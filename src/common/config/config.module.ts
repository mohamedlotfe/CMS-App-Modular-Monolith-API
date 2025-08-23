import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import configs from './config.service';

@Module({
  imports: [
    NestConfigModule.forRoot({
      isGlobal: true,
      load: [configs],
    }),
  ],
})
export class ConfigModule {}
