import { Module } from "@nestjs/common";
import { MonthService } from "./month.service";
import { MonthController } from "./month.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Countries } from "src/entity/country.entity";
import { TimeSeries } from "src/entity/timeseries.entity";
import { CaseService } from "../Endpoint 3/cases.service";

@Module({
  imports: [TypeOrmModule.forFeature([Countries, TimeSeries])],
  providers: [MonthService],
  controllers: [MonthController],
})
export class MonthModule {}