import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { PaginationDto } from "./pagination.dto";
import { Countries } from "src/entity/country.entity";
import { ResponseDto } from "./response.dto";

@Injectable()
export class PaginationService {
  constructor(@InjectRepository(Countries) private countryRepo: Repository<Countries>) {}

  public async paginateData(paginate: PaginationDto): Promise<ResponseDto<Countries>>  {
    const { page, pageSize } = paginate;
    const skip = ((page - 1) * pageSize) as number;

    const total = await this.countryRepo.count();
    const order = {
      country: 'ASC' as const
    }

    const data = await this.countryRepo.find({
      skip,
      take: pageSize,
      order,
    });

    const totalPages = Math.ceil(total / pageSize);

    return {
      data,
      total,
      totalPages,
      page,
      pageSize,
    }
  }
}