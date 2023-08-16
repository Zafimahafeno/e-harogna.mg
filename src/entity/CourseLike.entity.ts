import {Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import { Course } from "./course.entity";
import { User } from "./user.entity";

@Entity()
export class CourseLike {

    @PrimaryGeneratedColumn()
    id: number; 

    @ManyToOne(() => Course, (Course) => Course.courseLike)
    course: Course;

    @ManyToOne(() => User, (user) => user.likes)
    user: User;

}