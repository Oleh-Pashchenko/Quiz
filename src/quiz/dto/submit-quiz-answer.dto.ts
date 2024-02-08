import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class SubmitQuizAnswerDto {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty({ message: 'questionId is required' })
  questionId: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty({ message: 'optionId is required' })
  optionId: number;
}
