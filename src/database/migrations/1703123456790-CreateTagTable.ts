import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateTagTable1703123456790 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create tag table
    await queryRunner.createTable(
      new Table({
        name: 'tag',
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
        ],
      }),
      true,
    );

    // Create unique index on name
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_tag_name" ON "tag" ("name")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "IDX_tag_name"`);
    await queryRunner.dropTable('tag');
  }
}
