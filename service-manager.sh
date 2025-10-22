#!/bin/bash

# 🐾🎭🗡️ Triple Personality Video API - Service Manager
# Automatically starts and manages the API service
#
# This script ensures the API is running before any operation.
# If the API is not running, it starts it in the background.

set -e

API_PORT=3001
API_URL="http://localhost:$API_PORT"
PROJECT_DIR="/home/wakibaka/Documents/github/triple-personality-video-api"
LOG_DIR="$PROJECT_DIR/logs"
PID_FILE="$PROJECT_DIR/.api.pid"
LOG_FILE="$LOG_DIR/api-$(date +%Y%m%d).log"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Create logs directory
mkdir -p "$LOG_DIR"

# Function: Check if API is running
is_api_running() {
  if curl -s "$API_URL/api/video/health" > /dev/null 2>&1; then
    return 0  # Running
  else
    return 1  # Not running
  fi
}

# Function: Get API PID
get_api_pid() {
  if [ -f "$PID_FILE" ]; then
    cat "$PID_FILE"
  else
    echo ""
  fi
}

# Function: Check if PID is actually running
is_pid_running() {
  local pid=$1
  if [ -z "$pid" ]; then
    return 1
  fi
  if ps -p "$pid" > /dev/null 2>&1; then
    return 0
  else
    return 1
  fi
}

# Function: Start API service
start_api() {
  echo -e "${CYAN}🐾 Neko-Arc: Starting Triple Personality Video API, nyaa~!${NC}"

  cd "$PROJECT_DIR"

  # Check if node_modules exists
  if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}📦 Installing dependencies first, desu~!${NC}"
    npm install >> "$LOG_FILE" 2>&1
  fi

  # Start API in background
  echo -e "${CYAN}🚀 Starting API server on port $API_PORT...${NC}"
  nohup npm run start:dev >> "$LOG_FILE" 2>&1 &
  local api_pid=$!
  echo "$api_pid" > "$PID_FILE"

  echo -e "${CYAN}📝 PID: $api_pid${NC}"
  echo -e "${CYAN}📋 Logs: $LOG_FILE${NC}"

  # Wait for API to be ready (max 30 seconds)
  echo -e "${YELLOW}⏳ Waiting for API to be ready...${NC}"
  local max_wait=30
  local waited=0

  while [ $waited -lt $max_wait ]; do
    if is_api_running; then
      echo -e "${GREEN}✅ API is ready!${NC}"
      return 0
    fi
    sleep 1
    waited=$((waited + 1))
    echo -n "."
  done

  echo ""
  echo -e "${RED}❌ API failed to start within $max_wait seconds!${NC}"
  echo -e "${RED}Check logs: $LOG_FILE${NC}"
  return 1
}

# Function: Stop API service
stop_api() {
  local pid=$(get_api_pid)

  if [ -z "$pid" ]; then
    echo -e "${YELLOW}⚠️ No PID file found${NC}"
    return 0
  fi

  if is_pid_running "$pid"; then
    echo -e "${CYAN}🛑 Stopping API (PID: $pid)...${NC}"
    kill "$pid" 2>/dev/null || true

    # Wait for process to stop
    local max_wait=10
    local waited=0
    while is_pid_running "$pid" && [ $waited -lt $max_wait ]; do
      sleep 1
      waited=$((waited + 1))
    done

    # Force kill if still running
    if is_pid_running "$pid"; then
      echo -e "${YELLOW}⚠️ Force killing API...${NC}"
      kill -9 "$pid" 2>/dev/null || true
    fi

    echo -e "${GREEN}✅ API stopped${NC}"
  else
    echo -e "${YELLOW}⚠️ API process not running${NC}"
  fi

  rm -f "$PID_FILE"
}

# Function: Restart API service
restart_api() {
  echo -e "${CYAN}🔄 Restarting API...${NC}"
  stop_api
  sleep 2
  start_api
}

# Function: Show API status
status_api() {
  echo -e "${CYAN}📊 Triple Personality Video API Status${NC}"
  echo "=" | tr '=' '\n' | head -n 50 | tr '\n' '=' && echo ""

  local pid=$(get_api_pid)

  if [ -n "$pid" ]; then
    echo -e "PID File: $pid"
    if is_pid_running "$pid"; then
      echo -e "Process: ${GREEN}Running ✅${NC}"
    else
      echo -e "Process: ${RED}Not Running ❌${NC} (stale PID)"
    fi
  else
    echo -e "PID File: ${YELLOW}None${NC}"
  fi

  echo ""

  if is_api_running; then
    echo -e "API Health: ${GREEN}Responding ✅${NC}"
    echo -e "API URL: $API_URL"
    echo ""
    curl -s "$API_URL/api/video/health" | jq 2>/dev/null || echo "Health check response received"
  else
    echo -e "API Health: ${RED}Not Responding ❌${NC}"
  fi

  echo ""
  echo -e "Log File: $LOG_FILE"
  if [ -f "$LOG_FILE" ]; then
    echo -e "Log Size: $(du -h "$LOG_FILE" | cut -f1)"
  fi
}

# Function: Ensure API is running (main function)
ensure_api_running() {
  local pid=$(get_api_pid)

  # Check if PID exists and process is running
  if [ -n "$pid" ] && is_pid_running "$pid"; then
    # Process is running, check if it's responding
    if is_api_running; then
      echo -e "${GREEN}✅ API is already running (PID: $pid)${NC}"
      return 0
    else
      echo -e "${YELLOW}⚠️ Process exists but API not responding, restarting...${NC}"
      restart_api
      return $?
    fi
  else
    # No valid process, start API
    if [ -f "$PID_FILE" ]; then
      echo -e "${YELLOW}⚠️ Removing stale PID file${NC}"
      rm -f "$PID_FILE"
    fi
    start_api
    return $?
  fi
}

# Function: Show logs
logs_api() {
  if [ -f "$LOG_FILE" ]; then
    tail -f "$LOG_FILE"
  else
    echo -e "${RED}❌ Log file not found: $LOG_FILE${NC}"
    exit 1
  fi
}

# Main command handling
case "${1:-ensure}" in
  start)
    start_api
    ;;
  stop)
    stop_api
    ;;
  restart)
    restart_api
    ;;
  status)
    status_api
    ;;
  ensure)
    ensure_api_running
    ;;
  logs)
    logs_api
    ;;
  *)
    echo "🐾🎭🗡️ Triple Personality Video API - Service Manager"
    echo ""
    echo "Usage: $0 {start|stop|restart|status|ensure|logs}"
    echo ""
    echo "Commands:"
    echo "  start    - Start the API service"
    echo "  stop     - Stop the API service"
    echo "  restart  - Restart the API service"
    echo "  status   - Show API status"
    echo "  ensure   - Ensure API is running (start if not) [DEFAULT]"
    echo "  logs     - Follow API logs"
    echo ""
    echo "Examples:"
    echo "  $0              # Ensure API is running"
    echo "  $0 start        # Start API"
    echo "  $0 status       # Check status"
    echo "  $0 logs         # Watch logs"
    echo ""
    exit 1
    ;;
esac
