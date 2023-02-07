import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Ship } from '../../ship/entities/ship.entity';

@Entity('task_forces')
export class TaskForce {
  @PrimaryGeneratedColumn({ name: 'id', type: 'bigint' })
  id: string;

  @Column({ name: 'name' })
  name: string;

  @OneToMany(() => Ship, (ship) => ship.taskForce,
    { eager: true }
  )
  ships: Ship[];
}
