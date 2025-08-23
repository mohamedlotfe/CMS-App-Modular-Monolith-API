import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateIndexingJobTable1703123456795 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create indexing_job table
    await queryRunner.createTable(
      new Table({
        name: 'indexing_job',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'content_id',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'operation',
            type: 'text',
            isNullable: false,
          },
          {
            name: 'status',
            type: 'text',
            isNullable: false,
          },
          {
            name: 'retry_count',
            type: 'integer',
            default: 0,
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
      }),
      true,
    );

    // Create indexes
    await queryRunner.query(
      `CREATE INDEX "IDX_indexing_job_content_id" ON "indexing_job" ("content_id")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_indexing_job_status" ON "indexing_job" ("status")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "IDX_indexing_job_status"`);
    await queryRunner.query(`DROP INDEX "IDX_indexing_job_content_id"`);
    await queryRunner.dropTable('indexing_job');
  }
}
