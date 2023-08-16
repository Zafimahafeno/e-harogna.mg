import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import { User } from "./user.entity";

@Entity()
export class harognaFile {

    @PrimaryGeneratedColumn()
    id: number; 

    @Column()
    filename: String;

    @Column()
    path: String;

    @Column()
    ext: String;

    @ManyToOne(() => User, (user) => user.likes)
    user: User;

}