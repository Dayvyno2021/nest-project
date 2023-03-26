import { Exclude } from 'class-transformer';
import { UserEntity } from 'src/auth/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { TaskStatus } from './task-status-enum';

@Entity()
export class TaskEntity{
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  status: TaskStatus;

  @ManyToOne(_type=>UserEntity, userEntity=>userEntity.tasks, {eager: false})
  @Exclude({toPlainOnly: true})//exclude user object when returning json object
  user: UserEntity;
}