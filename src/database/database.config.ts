import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

export function getDatabaseConfig(
  configService: ConfigService,
): TypeOrmModuleOptions {
  return {
    type: 'postgres',
    host: configService.get('DATABASE.HOST') || 'localhost',
    port: (configService.get('DATABASE.PORT') as number) || 5432,
    username: configService.get('DATABASE.USER') || 'postgres',
    password: configService.get('DATABASE.PASS') || 'postgres',
    database: configService.get('DATABASE.NAME') || 'content_db',
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    migrations: [__dirname + '/migrations/*{.ts,.js}'],
    synchronize: false,
    logging: true,
    namingStrategy: new SnakeNamingStrategy(),
  };
}
