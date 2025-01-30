import { Module } from '@nestjs/common';
import { CountriesController } from './country.controller';
import { CountriesService } from './country.service';
import { TypeORMError } from 'typeorm';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Countries } from 'src/entity/country.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Countries])],
  controllers: [CountriesController],
  providers: [CountriesService],
})
export class CountriesModule {}