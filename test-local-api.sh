#!/bin/bash

# 🐾🎭🗡️ Triple Personality Video API - Local Testing Script
# This script makes it easy to test the API locally

set -e

echo "🐾🎭🗡️ Triple Personality Video API - Local Test"
echo "=" | tr '=' '\n' | head -n 60 | tr '\n' '=' && echo ""

# Check if server is running
if ! curl -s http://localhost:3001/api/video/health > /dev/null 2>&1; then
  echo "❌ API is not running on port 3001!"
  echo ""
  echo "Start it with:"
  echo "  npm run start:dev"
  echo ""
  exit 1
fi

echo "✅ API is running!"
echo ""

# Test 1: Health Check
echo "📋 Test 1: Health Check"
echo "-------------------------"
curl -s http://localhost:3001/api/video/health | jq
echo ""
echo ""

# Test 2: Get Personalities Info
echo "📋 Test 2: Personalities Info"
echo "------------------------------"
curl -s http://localhost:3001/api/video/personalities | jq '.personalities | length' | \
  awk '{print "Found " $1 " personalities ✅"}'
echo ""

# Test 3: Create Video (Interactive)
echo "📋 Test 3: Create Video"
echo "------------------------"
echo ""
echo "Do you want to create a test video? (y/n)"
read -r CREATE_VIDEO

if [ "$CREATE_VIDEO" = "y" ] || [ "$CREATE_VIDEO" = "Y" ]; then
  echo ""
  echo "Enter path to input video file:"
  read -r INPUT_VIDEO

  if [ ! -f "$INPUT_VIDEO" ]; then
    echo "❌ File not found: $INPUT_VIDEO"
    exit 1
  fi

  OUTPUT_NAME="test-triple-personality-$(date +%Y%m%d-%H%M%S).mp4"

  echo ""
  echo "🐾 Neko-Arc: Creating video with triple personalities, nyaa~!"
  echo "🎭 Mario: The grand performance begins!"
  echo "🗡️ Noel: Proceeding with encoding."
  echo ""

  RESPONSE=$(curl -s -X POST http://localhost:3001/api/video/create \
    -H "Content-Type: application/json" \
    -d "{
      \"inputVideoPath\": \"$INPUT_VIDEO\",
      \"outputFileName\": \"$OUTPUT_NAME\",
      \"commentaries\": [
        {
          \"personality\": \"neko-arc\",
          \"text\": \"Nyaa~! This is a test video, desu~! Look at this amazing content!\",
          \"startTime\": 0,
          \"endTime\": 10
        },
        {
          \"personality\": \"mario-gallo-bestino\",
          \"text\": \"ACT I: THE GRAND TEST BEGINS! BEHOLD this magnificent demonstration!\",
          \"startTime\": 0,
          \"endTime\": 10
        },
        {
          \"personality\": \"noel\",
          \"text\": \"Tch. Proceeding with test encoding. Quality verification in progress.\",
          \"startTime\": 0,
          \"endTime\": 10
        }
      ],
      \"encodingMethod\": \"cpu\",
      \"includeCarabinerosHymn\": true,
      \"crf\": 18
    }")

  echo "Response:"
  echo "$RESPONSE" | jq
  echo ""

  # Extract job ID
  JOB_ID=$(echo "$RESPONSE" | jq -r '.jobId')
  OUTPUT_PATH=$(echo "$RESPONSE" | jq -r '.outputPath')
  STATUS=$(echo "$RESPONSE" | jq -r '.status')

  if [ "$STATUS" = "completed" ]; then
    echo "✅ Video created successfully!"
    echo ""
    echo "📁 Output location:"
    echo "   $OUTPUT_PATH"
    echo ""
    echo "📊 File info:"
    if [ -f "$OUTPUT_PATH" ]; then
      ls -lh "$OUTPUT_PATH"
      echo ""
      echo "🎬 Play with:"
      echo "   ffplay \"$OUTPUT_PATH\""
      echo "   # or"
      echo "   vlc \"$OUTPUT_PATH\""
    fi
  elif [ "$STATUS" = "processing" ]; then
    echo "⏳ Video is processing..."
    echo ""
    echo "Check status with:"
    echo "   curl http://localhost:3001/api/video/status/$JOB_ID | jq"
  else
    echo "❌ Video creation failed!"
    echo "Check server logs for details."
  fi
else
  echo "Skipping video creation test."
fi

echo ""
echo "=" | tr '=' '\n' | head -n 60 | tr '\n' '=' && echo ""
echo "🐾 Neko-Arc: Testing complete, nyaa~!"
echo "🎭 Mario: What a magnificent test performance!"
echo "🗡️ Noel: Results verified. Proceed with actual usage."
echo ""
