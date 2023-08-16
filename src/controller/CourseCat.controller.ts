import { Request, Response } from "express";
import { getManager } from "typeorm";
import { Course } from "../entity/course.entity";
import { CourseCat } from "../entity/courseCat.entity";


export const fetchAllCourseCat = async (req: Request, res: Response ) => {
    const take = 10;
    const page = parseInt( req.query.page as string || '1');
    const repository = getManager().getRepository(CourseCat);
    await repository.findAndCount({
        take,
        skip: (page - 1 ) * take
    }).then((result) => {
        const [data, total] = result;
        return res.status(200).render('CourseCategory/index', {
            data,
            page_name: "liste2",
            meta: {
                total,
                page,
                last_page: Math.ceil(total / take)
            }
        })
    }).catch((err) => {
        return res.status(500).send(err);
    });
};

export const createCourseCatView = async (req:Request, res: Response) => {
    const repository = getManager().getRepository(CourseCat);
    try {
        const cat = await repository.find();
        return res.render('Course/create', {
            page_name: "createcourse",
            data: cat
        });
    } catch (error) {
        return res.status(500).send(error);
    }
}

export const createCourseCat = async (req: Request, res: Response ) => {
    const {title, description, imgUrl} = req.body;
        console.log(description);
        const repository = getManager().getRepository(CourseCat);
        await repository.save({
            title: title,
            description: description.toString(),
            image: imgUrl,
            }).then((result) => {
                req.flash('success' , 'categorie creer avec succer')
                return res.redirect('/categories')
            }).catch((err) => {
                return res.status(500).send(err);
            });
    };


    export const UpdateCourseCat = async (req: Request, res: Response) => {
        const id = req.params.id;
        const {title, description, image, category} = req.body;

        const repository = getManager().getRepository(CourseCat);
        await repository.update( {id: parseInt(id)}, {
            title: title,
            description: description.toString(),
            image: image
            }).then((result) => {
                req.flash('success' , 'categorie mis a jours avec succer')
                return res.redirect('/categories')
        }).catch((err) => {
            return res.status(500).send(err);
        });
    };
    
    export const getOneCourseCat = async (req: Request, res: Response) => {
        const id = req.params.id;
        const repository = getManager().getRepository(CourseCat);
        await repository.findOne({ where :{id : parseInt(id)} }).then((result) => {
            return res.render('CourseCat/Show', {
                page_name: "createcourse",
                data: result
            });
        }).catch((err) => {
            return res.status(500).send(err);
        });
    };

    export const DeleteCourseCat = async (req: Request, res: Response ) => { 
        const id = req.params.id;
        const repository = getManager().getRepository(CourseCat);
        await repository.delete({id : parseInt(id)}).then((result) => {
            req.flash('success' , 'categorie supprimer avec succer')
            return res.redirect('/categories')
        }).catch((err) => {
            return res.status(500).send(err);
        });
    }

