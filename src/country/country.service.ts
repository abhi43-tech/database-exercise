import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCountry, UpdateCountry } from './dto/country.dto';
import { PaginationDto } from '../pagination/dto/pagination.dto';
import { PaginationService } from './../pagination/pagination.service';
import { ResponseDto } from '../pagination/dto/response.dto';
import { Countries } from './entity/country.entity';
import { CountryRepository } from './repository/country.repository';
import { DataSource, Like } from 'typeorm';

@Injectable()
export class CountryService {
  constructor(
    private readonly countryRepo: CountryRepository,
    private readonly paginationService: PaginationService,
    private dataSource: DataSource,
  ) {}

  // Retrives all countries using pagination
  public async get(paginate: PaginationDto): Promise<ResponseDto<Countries>> {
    return await this.paginationService.paginateData(paginate);
  }

  // Create country
  public async create(countryData: CreateCountry): Promise<Countries> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.startTransaction();

    try {
      const newCountry = await queryRunner.manager.create(
        Countries,
        countryData,
      );
      const existingCountry = await this.countryRepo.findByCode(
        countryData.code,
      );

      // Gives an error is code is already in database
      if (existingCountry) {
        throw new ConflictException('ISO Code already exists');
      }

      return await queryRunner.manager.save(newCountry);
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  // Update coutnry
  public async update(
    id: number,
    countryData: UpdateCountry,
  ): Promise<Countries> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const existingCountry = await this.countryRepo.findById(id);

      if (!existingCountry)
        throw new NotFoundException(
          'Country with given ID is not found in Database.',
        );

      if (countryData?.country) existingCountry.name = countryData.country;
      if (countryData?.code) {
        const existingCountryCode = this.countryRepo.findByCode(
          countryData.code,
        );

        // Gives an error if code is not unique
        if (existingCountryCode)
          throw new BadRequestException(
            'Country with given code is already exists.',
          );
        else existingCountry.code = countryData.code;
      }
      if (countryData?.flag) existingCountry.flag = countryData.flag;

      return await queryRunner.manager.save(existingCountry);
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  // Delete country
  public async delete(id: number): Promise<Countries> {
    const country = await this.countryRepo.findWithRelation(id);

    // Error if country is not found
    if (!country)
      throw new NotFoundException('Country with given ID od not found.');

    // Error if timeseries data is exist
    if (country.timeseries.length > 0) {
      throw new BadRequestException(
        'This country is not deleted because, it have timeseries data.',
      );
    }
    return await this.countryRepo.remove(country);
  }

  // Get country with timeseries data
  public async getCountry(id: number) {
    return await this.countryRepo.findWithRelation(id);
  }

  // Get country from name or ISO code
  public async getSearchData(name?: string, code?: string) {
    let where: any = {};
    if (code) where.code = Like(`%${code}%`);
    if (name) where.name = Like(`%${name}%`);

    return this.countryRepo.find({ where });
  }
}
