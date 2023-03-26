import { TaskEntity } from "src/tasks/task.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class UserEntity{
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({unique: true})
  username: string;

  @Column()
  password: string;

  @OneToMany(_taskEntity=> TaskEntity, taskEntity=>taskEntity.user, {eager: true})
  tasks: TaskEntity[]
}