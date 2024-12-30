import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { StockModule } from './stock/stock.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_URI'),
      }),
      inject: [ConfigService],
    }),
    ConfigModule.forRoot({ isGlobal: true,
      validationSchema: Joi.object({
        MONGO_URI: Joi.string().uri().required(),
        AZURE_OPENAI_API_KEY: Joi.string().required(),
        OPENAI_API_VERSION: Joi.string().optional(),
        AZURE_OPENAI_DEPLOYMENT_ID: Joi.string().optional(),
        AZURE_OPENAI_ENDPOINT: Joi.string().uri().required(),
      }),
     }),
    StockModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {

}
