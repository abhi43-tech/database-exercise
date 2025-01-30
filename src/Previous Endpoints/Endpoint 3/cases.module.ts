import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Countries } from "src/entity/country.entity";
import { TimeSeries } from "src/entity/timeseries.entity";
import { CaseController } from "./cases.controller";
import { CaseService } from "./cases.service";

@Module({
  imports: [TypeOrmModule.forFeature([Countries, TimeSeries])],
  controllers: [CaseController],
  providers: [CaseService],
})

export class CaseModule {}