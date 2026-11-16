#!/usr/bin/env -S node
import type { Contract as End } from '../../snapshots/6a5afe07e2cb42417c2e99cfaccb810ad2c07e10294bdaf508d48bbcce474a06/contract';
import endContract from '../../snapshots/6a5afe07e2cb42417c2e99cfaccb810ad2c07e10294bdaf508d48bbcce474a06/contract.json' with { type: 'json' };
import {
  Migration,
  MigrationCLI,
  checkExpression,
  col,
  lit,
  primaryKey,
  sql,
} from '@prisma/orm-postgres/migration';

export default class M extends Migration<never, End> {
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.createSchema({ schema: 'public' }),
      this.createTable({
        schema: 'public',
        table: 'Appointment',
        columns: [
          col('calendarId', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('customerId', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('serviceId', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('slotId', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('status', 'text', {
            notNull: true,
            default: lit('Booked'),
            codecRef: { codecId: 'pg/text@1' },
          }),
        ],
        constraints: [
          primaryKey(['id']),
          checkExpression(
            'Appointment_status_check_e3d04eae',
            sql`"status" IN ('Booked', 'Cancelled')`,
          ),
        ],
      }),
      this.createTable({
        schema: 'public',
        table: 'Calendar',
        columns: [col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } })],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'Customer',
        columns: [
          col('email', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('name', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('phone', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'Service',
        columns: [
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('name', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'Slot',
        columns: [
          col('endTime', 'timestamptz(3)', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-date@1', typeParams: { precision: 3 } },
          }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('startTime', 'timestamptz(3)', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-date@1', typeParams: { precision: 3 } },
          }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createIndex({
        schema: 'public',
        table: 'Appointment',
        index: 'Appointment_calendarId_idx_51abb0b3',
        columns: ['calendarId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'Appointment',
        index: 'Appointment_customerId_idx_b2a8a46c',
        columns: ['customerId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'Appointment',
        index: 'Appointment_serviceId_idx_b5d9acbf',
        columns: ['serviceId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'Appointment',
        index: 'Appointment_slotId_idx_4d7c6bc9',
        columns: ['slotId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'Appointment',
        index: 'Appointment_slotId_booked_unique_idx',
        columns: ['slotId'],
        extras: {
          unique: true,
          where: `"status" = 'Booked'`
        }
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'Appointment',
        foreignKey: {
          name: 'Appointment_slotId_fkey',
          columns: ['slotId'],
          references: { schema: 'public', table: 'Slot', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'Appointment',
        foreignKey: {
          name: 'Appointment_serviceId_fkey',
          columns: ['serviceId'],
          references: { schema: 'public', table: 'Service', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'Appointment',
        foreignKey: {
          name: 'Appointment_customerId_fkey',
          columns: ['customerId'],
          references: { schema: 'public', table: 'Customer', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'Appointment',
        foreignKey: {
          name: 'Appointment_calendarId_fkey',
          columns: ['calendarId'],
          references: { schema: 'public', table: 'Calendar', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
