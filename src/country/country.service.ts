import { Injectable } from '@nestjs/common';
import { CreateCountry, UpdateCountry } from './dto/country.dto';
import { PaginationDto } from '../pagination/dto/pagination.dto';
import { PaginationService } from './../pagination/pagination.service';
import { ResponseDto } from '../pagination/dto/response.dto';
import { Countries } from './entity/country.entity';
import { CountryRepository } from './repository/country.repository';

@Injectable()
export class CountryService {
  constructor(
    private readonly countryRepo: CountryRepository,
    private readonly paginationService: PaginationService,
  ) {}

  // Retrives all countries using pagination 
  public async get(paginate: PaginationDto): Promise<ResponseDto<Countries>> {
    return await this.paginationService.paginateData(paginate);
  }

  // Create country
  public async create(countryData: CreateCountry): Promise<Countries> {
    return await this.countryRepo.createCountry(countryData);
  }

  // Update coutnry
  public async update(
    id: number,
    countryData: UpdateCountry,
  ): Promise<Countries> {
    return await this.countryRepo.updateCountry(id, countryData);
  }

  // Delete country
  public async delete(id: number): Promise<Countries> {
    return await this.countryRepo.deleteCountry(id);
  }

  // Get country
  public async getCountry(id: number) {
    return await this.countryRepo.getCountry(id);
  }

  // Get country from name or ISO code
  public async getSearchData(name?: string, code?: string) {
    return await this.countryRepo.getSearchData(name, code);
  }
}
