import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Option } from '../database/entities/option.entity';
import { Quiz } from '../database/entities/quiz.entity';
import { UserQuizScore } from '../database/entities/user-quiz-score.entity';
import { User } from '../database/entities/user.entity';
import { Answer } from './../database/entities/answer.entity';
import { CreateQuizDto } from './dto/create-quiz.dto';
import { SubmitQuizAnswerDto } from './dto/submit-quiz-answer.dto';

@Injectable()
export class QuizService {
  constructor(
    @Inject('QUIZ_REPOSITORY')
    private quizRepository: Repository<Quiz>,
    @Inject('ANSWER_REPOSITORY')
    private answerRepository: Repository<Answer>,
    @Inject('OPTION_REPOSITORY')
    private optionRepository: Repository<Option>,
    @Inject('USER_QUIZ_SCORE_REPOSITORY')
    private userQuizScoreRepository: Repository<UserQuizScore>,
  ) {}

  async create(createQuizDto: CreateQuizDto) {
    const quiz = this.quizRepository.create(createQuizDto);
    await this.quizRepository.save(quiz);

    return quiz;
  }

  async findAll() {
    return this.quizRepository.findAndCount({
      select: ['id', 'title'],
    });
  }

  async findOne(id: number) {
    const quiz = await this.quizRepository
      .createQueryBuilder('quiz')
      .leftJoinAndSelect('quiz.questions', 'question')
      .leftJoinAndSelect(
        'question.options',
        'option',
        'question.quizId = :id',
        { id },
      )
      .select([
        'quiz.id',
        'quiz.title',
        'question.id',
        'question.text',
        'option.id',
        'option.text',
      ])
      .where('quiz.id = :id', { id })
      .getOne();

    if (!quiz) {
      throw new NotFoundException(`Quiz with ID ${id} not found`);
    }

    return quiz;
  }

  async participate(id: number) {
    const quiz = await this.quizRepository
      .createQueryBuilder('quiz')
      .leftJoinAndSelect('quiz.questions', 'question')
      .leftJoinAndSelect(
        'question.options',
        'option',
        'question.quizId = :id',
        { id },
      )
      .select([
        'quiz.id',
        'quiz.title',
        'question.id',
        'question.text',
        'option.id',
        'option.text',
      ])
      .where('quiz.id = :id', { id })
      .getOne();

    if (!quiz) {
      throw new NotFoundException(`Quiz with ID ${id} not found`);
    }

    return quiz;
  }

  async submitAnswer(
    user: User,
    quizId: number,
    { questionId, optionId }: SubmitQuizAnswerDto,
  ) {
    const option = await this.optionRepository.findOne({
      where: {
        id: optionId,
        question: { id: questionId, quiz: { id: quizId } },
      },
    });

    if (!option) {
      throw new NotFoundException(
        `Option ${optionId} in question ${questionId} of quiz ${quizId} not found`,
      );
    }

    if (option.isCorrect) {
      const quizUserScore = await this.userQuizScoreRepository.findOne({
        where: { quiz: { id: quizId }, user: { id: user.id } },
      });

      let scoreData = quizUserScore;

      if (!quizUserScore) {
        const quiz = await this.quizRepository.findOne({
          where: { id: quizId },
        });
        scoreData = this.userQuizScoreRepository.create({
          user,
          quiz,
          score: 0,
          streak: 0,
        });
      }
      if (option.isCorrect) {
        scoreData.streak++;
        scoreData.score += 1 + this.calculateStreakBonus(scoreData.streak);
      } else {
        scoreData.streak = 0;
      }

      await this.userQuizScoreRepository.save(scoreData);
    }

    const answer = this.answerRepository.create({
      user,
      option,
    });

    await this.answerRepository.save(answer);

    return option;
  }

  async getQuizScore(user: User, quizId: number) {
    const userQuizScore = await this.userQuizScoreRepository.findOne({
      where: { quiz: { id: quizId }, user: { id: user.id } },
    });

    if (!userQuizScore) {
      throw new NotFoundException(
        `User ${user.id} does not have score for quiz ${quizId}`,
      );
    }

    return {
      score: userQuizScore.score,
      streak: userQuizScore.streak,
    };
  }

  async getLeaderboard() {
    return this.userQuizScoreRepository
      .createQueryBuilder('uqs')
      .select('user.username', 'username')
      .addSelect('SUM(uqs.score) + SUM(uqs.streak)', 'totalscore')
      .innerJoin('uqs.user', 'user')
      .groupBy('user.username')
      .orderBy('totalscore', 'DESC')
      .getRawMany();
  }

  private calculateStreakBonus(streak: number): number {
    return Math.floor(streak / 3) * 2;
  }
}
