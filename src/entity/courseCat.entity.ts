import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Course } from "./course.entity";

@Entity()
export class CourseCat {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column()
    description: string;

    @Column()
    image: string;

    @OneToMany(() => Course, (courses) => courses.courseCat)
    courses: Course[];

}