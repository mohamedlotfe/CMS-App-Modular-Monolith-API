import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { Content } from './entities/content.entity';
import { Author } from './entities/author.entity';
import { Tag } from './entities/tag.entity';
import { CreateContentDto } from './dto/create-content.dto';
import { UpdateContentDto } from './dto/update-content.dto';
import { CmsRepository } from './cms.repository';

@Injectable()
export class CmsService {
  constructor(
    private cmsRepository: CmsRepository,
    @InjectQueue('indexing')
    private indexingQueue: Queue,
  ) {}

  async createContent(createContentDto: CreateContentDto): Promise<Content> {
    const { tags, ...contentData } = createContentDto;

    // Find or create tags
    const tagEntities = tags
      ? await this.cmsRepository.findOrCreateTags(tags)
      : [];

    // Create content
    const savedContent = await this.cmsRepository.createContent({
      ...contentData,
      tags: tagEntities,
    });

    // Enqueue indexing job
    await this.indexingQueue.add({
      contentId: savedContent.id,
      operation: 'INDEX',
    });

    return savedContent;
  }

  async findAllContent(): Promise<Content[]> {
    return this.cmsRepository.findAllContent();
  }

  async findContentById(id: string): Promise<Content | null> {
    return this.cmsRepository.findContentById(id);
  }

  async updateContent(
    id: string,
    updateContentDto: UpdateContentDto,
  ): Promise<Content | null> {
    const { tags, ...updateData } = updateContentDto;

    let tagEntities: Tag[] = [];
    if (tags) {
      tagEntities = await this.cmsRepository.findOrCreateTags(tags);
    }

    await this.cmsRepository.updateContent(id, updateData);

    if (tags) {
      const content = await this.findContentById(id);
      if (content) {
        content.tags = tagEntities;
        await this.cmsRepository.saveContent(content);
      }
    }

    const updatedContent = await this.findContentById(id);

    // Enqueue indexing job
    await this.indexingQueue.add({
      contentId: id,
      operation: 'UPDATE',
    });

    return updatedContent;
  }

  async deleteContent(id: string): Promise<void> {
    await this.cmsRepository.deleteContent(id);

    // Enqueue indexing job
    await this.indexingQueue.add({
      contentId: id,
      operation: 'DELETE',
    });
  }

  async createAuthor(name: string, email: string): Promise<Author> {
    return this.cmsRepository.createAuthor({ name, email });
  }

  async findAllAuthors(): Promise<Author[]> {
    return this.cmsRepository.findAllAuthors();
  }

  async createTag(name: string): Promise<Tag> {
    return this.cmsRepository.createTag({ name });
  }

  async findAllTags(): Promise<Tag[]> {
    return this.cmsRepository.findAllTags();
  }
}
