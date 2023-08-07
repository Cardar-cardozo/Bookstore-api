import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Put,
  Delete,
  ParseIntPipe,
  NotFoundException,
} from '@nestjs/common';
import { BooksService } from './books.service';
import { Book } from '../entity/book.entity';
import { CreateBookDto } from '../dto/create-book.dto';
import { UpdateBookDto } from '../dto/update-book.dto';

@Controller('books')
export class BooksController {
  constructor(private readonly bookService: BooksService) {}

  @Get()
  async findAll(): Promise<Book[]> {
    return this.bookService.findAll();
  }

  @Get(':id')
  async findById(@Param('id', ParseIntPipe) id: number): Promise<Book> {
    try {
      return await this.bookService.findById(id);
    } catch (error) {
      throw new NotFoundException(`Book with ID ${id} not found`);
    }
  }

  @Post()
  async create(@Body() createBookDto: CreateBookDto): Promise<Book> {
    return this.bookService.create(createBookDto);
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateBookDto: UpdateBookDto,
  ): Promise<Book> {
    try {
      return this.bookService.update(id, updateBookDto);
    } catch (error) {
      throw new NotFoundException(`Book with ID ${id} not found`);
    }
  }

  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
    try {
      await this.bookService.delete(id);
    } catch (error) {
      throw new NotFoundException(`Book with ID ${id} not found`);
    }
  }
}
