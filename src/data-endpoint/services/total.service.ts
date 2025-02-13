import { Injectable } from '@nestjs/common';
import { DateDto } from '../dto/date.dto';
import { TotalRepository } from '../repository/total.repository';

@Injectable()
export class TotalService {
  constructor(
    private readonly totalRepo: TotalRepository
  ) {}

  // Response contains total confirmed, total deaths, total recovered for each country
  public async get(condition?: number) {
    return await this.totalRepo.get(condition)
  }

  // filter by between two dates
  // filter by total confirmedcase is greater or less than a number 
  public async filter(date?: DateDto, iso?: string) {
    return await this.totalRepo.filter(date, iso);
  }
}
