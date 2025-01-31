import { Module } from "@nestjs/common";
import { ExcelController } from "./excel.controller";
import { ExcelService } from "./excel.service";
import { MonthService } from "../Endpoint 4/month.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TimeSeries } from "src/entity/timeseries.entity";
import { Countries } from "src/entity/country.entity";

@Module({
  imports: [TypeOrmModule.forFeature([TimeSeries, Countries])],
  providers: [ExcelService, MonthService],
  controllers: [ExcelController]
})
export class EXcelModule {}