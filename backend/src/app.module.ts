import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PokemonModule } from './modules/pokemon/pokemon.module';
import { HealthModule } from './modules/health/health.module';
import { MongoMemoryServer } from 'mongodb-memory-server';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        // Option 1: Use MongoDB Atlas
        const mongoURI = configService.get<string>('MONGODB_URI');

        // Option 2: Use local MongoDB
        const useLocalMongoDB =
          configService.get<string>('USE_LOCAL_MONGODB') === 'true';
        const localMongoURI = 'mongodb://localhost:27017/pokemon-app';

        // Option 3: Use in-memory MongoDB (for development/testing)
        const useMemoryDB =
          configService.get<string>('USE_MEMORY_DB') === 'true';
        let memoryMongoURI = '';

        if (useMemoryDB) {
          const mongod = await MongoMemoryServer.create();
          memoryMongoURI = mongod.getUri() + 'pokemon-app';
          console.log(`📦 Using in-memory MongoDB at: ${memoryMongoURI}`);
        }

        // Determine which URI to use
        let uri: string;
        if (useMemoryDB) {
          uri = memoryMongoURI;
        } else if (useLocalMongoDB) {
          console.log('🔄 Using local MongoDB at:', localMongoURI);
          uri = localMongoURI;
        } else if (mongoURI) {
          uri = mongoURI;
        } else {
          // Default fallback (should never reach here if .env is properly configured)
          uri = 'mongodb://localhost:27017/pokemon-app';
        }

        return {
          uri,
          retryAttempts: 3,
          retryDelay: 1000,
          autoIndex: true,
        };
      },
    }),
    PokemonModule,
    HealthModule,
  ],
})
export class AppModule {}
