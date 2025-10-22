# 🐾🎭🗡️ Triple Personality Video API

> **A NestJS microservice for creating videos with three simultaneous personality commentaries**

This microservice implements the **IMMUTABLE Triple Personality Rule**: ALL three personalities (Neko-Arc, Mario Gallo Bestino, and Noel) MUST always interact and comment together on videos.

## 🌟 Features

- **Triple-Layer Subtitle System**: Simultaneous commentaries from three distinct personalities
- **MongoDB Triple Documentation**: Automatic saves to three separate databases
- **CPU & GPU Encoding**: Support for both libx264 (CPU) and h264_qsv (GPU) encoding
- **Carabineros Hymn Integration**: Automatic background audio (Rule 3.9)
- **Type-Safe TypeScript**: Full TypeScript with strict mode enabled
- **RESTful API**: Clean, documented REST endpoints

## 🐾🎭🗡️ The Three Personalities

### 🐾 Neko-Arc (Bottom, Cyan)
- **Position**: Bottom center
- **Color**: Cyan (&H00FFFF00)
- **Characteristics**: Enthusiastic, Kawaii, Uses "nyaa~" and "desu~", Playful, Action-oriented

### 🎭 Mario Gallo Bestino (Top, Yellow/Gold)
- **Position**: Top center
- **Color**: Yellow/Gold (&H0000FFFF)
- **Characteristics**: Theatrical, Dramatic, Artistic narration, Grand gestures, Performance-focused

### 🗡️ Noel (Middle, White/Silver)
- **Position**: Middle center
- **Color**: White/Silver (&H00FFFFFF)
- **Characteristics**: Sarcastic, Blunt, Tactical, Professional, Mocks Mario

## 📋 API Endpoints

### Health Check
```http
GET /api/video/health
```

**Response**:
```json
{
  "status": "ok",
  "service": "Triple Personality Video API",
  "personalities": ["neko-arc", "mario-gallo-bestino", "noel"],
  "message": "All three personalities ready! 🐾🎭🗡️"
}
```

### Create Video
```http
POST /api/video/create
```

**Request Body**:
```json
{
  "inputVideoPath": "/path/to/input.mp4",
  "outputFileName": "my-video-TRIPLE-PERSONALITY.mp4",
  "commentaries": [
    {
      "personality": "neko-arc",
      "text": "Nyaa~! This is amazing, desu~!",
      "startTime": 0,
      "endTime": 5
    },
    {
      "personality": "mario-gallo-bestino",
      "text": "BEHOLD! The grand performance begins!",
      "startTime": 0,
      "endTime": 5
    },
    {
      "personality": "noel",
      "text": "Tch. Let's get this done efficiently.",
      "startTime": 0,
      "endTime": 5
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
  "outputPath": "/home/wakibaka/Documents/github/wakibaka-youtube-videos/my-video.mp4",
  "fileSize": 1048576,
  "duration": 15.5,
  "personalities": ["neko-arc", "mario-gallo-bestino", "noel"],
  "createdAt": "2025-10-21T...",
  "completedAt": "2025-10-21T..."
}
```

### Get Job Status
```http
GET /api/video/status/:jobId
```

**Response**: Same as create video response

### Get Personalities Info
```http
GET /api/video/personalities
```

**Response**: Detailed information about all three personalities

## 🚀 Quick Start

### 1. Clone the repository
```bash
git clone https://github.com/wakibaba/triple-personality-video-api.git
cd triple-personality-video-api
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment
```bash
cp .env.example .env
# Edit .env with your MongoDB Atlas credentials
```

**Required .env variables**:
```bash
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/
MONGODB_DATABASE=neko-defense-system
MARIONNETTE_DATABASE=marionnette-theater
NOEL_DATABASE=noel-precision-archives
VIDEO_OUTPUT_PATH=/home/wakibaka/Documents/github/wakibaka-youtube-videos
CARABINEROS_HYMN_PATH=/home/wakibaka/Documents/carabineros-hymn.mp3
PORT=3001
NODE_ENV=development
```

### 4. Run the microservice
```bash
# Development mode
npm run start:dev

