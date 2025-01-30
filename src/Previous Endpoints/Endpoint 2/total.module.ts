import { Module } from "@nestjs/common";
import { TotalService } from "./total.service";
import { TotalController } from "./total.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Countries } from "src/entity/country.entity";
import { TimeSeries } from "src/entity/timeseries.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Countries, TimeSeries])],
  controllers: [TotalController],
  providers: [TotalService],
})

export class TotalModule {}