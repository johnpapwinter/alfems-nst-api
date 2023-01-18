import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { TaskForce } from '../../task-force/entities/task-force.entity';

@Entity('ships')
export class Ship {
  @PrimaryGeneratedColumn({ name: 'id', type: 'bigint' })
  id: string;

  @Column({ name: 'name' })
  name: string;

  @Column({ name: 'type' })
  type: string;

  @Column({ name: 'crew' })
  crew: number;

  @Column({ name: 'passengers' })
  passengers: number;

  @Column({ name: 'fighters' })
  fighters: number;

  @ManyToOne(() => TaskForce, (taskForce) => taskForce.ships)
  taskForce: TaskForce;
}
