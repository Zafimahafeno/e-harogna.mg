import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";

@Entity()
export class Graduation {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column()// may be we have to create a new entity for this field
    sector: string;

    @Column() // may be we have to create a new entity for the instution
    institution: string;

    @Column()
    date: Date;


    @ManyToOne(() => User, (user) => user.graduations, {
        onDelete: 'CASCADE',
        orphanedRowAction: 'delete',
    })
    user

}