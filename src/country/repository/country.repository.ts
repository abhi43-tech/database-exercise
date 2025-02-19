import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Countries } from '../entity/country.entity';

@Injectable()
export class CountryRepository extends Repository<Countries> {
  createQueryRunner() {
    throw new Error('Method not implemented.');
  }
  constructor(private dataSource: DataSource) {
    super(Countries, dataSource.createEntityManager());
  }

  public async findByCode(code: string) {
    return await this.findOne({ where: { code } });
  }

  public async findById(id: number): Promise<Countries> {
    return await this.findOne({ where: { id } });
  }

  public async findWithRelation(id: number) {
    return await this.findOne({
      where: { id },
      relations: { timeseries: true },
    });
  }

  public async findByName(name: string) {
    return await this.findOne({
      where: { name },
      select: ['id'],
    });
  }
}
