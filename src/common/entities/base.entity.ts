import {
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm'
import { Expose } from 'class-transformer'

@Entity()
export abstract class BaseModel {
  @PrimaryGeneratedColumn()
  @Expose()
  id: number

  @UpdateDateColumn()
  updateAt: Date

  @CreateDateColumn()
  createAt: Date
}
