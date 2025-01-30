import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { createCountry, updateCountry } from 'src/dto/country.dto';
import { Countries } from 'src/entity/country.entity';
import { TimeSeries } from 'src/entity/timeseries.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CountryService {
  constructor(
    @InjectRepository(Countries) private countryRepo: Repository<Countries>,
    @InjectRepository(TimeSeries) private timeRepo: Repository<TimeSeries>,
  ) {}

  public async getAllCountry(): Promise<Countries[]> {
    return await this.countryRepo.find();
  }

  // 1st
  public async createCountry(countryData: createCountry): Promise<Countries> {
    const existingCountry = await this.countryRepo.findOne({
      where: { code: countryData.code },
    });

    if (existingCountry) {
      throw new ConflictException('ISO Code already exists');
    }
    const newCountry = await this.countryRepo.create(countryData);

    return await this.countryRepo.save(newCountry);
  }

  // 2nd
  public async updateCountry(
    id: number,
    countryData: updateCountry,
  ): Promise<Countries> {
    const existingCountry = await this.countryRepo.findOne({
      where: { id: id },
    });

    if (!existingCountry)
      throw new ConflictException(
        'Country with given code is not found in Database.',
      );

    if (countryData?.country) existingCountry.country = countryData.country;
    if (countryData?.code) existingCountry.code = countryData.code;
    if (countryData?.flag) existingCountry.flag = countryData.flag;

    return await this.countryRepo.save(existingCountry);
  }

  // 3rd
  public async deleteCountry(id: number): Promise<Countries> {
    const country = await this.countryRepo.findOne({
      relations: { timeseries: true },
      where: { id: id },
    });
    if (country.timeseries.length > 0) {
      throw new BadRequestException(
        'This country is not deleted because, it have timeseries data.',
      );
    }
    return await this.countryRepo.remove(country);
  }

  // 4th
  public async getCountry(id: number) {
    return await this.countryRepo.findOne({
      relations: { timeseries: true },
      where: { id: id },
    });
  }
}
