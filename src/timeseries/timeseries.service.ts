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
import { BadRequestException, Injectable } from '@nestjs/common';
import { CountryRepository } from 'src/country/repository/country.repository';
import { DataSource } from 'typeorm';

@Injectable()
export class TimeSeriesService {
  constructor(
    private readonly timeseriesRepo: TimeseriesRepository,
    private readonly timePaginate: TimePaginate,
    private readonly countryRepo: CountryRepository,
    private dataSource: DataSource,
  ) {}

  // Retrive all timeseires data using pagination
  public async get(paginate: PaginationDto): Promise<ResponseDto<TimeSeries>> {
    return await this.timePaginate.paginateData(paginate);
  }

  // Create timeseries
  public async create(data: CreateTimeseries) {
    const queryRunner = this.dataSource.createQueryRunner();
    const country = await this.countryRepo.findByName(data.name);
    await queryRunner.startTransaction();
    try {
      for (let i = 0; i < data.data.length; i++) {
        let date = new Date(data.data[i].date)
        const existingData = await this.timeseriesRepo.findByDate(
          date,
          country,
        );

        // Gives an error if data is already in database with same date and country
        if (existingData)
          throw new BadRequestException(
            'Data is already available for given Date and Country',
          );

        const timeData = {
          name: data.name,
          date: data.data[i].date,
          confirmed: data.data[i].confirmed,
          deaths: data.data[i].deaths,
          recovered: data.data[i].recovered,
          country: country,
        };
        const newData = await queryRunner.manager.create(TimeSeries, timeData);
        await queryRunner.manager.save(newData);
      }
      await queryRunner.commitTransaction();
      return 'Data is added.';
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  // Update timeseries
  public async update(data: UpdateTimeseries): Promise<TimeSeries> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.startTransaction();
    const country = await this.countryRepo.findByName(data.name);

    try {
      const date = new Date(data.date);
      const existingData = await this.timeseriesRepo.findByDate(date, country);

      // Gives an error if data is not found
      if (!existingData)
        throw new BadRequestException(
          'Data is not available for the given date and country.',
        );

      Object.assign(existingData, data);
      const updatedData = await queryRunner.manager.save(existingData);
      await queryRunner.commitTransaction();
      return updatedData;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  // Delete timeseries
  public async delete(data: DeleteTimeseries): Promise<String> {
    const fromDate = new Date(data.from);
    const toDate = new Date(data.to);
    const country = await this.countryRepo.findByName(data.name);

    const countryData = await this.timeseriesRepo.findByCountry(country);

    const filterData = await this.timeseriesRepo
      .createQueryBuilder('timeseries')
      .select('*')
      .where('timeseries.country = :country', {country: countryData})
      .where('DATE(timeseries.date) > :fromDate', { fromDate })
      .andWhere('DATE(timeseries.date) < :toDate', { toDate })
      .getRawMany();

    const ids = filterData.map((data) => data.id);
    
    if(ids.length > 0)
      await this.timeseriesRepo.delete(ids);

    return 'Data is deleted.';
  }
}
