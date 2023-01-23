import { AuditingAction, AuditingEntity, AuditingEntityDefaultColumns } from 'typeorm-auditing';
import { Ship } from './ship.entity';

@AuditingEntity(Ship)
export class ShipAudit extends Ship implements AuditingEntityDefaultColumns {
  readonly _seq!: number;
  readonly _action!: AuditingAction;
  readonly _modifiedAt!: Date;
}