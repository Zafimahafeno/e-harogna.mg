import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Experience {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  companyName: string;

  @Column()
  startDate: Date;

  @Column()
  endDate: Date;

  @Column()
  currentlyHeld: boolean;

  @Column()
  userId: string;
}
