import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CountryService } from './country.service';
import { createCountry, updateCountry } from 'src/dto/country.dto';

@Controller('country')
export class CountryController {
  constructor(private readonly countryService: CountryService) {}

  @Get()
  async getAllCountry() {
    return await this.countryService.getAllCountry();
  }

  // 1st
  @Post()
  @UsePipes(new ValidationPipe())
  async newCountry(@Body() country: createCountry) {
    return await this.countryService.createCountry(country);
  }

  // 2nd
  @Put(':id')
  @UsePipes(new ValidationPipe())
  async updateCountry(@Param('id') id: number, @Body() country: updateCountry) {
    return await this.countryService.updateCountry(id, country);
  }

  // 3rd
  @Delete(':id')
  async deleteCountry(@Param('id') id: number) {
    return await this.countryService.deleteCountry(id);
  }

  // 4th
  @Get(':id')
  async getCountry(@Param('id') id: number) {
    return await this.countryService.getCountry(id);
  }
}
