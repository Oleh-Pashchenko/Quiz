import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Option } from './option.entity';
import { User } from './user.entity';

@Entity()
export class Answer {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.answers)
  user: User;

  @ManyToOne(() => Option, (option) => option.answers)
  option: Option;
}
