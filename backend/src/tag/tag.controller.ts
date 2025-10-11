import { Controller, Get, Post, Body, Param, Patch, Delete } from '@nestjs/common';
import { TagService } from './tag.service';

@Controller('tags')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Post()
  create(@Body() body: { name: string }) {
    return this.tagService.create(body.name);
  }

  @Get()
  findAll() {
    return this.tagService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tagService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body: { name: string }) {
    return this.tagService.update(+id, body.name);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tagService.remove(+id);
  }
}
