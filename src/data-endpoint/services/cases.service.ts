import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TimeSeries } from '../../timeseries/entity/timeseries.entity';
import { DateDto } from '../dto/date.dto';
import { CasesRepository } from '../repository/cases.repository';

@Injectable()
export class CaseService {
  constructor(
    private readonly casesRepo: CasesRepository,
  ) {}

  // Response contains total confirmed, deaths, recoverd
  // filter by two dates and ISO code
  public async filter(
    date?: DateDto,
    greater?: number,
    less?: number,
    condition?: number,
  ) {
    return await this.casesRepo.filter(date, greater, less, condition);
  }
}
