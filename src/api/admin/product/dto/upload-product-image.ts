import { ApiProperty } from '@nestjs/swagger';

export class UploadProductImageDto {
    @ApiProperty({
        type: 'string',
        format: 'binary',
        description: 'Image file to upload'
    })
    image: Express.Multer.File;
}