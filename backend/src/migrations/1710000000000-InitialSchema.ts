import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class InitialSchema1710000000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'favorites',
        columns: [
          {
            name: 'imdbID',
            type: 'varchar',
            isPrimary: true,
          },
          {
            name: 'Title',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'Year',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'Poster',
            type: 'varchar',
            isNullable: true,
          },
        ],
      }),
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('favorites');
  }
}
