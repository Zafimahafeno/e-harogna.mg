import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";

@Entity()
export class Formation {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column()
    institution: string; // Change this to institution1 or institution2

    @Column()
    description: string;

    @Column()
    date: Date;

    @ManyToOne(() => User, (user) => user.formations, {
        onDelete: 'CASCADE',
        orphanedRowAction: 'delete',
    })
    user: User; // Assuming there's a relation with User entity
}
