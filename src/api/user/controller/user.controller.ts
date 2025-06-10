import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserService } from '../service/user.service';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { RoleGuard } from 'src/guards/role.guard';
import { Controller, UseGuards } from '@nestjs/common';

@ApiTags('User')
@Controller('user')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RoleGuard)
export class UserController {
    constructor(private userService: UserService) { }
}
