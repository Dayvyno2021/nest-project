import { Controller, Get, Post, Body, Param, Delete, Patch, Query, UseGuards, Logger } from '@nestjs/common';
import {AuthGuard} from '@nestjs/passport';
import { GetUser } from 'src/auth/get-user.decorator';
import { UserEntity } from 'src/auth/user.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-task-filter.dto';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
import { TaskEntity } from './task.entity';
import { TasksService } from './tasks.service';

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {

  private logger = new Logger('TasksController', {timestamp: true});

  constructor(private tasksService: TasksService) {}
  
  @Get()
  async getTasks(
    @Query() filterDto: GetTasksFilterDto,
    @GetUser() user:UserEntity
    ): Promise<TaskEntity[]> {
      this.logger.verbose(`User "${user.username}" retrieving all task, Filters: ${JSON.stringify(filterDto)}`)
      return this.tasksService.getAllTasks(filterDto, user);
  }

  @Post()
  createTask(
    @Body() createTaskDto: CreateTaskDto,
    @GetUser() user: UserEntity
    ):Promise<TaskEntity> {
    return this.tasksService.createTask(createTaskDto, user);
  }

  @Get(':id')
  getTaskById(@Param('id') id: string, @GetUser() user: UserEntity):Promise<TaskEntity> {
    return this.tasksService.getTaskById(id, user);
  }

  // @Get(':id')
  // getTaskById(@Param('id') id: string):Task {
  //   return this.tasksService.getTaskById(id);
  // }

  @Delete(':id')
  deleteTask(@Param('id') id, @GetUser() user:UserEntity): Promise<string>{
    return this.tasksService.deleteTask(id, user);
  }

  @Patch(':id/status')
  updateTaskStatus(
    @Param('id') id: string, 
    @Body() updateTaskstatusDto: UpdateTaskStatusDto, 
    @GetUser() user: UserEntity): Promise<TaskEntity>{

    return this.tasksService.updateTaskStatus(id, updateTaskstatusDto, user);
  }

}
