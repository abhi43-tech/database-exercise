import { Controller, Get, Param } from '@nestjs/common';
import { CountryService } from './country.service';

@Controller('country')
export class CountryController {
  constructor(private readonly countryService: CountryService) {}

  @Get()
  getAllCountry() {
    return this.countryService.getAllCountry();
  }

  @Get(':country')
  getCountry(@Param('country') country: string) {
    return this.countryService.getCountry(country);
  }
}
