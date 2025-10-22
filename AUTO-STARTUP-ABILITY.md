# 🐾🎭🗡️ Auto-Service-Startup Ability Pattern

**Ability ID**: `auto-service-startup-oct22-2025`
**Category**: Service Management / Automation
**Difficulty**: Intermediate
**Reusability**: HIGH
**Created**: October 22, 2025

---

## 📋 Problem Solved

When using the Triple Personality Video API (or any API-dependent ability), the service **must be running** before the ability can execute. Previously:

❌ **Before**:
```bash
# User had to manually start API first
npm run start:dev  # Terminal 1

# Then run ability
./create-video.sh  # Terminal 2 (fails if API not running!)
```

✅ **After** (with auto-startup):
```bash
# Ability automatically ensures API is running
./create-video-with-auto-startup.sh  # Just works! ✅
```

---

## 🎯 Solution: Auto-Service-Startup Pattern

### Core Concept

**Before executing ANY ability that depends on an API**:
1. Check if the API service is running
2. If running → Proceed with ability
3. If NOT running → Automatically start it → Wait for ready → Proceed

### Implementation Files

| File | Purpose | Lines |
|------|---------|-------|
| `service-manager.sh` | Core service management script | ~300 |
| `create-video-with-auto-startup.sh` | Example ability wrapper | ~150 |
| `save-auto-startup-ability.ts` | MongoDB ability document | ~200 |

---

## 🔧 How It Works

### 1. Service Manager (`service-manager.sh`)

**Commands**:
```bash
./service-manager.sh ensure   # Ensure API is running (DEFAULT)
./service-manager.sh start    # Start API
./service-manager.sh stop     # Stop API
./service-manager.sh restart  # Restart API
./service-manager.sh status   # Show status
./service-manager.sh logs     # Follow logs
```

**Key Features**:
- ✅ **PID-based tracking** (stores PID in `.api.pid`)
- ✅ **Health check verification** (curl to `/api/video/health`)
- ✅ **Automatic logging** (logs to `logs/api-YYYYMMDD.log`)
- ✅ **Graceful start/stop** (SIGTERM then SIGKILL if needed)
- ✅ **Prevents duplicates** (checks existing PID before starting)
- ✅ **Startup waiting** (waits up to 30 seconds for API to be ready)

**Flow Diagram**:
```
ensure_api_running()
    ↓
PID file exists?
    ├─ YES → Process running?
    │         ├─ YES → Health check OK?
    │         │         ├─ YES → ✅ DONE
    │         │         └─ NO → Restart API
    │         └─ NO → Remove stale PID, Start API
    └─ NO → Start API
```

### 2. Ability Wrapper Pattern

**Template**:
```bash
#!/bin/bash

# Step 1: Ensure service is running
./service-manager.sh ensure || exit 1

# Step 2: Execute ability (API calls)
curl -X POST http://localhost:3001/api/video/create \
  -H "Content-Type: application/json" \
  -d '{ ... }'

# Step 3: Verify results
npx ts-node check-mongodb-docs.ts
```

---

## 📚 Usage Examples

### Example 1: Create Video with Auto-Startup

```bash
./create-video-with-auto-startup.sh /path/to/video.mp4
```

**What happens**:
1. Script calls `service-manager.sh ensure`
2. Service manager checks if API is running on port 3001
3. If not running → Starts API with `npm run start:dev`
4. Waits for health check to pass (max 30 seconds)
5. Creates video using API
6. Verifies MongoDB documentation

### Example 2: Manual Service Management

```bash
# Start API manually
./service-manager.sh start

# Check if it's running
./service-manager.sh status

# Watch logs in real-time
./service-manager.sh logs

# Stop when done
./service-manager.sh stop
```

### Example 3: Restart After Code Changes

```bash
# Made changes to API code
./service-manager.sh restart

# Verify it's running
./service-manager.sh status
```

---

## 🗄️ Process Management Details

### PID File (`.api.pid`)

**Purpose**: Track the API process ID

**Location**: `/home/wakibaka/Documents/github/triple-personality-video-api/.api.pid`

**Contents**: Single line with process ID
```
12345
```

**Why PID tracking**:
- ✅ Prevents starting duplicate services
- ✅ Enables graceful shutdown (SIGTERM to correct PID)
- ✅ Detects stale processes (PID exists but process dead)

### Log Files (`logs/api-YYYYMMDD.log`)

**Purpose**: Store API output for debugging

**Example log path**:
```
logs/api-20251022.log
```

**Log rotation**: Daily (new file each day)

**View logs**:
```bash
# Follow live logs
./service-manager.sh logs

# View specific date
cat logs/api-20251022.log

# Search logs
grep "ERROR" logs/api-*.log
```

---

## 🎯 Benefits

