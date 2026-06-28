import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CatalogYear } from '../../database/entities/catalog-year.entity';
import { CatalogYearsController } from './catalog-years.controller';
import { CatalogYearsService } from './catalog-years.service';

@Module({
  imports: [TypeOrmModule.forFeature([CatalogYear])],
  controllers: [CatalogYearsController],
  providers: [CatalogYearsService],
  exports: [CatalogYearsService],
})
export class CatalogYearsModule {}
