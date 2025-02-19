import { Countries } from '../../country/entity/country.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('timeseries')
export class TimeSeries {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'date',
    nullable: false,
  })
  date: Date;

  @Column({
    type: 'int',
    nullable: true,
  })
  confirmed: number;

  @Column({
    type: 'int',
    nullable: true,
  })
  deaths: number;

  @Column({
    type: 'int',
    nullable: true,
  })
  recovered: number;

  @ManyToOne(() => Countries, (country) => country.timeseries, {
    nullable: false,
    onUpdate: 'CASCADE'
  })
  @JoinColumn({ name: 'country_id', referencedColumnName: 'id' })
  country: Countries;
}
