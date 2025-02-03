import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CountryService } from './country.service';
import { createCountry, updateCountry } from 'src/dto/country.dto';
import { PaginationDto } from 'src/pagination/pagination.dto';

@Controller('country')
export class CountryController {
  constructor(private readonly countryService: CountryService) {}

  @Get()
  async getAllCountry(@Query('page') page: number, @Query('pageSize') pageSize: number) {
    const paginate: PaginationDto = {page:page, pageSize: pageSize}
    return await this.countryService.getAllCountry(paginate);
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
