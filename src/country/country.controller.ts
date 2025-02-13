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
import { CreateCountry, UpdateCountry } from './dto/country.dto';
import { PaginationDto } from '../pagination/dto/pagination.dto';
import { ApiQuery } from '@nestjs/swagger';
import { Countries } from './entity/country.entity';

@Controller('country')
export class CountryController {
  constructor(private readonly countryService: CountryService) {}

  @Get()
  async get(@Query('page') page: number, @Query('pageSize') pageSize: number) {
    const paginate: PaginationDto = { page: page, pageSize: pageSize };
    return await this.countryService.get(paginate);
  }

  /**
   *  Create country if ISO code is valid and unique
   * 
   * @Body country
   * @returns
   */
  @Post()
  @UsePipes(new ValidationPipe())
  async new(@Body() country: CreateCountry): Promise<Countries> {
    return await this.countryService.create(country);
  }

  /**
   * Update country and ensure that ISO is unqiue and valid
   * 
   * @param id 
   * @Body country 
   * @returns 
   */
  @Put(':id')
  @UsePipes(new ValidationPipe())
  async update(@Param('id') id: number, @Body() country: UpdateCountry) {
    return await this.countryService.update(id, country);
  }

  /**
   *  Delete country if Timeseries data is not exist for that country
   *  
   * @param id 
   * @returns 
   */
  @Delete(':id')
  async delete(@Param('id') id: number) {
    return await this.countryService.delete(id);
  }

  /**
   * Get country by name or code 
   * 
   * @param name 
   * @param code 
   * @returns 
   */
  @Get('search')
  @ApiQuery({
    name: 'name',
    description: 'Enter Country Name',
    required: false,
    type: String,
  })
  @ApiQuery({
    name: 'code',
    description: 'Enter Country Code',
    required: false,
    type: String,
  })
  getSearchData(@Query('name') name?: string, @Query('code') code?: string) {
    return this.countryService.getSearchData(name, code);
  }

  /**
   *  Get country data with Timeseries data by country ID
   * 
   * @param id 
   * @returns 
   */
  @Get(':id')
  async getCountry(@Param('id') id: number) {
    return await this.countryService.getCountry(id);
  }
}
