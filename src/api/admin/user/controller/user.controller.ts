import { ApiTags } from '@nestjs/swagger';
import { AdminService } from './../service/user.service';
import { Body, Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { UpdateStatus } from '../dto/updateStatus.dto';

@ApiTags('Admin / User')
@Controller('admin/user')
export class UserController {
  constructor(private adminService: AdminService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async getAllUsers() {
    return this.adminService.getAllUsers();
  }

  @Patch(':userId/update-status')
  @UseGuards(JwtAuthGuard)
  async updateStatus(
    @Param('userId') userId: number,
    @Body() updateStatus: UpdateStatus,
  ) {
    return this.adminService.updateUserStatus(userId, updateStatus);
  }
}
