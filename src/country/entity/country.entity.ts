import { TimeSeries } from './../../timeseries/entity/timeseries.entity';
import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

@Entity('country')
// @Unique(['code'])
export class Countries {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: false,
  })
  name: string;

  @Column({
    type: 'varchar',
    length: 2,
    nullable: false,
  })
  flag: string;

  @Column({
    type: 'varchar',
    length: 2,
    nullable: false,
  })
  code: string;

  @OneToMany(() => TimeSeries, (timeSeries) => timeSeries.country)
  timeseries: TimeSeries[];
}
