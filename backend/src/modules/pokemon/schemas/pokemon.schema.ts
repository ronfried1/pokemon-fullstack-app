import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Pokemon extends Document {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ required: true })
  url: string;

  @Prop({ default: false })
  isFav: boolean;

  @Prop({ default: false })
  isViewed: boolean;

  @Prop({ type: Object })
  details?: any; // Save full fetched details if available
}

export const PokemonSchema = SchemaFactory.createForClass(Pokemon);

@Schema({ timestamps: true })
export class PokemonDetail extends Document {
  @Prop({ type: Types.ObjectId, ref: 'Pokemon', required: true })
  pokeId: Types.ObjectId;

  @Prop({ type: Object, required: true })
  details: any;
}

export const PokemonDetailSchema = SchemaFactory.createForClass(PokemonDetail);

