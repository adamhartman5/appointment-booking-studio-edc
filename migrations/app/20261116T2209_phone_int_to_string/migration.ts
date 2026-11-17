#!/usr/bin/env -S node
import type { Contract as Start } from '../../snapshots/6a5afe07e2cb42417c2e99cfaccb810ad2c07e10294bdaf508d48bbcce474a06/contract';
import startContract from '../../snapshots/6a5afe07e2cb42417c2e99cfaccb810ad2c07e10294bdaf508d48bbcce474a06/contract.json' with { type: 'json' };
import type { Contract as End } from '../../snapshots/b2e19bb3f5b406c2f4d5f3a3ae0998d2e30e2289de6d10f01b3eaa5c2791f9ed/contract';
import endContract from '../../snapshots/b2e19bb3f5b406c2f4d5f3a3ae0998d2e30e2289de6d10f01b3eaa5c2791f9ed/contract.json' with { type: 'json' };
import { Migration, MigrationCLI } from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.alterColumnType({
        schema: 'public',
        table: 'Customer',
        column: 'phone',
        type: 'text',
        operationClass: 'widening',
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
