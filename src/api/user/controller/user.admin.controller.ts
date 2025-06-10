import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { UserService } from '../service/user.service';
import { Body, Controller, Get, Param, Patch, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { UpdateStatus } from '../dto/updateStatus.dto';
import { RoleGuard } from 'src/guards/role.guard';
import { Roles } from 'src/api/auth/decorators/roles.decorator';
import { EUserRole } from 'src/enums/user.enums';
import { GetAllUsersInDto } from '../dto/get-all-users.in.dto';
import { GetAllUsersOutRes } from '../dto/get-all-users.out.dto';
import { SUCCESS } from 'src/contants/response.constant';
import { ApiPagRes, ApiRes } from 'src/type/custom-response.type';

@ApiTags('Admin / User')
@ApiBearerAuth()
@Controller('admin/user')
@UseGuards(JwtAuthGuard, RoleGuard)
export class UserAdminController {
  constructor(private userService: UserService) { }

  @Get()
  @Roles(EUserRole.ADMIN)
  @ApiOkResponse({ type: GetAllUsersOutRes })
  async getAllUsers(@Query() query: GetAllUsersInDto) {
    const { page, perPage } = query;
    const result = await this.userService.getAllUsers(query);

    return new ApiPagRes(result.users, result.total, page, perPage, SUCCESS);
  }

  @Patch(':userId/update-status')
  @Roles(EUserRole.ADMIN)
  async updateStatus(
    @Param('userId') userId: number,
    @Body() updateStatus: UpdateStatus,
  ) {
    const result = await this.userService.updateUserStatus(userId, updateStatus);

    return new ApiRes(result, SUCCESS);
  }
}
