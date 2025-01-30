import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Countries } from 'src/entity/country.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CountriesService {
  constructor(
    @InjectRepository(Countries) private countryRepo: Repository<Countries>,
  ) {}

  public async getCountries(name?: string, code?: string) {
    let result = await this.countryRepo.find();

    if (name) {
      name = name.toLowerCase();
      result = result.filter((country) =>
        country.country?.toLowerCase().includes(name),
      );
      // console.log(result)
    }

    if (code) {
      code = code.toLowerCase();

      result = result.filter((country) =>
        country.code?.toLowerCase().includes(code),
      );
      // console.log(result)
    }

    return result;
  }
}
