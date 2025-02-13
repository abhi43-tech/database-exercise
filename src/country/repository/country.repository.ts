import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DataSource, Like, Repository } from 'typeorm';
import { Countries } from '../entity/country.entity';
import { CreateCountry, UpdateCountry } from '../dto/country.dto';

@Injectable()
export class CountryRepository extends Repository<Countries> {
  constructor(private dataSource: DataSource) {
    super(Countries, dataSource.createEntityManager());
  }

  //  Create country if given code is unique
  public async createCountry(countryData: CreateCountry): Promise<Countries> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.startTransaction();

    try {
      const newCountry = await queryRunner.manager.create(
        Countries,
        countryData,
      );
      const existingCountry = await queryRunner.manager.findOne(Countries, {
        where: { code: countryData.code },
      });

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

  // Update country and ensure that ISO code in valid and unique
  public async updateCountry(
    id: number,
    countryData: UpdateCountry,
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

      if (countryData?.country) existingCountry.name = countryData.country;
      if (countryData?.code) {
        const existingCountryCode = await queryRunner.manager.findOne(
          Countries,
          {
            where: { code: countryData.code },
          },
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

  // Delete country if timeseries data is exist then gives an error
  public async deleteCountry(id: number): Promise<Countries> {
    const country = await this.findOne({
      relations: { timeseries: true },
      where: { id: id },
    });

    // Error if country is not found
    if (!country)
      throw new NotFoundException('Country with given ID od not found.');

    // Error if timeseries data is exist
    if (country.timeseries.length > 0) {
      throw new BadRequestException(
        'This country is not deleted because, it have timeseries data.',
      );
    }
    return await this.remove(country);
  }

  // Get the country data with timseries data
  public async getCountry(id: number) {
    const country = await this.findOne({
      where: { id: id },
      relations: { timeseries: true },
    });

    if (!country) throw new NotFoundException('Coutnry is not found.');
    return country;
  }

  // Get country data based on name or ISO code
  public async getSearchData(name?: string, code?: string) {
    if (name && code)
      return await this.find({
        where: { name: Like(`%${name}%`), code: Like(`%${code}%`) },
      });
    if (name) {
      return await this.find({
        where: { name: Like(`%${name}%`) },
      });
    } else if (code) {
      return await this.find({
        where: { code: Like(`%${code}%`) },
      });
    } else {
      return await this.find();
    }
  }
}
