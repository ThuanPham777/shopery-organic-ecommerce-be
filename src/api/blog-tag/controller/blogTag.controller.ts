import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ApiRes } from 'src/type/custom-response.type';
import { SUCCESS } from 'src/contants/response.constant';
import { BlogTagService } from '../service/blogTag.service';

@ApiTags('blogTag')
@Controller('blogTag')
export class BlogTagController {
    constructor(private readonly blogTagService: BlogTagService) { }

    @Get()
    async getNameOfAllBlogTags() {
        const tagsName = await this.blogTagService.getNameOfAllBlogTags();

        return new ApiRes(tagsName, SUCCESS);
    }
}
