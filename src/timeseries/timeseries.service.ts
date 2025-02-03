import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  createTimeseries,
  deleteTimeseries,
  updateTimeseries,
} from 'src/dto/timeseries.dto';
import { Countries } from 'src/entity/country.entity';
import { TimeSeries } from 'src/entity/timeseries.entity';
import { PaginationDto } from 'src/pagination/pagination.dto';
import { ResponseDto } from 'src/pagination/response.dto';
import { TimePaginate } from 'src/pagination/timeseries.paginate.service';
import { Repository } from 'typeorm';

@Injectable()
export class TimeSeriesService {
  constructor(
    @InjectRepository(Countries) private countryRepo: Repository<Countries>,
    @InjectRepository(TimeSeries) private timeRepo: Repository<TimeSeries>,
    private readonly timePaginate: TimePaginate
  ) {}

  public async getTime(paginate: PaginationDto): Promise<ResponseDto<TimeSeries>> {
    return await this.timePaginate.paginateData(paginate)
  }

  // 5th
  public async createTimeseries(data: createTimeseries): Promise<String> {
    const queryRunner = this.timeRepo.manager.connection.createQueryRunner();
    await queryRunner.startTransaction();
    try {
      for (let i = 0; i < data.data.length; i++) {
        const existingData = await this.timeRepo.findOne({
          where: { date: data.data[i].date, name: data.name },
        });

        if (existingData)
          throw new BadRequestException(
            'Data is already available for given Date and Country',
          );

        this.validDate(data.data[i].date);

        const timeData = {
          name: data.name,
          date: data.data[i].date,
          confirmed: data.data[i].confirmed,
          deaths: data.data[i].deaths,
          recovered: data.data[i].recovered,
        };
        const newData = await queryRunner.manager.create(TimeSeries, timeData);
        await queryRunner.manager.save(newData);
      }

      return 'Data is added.';
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  // 6th
  public async updateTimeseries(data: updateTimeseries): Promise<TimeSeries> {
    const queryRunner = this.timeRepo.manager.connection.createQueryRunner();
    await queryRunner.startTransaction();

    try {
      const existingData = await queryRunner.manager.findOne(TimeSeries, {
        where: { name: data.name, date: data.date },
      });

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

  // 7th
  public async deleteTimeseries(data: deleteTimeseries): Promise<String> {
    this.validDate(data.from);
    this.validDate(data.to);
    const fromDate = new Date(data.from).getTime();
    const toDate = new Date(data.to).getTime();

    const countryData = await this.timeRepo.find({
      where: { name: data.name },
    });

    const filterData = await countryData.filter((data) => {
      const date = new Date(data.date).getTime() ?? null;
      if (fromDate <= date && date <= toDate) return data;
    });

    const ids = filterData.map((data) => data.id);
    await this.timeRepo.delete(ids);

    return 'Data is deleted.';
  }

  private validDate(date: string) {
    let time = new Date(date).getTime();
    let date_ = new Date(date).getDate();
    let year = new Date(date).getFullYear();
    let month = new Date(date).getMonth() + 1;
    if (isNaN(time) || !date_ || !month || !year)
      throw new BadRequestException('Given Date is not valid');
  }
}
