import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Quiz } from './quiz.entity';
import { User } from './user.entity';

@Entity()
export class UserQuizScore {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.userQuizScores)
  user: User;

  @ManyToOne(() => Quiz, (quiz) => quiz.userQuizScores)
  quiz: Quiz;

  @Column({ default: 0 })
  score: number;

  @Column({ default: 0 })
  streak: number;
} 
