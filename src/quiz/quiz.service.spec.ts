import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { Answer } from '../database/entities/answer.entity';
import { Option } from '../database/entities/option.entity';
import { Quiz } from '../database/entities/quiz.entity';
import { UserQuizScore } from '../database/entities/user-quiz-score.entity';
import { CreateQuizDto } from './dto/create-quiz.dto';
import { SubmitQuizAnswerDto } from './dto/submit-quiz-answer.dto';
import { QuizService } from './quiz.service';

describe('QuizService', () => {
  let service: QuizService;
  let quizRepository: Repository<Quiz>;
  let answerRepository: Repository<Answer>;
  let optionRepository: Repository<Option>;
  let userQuizScoreRepository: Repository<UserQuizScore>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        QuizService,
        {
          provide: 'QUIZ_REPOSITORY',
          useClass: Repository,
        },
        {
          provide: 'ANSWER_REPOSITORY',
          useClass: Repository,
        },
        {
          provide: 'OPTION_REPOSITORY',
          useClass: Repository,
        },
        {
          provide: 'USER_QUIZ_SCORE_REPOSITORY',
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<QuizService>(QuizService);
    quizRepository = module.get('QUIZ_REPOSITORY');
    answerRepository = module.get('ANSWER_REPOSITORY');
    optionRepository = module.get('OPTION_REPOSITORY');
    userQuizScoreRepository = module.get('USER_QUIZ_SCORE_REPOSITORY');
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a new quiz', async () => {
    const createQuizDto: CreateQuizDto = {
      title: 'Mock Quiz Title',
      questions: [
        {
          text: 'Mock Question 1',
          options: [
            { text: 'Mock Option 1', isCorrect: true },
            { text: 'Mock Option 2', isCorrect: false },
          ],
        },
        {
          text: 'Mock Question 2',
          options: [
            { text: 'Mock Option 1', isCorrect: true },
            { text: 'Mock Option 2', isCorrect: false },
            { text: 'Mock Option 3', isCorrect: false },
          ],
        },
      ],
    };

    const saveMock = jest.fn().mockResolvedValue(createQuizDto);
    quizRepository.create = jest.fn().mockReturnValue(createQuizDto);
    quizRepository.save = saveMock;

    const createdQuiz = await service.create(createQuizDto);

    expect(quizRepository.create).toHaveBeenCalledWith(createQuizDto);
    expect(saveMock).toHaveBeenCalled();

    expect(createdQuiz).toEqual(createQuizDto);
  });

  it('should submit an answer and calculate the score correctly', async () => {
    const submitAnswerDto: SubmitQuizAnswerDto = {
      questionId: 1,
      optionId: 1,
    };

    const mockUser = { id: 1, username: 'testuser' };
    const mockQuiz = { id: 1, title: 'Test Quiz' };
    const mockOption = { id: 1, text: 'Option A', isCorrect: true };

    answerRepository.create = jest
      .fn()
      .mockReturnValueOnce({ user: mockUser, option: mockOption } as any);
    answerRepository.save = jest.fn().mockResolvedValueOnce({} as any);
    quizRepository.findOne = jest.fn().mockReturnValue(mockQuiz);
    optionRepository.findOne = jest.fn().mockReturnValue(mockOption);
    userQuizScoreRepository.findOne = jest.fn().mockReturnValue(null);
    userQuizScoreRepository.save = jest.fn().mockReturnValue({});
    userQuizScoreRepository.create = jest.fn().mockReturnValue({
      user: mockUser,
      quiz: mockQuiz,
      score: 0,
      streak: 0,
    });

    await service.submitAnswer(mockUser as any, mockQuiz.id, submitAnswerDto);

    expect(answerRepository.create).toHaveBeenCalledWith({
      user: mockUser,
      option: mockOption,
    } as any);
    expect(answerRepository.save).toHaveBeenCalledWith({
      user: mockUser,
      option: mockOption,
    } as any);

    const expectedScore = 1;
    const expectedStreak = 1;
    expect(userQuizScoreRepository.save).toHaveBeenCalledWith({
      user: mockUser,
      quiz: mockQuiz,
      score: expectedScore,
      streak: expectedStreak,
    } as any);
  });

  it('should return the score and streak for a user in a quiz', async () => {
    const mockUser = { id: 1, username: 'testuser' };
    const mockQuizId = 1;
    const mockUserQuizScore = {
      user: mockUser,
      quiz: { id: mockQuizId },
      score: 10,
      streak: 3,
    };

    userQuizScoreRepository.findOne = jest
      .fn()
      .mockResolvedValue(mockUserQuizScore);

    const result = await service.getQuizScore(mockUser as any, mockQuizId);

    expect(result).toEqual({
      score: mockUserQuizScore.score,
      streak: mockUserQuizScore.streak,
    });
    expect(userQuizScoreRepository.findOne).toHaveBeenCalledWith({
      where: { quiz: { id: mockQuizId }, user: { id: mockUser.id } },
    });
  });

  it('should throw an error if user score for the quiz is not found', async () => {
    const mockUser = { id: 1, username: 'testuser' };
    const mockQuizId = 1;

    userQuizScoreRepository.findOne = jest.fn().mockResolvedValue(null);

    await expect(
      service.getQuizScore(mockUser as any, mockQuizId),
    ).rejects.toThrow(
      new NotFoundException(
        `User ${mockUser.id} does not have score for quiz ${mockQuizId}`,
      ),
    );

    expect(userQuizScoreRepository.findOne).toHaveBeenCalledWith({
      where: { quiz: { id: mockQuizId }, user: { id: mockUser.id } },
    });
  });
});