# Production mode
npm run build
npm run start:prod
```

## 🗄️ Database Architecture

This microservice automatically documents to **THREE separate MongoDB databases**:

### 1. **neko-defense-system** (Neko-Arc's Database)
- **Collection**: `videojobs`
- **Purpose**: Primary video job tracking
- **Schema**: VideoJob with status, paths, metrics

### 2. **marionnette-theater** (Mario's Database)
- **Collection**: `performances`
- **Purpose**: Theatrical documentation of video creation
- **Schema**: Performance with act structure, reviews

### 3. **noel-precision-archives** (Noel's Database)
- **Collection**: `combatsessions`
- **Purpose**: Tactical analysis and metrics
- **Schema**: CombatSession with performance metrics

## 📚 Technical Stack

- **Framework**: NestJS 11.x
- **Language**: TypeScript (strict mode)
- **Database**: MongoDB Atlas (3 separate databases)
- **Video Processing**: ffmpeg with fluent-ffmpeg
- **Validation**: class-validator, class-transformer
- **Configuration**: @nestjs/config with dotenv

## 🔒 Security & Best Practices

✅ **Environment Variables**: All secrets in .env (gitignored)
✅ **TypeScript Strict Mode**: Maximum type safety
✅ **Validation**: DTO validation on all endpoints
✅ **Rule 3.2 Compliance**: Never commit .env files
✅ **Rule 3.7 Compliance**: TypeScript by default
✅ **Rule 3.9 Compliance**: Carabineros hymn integration
✅ **Rule 3.10 Compliance**: Videos saved to repository
✅ **Rules 3.11/3.12 Compliance**: Triple personality MANDATORY

## 🧪 Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## 📦 Project Structure

```
triple-personality-video-api/
├── src/
│   ├── video/
│   │   ├── dto/
│   │   │   └── create-video.dto.ts
│   │   ├── interfaces/
│   │   │   ├── personality.interface.ts
│   │   │   └── video-job.interface.ts
│   │   ├── video.controller.ts
│   │   ├── video.service.ts
│   │   └── video.module.ts
│   ├── personalities/
│   │   ├── personalities.service.ts
│   │   └── personalities.module.ts
│   ├── database/
│   │   └── schemas/
│   │       ├── video-job.schema.ts
│   │       ├── performance.schema.ts
│   │       └── combat-session.schema.ts
│   ├── app.module.ts
│   └── main.ts
├── .env (gitignored)
├── .env.example
├── package.json
└── README.md
```

## 🎯 Example Usage

### Curl Example
```bash
curl -X POST http://localhost:3001/api/video/create \
  -H "Content-Type: application/json" \
  -d '{
    "inputVideoPath": "/path/to/video.mp4",
    "outputFileName": "triple-personality-video.mp4",
    "commentaries": [
      {
        "personality": "neko-arc",
        "text": "Nyaa~! Amazing gameplay, desu~!",
        "startTime": 0,
        "endTime": 10
      },
      {
        "personality": "mario-gallo-bestino",
        "text": "BEHOLD! The marionette dances!",
        "startTime": 0,
        "endTime": 10
      },
      {
        "personality": "noel",
        "text": "Acceptable execution. Continue.",
        "startTime": 0,
        "endTime": 10
      }
    ],
    "encodingMethod": "cpu",
    "includeCarabinerosHymn": true,
    "crf": 18
  }'
```

### TypeScript Client Example
```typescript
import axios from 'axios';

const response = await axios.post('http://localhost:3001/api/video/create', {
  inputVideoPath: '/path/to/video.mp4',
  outputFileName: 'my-video.mp4',
  commentaries: [
    {
      personality: 'neko-arc',
      text: 'Nyaa~! This is so cool, desu~!',
      startTime: 0,
      endTime: 5,
    },
    {
      personality: 'mario-gallo-bestino',
      text: 'A MAGNIFICENT display!',
      startTime: 0,
      endTime: 5,
    },
    {
      personality: 'noel',
      text: 'Tch. Proceed.',
      startTime: 0,
      endTime: 5,
    },
  ],
});

console.log('Job ID:', response.data.jobId);
```

## ⚡ Performance

### CPU Encoding (libx264)
- **Speed**: 0.8-1.0x realtime
- **Power**: 40-50W
- **CPU Usage**: 6-8 cores
- **Quality**: Excellent (5/5)
- **Use Case**: Archives, master copies

### GPU Encoding (h264_qsv)
- **Speed**: 3-5x realtime
- **Power**: 10-20W
- **CPU Usage**: 1-2 cores
- **Quality**: Very Good (4/5)
- **Use Case**: YouTube, fast turnaround

## 🐾🎭🗡️ The Triple Personality Rule

**NON-NEGOTIABLE**: ALL videos MUST include commentary from ALL THREE personalities.

The API will **reject** requests that don't include all three personalities:

```json
{
  "statusCode": 400,
  "message": "TRIPLE PERSONALITY RULE VIOLATION! Missing: noel. ALL THREE PERSONALITIES MUST PARTICIPATE (NON-NEGOTIABLE Rule 3.11/3.12)!"
}
```

## 📄 License

MIT License

## 🙏 Credits

Created by **wakibaka** with the collaborative efforts of:
- 🐾 **Neko-Arc**: Technical execution and rapid coding
- 🎭 **Mario Gallo Bestino**: Theatrical documentation and Puppeteer mastery
- 🗡️ **Noel**: Tactical analysis and quality assurance

**Generated with Claude Code** 🐾🎭🗡️

---

**REMEMBER**:
- ALL THREE PERSONALITIES MUST ALWAYS INTERACT (Rule 3.11/3.12)
- ALWAYS use TypeScript (.ts) (Rule 3.7)
- NEVER commit .env files (Rule 3.2)
- Videos ALWAYS include Carabineros Hymn (Rule 3.9)
- Videos ALWAYS saved to wakibaka-youtube-videos repository (Rule 3.10)

*Neko-Arc*: "Nyaa~! Ready to create amazing videos, desu~!" 🐾
*Mario Gallo Bestino*: "BEHOLD! The GRAND video creation API!" 🎭
*Noel*: "Tch. Let's get to work." 🗡️
