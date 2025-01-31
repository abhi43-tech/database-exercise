import { Module } from '@nestjs/common';
import * as Joi from 'joi';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CountryModule } from './country/country.module';
import { Countries } from './entity/country.entity';
import { TimeSeries } from './entity/timeseries.entity';
import { TimeSeriesModule } from './timeseries/timeseries.module';
import { CountriesModule } from './Previous Endpoints/Endpoint 1/country.module';
import { TotalModule } from './Previous Endpoints/Endpoint 2/total.module';
import { CaseModule } from './Previous Endpoints/Endpoint 3/cases.module';
import { MonthModule } from './Previous Endpoints/Endpoint 4/month.module';
import { TopModule } from './Previous Endpoints/Endpoint 5/top.module';
import { EXcelModule } from './Previous Endpoints/Endpoint 6/excel.module';

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
        host: "localhost",
        entities: [Countries, TimeSeries],
        synchronize: false,
      }),
    }),
    CountryModule,
    TimeSeriesModule,
    CountriesModule,
    TotalModule,
    CaseModule,
    MonthModule,
    TopModule,
    EXcelModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  
}

// type: 'configService.get<string>('DB_TYPE') as any',
//         host: configService.get<string>('DB_HOST'),
//         port: configService.get<number>('DB_PORT'),
//         username: configService.get<string>('DB_USERNAME'),
//         password: configService.get<string>('DB_PASSWORD'),
//         database: configService.get<string>('DB_DATABASE'),
//         entities: [Countries],
//         synchronize: true,
