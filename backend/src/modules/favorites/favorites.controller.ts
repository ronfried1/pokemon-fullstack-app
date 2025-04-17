import { Controller, Get, Post, Delete, Body } from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { FavoriteDto } from './dto/favorite.dto';
import { Favorite } from './schemas/favorite.schema';

@Controller('favorites')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Get()
  async findAll(): Promise<Favorite[]> {
    return this.favoritesService.findAll();
  }

  @Post()
  async addFavorite(@Body() favoriteDto: FavoriteDto): Promise<Favorite> {
    return this.favoritesService.addFavorite(favoriteDto);
  }

  @Delete()
  async removeFavorite(@Body() favoriteDto: FavoriteDto): Promise<void> {
    return this.favoritesService.removeFavorite(favoriteDto);
  }
}
