import { Injectable } from '@nestjs/common';
import { NotFoundException } from '@nestjs/common/exceptions';
import { TaskStatus  } from './task-status-enum';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-task-filter.dto';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
import {InjectRepository} from '@nestjs/typeorm';
import { TaskEntity } from './task.entity';
import { Repository } from 'typeorm';
import { UserEntity } from 'src/auth/user.entity';
import { GetUser } from 'src/auth/get-user.decorator';

@Injectable()
export class TasksService {
  // private tasks: Task[] = [];
  
  constructor(
    @InjectRepository(TaskEntity)
    private taskRepository: Repository<TaskEntity>,
  ) { }

  async getAllTasks(
    filterDto: GetTasksFilterDto,
    @GetUser() user:UserEntity
    ):Promise<TaskEntity[]> {
    const {status, search} = filterDto;
    let query = this.taskRepository.createQueryBuilder('taskEntity');
    query.where({user})
    if (status){
      query.andWhere('(taskEntity.status = :status)', {status: status}); 
    }
    if (search){
      query.andWhere('(taskEntity.title ILIKE :search OR taskEntity.description ILIKE :search)', { //Without d inner aprenthesis gave a bug
        search: `%${search}%`
      })
    }
    const tasks = await query.getMany();
    return tasks
  }

  async createTask(createTaskDto: CreateTaskDto, user: UserEntity):Promise<TaskEntity> {
    const {title, description} = createTaskDto
    const task: TaskEntity = this.taskRepository.create({
      title,
      description,
      status: TaskStatus.OPEN,
      user
    });

    await this.taskRepository.save(task);
    return task;
  }

  async getTaskById(id: string, user: UserEntity): Promise<TaskEntity>{
    const found = await this.taskRepository.findOneBy({id, user});
    // const found = await this.taskRepository.findOne({where:{id, user}});
    if (!found) {
      throw new NotFoundException(`Task with Id: "${id}" not found`)
    }
    return found;
  }

  async deleteTask(id: string, user:UserEntity): Promise<string>{
    const found = await this.taskRepository.delete({id, user});
    if (found.affected===0){
      throw new NotFoundException(`Task with ID: "${id}" not found`)
    }
    return 'Task deleted!!!'
  }

  async updateTaskStatus(id: string, updateTaskStatusDto: UpdateTaskStatusDto, user: UserEntity): Promise<TaskEntity>{
    const task = await this.getTaskById(id, user);
    task.status = updateTaskStatusDto.status;
    await this.taskRepository.save(task)
    return task;
    
  }
}
