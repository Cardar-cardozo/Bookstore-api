import { Test, TestingModule } from '@nestjs/testing';

import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';

import { BooksController } from './books.controller';
import { BooksService } from './books.service';
import { CreateBookDto } from '../dto/create-book.dto';
import { UpdateBookDto } from '../dto/update-book.dto';
import { Book } from '../entity/book.entity';

describe('BookController', () => {
  let bookController: BooksController;
  let bookService: BooksService;

  const bookRepositoryMock = {
    // Mock repository methods here
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BooksController],
      providers: [
        BooksService,
        {
          provide: getRepositoryToken(Book),
          useValue: bookRepositoryMock,
        },
      ],
    }).compile();

    bookController = module.get<BooksController>(BooksController);
    bookService = module.get<BooksService>(BooksService);
  });

  describe('findAll', () => {
    it('should return an array of books', async () => {
      const result: Book[] = [{ id: 1, title: 'Book 1', author: 'Author 1' }];
      jest.spyOn(bookService, 'findAll').mockResolvedValue(result);

      expect(await bookController.findAll()).toEqual(result);
    });
  });

  describe('findById', () => {
    it('should return a book with the given ID', async () => {
      const book: Book = { id: 1, title: 'Book 1', author: 'Author 1' };
      jest.spyOn(bookService, 'findById').mockResolvedValue(book);

      expect(await bookController.findById(1)).toEqual(book);
    });

    it('should throw NotFoundException for non-existent ID', async () => {
      jest
        .spyOn(bookService, 'findById')
        .mockRejectedValue(new NotFoundException());

      await expect(bookController.findById(999)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('create', () => {
    it('should create and return a new book', async () => {
      const createBookDto: CreateBookDto = {
        title: 'New Book',
        author: 'New Author',
      };
      const newBook: Book = { id: 2, ...createBookDto };
      jest.spyOn(bookService, 'create').mockResolvedValue(newBook);

      expect(await bookController.create(createBookDto)).toEqual(newBook);
    });
  });

  describe('update', () => {
    it('should update and return the updated book', async () => {
      const updateBookDto: UpdateBookDto = { title: 'Updated Book' };
      const updatedBook: Book = {
        id: 1,
        title: 'Updated Book',
        author: 'Author 1',
      };
      jest.spyOn(bookService, 'update').mockResolvedValue(updatedBook);

      expect(await bookController.update(1, updateBookDto)).toEqual(
        updatedBook,
      );
    });

    it('should throw NotFoundException for non-existent ID', async () => {
      const updateBookDto: UpdateBookDto = { title: 'Updated Book' };
      jest
        .spyOn(bookService, 'update')
        .mockRejectedValue(new NotFoundException());

      await expect(bookController.update(999, updateBookDto)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('delete', () => {
    it('should delete a book', async () => {
      await bookController.delete(1);
      expect(bookService.delete).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException for non-existent ID', async () => {
      jest
        .spyOn(bookService, 'delete')
        .mockRejectedValue(new NotFoundException());

      await expect(bookController.delete(999)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
