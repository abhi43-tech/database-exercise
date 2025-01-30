import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class TimeSeries {

  @Column({
    nullable: false
  })
  country: string

  @Column({
    type: 'varchar',
    nullable: false,
  })
  date: string;

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
}
