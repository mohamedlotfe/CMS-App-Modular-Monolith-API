import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CmsService } from './cms.service';
import { CreateContentDto } from './dto/create-content.dto';
import { UpdateContentDto } from './dto/update-content.dto';

@Controller('cms')
export class CmsController {
  constructor(private readonly cmsService: CmsService) {}

  @Post('content')
  createContent(@Body() createContentDto: CreateContentDto) {
    return this.cmsService.createContent(createContentDto);
  }

  @Get('content')
  findAllContent() {
    return this.cmsService.findAllContent();
  }

  @Get('content/:id')
  findContentById(@Param('id') id: string) {
    return this.cmsService.findContentById(id);
  }

  @Patch('content/:id')
  updateContent(
    @Param('id') id: string,
    @Body() updateContentDto: UpdateContentDto,
  ) {
    return this.cmsService.updateContent(id, updateContentDto);
  }

  @Delete('content/:id')
  deleteContent(@Param('id') id: string) {
    return this.cmsService.deleteContent(id);
  }

  @Post('authors')
  createAuthor(@Body() body: { name: string; email: string }) {
    return this.cmsService.createAuthor(body.name, body.email);
  }

  @Get('authors')
  findAllAuthors() {
    return this.cmsService.findAllAuthors();
  }

  @Post('tags')
  createTag(@Body() body: { name: string }) {
    return this.cmsService.createTag(body.name);
  }

  @Get('tags')
  findAllTags() {
    return this.cmsService.findAllTags();
  }
}
