import { Module } from '@nestjs/common';

import { AppController } from './app.controller';

import { CartModule } from './cart/cart.module';
import { AuthModule } from './auth/auth.module';
import { OrderModule } from './order/order.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Module({
  imports: [
    AuthModule,
    CartModule,
    OrderModule,
    // Config Service
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    // Type ORM
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USER'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        autoLoadEntities: true, // Automatically load entities (useful during development)
        synchronize: true, // Auto-create tables, use only in dev mode
        // entities: []
      }),
    }),
  ],
  controllers: [
    AppController,
  ],
  providers: [],
})
export class AppModule {
  constructor(private dataSource: DataSource) {}
}
