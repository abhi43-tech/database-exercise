import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TimeSeries } from '../entity/timeseries.entity';
import { DataSource, Repository } from 'typeorm';
import { Countries } from '../../country/entity/country.entity';
import {
  CreateTimeseries,
  DeleteTimeseries,
  UpdateTimeseries,
} from '../dto/timeseries.dto';

@Injectable()
export class TimeseriesRepository extends Repository<TimeSeries> {
  constructor(
    private dataSource: DataSource,
    @InjectRepository(Countries) private countryRepo: Repository<Countries>,
  ) {
    super(TimeSeries, dataSource.createEntityManager());
  }

  // Create time series data for given country and date if not exist
  public async createTimeseries(data: CreateTimeseries) {
    const queryRunner = this.dataSource.createQueryRunner();
    const country = await this.countryRepo.findOne({
      where: { name: data.name },
    });
    await queryRunner.startTransaction();
    try {
      for (let i = 0; i < data.data.length; i++) {
        const existingData = await this.findOne({
          where: { date: data.data[i].date, name: data.name },
        });

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
        await queryRunner.commitTransaction();
      }

      return 'Data is added.';
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  // Update country for given country and date if exist
  public async updateTimeseries(data: UpdateTimeseries): Promise<TimeSeries> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.startTransaction();

    try {
      const existingData = await queryRunner.manager.findOne(TimeSeries, {
        where: { name: data.name, date: data.date },
      });

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

  // Delete the data for given country for specific date range
  public async deleteTimeseries(data: DeleteTimeseries): Promise<String> {
    const fromDate = new Date(data.from).getTime();
    const toDate = new Date(data.to).getTime();

    const countryData = await this.find({
      where: { name: data.name },
    });

    const filterData = await countryData.filter((data) => {
      const date = new Date(data.date).getTime() ?? null;
      if (fromDate <= date && date <= toDate) return data;
    });

    const ids = filterData.map((data) => data.id);
    await this.delete(ids);

    return 'Data is deleted.';
  }
}
