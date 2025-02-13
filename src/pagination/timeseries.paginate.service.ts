import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaginationDto } from './dto/pagination.dto';
import { ResponseDto } from './dto/response.dto';
import { TimeSeries } from './../timeseries/entity/timeseries.entity';

@Injectable()
export class TimePaginate {
  constructor(
    @InjectRepository(TimeSeries)
    private timeseriesRepo: Repository<TimeSeries>,
  ) {}

  public async paginateData(
    paginate: PaginationDto,
  ): Promise<ResponseDto<TimeSeries>> {
    const { page, pageSize } = paginate;
    const skip = ((page - 1) * pageSize) as number;

    const total = await this.timeseriesRepo.count();
    const order = {
      confirmed: 'DESC' as const,
    };

    const data = await this.timeseriesRepo.find({
      skip,
      take: pageSize,
      order,
    });

    const totalPages = Math.ceil(total / pageSize);

    return {
      data,
      total,
      totalPages,
      page,
      pageSize,
    };
  }
}
