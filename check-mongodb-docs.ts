#!/usr/bin/env ts-node

/**
 * 🐾🎭🗡️ MongoDB Triple Database Checker
 *
 * This script checks all 3 databases after video creation to verify
 * that the triple-personality documentation system is working.
 *
 * Usage:
 *   npx ts-node check-mongodb-docs.ts
 */

import { MongoClient } from 'mongodb';
import * as dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI not set in .env file!');
  process.exit(1);
}

interface VideoJob {
  jobId: string;
  inputVideoPath: string;
  outputFileName: string;
  status: string;
  outputPath?: string;
  fileSize?: number;
  duration?: number;
  personalities: string[];
  createdAt: Date;
  completedAt?: Date;
}

interface Performance {
  performanceId: string;
  title: string;
  director: string;
  assistantDirector?: string;
  tacticalAdvisor?: string;
  actStructure?: object;
  marioReview?: string;
  nekoReview?: string;
  noelReview?: string;
  status: string;
  createdAt: Date;
}

interface CombatSession {
  combatId: string;
  title: string;
  commander: string;
  supportUnits?: string[];
  performanceMetrics?: object;
  noelAssessment?: string;
  nekoComment?: string;
  marioProtest?: string;
  status: string;
  createdAt: Date;
}

async function checkTripleDatabases() {
  const client = new MongoClient(MONGODB_URI);

  try {
    console.log('🔗 Connecting to MongoDB Atlas...\n');
    await client.connect();

    // 1. Check Neko's Database
    console.log('🐾 NEKO-ARC\'S DATABASE: neko-defense-system');
    console.log('=' .repeat(60));
    const nekoDB = client.db('neko-defense-system');
    const videoJobs = await nekoDB
      .collection<VideoJob>('videojobs')
      .find({})
      .sort({ createdAt: -1 })
      .limit(5)
      .toArray();

    console.log(`Found ${videoJobs.length} recent video jobs:\n`);
    videoJobs.forEach((job, index) => {
      console.log(`${index + 1}. Job ID: ${job.jobId}`);
      console.log(`   Output: ${job.outputFileName}`);
      console.log(`   Status: ${job.status}`);
      console.log(`   Personalities: ${job.personalities.join(', ')}`);
      console.log(`   Created: ${job.createdAt}`);
      if (job.completedAt) {
        console.log(`   Completed: ${job.completedAt}`);
      }
      console.log('');
    });

    // 2. Check Mario's Database
    console.log('\n🎭 MARIO GALLO BESTINO\'S DATABASE: marionnette-theater');
    console.log('=' .repeat(60));
    const marioDB = client.db('marionnette-theater');
    const performances = await marioDB
      .collection<Performance>('performances')
      .find({})
      .sort({ createdAt: -1 })
      .limit(5)
      .toArray();

    console.log(`Found ${performances.length} recent performances:\n`);
    performances.forEach((perf, index) => {
      console.log(`${index + 1}. Performance ID: ${perf.performanceId}`);
      console.log(`   Title: ${perf.title}`);
      console.log(`   Director: ${perf.director}`);
      console.log(`   Status: ${perf.status}`);
      if (perf.marioReview) {
        console.log(`   Mario's Review: "${perf.marioReview}"`);
      }
      console.log(`   Created: ${perf.createdAt}`);
      console.log('');
    });

    // 3. Check Noel's Database
    console.log('\n🗡️ NOEL\'S DATABASE: noel-precision-archives');
    console.log('=' .repeat(60));
    const noelDB = client.db('noel-precision-archives');
    const combatSessions = await noelDB
      .collection<CombatSession>('combatsessions')
      .find({})
      .sort({ createdAt: -1 })
      .limit(5)
      .toArray();

    console.log(`Found ${combatSessions.length} recent combat sessions:\n`);
    combatSessions.forEach((session, index) => {
      console.log(`${index + 1}. Combat ID: ${session.combatId}`);
      console.log(`   Title: ${session.title}`);
      console.log(`   Commander: ${session.commander}`);
      console.log(`   Status: ${session.status}`);
      if (session.noelAssessment) {
        console.log(`   Noel's Assessment: "${session.noelAssessment}"`);
      }
      console.log(`   Created: ${session.createdAt}`);
      console.log('');
    });

    // Summary
    console.log('\n📊 TRIPLE DATABASE SUMMARY');
    console.log('=' .repeat(60));
    console.log(`🐾 Neko's Database:  ${videoJobs.length} video jobs`);
    console.log(`🎭 Mario's Database: ${performances.length} performances`);
    console.log(`🗡️ Noel's Database:  ${combatSessions.length} combat sessions`);
    console.log('');

    if (videoJobs.length === 0 && performances.length === 0 && combatSessions.length === 0) {
      console.log('⚠️ No documents found! Create a video first using:');
      console.log('   ./test-local-api.sh');
      console.log('');
    } else {
      console.log('✅ Triple-personality documentation system is working!');
      console.log('');
    }

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
console.log('🐾🎭🗡️ Triple Personality MongoDB Database Checker\n');
checkTripleDatabases();
