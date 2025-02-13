import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CountryModule } from './country/country.module';
import { Countries } from './country/entity/country.entity';
import { TimeSeries } from './timeseries/entity/timeseries.entity';
import { TimeSeriesModule } from './timeseries/timeseries.module';
import { DataModule } from './data-endpoint/data.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        database: 'covid_data',
        port: Number(3306),
        username: 'root',
        password: '',
        host: 'localhost',
        entities: [Countries, TimeSeries],
        synchronize: true,
        // logging: true,
      }),
    }),
    CountryModule,
    TimeSeriesModule,
    DataModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

