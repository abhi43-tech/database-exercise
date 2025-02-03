import { Module } from "@nestjs/common";
import { CountryService } from "./country.service";
import { CountryController } from "./country.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Countries } from "src/entity/country.entity";
import { TimeSeries } from "src/entity/timeseries.entity";
import { DataSource } from "typeorm";
import { PaginationService } from "src/pagination/pagination.service";

@Module({
  imports: [TypeOrmModule.forFeature([Countries, TimeSeries])],
  providers: [CountryService, PaginationService],
  controllers: [CountryController]
})
export class CountryModule {
  constructor(public dataSource: DataSource) {}
}