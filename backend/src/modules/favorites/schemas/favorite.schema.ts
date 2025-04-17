import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Favorite extends Document {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop()
  createdAt: Date;
}

export const FavoriteSchema = SchemaFactory.createForClass(Favorite);
