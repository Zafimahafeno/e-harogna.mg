import { Course } from "./course.entity";
import { CourseCat } from "./courseCat.entity";
import { CourseItem } from "./courseItem.entity";
import { CourseLike } from "./CourseLike.entity";
import { Job } from "./job.entity";;
import { Permission } from "./permission.entity";
import { Role } from "./role.entity";
import { User } from "./user.entity";
import { harognaFile } from "./file.entity"
import { Formation } from "./formation.entity";
import { Graduation } from "./graduation.entity";
import { ProfessionalExperience } from "./professionalExperience.entity";

export const entities = [
    Course, CourseCat, Job, Permission, Role, User, CourseLike, CourseItem, harognaFile, Formation, Graduation, ProfessionalExperience
]