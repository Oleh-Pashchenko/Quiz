import {
    Body,
    Controller,
    Get,
    HttpStatus,
    Param,
    ParseIntPipe,
    Post,
    Request,
    UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Quiz } from '../database/entities/quiz.entity';
import { UserRequest } from '../types/request';
import {
    ArrayDataResponse,
    DataResponse,
    MessageResponse,
} from '../types/responce';
import { CreateQuizDto } from './dto/create-quiz.dto';
import { SubmitQuizAnswerDto } from './dto/submit-quiz-answer.dto';
import { QuizService } from './quiz.service';

@ApiTags('quizzes')
@Controller({
  version: '1',
  path: 'quizzes',
})
export class QuizController {
  constructor(private readonly quizService: QuizService) {}

  @ApiResponse({
    status: HttpStatus.OK,
    type: DataResponse<number>,
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Post()
  async create(@Body() createQuizDto: CreateQuizDto) {
    const quiz = await this.quizService.create(createQuizDto);
    return {
      data: quiz.id,
      status: HttpStatus.CREATED,
    };
  }

  @ApiResponse({
    status: HttpStatus.OK,
    type: ArrayDataResponse<Quiz>,
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Get()
  async findAll() {
    const [data, amount] = await this.quizService.findAll();
    return { amount, data, status: HttpStatus.OK };
  }

  @ApiResponse({
    status: HttpStatus.OK,
    type: DataResponse<Quiz>,
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const data = await this.quizService.findOne(id);

    return { data, status: HttpStatus.OK };
  }

  @ApiResponse({
    status: HttpStatus.OK,
    type: DataResponse<Quiz>,
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Post(':id/participate')
  async participate(@Param('id', ParseIntPipe) id: number) {
    const data = await this.quizService.participate(id);
    return {
      status: HttpStatus.OK,
      data,
    };
  }

  @ApiResponse({
    status: HttpStatus.OK,
    type: MessageResponse,
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Post(':id/answer')
  async submitAnswer(
    @Param('id', ParseIntPipe) quizId: number,
    @Body() dto: SubmitQuizAnswerDto,
    @Request() req: UserRequest,
  ) {
    await this.quizService.submitAnswer(req.user, quizId, dto);

    return {
      message: 'Answers submitted successfully',
      status: HttpStatus.CREATED,
    };
  }

  @ApiResponse({
    status: HttpStatus.OK,
    type: DataResponse<{ access_token: string }>,
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Get(':id/score')
  async getParticipantScore(
    @Param('id', ParseIntPipe) id: number,
    @Request() req: UserRequest,
  ) {
    const data = await this.quizService.getQuizScore(req.user, id);
    return { data, status: HttpStatus.OK };
  }
}
