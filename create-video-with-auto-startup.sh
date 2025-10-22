#!/bin/bash

# 🐾🎭🗡️ Create Video with Auto-Startup Ability
#
# This script demonstrates the auto-service-startup pattern:
# 1. Ensures API service is running (starts if needed)
# 2. Creates video using the API
# 3. Verifies MongoDB documentation
#
# This is the ABILITY PATTERN that should be used for all video creation!

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SERVICE_MANAGER="$SCRIPT_DIR/service-manager.sh"

# Colors
GREEN='\033[0;32m'
CYAN='\033[0;36m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${CYAN}🐾🎭🗡️ Video Creation Ability with Auto-Startup${NC}"
echo "=" | tr '=' '\n' | head -n 60 | tr '\n' '=' && echo ""
echo ""

# STEP 1: Ensure API Service is Running
echo -e "${CYAN}📋 Step 1: Ensure API Service is Running${NC}"
echo "-------------------------------------------"
echo ""

if ! bash "$SERVICE_MANAGER" ensure; then
  echo -e "${YELLOW}❌ Failed to start API service!${NC}"
  exit 1
fi

echo ""
echo ""

# STEP 2: Get Video Creation Parameters
echo -e "${CYAN}📋 Step 2: Video Creation Parameters${NC}"
echo "---------------------------------------"
echo ""

# Check if parameters provided via command line
if [ $# -eq 0 ]; then
  # Interactive mode
  echo "Enter path to input video file:"
  read -r INPUT_VIDEO

  if [ ! -f "$INPUT_VIDEO" ]; then
    echo "❌ File not found: $INPUT_VIDEO"
    exit 1
  fi

  OUTPUT_NAME="triple-personality-$(date +%Y%m%d-%H%M%S).mp4"
  echo "Output filename: $OUTPUT_NAME"
  echo ""
else
  # Command line mode
  INPUT_VIDEO="$1"
  OUTPUT_NAME="${2:-triple-personality-$(date +%Y%m%d-%H%M%S).mp4}"
fi

# STEP 3: Create Video with Triple Personalities
echo -e "${CYAN}📋 Step 3: Create Video with Triple Personalities${NC}"
echo "----------------------------------------------------"
echo ""

echo -e "${CYAN}🐾 Neko-Arc: Creating video, nyaa~!${NC}"
echo -e "${CYAN}🎭 Mario: The grand performance begins!${NC}"
echo -e "${CYAN}🗡️ Noel: Proceeding with encoding.${NC}"
echo ""

RESPONSE=$(curl -s -X POST http://localhost:3001/api/video/create \
  -H "Content-Type: application/json" \
  -d "{
    \"inputVideoPath\": \"$INPUT_VIDEO\",
    \"outputFileName\": \"$OUTPUT_NAME\",
    \"commentaries\": [
      {
        \"personality\": \"neko-arc\",
        \"text\": \"Nyaa~! This video is amazing, desu~! Look at this content!\",
        \"startTime\": 0,
        \"endTime\": 10
      },
      {
        \"personality\": \"mario-gallo-bestino\",
        \"text\": \"BEHOLD! A MAGNIFICENT display! The marionettes dance with grace!\",
        \"startTime\": 0,
        \"endTime\": 10
      },
      {
        \"personality\": \"noel\",
        \"text\": \"Tch. Acceptable quality. Proceeding with tactical analysis.\",
        \"startTime\": 0,
        \"endTime\": 10
      }
    ],
    \"encodingMethod\": \"cpu\",
    \"includeCarabinerosHymn\": true,
    \"crf\": 18
  }")

echo "API Response:"
echo "$RESPONSE" | jq
echo ""

# Extract job details
JOB_ID=$(echo "$RESPONSE" | jq -r '.jobId')
OUTPUT_PATH=$(echo "$RESPONSE" | jq -r '.outputPath')
STATUS=$(echo "$RESPONSE" | jq -r '.status')

# STEP 4: Verify Result
echo -e "${CYAN}📋 Step 4: Verify Result${NC}"
echo "-----------------------"
echo ""

if [ "$STATUS" = "completed" ]; then
  echo -e "${GREEN}✅ Video created successfully!${NC}"
  echo ""
  echo "📁 Output Location:"
  echo "   $OUTPUT_PATH"
  echo ""

  if [ -f "$OUTPUT_PATH" ]; then
    echo "📊 File Info:"
    ls -lh "$OUTPUT_PATH"
    echo ""

    echo "🎬 Play with:"
    echo "   ffplay \"$OUTPUT_PATH\""
    echo "   # or"
    echo "   vlc \"$OUTPUT_PATH\""
    echo ""
  fi

  # STEP 5: Verify MongoDB Documentation
  echo -e "${CYAN}📋 Step 5: Verify MongoDB Documentation${NC}"
  echo "-------------------------------------------"
  echo ""

  if [ -f "$SCRIPT_DIR/check-mongodb-docs.ts" ]; then
    echo "Checking all 3 databases..."
    echo ""
    cd "$SCRIPT_DIR"
    npx ts-node check-mongodb-docs.ts 2>/dev/null | tail -n 20
  else
    echo "⚠️ MongoDB checker not found, skipping verification"
  fi

elif [ "$STATUS" = "processing" ]; then
  echo -e "${YELLOW}⏳ Video is processing...${NC}"
  echo ""
  echo "Check status with:"
  echo "   curl http://localhost:3001/api/video/status/$JOB_ID | jq"
else
  echo -e "${YELLOW}❌ Video creation failed!${NC}"
  echo "Check API logs:"
  echo "   bash service-manager.sh logs"
fi

echo ""
echo "=" | tr '=' '\n' | head -n 60 | tr '\n' '=' && echo ""
echo -e "${GREEN}🐾🎭🗡️ Ability execution complete!${NC}"
echo ""
