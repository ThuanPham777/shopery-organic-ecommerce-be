import { ApiPropertyOptional } from '@nestjs/swagger';
import { EUserStatus } from 'src/enums/user.enums';

export class UpdateStatus {
  @ApiPropertyOptional({
    example: 'active',
    description: 'update user status',
  })
  status: EUserStatus;
}
