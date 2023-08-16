import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { CourseLike } from "./CourseLike.entity";
import { Formation } from "./formation.entity";
import { Graduation } from "./graduation.entity";
import { Job } from "./job.entity";
import { ProfessionalExperience } from "./professionalExperience.entity";
import { Role } from "./role.entity";

@Entity()
export class User {
    @Column()
    type_abonement: string;
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        unique: true
    })
    email: string;

    @Column({
        unique: true
    })
    username: string;

    @Column({ default: null })
    civility: string

    @Column({ default: null })
    firstName: string

    @Column({ default: null })
    lastName: string

    @Column({ default: null })
    birthDate: Date

    @Column({ default: null })
    adress: string

    @Column({ default: null })
    phoneNumber: string

    @Column()
    password: string;

    @Column()
    IsConfirmed: Boolean = true;

    @OneToMany(() => CourseLike, (courseLike) => courseLike.user)
    likes: CourseLike[]

    @OneToMany(() => ProfessionalExperience, (professionalExp) => professionalExp.user, { cascade: true })
    professionalExperiences: ProfessionalExperience[] | null

    @OneToMany(() => Formation, (_formation) => _formation.user, { cascade: true })
    formations: Formation[] | null

    @OneToMany(() => Graduation, (_grades) => _grades.user, { cascade: true })
    graduations: Graduation[] | null

    @ManyToOne(() => Role)
    @JoinColumn({ name: "roleId" })
    role: Role;
    static role: any;
}