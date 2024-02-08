import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Inject,
  Post,
  Request,
  UseGuards,
  forwardRef,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from '../auth/auth.service';
import { User } from '../database/entities/user.entity';
import { DataResponse } from '../types/responce';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/log-in.dto';
import { UserService } from './user.service';

@ApiTags('users')
@Controller({
  version: '1',
  path: 'users',
})
export class UserController {
  constructor(
    private readonly userService: UserService,
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
  ) {}

  @ApiResponse({
    status: HttpStatus.OK,
    type: DataResponse<User>,
  })
  @HttpCode(HttpStatus.OK)
  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    try {
      const { password, ...user } =
        await this.userService.createUser(createUserDto);
      return {
        status: HttpStatus.CREATED,
        data: user,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @ApiResponse({
    status: HttpStatus.OK,
    type: DataResponse<{ access_token: string }>,
  })
  @Post('login')
  @UseGuards(AuthGuard('local'))
  async login(@Body() dto: LoginDto, @Request() req) {
    return this.authService.login(req.user);
  }
}
