import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

@Schema()
export class Pokemon extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  url: string;

  @Prop({ required: true, default: false })
  isFav: boolean;

  @Prop({ required: true, default: false })
  isViewed: boolean;
}

export const PokemonSchema = SchemaFactory.createForClass(Pokemon);

// Schema for Pokemon details
@Schema()
export class PokemonDetail extends Document {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Pokemon', required: true })
  pokeId: MongooseSchema.Types.ObjectId;

  @Prop({ type: Object, required: true })
  details: {
    id: number;
    name: string;
    types: string[];
    abilities: string[];
    height: number;
    weight: number;
    stats: {
      hp: number;
      attack: number;
      defense: number;
      specialAttack: number;
      specialDefense: number;
      speed: number;
    };
    sprites: {
      front: string;
      back?: string;
    };
    evolutions?: {
      id: number;
      name: string;
      sprite: string;
      condition?: string;
    }[];
  };
}

export const PokemonDetailSchema = SchemaFactory.createForClass(PokemonDetail);

// Viewed schema
@Schema()
export class Viewed extends Document {
  @Prop({ required: true })
  userId: MongooseSchema.Types.ObjectId; // The user who viewed

  @Prop({ type: Object })
  details: object; // Can store view metadata like timestamp

  @Prop({ required: true })
  pokeId: MongooseSchema.Types.ObjectId; // Reference to Pokemon
}

export const ViewedSchema = SchemaFactory.createForClass(Viewed);
