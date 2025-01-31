import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Countries } from "src/entity/country.entity";
import { TimeSeries } from "src/entity/timeseries.entity";
import { CaseController } from "./cases.controller";
import { CaseService } from "./cases.service";
import { TotalModule } from "../Endpoint 2/total.module";
import { TotalService } from "../Endpoint 2/total.service";

@Module({
  imports: [TypeOrmModule.forFeature([Countries, TimeSeries])],
  controllers: [CaseController],
  providers: [CaseService, TotalService],
})

export class CaseModule {}