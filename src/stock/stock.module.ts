import { Module } from '@nestjs/common';
import { StockService } from './stock.service';
import { StockController } from './stock.controller';
import { HttpModule } from '@nestjs/axios';
import { AzureOpenAiService } from 'src/azure/azure-openai.service';
import { MongooseModule } from '@nestjs/mongoose';
import { BSECompanySchema } from './schemas/bse-company.schema';
import { JsonImportService } from './import/json-import.service';

@Module({
  imports: [
    HttpModule,
    MongooseModule.forFeature([{ name:'bsecompany', schema: BSECompanySchema }]),
  ],
  providers: [StockService,AzureOpenAiService,JsonImportService,AzureOpenAiService],
  controllers: [StockController]
})
export class StockModule {}