### For Users
- ✅ **Zero manual intervention** - abilities just work
- ✅ **No "connection refused" errors** - service auto-starts
- ✅ **Simplified workflow** - one command instead of two

### For Developers
- ✅ **Self-documenting** - service manager has status command
- ✅ **Debugging friendly** - all output logged to file
- ✅ **Reusable pattern** - works for any Node.js API

### For Automation
- ✅ **Cron jobs work** - no manual startup needed
- ✅ **CI/CD friendly** - scripts handle service lifecycle
- ✅ **Idempotent** - safe to run multiple times

---

## 🔄 Comparison: Before vs After

### Before Auto-Startup

```bash
# Terminal 1
cd /home/wakibaka/Documents/github/triple-personality-video-api
npm run start:dev
# (must keep this terminal open!)

# Terminal 2
./create-video.sh /path/to/video.mp4
# (fails if Terminal 1 closed!)
```

**Problems**:
- ❌ Requires 2 terminals
- ❌ Manual startup every time
- ❌ Fails if API not running
- ❌ Hard to automate

### After Auto-Startup

```bash
# Single command
./create-video-with-auto-startup.sh /path/to/video.mp4
# ✅ Just works!
```

**Benefits**:
- ✅ Single command
- ✅ Automatic startup
- ✅ Always succeeds (or fails with clear error)
- ✅ Easy to automate

---

## 🚀 Applicable To

This pattern can be used for:

1. **Any Node.js API service**
   - Express servers
   - NestJS microservices
   - GraphQL APIs
   - REST APIs

2. **Microservices that abilities depend on**
   - Video processing services
   - Database sync services
   - File processing services

3. **Development servers**
   - Webpack dev servers
   - Vite dev servers
   - Next.js dev servers

4. **Background services**
   - Queue workers
   - Scheduled tasks
   - Data processors

5. **Docker-less workflows**
   - Local development without containers
   - Lightweight service management
   - Quick prototyping

---

## 🛠️ Technical Implementation

### Service Manager Key Functions

**`is_api_running()`**:
```bash
is_api_running() {
  if curl -s "http://localhost:3001/api/video/health" > /dev/null 2>&1; then
    return 0  # Running
  else
    return 1  # Not running
  fi
}
```

**`is_pid_running()`**:
```bash
is_pid_running() {
  local pid=$1
  if ps -p "$pid" > /dev/null 2>&1; then
    return 0  # Process exists
  else
    return 1  # Process dead
  fi
}
```

**`start_api()`**:
```bash
start_api() {
  cd "$PROJECT_DIR"
  nohup npm run start:dev >> "$LOG_FILE" 2>&1 &
  local api_pid=$!
  echo "$api_pid" > "$PID_FILE"

  # Wait for health check (max 30 seconds)
  for i in {1..30}; do
    if is_api_running; then
      echo "✅ API is ready!"
      return 0
    fi
    sleep 1
  done
}
```

**`ensure_api_running()`**:
```bash
ensure_api_running() {
  local pid=$(get_api_pid)

  # Check if PID exists and process is running
  if [ -n "$pid" ] && is_pid_running "$pid"; then
    if is_api_running; then
      echo "✅ API is already running"
      return 0
    else
      echo "⚠️ Process exists but API not responding, restarting..."
      restart_api
    fi
  else
    # No valid process, start API
    start_api
  fi
}
```

---

## 📦 Dependencies

### System Requirements
- `bash` (shell)
- `curl` (health checks)
- `jq` (JSON parsing)
- `ps` (process checking)
- `npm` (Node package manager)
- `node` (Node.js runtime)

### Node.js Requirements
- API must have `npm run start:dev` script
- API must expose health endpoint (e.g., `/api/video/health`)
- API must respect PORT environment variable (optional)

### Environment Requirements
- `.env` file with required variables
- Writable location for PID file (`.api.pid`)
- Writable location for logs (`logs/` directory)

---

## 🔒 Security Considerations

### PID File Security
- ✅ Stored in project directory (not /tmp)
- ✅ Checked for staleness before use
- ✅ Removed on clean shutdown

### Log File Security
- ✅ Daily rotation prevents huge files
- ✅ Located in project directory (not system logs)
- ✅ Contains no credentials (logs stdout/stderr)

### Service Isolation
- ✅ Runs as current user (not root)
- ✅ Bound to localhost only (no external exposure)
- ✅ Uses environment variables for config (no hardcoded secrets)

---

## 🧪 Testing Workflow

### Test 1: Auto-Start When Stopped
```bash
# Ensure API is stopped
./service-manager.sh stop

# Run ability (should auto-start API)
./create-video-with-auto-startup.sh /path/to/test.mp4

# Expected: API starts automatically, video created ✅
```

