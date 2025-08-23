import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateAuthorTable1703123456789 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create author table
    await queryRunner.createTable(
      new Table({
        name: 'author',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'name',
            type: 'text',
            isNullable: false,
          },
          {
            name: 'email',
            type: 'text',
            isNullable: false,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',
            isNullable: false,
          },
        ],
      }),
      true,
    );

    // Create index on email for uniqueness
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_author_email" ON "author" ("email")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "IDX_author_email"`);
    await queryRunner.dropTable('author');
  }
}
