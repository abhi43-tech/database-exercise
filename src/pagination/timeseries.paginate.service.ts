import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { PaginationDto } from "./pagination.dto";
import { ResponseDto } from "./response.dto";
import { TimeSeries } from "src/entity/timeseries.entity";

@Injectable()
export class TimePaginate {
  constructor(@InjectRepository(TimeSeries) private countryRepo: Repository<TimeSeries>) {}

  public async paginateData(paginate: PaginationDto): Promise<ResponseDto<TimeSeries>>  {
    const { page, pageSize } = paginate;
    const skip = ((page - 1) * pageSize) as number;

    const total = await this.countryRepo.count();
    const order = {
      confirmed: 'DESC' as const,
    }

    const data = await this.countryRepo.find({
      skip,
      take: pageSize,
      order
    });

    const totalPages = Math.ceil(total / pageSize);

    return {
      data,
      total,
      totalPages,
      page,
      pageSize,
    }
  }
}