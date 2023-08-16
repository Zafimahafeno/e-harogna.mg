import {Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import { Course } from "./course.entity";

@Entity()
export class CourseItem {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: String;

    @Column()
    description: String;

    @Column()
    file: String;

    @ManyToOne(() => Course)
    @JoinColumn({name: "courseId"})
    course: Course;
}