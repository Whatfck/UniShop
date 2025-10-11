import { Controller, Get, Post, Body, Param, Patch, Delete } from '@nestjs/common';
import { CategoryService } from './category.service';

@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  create(@Body() body: { name: string; description?: string }) {
    return this.categoryService.create(body.name, body.description);
  }

  @Get()
  findAll() {
    return this.categoryService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoryService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body: { name?: string; description?: string }) {
    return this.categoryService.update(+id, body.name, body.description);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.categoryService.remove(+id);
  }
}
