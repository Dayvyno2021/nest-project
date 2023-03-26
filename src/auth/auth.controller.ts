import { Controller, Post, Body,/* UseGuards, Req */} from '@nestjs/common';
// import {AuthGuard} from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/auth-credential.dto';
import { JwtPayload } from './dto/jwt-payload.interface';

@Controller('auth')
export class AuthController {

  constructor(private authService: AuthService){};

  @Post('/signup')
  signup(@Body() authCredentialsDto: AuthCredentialsDto): Promise<void>{
    return this.authService.signUp(authCredentialsDto);
  }

  @Post('/signin')
  signIn(@Body() authCredentialsDto: AuthCredentialsDto): Promise<{accessToken}>{
    return this.authService.signIn(authCredentialsDto);
  }

  // @Post('/test')
  // @UseGuards(AuthGuard())
  // test(@Req() req){
  //   console.log(req)
  // }
}
