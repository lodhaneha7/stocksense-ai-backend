import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ collection: 'bsecompany' })
export class BSECompany extends Document {
  @Prop({ required: true, unique: true })
  securityCode: string;

  @Prop({ required: true })
  issuerName: string;

  @Prop({ required: true })
  securityId: string;

  @Prop({ required: true })
  securityName: string;

  @Prop({ required: true })
  status: string;

  @Prop({ required: true })
  group: string;

  @Prop({ required: true })
  faceValue: number;

  @Prop({ required: true })
  isinNo: string;

  @Prop()
  industry?: string;

  @Prop({ required: true })
  instrument: string;

  @Prop({ required: true })
  sectorName: string;

  @Prop()
  industryNewName?: string;

  @Prop()
  igroupName?: string;

  @Prop()
  isubgroupName?: string;
}

export const BSECompanySchema = SchemaFactory.createForClass(BSECompany);
