import { Column, Entity, OneToMany, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { TimeSeries } from './timeseries.entity';

@Entity('countries')
// @Unique(['code'])
export class Countries {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: false,
  })
  country: string;

  @Column({
    type: 'varchar',
    length: 2,
    nullable: false,
    unique: true
  })
  flag: string;

  @Column({
    type: 'varchar',
    length: 2,
    nullable: false,
    unique: true
  })
  code: string;

  @OneToMany(() => TimeSeries, (timeSeries) => timeSeries.country) 
  timeseries: TimeSeries[];

}
