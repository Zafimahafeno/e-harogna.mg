import {Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn} from "typeorm";
import { CourseCat } from "./courseCat.entity";
import { CourseItem } from "./courseItem.entity";
import { CourseLike } from "./CourseLike.entity";

@Entity()
export class Course {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: String;

    @Column()
    readTime: String;

    @Column()
    slug: String;

    @Column("longtext")
    description: String;

    @Column()
    image: String;

    @Column()
    IsPublished: Boolean;

    @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
    created_at: Date;

    @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)" })
    updated_at: Date;

    @ManyToOne(() => CourseCat, (courseCat) => courseCat.courses)
    courseCat: CourseCat;

    @OneToMany(() => CourseItem, (courseitem) => courseitem.course)
    courseitem: CourseItem[];

    @OneToMany(() => CourseLike, (courseLike) => courseLike.course)
    courseLike: CourseLike[];
  imgUrl: any;
}