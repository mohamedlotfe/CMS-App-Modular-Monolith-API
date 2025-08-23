import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateContentTable1703123456791 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create content table
    await queryRunner.createTable(
      new Table({
        name: 'content',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'title',
            type: 'text',
            isNullable: false,
          },
          {
            name: 'body',
            type: 'text',
            isNullable: false,
          },
          {
            name: 'author_id',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'published',
            type: 'boolean',
            default: false,
            isNullable: false,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',
            isNullable: false,
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'now()',
            isNullable: false,
          },
        ],
        foreignKeys: [
          {
            columnNames: ['author_id'],
            referencedTableName: 'author',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
          },
        ],
      }),
      true,
    );

    // Create indexes
    await queryRunner.query(
      `CREATE INDEX "IDX_content_author_id" ON "content" ("author_id")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_content_published" ON "content" ("published")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_content_created_at" ON "content" ("created_at")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "IDX_content_created_at"`);
    await queryRunner.query(`DROP INDEX "IDX_content_published"`);
    await queryRunner.query(`DROP INDEX "IDX_content_author_id"`);
    await queryRunner.dropTable('content');
  }
}
