import { Module } from "@nestjs/common";
import { TopService } from "./top.service";
import { TopController } from "./top.controller";
import { CaseService } from "../Endpoint 3/cases.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TimeSeries } from "src/entity/timeseries.entity";
import { Countries } from "src/entity/country.entity";
import { TotalService } from "../Endpoint 2/total.service";

@Module({
  imports: [TypeOrmModule.forFeature([TimeSeries, Countries])],
  providers: [TopService, CaseService, TotalService],
  controllers: [TopController]
})
export class TopModule {}