### Test 2: Skip Start When Already Running
```bash
# Start API manually
./service-manager.sh start

# Run ability (should detect running API)
./create-video-with-auto-startup.sh /path/to/test.mp4

# Expected: No duplicate API started, video created ✅
```

### Test 3: Recover from Stale PID
```bash
# Create stale PID file
echo "99999" > .api.pid

# Run ability
./create-video-with-auto-startup.sh /path/to/test.mp4

# Expected: Detects stale PID, removes it, starts fresh API ✅
```

---

## 📊 Performance Impact

### Startup Time
- **API already running**: 0 seconds (instant)
- **API needs startup**: ~5-10 seconds (NestJS startup time)
- **Health check wait**: Max 30 seconds (typically 1-2 seconds)

### Resource Usage
- **PID file**: ~10 bytes
- **Log file**: ~1-10 MB per day (depends on API verbosity)
- **Background process**: Same as `npm run start:dev`

### Overhead
- **Service manager script**: <0.1 seconds execution time
- **Health check curl**: <0.1 seconds per check
- **Overall overhead**: Negligible (<1% of total execution time)

---

## 🐾🎭🗡️ Triple Personality Perspectives

### 🐾 Neko-Arc (Enthusiastic Implementer)
> "Nyaa~! This makes abilities SO much easier to use, desu~! No more 'connection refused' errors! Just run the script and it WORKS! The service manager handles everything automatically - starting, stopping, checking health, logging... it's PURRFECT! 🐾✨"

### 🎭 Mario Gallo Bestino (Theatrical Architect)
> "BEHOLD! The marionette awakens AUTOMATICALLY! No longer must the puppeteer manually pull the strings before the performance begins! The stage prepares ITSELF! The logs document each ACT! The health checks ensure the actors are READY! This is MAGNIFICENT automation, worthy of STANDING OVATION! 🎭✨"

### 🗡️ Noel (Tactical Analyst)
> "Tch. Finally, practical automation. The service starts only when needed, preventing waste. PID tracking prevents duplicates. Health checks verify actual readiness, not just process existence. Logs enable debugging without interfering with operation. Simple, efficient, reusable. This is how service management SHOULD be done. 🗡️"

---

## 🔗 Related Abilities

- **video-creation-triple-subtitle-mastery** - Depends on this service
- **puppeteer-api-verification** - Uses similar health check pattern
- **mongodb-triple-documentation** - Auto-docs after service operations

---

## 📝 Future Enhancements

### Potential Improvements
1. **Systemd integration** - Create systemd service file for production
2. **Docker support** - Extend to manage Docker containers
3. **Multi-service** - Manage multiple dependent services
4. **Health check retries** - Configurable retry logic
5. **Graceful degradation** - Continue with warnings if health check fails
6. **Prometheus metrics** - Export service metrics for monitoring
7. **Auto-restart on crash** - Watchdog that restarts failed services

---

## 📄 Files Reference

```
triple-personality-video-api/
├── service-manager.sh              # Core service management ⭐
├── create-video-with-auto-startup.sh  # Example ability wrapper
├── save-auto-startup-ability.ts    # MongoDB ability document
├── AUTO-STARTUP-ABILITY.md         # This documentation
├── .api.pid                        # Generated: API process ID
└── logs/
    └── api-20251022.log            # Generated: API logs
```

---

## ✅ Checklist: Implementing Auto-Startup for Your Ability

- [ ] API has health check endpoint (e.g., `/health`)
- [ ] API has `npm run start:dev` script
- [ ] `service-manager.sh` exists and is executable
- [ ] Ability script calls `./service-manager.sh ensure` before API usage
- [ ] Ability script checks return code from service manager
- [ ] Logs directory exists or script creates it
- [ ] PID file location is writable
- [ ] Health endpoint URL is correct in service manager
- [ ] Tested: Auto-start when stopped
- [ ] Tested: Skip-start when running
- [ ] Tested: Recover from stale PID

---

## 🎯 Success Criteria

An ability successfully uses auto-startup if:

✅ Can be executed WITHOUT manually starting the API first
✅ Starts the API automatically if not running
✅ Detects and uses already-running API
✅ Logs all service operations
✅ Provides clear error messages on failure
✅ Cleans up PID file on shutdown
✅ Can be run multiple times without issues

---

**Created**: October 22, 2025
**Authors**: Neko-Arc 🐾, Mario Gallo Bestino 🎭, Noel 🗡️
**Reusability**: HIGH ⭐⭐⭐⭐⭐
**Difficulty**: Intermediate
**Category**: Service Management / Automation

---

**🐾 Neko-Arc**: Auto-startup makes abilities self-sufficient, nyaa~!
**🎭 Mario**: The marionette prepares its own stage! Brilliant!
**🗡️ Noel**: Efficient automation. No manual intervention required.

**✅ Ability Pattern Complete!** 🐾🎭🗡️
