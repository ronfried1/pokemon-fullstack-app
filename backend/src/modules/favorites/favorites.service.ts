import {
  Injectable,
  ConflictException,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Favorite } from './schemas/favorite.schema';
import { FavoriteDto } from './dto/favorite.dto';

@Injectable()
export class FavoritesService {
  private readonly logger = new Logger(FavoritesService.name);

  constructor(
    @InjectModel(Favorite.name) private favoriteModel: Model<Favorite>,
  ) {}

  async findAll(): Promise<Favorite[]> {
    return this.favoriteModel.find().sort({ createdAt: -1 }).exec();
  }

  async addFavorite(favoriteDto: FavoriteDto): Promise<Favorite> {
    const { name } = favoriteDto;
    const existingFavorite = await this.favoriteModel.findOne({ name }).exec();

    if (existingFavorite) {
      this.logger.warn(`Pokemon ${name} is already in favorites`);
      throw new ConflictException(`Pokemon ${name} is already in favorites`);
    }

    const newFavorite = new this.favoriteModel({ name });
    return newFavorite.save();
  }

  async removeFavorite(favoriteDto: FavoriteDto): Promise<void> {
    const { name } = favoriteDto;
    const result = await this.favoriteModel.deleteOne({ name }).exec();

    if (result.deletedCount === 0) {
      this.logger.warn(`Pokemon ${name} not found in favorites`);
      throw new NotFoundException(`Pokemon ${name} not found in favorites`);
    }
  }
}
