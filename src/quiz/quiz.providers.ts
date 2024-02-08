import { Answer } from '../database/entities/answer.entity';
import { Option } from '../database/entities/option.entity';
import { Question } from '../database/entities/question.entity';

import { DataSource } from 'typeorm';
import { Quiz } from '../database/entities/quiz.entity';
import { UserQuizScore } from '../database/entities/user-quiz-score.entity';

export const quizProviders = [
  {
    provide: 'QUIZ_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Quiz),
    inject: ['DATA_SOURCE'],
  },
  {
    provide: 'OPTION_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Option),
    inject: ['DATA_SOURCE'],
  },
  {
    provide: 'ANSWER_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Answer),
    inject: ['DATA_SOURCE'],
  },
  {
    provide: 'QUESTION_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Question),
    inject: ['DATA_SOURCE'],
  },
  {
    provide: 'USER_QUIZ_SCORE_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(UserQuizScore),
    inject: ['DATA_SOURCE'],
  },
];
