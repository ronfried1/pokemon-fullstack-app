import { IsString, IsNotEmpty } from 'class-validator';

export class FavoriteDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}
