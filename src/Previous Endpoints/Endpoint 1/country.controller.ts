import { Controller, Get, Query } from '@nestjs/common';
import { CountriesService } from './country.service';


@Controller('countries')
export class CountriesController {
  constructor(private readonly countriesService: CountriesService) {}

  @Get() 
  getCountries(@Query('name') name?: string, @Query('code') code?: string) {

    return this.countriesService.getCountries(name, code);
  }
}