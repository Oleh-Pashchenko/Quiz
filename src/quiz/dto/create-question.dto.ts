import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { CreateOptionDto } from './create-option.dto';

export class CreateQuestionDto {
  @ApiProperty()
  @IsString({ message: 'Text is required' })
  @IsNotEmpty()
  text: string;

  @ApiProperty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOptionDto)
  options: CreateOptionDto[];
}
