import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { createCountry, updateCountry } from 'src/dto/country.dto';
import { Countries } from 'src/entity/country.entity';
import { TimeSeries } from 'src/entity/timeseries.entity';
import { PaginationDto } from 'src/pagination/pagination.dto';
import { PaginationService } from 'src/pagination/pagination.service';
import { ResponseDto } from 'src/pagination/response.dto';
import { DataSource, EntityManager, Repository, Transaction } from 'typeorm';

@Injectable()
export class CountryService {
  constructor(
    @InjectRepository(Countries) private countryRepo: Repository<Countries>,
    @InjectRepository(TimeSeries) private timeRepo: Repository<TimeSeries>,
    private dataSource: DataSource,
    private readonly paginationService: PaginationService
  ) {}

  public async getAllCountry(paginate: PaginationDto): Promise<ResponseDto<Countries>> {
    return await this.paginationService.paginateData(paginate)
  }

  // 1st
  public async createCountry(countryData: createCountry): Promise<Countries> {
    const queryRunner = this.countryRepo.manager.connection.createQueryRunner();
    await queryRunner.startTransaction();

    try {
      const newCountry = await queryRunner.manager.create(
        Countries,
        countryData,
      );
      const existingCountry = await queryRunner.manager.findOne(Countries, {
        where: { code: countryData.code },
      });

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

  // 2nd
  public async updateCountry(
    id: number,
    countryData: updateCountry,
  ): Promise<Countries> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const existingCountry = await queryRunner.manager.findOne(Countries, {
        where: { id: id },
      });

      if (!existingCountry)
        throw new NotFoundException(
          'Country with given ID is not found in Database.',
        );

      if (countryData?.country) existingCountry.country = countryData.country;
      if (countryData?.code) {
        const existingCountryCode = await queryRunner.manager.findOne(Countries, {
          where: { code: countryData.code },
        });
        if (existingCountryCode)
          throw new BadRequestException(
            'Country with given code is already exists.',
          );
        else existingCountry.code = countryData.code;
      }
      if (countryData?.flag) existingCountry.flag = countryData.flag;

      return await queryRunner.manager.save(existingCountry);
    } catch (err) {
      await queryRunner.rollbackTransaction()
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  // 3rd
  public async deleteCountry(id: number): Promise<Countries> {
    const country = await this.countryRepo.findOne({
      relations: { timeseries: true },
      where: { id: id },
    });
    if (!country)
      throw new NotFoundException('Country with given ID od not found.');
    if (country.timeseries.length > 0) {
      throw new BadRequestException(
        'This country is not deleted because, it have timeseries data.',
      );
    }
    return await this.countryRepo.remove(country);
  }

  // 4th
  public async getCountry(id: number) {
    const country = await this.countryRepo.findOne({
      where: { id: id },
    });

    if (!country) throw new NotFoundException('Coutnry is not found.');
    const data = await this.countryRepo.findOne({
      relations: { timeseries: true },
      where: { id: id },
    });
    return data;
  }
}
