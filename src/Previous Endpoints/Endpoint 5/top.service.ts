import { BadRequestException, Injectable } from '@nestjs/common';
import { dateDto } from 'src/dto/date.dto';
import { CaseService } from '../Endpoint 3/cases.service';

@Injectable()
export class TopService {
  private data;
  constructor(private readonly caseService: CaseService) {}

  public async getTopData(top?: number, date?: dateDto) {
    if(top && top > 15) throw new BadRequestException('Do not ask more than 15 countries.')

    if (date) this.data = await this.caseService.getFilterData(date);
    else this.data = await this.caseService.getData();
    const sortedData = [...this.data];

    sortedData.sort((countryA, countryB) => {
      const confirmedA = countryA.confirmed;
      const confirmedB = countryB.confirmed;

      if (confirmedA > confirmedB) {
        return -1;
      } else if (confirmedA < confirmedB) {
        return 1;
      } else {
        return 0;
      }
    });

    let topCountries = sortedData.slice(0, Number(top) ? Number(top) : 3);

    return topCountries;
  }
}
