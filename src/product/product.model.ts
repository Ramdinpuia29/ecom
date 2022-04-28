import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity()
export default class Product {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  brand!: string;

  @Column()
  desc!: string;

  @Column()
  detailDesc!: string;

  @Column()
  colors!: string;

  @Column()
  sizes!: string;

  @Column()
  price!: number;

  @Column({ nullable: true })
  discount?: number | null;

  @Column()
  stock!: number;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
