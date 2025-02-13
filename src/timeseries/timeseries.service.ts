import {
  CreateTimeseries,
  DeleteTimeseries,
  UpdateTimeseries,
} from '../timeseries/dto/timeseries.dto';
import { TimeSeries } from '../timeseries/entity/timeseries.entity';
import { PaginationDto } from '../pagination/dto/pagination.dto';
import { ResponseDto } from '../pagination/dto/response.dto';
import { TimePaginate } from '../pagination/timeseries.paginate.service';
import { TimeseriesRepository } from './repository/timeseries.repo';
import { Injectable } from '@nestjs/common';

@Injectable()
export class TimeSeriesService {
  constructor(
    private readonly timeseriesRepo: TimeseriesRepository,
    private readonly timePaginate: TimePaginate,
  ) {}

  // Retrive all timeseires data using pagination
  public async get(paginate: PaginationDto): Promise<ResponseDto<TimeSeries>> {
    return await this.timePaginate.paginateData(paginate);
  }

  // Create timeseries
  public async create(data: CreateTimeseries) {
    return await this.timeseriesRepo.createTimeseries(data);
  }

  // Update timeseries
  public async update(data: UpdateTimeseries): Promise<TimeSeries> {
    return await this.timeseriesRepo.updateTimeseries(data);
  }

  // Delete timeseries
  public async delete(data: DeleteTimeseries): Promise<String> {
    return await this.timeseriesRepo.deleteTimeseries(data);
  }
}
