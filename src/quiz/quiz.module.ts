import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { QuizController } from './quiz.controller';
import { quizProviders } from './quiz.providers';
import { QuizService } from './quiz.service';

@Module({
  imports: [DatabaseModule],
  providers: [
    ...quizProviders,
    QuizService
  ],
  controllers: [QuizController],
  exports: [QuizService],
})
export class QuizModule {}
