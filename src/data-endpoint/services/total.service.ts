import { Injectable } from '@nestjs/common';
import { DateDto } from '../dto/date.dto';
import { TotalRepository } from '../repository/total.repository';

@Injectable()
export class TotalService {
  constructor(
    private readonly totalRepo: TotalRepository
  ) {}

  // Response contains total confirmed, total deaths, total recovered
  public async get(condition?: number) {
    return await this.totalRepo.get(condition)
  }

  // filter by ISO code
  public async filter(date?: DateDto, iso?: string) {
    return await this.totalRepo.filter(date, iso);
  }
}
