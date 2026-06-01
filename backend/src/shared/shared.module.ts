import { Global, Module } from '@nestjs/common';
import { LoggerService } from './services/logger.service';
import { RedisService } from './services/redis.service';

@Global()
@Module({
  providers: [LoggerService, RedisService],
  exports: [LoggerService, RedisService],
})
export class SharedModule {}
