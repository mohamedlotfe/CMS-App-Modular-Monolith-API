import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateIngestSourceTable1703123456793
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create ingest_source table
    await queryRunner.createTable(
      new Table({
        name: 'ingest_source',
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
            name: 'type',
            type: 'text',
            isNullable: false,
          },
          {
            name: 'config_json',
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

    // Create unique index on name
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_ingest_source_name" ON "ingest_source" ("name")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "IDX_ingest_source_name"`);
    await queryRunner.dropTable('ingest_source');
  }
}
