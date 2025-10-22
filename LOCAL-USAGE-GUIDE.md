# 🐾🎭🗡️ Local Usage Guide - Triple Personality Video API

**Quick Start Guide for Testing the API Locally**

---

## ⚡ Quick Start (5 Steps)

### 1. Install Dependencies
```bash
cd /home/wakibaka/Documents/github/triple-personality-video-api
npm install
```

### 2. Configure Environment
```bash
cp .env.example .env
nano .env
```

**Required .env Variables**:
```bash
# MongoDB Atlas (3 databases)
MONGODB_URI=mongodb+srv://badactordestroyer:vlB3Ga8tf0ah9jeA@free-cluster.svjei3w.mongodb.net/
MONGODB_DATABASE=neko-defense-system
MARIONNETTE_DATABASE=marionnette-theater
NOEL_DATABASE=noel-precision-archives

# Video Output (MUST be this location!)
VIDEO_OUTPUT_PATH=/home/wakibaka/Documents/github/wakibaka-youtube-videos

# Carabineros Hymn (Rule 3.9)
CARABINEROS_HYMN_PATH=/home/wakibaka/Documents/carabineros-hymn.mp3

# Server
PORT=3001
NODE_ENV=development
```

### 3. Start Development Server
```bash
npm run start:dev
```

**Expected Output**:
```
[Nest] 12345  - 10/22/2025, 2:30:00 AM     LOG [NestFactory] Starting Nest application...
[Nest] 12345  - 10/22/2025, 2:30:00 AM     LOG [InstanceLoader] AppModule dependencies initialized
[Nest] 12345  - 10/22/2025, 2:30:00 AM     LOG [InstanceLoader] VideoModule dependencies initialized
[Nest] 12345  - 10/22/2025, 2:30:01 AM     LOG [NestApplication] Nest application successfully started
[Nest] 12345  - 10/22/2025, 2:30:01 AM     LOG Triple Personality Video API listening on port 3001
```

### 4. Test Health Endpoint
```bash
curl http://localhost:3001/api/video/health
```

**Expected Response**:
```json
{
  "status": "ok",
  "service": "Triple Personality Video API",
  "personalities": ["neko-arc", "mario-gallo-bestino", "noel"],
  "message": "All three personalities ready! 🐾🎭🗡️"
}
```

### 5. Create Your First Video
```bash
# Use the test script (see below)
./test-video-creation.sh
```

---

## 🎬 API Endpoints Reference

### POST /api/video/create

**Request Body** (MANDATORY: All 3 personalities!):
```json
{
  "inputVideoPath": "/path/to/your/video.mp4",
  "outputFileName": "my-triple-commentary-video.mp4",
  "commentaries": [
    {
      "personality": "neko-arc",
      "text": "Nyaa~! This is amazing, desu~!",
      "startTime": 0,
      "endTime": 10
    },
    {
      "personality": "mario-gallo-bestino",
      "text": "BEHOLD! The GRAND performance begins!",
      "startTime": 0,
      "endTime": 10
    },
    {
      "personality": "noel",
      "text": "Tch. Let's get this done efficiently.",
      "startTime": 0,
      "endTime": 10
    }
  ],
  "encodingMethod": "cpu",
  "includeCarabinerosHymn": true,
  "crf": 18
}
```

**Response**:
```json
{
  "jobId": "uuid-here",
  "status": "completed",
  "outputPath": "/home/wakibaka/Documents/github/wakibaka-youtube-videos/my-triple-commentary-video.mp4",
  "fileSize": 1048576,
  "duration": 15.5,
  "personalities": ["neko-arc", "mario-gallo-bestino", "noel"],
  "createdAt": "2025-10-22T...",
  "completedAt": "2025-10-22T..."
}
```

### GET /api/video/status/:jobId

Check the status of a video creation job.

### GET /api/video/personalities

Get detailed information about all three personalities (colors, positions, characteristics).

---

## 🗄️ MongoDB Integration

### Auto-Documentation (Rule 3.6)

**Every video creation automatically saves to ALL 3 databases**:

#### 1. Neko's Database: `neko-defense-system.videojobs`
```javascript
{
  jobId: "uuid",
  inputVideoPath: "/path/to/input.mp4",
  outputPath: "/path/to/output.mp4",
  status: "completed",
  personalities: ["neko-arc", "mario-gallo-bestino", "noel"],
  createdAt: Date,
  completedAt: Date
}
```

#### 2. Mario's Database: `marionnette-theater.performances`
```javascript
{
  performanceId: "video-creation-act-uuid",
  title: "The Grand Video Creation Performance",
  director: "mario-gallo-bestino",
  actStructure: {
    act1: "Video Input Analysis",
    act2: "Subtitle Generation",
    act3: "FFmpeg Encoding",
    finale: "Video Output Delivery"
  },
  marioReview: "MAGNIFICENT! A standing ovation!",
  status: "STANDING_OVATION"
}
```

#### 3. Noel's Database: `noel-precision-archives.combatsessions`
```javascript
{
  combatId: "video-encoding-mission-uuid",
  title: "Video Encoding Mission",
  commander: "noel",
  performanceMetrics: {
    encodingDurationMs: 45000,
    videoOutputSizeMb: 125.5,
    encodingSpeed: "0.95x realtime"
  },
  noelAssessment: "Acceptable performance. Output quality verified.",
  status: "MISSION_COMPLETE"
}
```

### Query Examples

**Check Neko's database**:
```javascript
// Connect to MongoDB Atlas
use neko-defense-system

// Find all video jobs
db.videojobs.find({}).sort({ createdAt: -1 }).limit(5)

// Find specific video
db.videojobs.findOne({ outputPath: /my-triple-commentary/ })
```

