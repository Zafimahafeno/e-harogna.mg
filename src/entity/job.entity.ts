import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";

@Entity()
export class Job {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: String;

    @Column()
    companyName: String;

    @Column()
    JobTitle: String;

    @Column()
    JobType: String;

    @Column("longtext")
    description: String;

    @Column()
    image: String;

    @Column()
    MinSalary: Number;

    @Column()
    MaxSalary: Number;

    @Column()
    IsOpen: Boolean;


}
