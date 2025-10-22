import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { VideoModule } from './video/video.module';
import { PersonalitiesModule } from './personalities/personalities.module';

/**
 * App Module
 * Root module with MongoDB connections to all three personality databases
 */
@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // Neko's MongoDB connection (neko-defense-system)
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
        dbName: configService.get<string>('MONGODB_DATABASE'),
      }),
      inject: [ConfigService],
    }),

    // Mario's MongoDB connection (marionnette-theater)
    MongooseModule.forRootAsync({
      connectionName: 'marionnette',
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
        dbName: configService.get<string>('MARIONNETTE_DATABASE'),
      }),
      inject: [ConfigService],
    }),

    // Noel's MongoDB connection (noel-precision-archives)
    MongooseModule.forRootAsync({
      connectionName: 'noel',
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
        dbName: configService.get<string>('NOEL_DATABASE'),
      }),
      inject: [ConfigService],
    }),

    // Feature modules
    PersonalitiesModule,
    VideoModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
