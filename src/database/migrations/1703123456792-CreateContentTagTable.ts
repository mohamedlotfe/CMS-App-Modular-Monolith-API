import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateContentTagTable1703123456792 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create content_tag junction table
    await queryRunner.createTable(
      new Table({
        name: 'content_tag',
        columns: [
          {
            name: 'content_id',
            type: 'uuid',
            isPrimary: true,
          },
          {
            name: 'tag_id',
            type: 'uuid',
            isPrimary: true,
          },
        ],
        foreignKeys: [
          {
            columnNames: ['content_id'],
            referencedTableName: 'content',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
          },
          {
            columnNames: ['tag_id'],
            referencedTableName: 'tag',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
          },
        ],
      }),
      true,
    );

    // Create indexes
    await queryRunner.query(
      `CREATE INDEX "IDX_content_tag_content_id" ON "content_tag" ("content_id")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_content_tag_tag_id" ON "content_tag" ("tag_id")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "IDX_content_tag_tag_id"`);
    await queryRunner.query(`DROP INDEX "IDX_content_tag_content_id"`);
    await queryRunner.dropTable('content_tag');
  }
}
