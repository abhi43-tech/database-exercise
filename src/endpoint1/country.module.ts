import { Module } from "@nestjs/common";
import { CountryService } from "./country.service";
import { CountryController } from "./country.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Countries } from "src/entity/country.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Countries])],
  providers: [CountryService],
  controllers: [CountryController]
})
export class CountryModule {}