import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Countries } from 'src/entity/country.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CountryService {
  constructor(
    @InjectRepository(Countries) private countryRepo: Repository<Countries>,
  ) {}

  public async getAllCountry() {
    return await this.countryRepo.find();
  }

  public async getCountry(country: string) {
    return await this.countryRepo.findOne({ where: { country: country } })
  }
}
