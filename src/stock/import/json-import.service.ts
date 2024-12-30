import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as fs from 'fs/promises';
import path from 'path';
import { BSECompany } from '../schemas/bse-company.schema';

@Injectable()
export class JsonImportService implements OnModuleInit {
  constructor(@InjectModel('bsecompany') private bseCompany: Model<BSECompany>) {}

  async onModuleInit(): Promise<void> {
    console.log('Initializing module... Checking and importing JSON data.');

    const filePath = path.resolve(__dirname, '../../assets/bsecompany.json'); // For development
    await this.checkAndImportJson(filePath);
  }

  async checkAndImportJson(filePath: string): Promise<void> {
    const documentCount = await this.bseCompany.countDocuments();
    if (documentCount > 0) {
      console.log('Collection already has data. Skipping JSON import.');
      return;
    }

    console.log('Collection is empty. Importing JSON data...');

    try {
      // Read the JSON file
      const jsonData = await fs.readFile(filePath, 'utf-8');
      const data: Partial<BSECompany>[] = JSON.parse(jsonData);

      // Insert data into MongoDB
      await this.bseCompany.insertMany(data);
      console.log('JSON data successfully imported!');
    } catch (err) {
      console.error('Error importing JSON data:', err);
      throw err;
    }
  }
}
