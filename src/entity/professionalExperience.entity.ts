import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";

@Entity()
export class ProfessionalExperience {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column()
    description: string;

    @Column() // may be we have to create a new entity for this field (Company {name,adresse,contact, etc ...})
    companyName: string;

    @Column()
    startDate: Date;

    @Column()
    endDate: Date

    @Column()
    currentlyHeld: boolean

    @ManyToOne(() => User, (user) => user.professionalExperiences, {
        onDelete: 'CASCADE',
        orphanedRowAction: 'delete',
    })
    user

}