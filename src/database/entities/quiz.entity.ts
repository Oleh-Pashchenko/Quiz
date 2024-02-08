import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Question } from './question.entity';
import { UserQuizScore } from './user-quiz-score.entity';

@Entity()
export class Quiz {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @OneToMany(() => Question, (question) => question.quiz, {
    cascade: true,
  })
  questions: Question[];

  @OneToMany(() => UserQuizScore, userQuizScore => userQuizScore.quiz)
  userQuizScores: UserQuizScore[];
}
