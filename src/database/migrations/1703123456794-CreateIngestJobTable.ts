import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateIngestJobTable1703123456794 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create ingest_job table
    await queryRunner.createTable(
      new Table({
        name: 'ingest_job',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'source_id',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'status',
            type: 'text',
            isNullable: false,
          },
          {
            name: 'error_message',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',
            isNullable: false,
          },
          {
            name: 'finished_at',
            type: 'timestamp',
            isNullable: true,
          },
        ],
        foreignKeys: [
          {
            columnNames: ['source_id'],
            referencedTableName: 'ingest_source',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
          },
        ],
      }),
      true,
    );

    // Create indexes
    await queryRunner.query(
      `CREATE INDEX "IDX_ingest_job_source_id" ON "ingest_job" ("source_id")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_ingest_job_status" ON "ingest_job" ("status")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "IDX_ingest_job_status"`);
    await queryRunner.query(`DROP INDEX "IDX_ingest_job_source_id"`);
    await queryRunner.dropTable('ingest_job');
  }
}