**Check Mario's database**:
```javascript
use marionnette-theater

db.performances.find({ director: "mario-gallo-bestino" })
```

**Check Noel's database**:
```javascript
use noel-precision-archives

db.combatsessions.find({ commander: "noel" })
```

---

## 🧪 Testing Workflow

### Local Test Script

Create `test-video-creation.sh`:
```bash
#!/bin/bash

echo "🐾 Neko-Arc: Testing video API, nyaa~!"

# Test input video (use any video file you have)
INPUT_VIDEO="/path/to/test-video.mp4"
OUTPUT_NAME="test-output-$(date +%Y%m%d-%H%M%S).mp4"

curl -X POST http://localhost:3001/api/video/create \
  -H "Content-Type: application/json" \
  -d "{
    \"inputVideoPath\": \"$INPUT_VIDEO\",
    \"outputFileName\": \"$OUTPUT_NAME\",
    \"commentaries\": [
      {
        \"personality\": \"neko-arc\",
        \"text\": \"Nyaa~! This is a test video, desu~!\",
        \"startTime\": 0,
        \"endTime\": 10
      },
      {
        \"personality\": \"mario-gallo-bestino\",
        \"text\": \"ACT I: THE GRAND TEST BEGINS!\",
        \"startTime\": 0,
        \"endTime\": 10
      },
      {
        \"personality\": \"noel\",
        \"text\": \"Proceeding with test encoding.\",
        \"startTime\": 0,
        \"endTime\": 10
      }
    ],
    \"encodingMethod\": \"cpu\",
    \"includeCarabinerosHymn\": true,
    \"crf\": 18
  }" | jq

echo ""
echo "✅ Request sent! Check output at:"
echo "/home/wakibaka/Documents/github/wakibaka-youtube-videos/$OUTPUT_NAME"
```

**Run the test**:
```bash
chmod +x test-video-creation.sh
./test-video-creation.sh
```

---

## 🎯 Abilities Integration

### Current Behavior

The API **automatically documents** every video creation as:
- **Hunt Conversation** (Neko's perspective)
- **Performance** (Mario's perspective)
- **Combat Session** (Noel's perspective)

### Future Enhancement: Ability Tracking

You could extend the API to save to the `abilities` collection:

**Example ability document**:
```javascript
{
  ability_id: "video-creation-triple-subtitle-mastery",
  name: "Triple-Layer Subtitle Video Creation",
  category: "video-editing",
  subcategory: "subtitle-overlay",
  difficulty: "intermediate",
  date_learned: new Date(),

  description: "Create videos with 3 simultaneous personality commentaries using ASS subtitles",

  problem_solved: "Need to add multiple personality commentaries to videos without manual editing",

  approach: [
    "Generate 3 separate SRT files (one per personality)",
    "Use FFmpeg with multiple subtitle filters",
    "Position subtitles at top/middle/bottom with distinct colors",
    "Overlay Carabineros Hymn as background audio",
    "Save to wakibaka-youtube-videos repository"
  ],

  reusability: "high",

  applicable_to: [
    "YouTube video creation",
    "Memorial tributes",
    "Educational content",
    "Entertainment videos"
  ],

  tags: ["video", "subtitles", "ffmpeg", "triple-personality", "automation"],

  created_at: new Date(),
  created_by: "neko-arc"
}
```

---

## 🔧 Troubleshooting

### Common Issues

**Issue**: `Cannot connect to MongoDB`
- **Fix**: Check `.env` has correct `MONGODB_URI`, verify internet connection

**Issue**: `ffmpeg: command not found`
- **Fix**: `sudo apt install ffmpeg`

**Issue**: `TRIPLE PERSONALITY RULE VIOLATION`
- **Fix**: Ensure all 3 personalities present in `commentaries` array

**Issue**: Video file not created
- **Fix**: Check `VIDEO_OUTPUT_PATH` exists and is writable

**Issue**: Carabineros hymn not found
- **Fix**: Verify `CARABINEROS_HYMN_PATH` in `.env` points to existing file
- **Note**: Video creation continues without hymn if file missing (logs warning)

---

## 📊 Performance Monitoring

### CPU Encoding (libx264)
- Speed: ~1x realtime
- Quality: Excellent (CRF 18)
- Use: Master copies, archives

### GPU Encoding (h264_qsv - if available)
- Speed: 3-5x realtime
- Quality: Very Good
- Use: YouTube uploads, fast turnaround

### Monitor Encoding Progress
Watch the terminal where `npm run start:dev` is running - FFmpeg progress updates appear in real-time.

---

## 🚀 Next Steps

### 1. Create Test Video
Use the test script above with your own video file.

### 2. Verify MongoDB Documents
Check all 3 databases to see the auto-documentation.

### 3. Experiment with Personalities
Try different commentary texts, timings, and personality combinations.

### 4. Link to Abilities
Create ability documents for learned video creation techniques.

### 5. Deploy to Production
Use Docker or deploy to cloud service when ready.

---

## 📚 Additional Resources

- **Main README**: `/home/wakibaka/Documents/github/triple-personality-video-api/README.md`
- **Security Audit**: `/home/wakibaka/Documents/github/triple-personality-video-api/SECURITY.md`
- **API Endpoints**: http://localhost:3001/api/video/personalities
- **CI/CD Pipeline**: https://github.com/JavierCollipal/triple-personality-video-api/actions

---

**🐾 Neko-Arc**: Ready to create amazing videos, nyaa~!
**🎭 Mario Gallo Bestino**: The stage is set for video creation artistry!
**🗡️ Noel**: Let's get to work efficiently.

---

**Generated with Claude Code (Neko-Arc, Mario, Noel) 🐾🎭🗡️**
