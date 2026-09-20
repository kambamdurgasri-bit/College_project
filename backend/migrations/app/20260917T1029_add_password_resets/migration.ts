#!/usr/bin/env -S node
import type { Contract as End } from '../../snapshots/2cedc2b961693cb256df67f0a11f4c404ee269c33139e8af11d4e0d0abf1e7a0/contract';
import endContract from '../../snapshots/2cedc2b961693cb256df67f0a11f4c404ee269c33139e8af11d4e0d0abf1e7a0/contract.json' with { type: 'json' };
import type { Contract as Start } from '../../snapshots/b4a3c6fea33ea67d7e78fe232d0f323ff37b63f3c29960fbc3d9831b54733bbd/contract';
import startContract from '../../snapshots/b4a3c6fea33ea67d7e78fe232d0f323ff37b63f3c29960fbc3d9831b54733bbd/contract.json' with { type: 'json' };
import { Migration, MigrationCLI, col, primaryKey } from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.createTable({
        schema: 'public',
        table: 'password_resets',
        columns: [
          col('expires_at', 'timestamp', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamp-temporal@1' },
          }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('token', 'character varying(255)', {
            notNull: true,
            codecRef: { codecId: 'sql/varchar@1', typeParams: { length: 255 } },
          }),
          col('user_id', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
        ],
        constraints: [primaryKey(['id'], { name: 'password_resets_pkey' })],
      }),
      this.addUnique({
        schema: 'public',
        table: 'password_resets',
        constraint: 'password_resets_token_key',
        columns: ['token'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'password_resets',
        index: 'idx_password_resets_user_id',
        columns: ['user_id'],
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'password_resets',
        foreignKey: {
          name: 'password_resets_user_id_fkey',
          columns: ['user_id'],
          references: { schema: 'public', table: 'users', columns: ['id'] },
        },
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
