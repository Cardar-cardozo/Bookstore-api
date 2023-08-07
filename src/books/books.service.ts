import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateBookDto } from 'src/dto/create-book.dto';
import { Repository } from 'typeorm';
import { Book } from '../entity/book.entity';

@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(Book)
    private readonly booksRepository: Repository<Book>,
  ) {}

  async findAll(): Promise<Book[]> {
    return this.booksRepository.find();
  }

  async findById(id): Promise<Book> {
    const book = await this.booksRepository.findOne(id);
    if (!book) {
      throw new NotFoundException(`Book with ID ${id} not found`);
    }
    return book;
  }

  async create(book: CreateBookDto): Promise<Book> {
    return this.booksRepository.save(book);
  }

  async update(id: number, bookData: Partial<Book>): Promise<Book> {
    const book = await this.findById(id);
    Object.assign(book, bookData);
    return this.booksRepository.save(book);
  }

  async delete(id: number): Promise<void> {
    const book = await this.findById(id); // Implement this method to find the book by ID
    if (!book) {
      throw new NotFoundException(`Book with ID ${id} not found`);
    }
    await this.booksRepository.remove(book);
  }
}
