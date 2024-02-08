import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class CreateOptionDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'Text is required' })
  text: string;

  @ApiProperty()
  @IsBoolean({ message: 'isCorrect is required' })
  isCorrect: boolean;
}
