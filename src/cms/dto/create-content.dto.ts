import {
  IsString,
  IsUUID,
  IsArray,
  IsOptional,
  IsBoolean,
} from 'class-validator';

export class CreateContentDto {
  @IsString()
  title: string;

  @IsString()
  body: string;

  @IsUUID()
  authorId: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];

  @IsBoolean()
  @IsOptional()
  published?: boolean;
}
