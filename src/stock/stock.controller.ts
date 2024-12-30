import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiTags,ApiBody } from '@nestjs/swagger';
import { StockService } from './stock.service';

@ApiTags('Stock API')
@Controller('stock-api')
export class StockController {
  constructor(private readonly stockService: StockService) {}

  @Post('analyze')
  @ApiBody({ 
    description: 'Stock analysis payload containing company data and news URLs',
  })
  async analyzeStock(
    @Body() payload: {companyName:string,latestNewsUrls:string}
  ): Promise<{aiInsight:string}> {
    return this.stockService.analyzeStock(payload);
  }
  
  @Get('search')
  async searchCompany(@Query('keyword') keyword: string) {
    if (!keyword) {
      return {
        message: 'Keyword is required',
        data: [],
      };
    }
    const results = await this.stockService.searchCompany(keyword);
    return results;
  }
  
}
