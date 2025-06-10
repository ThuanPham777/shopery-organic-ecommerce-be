import { ApiPropertyOptional } from "@nestjs/swagger";
import { ApiPagReq } from "src/type/custom-response.type";

export class GetAllOrdersInDto extends ApiPagReq {
    @ApiPropertyOptional({ description: 'Search by customer name or order ID' })
    search?: string;

    @ApiPropertyOptional({ description: 'Filter by order status (e.g. pending, completed, cancelled)' })
    status?: string;

    @ApiPropertyOptional({ description: 'Filter by minimum total amount' })
    minTotal?: number;

    @ApiPropertyOptional({ description: 'Filter by maximum total amount' })
    maxTotal?: number;

    @ApiPropertyOptional({ description: 'Filter orders from this start date (ISO format)' })
    startDate?: string;

    @ApiPropertyOptional({ description: 'Filter orders up to this end date (ISO format)' })
    endDate?: string;
}