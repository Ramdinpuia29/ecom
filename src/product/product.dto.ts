import { IsNumber, IsString } from "class-validator";

export default class CreateProductDto {
  @IsString()
  public brand: string;

  @IsString()
  public desc: string;

  @IsString()
  public detailDesc!: string;

  @IsString()
  public colors: string;

  @IsString()
  public sizes: string;

  @IsNumber()
  public price: number;

  @IsNumber()
  public discount?: number | null;
}
