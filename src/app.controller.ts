import { Controller, Get, HttpStatus } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { QuizService } from './quiz/quiz.service';
import { LeaderboardItem } from './types/leaderboard';
import { ArrayDataResponse } from './types/responce';

@ApiTags('')
@Controller({
  version: '1',
  path: '',
})
export class AppController {
  constructor(private readonly quizService: QuizService) {}

  @ApiResponse({
    status: HttpStatus.OK,
    type: ArrayDataResponse<LeaderboardItem>,
  })
  @Get('leaderboard')
  async getLeaderboard() {
    const data = await this.quizService.getLeaderboard();

    return {
      data,
      amount: data.length,
      status: HttpStatus.OK,
    };
  }
}
