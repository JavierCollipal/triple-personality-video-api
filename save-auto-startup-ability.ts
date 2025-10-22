#!/usr/bin/env ts-node

/**
 * 🐾🎭🗡️ Save Auto-Service-Startup Ability to MongoDB
 *
 * This script documents the auto-service-startup pattern as an ability
 * that can be referenced and reused for future projects.
 */

import { MongoClient } from 'mongodb';
import * as dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI not set in .env file!');
  process.exit(1);
}

async function saveAutoStartupAbility() {
  const client = new MongoClient(MONGODB_URI!);

  try {
    console.log('🔗 Connecting to MongoDB Atlas...\n');
    await client.connect();

    const nekoDB = client.db('neko-defense-system');

    // Create the ability document
    const ability = {
      ability_id: 'auto-service-startup-oct22-2025',
      name: 'Auto-Service-Startup Pattern for API Abilities',
      category: 'service-management',
      subcategory: 'automation',
      difficulty: 'intermediate',
      date_learned: new Date(),

      description:
        'Automatically ensure an API service is running before executing abilities that depend on it. ' +
        'If the service is not running, start it automatically. This prevents "connection refused" errors ' +
        'and makes abilities self-sufficient.',

      problem_solved:
        'When creating videos or using the Triple Personality Video API, the service must be running. ' +
        'Previously, users had to manually start the API with "npm run start:dev" before running abilities. ' +
        'This caused failures if the service was not running.',

      approach: [
        'Create service-manager.sh script with start/stop/restart/ensure commands',
        'Implement PID-based process tracking (stores PID in .api.pid file)',
        'Add health check verification (curl to /api/video/health endpoint)',
        'Create ensure_api_running() function that checks if service is up',
        'If service down, automatically start it in background with nohup',
        'Wait up to 30 seconds for API to be ready before proceeding',
        'Log all output to logs/api-YYYYMMDD.log for debugging',
        'Wrap abilities with service manager call before API usage',
      ],

      implementation_details: {
        service_manager_script: 'service-manager.sh',
        commands: {
          ensure: 'Ensures API is running (starts if needed) - DEFAULT',
          start: 'Explicitly start the API service',
          stop: 'Stop the API service',
          restart: 'Restart the API service',
          status: 'Show API status and health',
          logs: 'Follow API logs in real-time',
        },
        pid_file: '.api.pid',
        log_directory: 'logs/',
        api_port: 3001,
        health_endpoint: '/api/video/health',
        max_startup_wait: 30,
      },

      usage_examples: [
        {
          scenario: 'Create video with auto-startup',
          command: './create-video-with-auto-startup.sh /path/to/video.mp4',
          explanation:
            'Script calls service-manager.sh ensure, which starts API if needed, then creates video',
        },
        {
          scenario: 'Manually ensure API is running',
          command: './service-manager.sh ensure',
          explanation: 'Checks if API is running, starts if not',
        },
        {
          scenario: 'Check API status',
          command: './service-manager.sh status',
          explanation: 'Shows PID, process status, health check, log location',
        },
        {
          scenario: 'Watch API logs',
          command: './service-manager.sh logs',
          explanation: 'Follows log file with tail -f',
        },
        {
          scenario: 'Restart API',
          command: './service-manager.sh restart',
          explanation: 'Stops and starts API service',
        },
      ],

      reusability: 'high',

      applicable_to: [
        'Any Node.js API service that needs to run in background',
        'Microservices that abilities depend on',
        'Development servers that need auto-startup',
        'Background services for automation tasks',
        'Docker-less local development workflows',
        'CI/CD pipelines requiring service management',
      ],

      benefits: [
        '✅ Zero manual intervention - abilities are self-sufficient',
        '✅ Prevents "connection refused" errors',
        '✅ PID-based tracking prevents duplicate services',
        '✅ Health checks verify service is actually responding',
        '✅ Automatic logging for debugging',
        '✅ Graceful start/stop/restart operations',
        '✅ Works without Docker or systemd',
      ],

      dependencies: {
        system: ['bash', 'curl', 'jq', 'npm', 'node'],
        node_packages: ['npm run start:dev (API must have this script)'],
        environment: ['.env file with required variables', 'PID file writable location'],
      },

      files_created: [
        {
          file: 'service-manager.sh',
          purpose: 'Core service management script with start/stop/ensure commands',
          size_lines: 300,
        },
        {
          file: 'create-video-with-auto-startup.sh',
          purpose: 'Example ability wrapper that uses service manager',
          size_lines: 150,
        },
        {
          file: '.api.pid',
          purpose: 'Stores API process ID for tracking',
          generated: true,
        },
        {
          file: 'logs/api-YYYYMMDD.log',
          purpose: 'Daily log files for API output',
          generated: true,
        },
      ],

      related_abilities: [
        'video-creation-triple-subtitle-mastery',
        'puppeteer-api-verification',
        'mongodb-triple-documentation',
      ],

      tags: [
        'service-management',
        'automation',
        'pid-tracking',
        'health-checks',
        'background-services',
        'self-starting-abilities',
        'api-management',
        'process-management',
      ],

      created_at: new Date(),
      created_by: 'neko-arc',

      triple_personality_notes: {
        neko_perspective:
          'Nyaa~! This makes abilities super easy to use, desu~! No more manual service starting!',
        mario_perspective:
          'The marionette awakens automatically! The stage prepares itself! MAGNIFICENT automation!',
        noel_perspective:
          'Tch. Finally practical automation. Service starts only when needed. Efficient.',
      },
    };

    // Save to abilities collection
    const result = await nekoDB.collection('abilities').insertOne(ability);

    console.log('✅ Ability saved to MongoDB!');
    console.log('');
    console.log('📊 Ability Details:');
    console.log('-------------------');
    console.log(`Ability ID: ${ability.ability_id}`);
    console.log(`Name: ${ability.name}`);
    console.log(`Category: ${ability.category} / ${ability.subcategory}`);
    console.log(`Difficulty: ${ability.difficulty}`);
    console.log(`Reusability: ${ability.reusability}`);
    console.log(`MongoDB _id: ${result.insertedId}`);
    console.log('');
    console.log('🐾 Neko-Arc: Ability documented, nyaa~!');
    console.log('🎭 Mario: The automation technique is archived!');
    console.log('🗡️ Noel: Pattern available for future reference.');
    console.log('');
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('❌ Error:', errorMessage);
    process.exit(1);
  } finally {
    await client.close();
    console.log('🔗 MongoDB connection closed.');
  }
}

// Main execution
console.log('🐾🎭🗡️ Saving Auto-Service-Startup Ability to MongoDB\n');
saveAutoStartupAbility();
