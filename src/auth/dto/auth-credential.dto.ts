import { IsNotEmpty, Matches, MaxLength, MinLength } from "class-validator";

export class AuthCredentialsDto{

  @IsNotEmpty()
  @MinLength(4)
  @MaxLength(20)
  username: string;

  @IsNotEmpty()
  @MinLength(8)
  @Matches(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/, {
    message: 'password must contain at least a number, an uppercase, a lowercase and a special character'
})
  password: string;
}