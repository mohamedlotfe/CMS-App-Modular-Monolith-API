import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Content } from './entities/content.entity';
import { Author } from './entities/author.entity';
import { Tag } from './entities/tag.entity';

@Injectable()
export class CmsRepository {
  constructor(
    @InjectRepository(Content)
    private contentRepository: Repository<Content>,
    @InjectRepository(Author)
    private authorRepository: Repository<Author>,
    @InjectRepository(Tag)
    private tagRepository: Repository<Tag>,
  ) {}

  // Content operations
  async createContent(contentData: Partial<Content>): Promise<Content> {
    const content = this.contentRepository.create(contentData);
    return this.contentRepository.save(content);
  }

  async findAllContent(): Promise<Content[]> {
    return this.contentRepository.find({
      relations: ['author', 'tags'],
    });
  }

  async findContentById(id: string): Promise<Content | null> {
    return this.contentRepository.findOne({
      where: { id },
      relations: ['author', 'tags'],
    });
  }

  async updateContent(id: string, updateData: Partial<Content>): Promise<void> {
    await this.contentRepository.update(id, updateData);
  }

  async saveContent(content: Content): Promise<Content> {
    return this.contentRepository.save(content);
  }

  async deleteContent(id: string): Promise<void> {
    await this.contentRepository.delete(id);
  }

  // Author operations
  async createAuthor(authorData: Partial<Author>): Promise<Author> {
    const author = this.authorRepository.create(authorData);
    return this.authorRepository.save(author);
  }

  async findAllAuthors(): Promise<Author[]> {
    return this.authorRepository.find();
  }

  async findAuthorById(id: string): Promise<Author | null> {
    return this.authorRepository.findOne({ where: { id } });
  }

  // Tag operations
  async createTag(tagData: Partial<Tag>): Promise<Tag> {
    const tag = this.tagRepository.create(tagData);
    return this.tagRepository.save(tag);
  }

  async findAllTags(): Promise<Tag[]> {
    return this.tagRepository.find();
  }

  async findTagByName(name: string): Promise<Tag | null> {
    return this.tagRepository.findOne({ where: { name } });
  }

  async findOrCreateTag(name: string): Promise<Tag> {
    let tag = await this.findTagByName(name);
    if (!tag) {
      tag = await this.createTag({ name });
    }
    return tag;
  }

  async findOrCreateTags(tagNames: string[]): Promise<Tag[]> {
    const tags: Tag[] = [];

    for (const name of tagNames) {
      const tag = await this.findOrCreateTag(name);
      tags.push(tag);
    }

    return tags;
  }
}
