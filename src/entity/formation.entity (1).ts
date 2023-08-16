import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";

@Entity()
export class Formation {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column() // may be we have to create a new entity for the instution
    institution: string;

    @Column()
    description: string;

    @Column()
    date: Date;


    @ManyToOne(() => User, (user) => user.formations, {
        onDelete: 'CASCADE',
        orphanedRowAction: 'delete',
    })
    user

}