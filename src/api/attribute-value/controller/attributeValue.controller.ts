import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AttributeValueService } from '../service/attributeValue.service';
import { Controller, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { RoleGuard } from 'src/guards/role.guard';

@ApiTags('Attribute-Value')
@Controller('attribute-value')
export class AttributeValueController {
  constructor(private attributeValueService: AttributeValueService) {}
}
