import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('countries')
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
}
