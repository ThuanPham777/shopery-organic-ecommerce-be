import { UserService } from 'src/api/user/service/user.service';
import { Controller, Get } from '@nestjs/common';

@Controller('user')
export class UserController {
  constructor(private readonly UserService: UserService) {}
}
