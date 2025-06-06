import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AdminService } from './../service/user.service';
import { Body, Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { UpdateStatus } from '../dto/updateStatus.dto';
import { RoleGuard } from 'src/guards/role.guard';
import { Roles } from 'src/api/auth/decorators/roles.decorator';
import { EUserRole } from 'src/enums/user.enums';

@ApiTags('Admin / User')
@ApiBearerAuth('bearerAuth')
@Controller('admin/user')
@UseGuards(JwtAuthGuard, RoleGuard)
export class UserController {
  constructor(private adminService: AdminService) { }

  @Get()
  @Roles(EUserRole.ADMIN)
  async getAllUsers() {
    return this.adminService.getAllUsers();
  }

  @Patch(':userId/update-status')
  @Roles(EUserRole.ADMIN)
  async updateStatus(
    @Param('userId') userId: number,
    @Body() updateStatus: UpdateStatus,
  ) {
    return this.adminService.updateUserStatus(userId, updateStatus);
  }
}
