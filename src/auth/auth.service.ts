import { ConflictException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthCredentialsDto } from './dto/auth-credential.dto';
import { UserEntity } from './user.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt/dist/jwt.service';
import { JwtPayload } from './dto/jwt-payload.interface';

@Injectable()
export class AuthService {

  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private jwtService: JwtService
    ){}

  async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void>{
    try {
      const {username, password} = authCredentialsDto;

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hashSync(password, salt);


      const user = this.userRepository.create({username, password: hash});
      await this.userRepository.save(user);
      
    } catch (error) {
      if (error.code === '23505'){
        throw new ConflictException('Username already exists');
      } else{
        throw new InternalServerErrorException();
      }
    }
  }

  async signIn(authCredentialsDto: AuthCredentialsDto):Promise<{accessToken}>{

    const {username, password} = authCredentialsDto;
    const userExist = await this.userRepository.findOneBy({username});

    if (userExist && (await bcrypt.compare(password, userExist.password))){
      const payload: JwtPayload = {username};
      const accessToken:string = await this.jwtService.sign(payload);
      return {accessToken};
    }else{
      throw new UnauthorizedException('Please check your login credentials')
    }
  }

}
