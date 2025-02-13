import { BadRequestException, Injectable } from '@nestjs/common';
import { DateDto } from '../dto/date.dto';
import { CaseService } from './cases.service';
import { TotalService } from './total.service';

@Injectable()
export class TopService {
  constructor(
    private readonly totalService: TotalService,
    private readonly caseService: CaseService,
  ) {}

  // Return top N coutnry with highest total confirmed cases
  public async get(top?: number, date?: DateDto) {
    let data;
    if (date.from != undefined)
      data = await this.caseService.filter(date, null, null, top);
    else data = await this.totalService.get(top ? top : 2);

    return data;
  }
}
