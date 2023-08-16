import { Request, Response } from "express";
import { getManager } from "typeorm";
import { Course } from "../entity/course.entity";
import { CourseCat } from "../entity/courseCat.entity";
import readingTime from "reading-time";


export const fetchAllCourse = async (req: Request, res: Response) => {
    const take = 10;
    const page = (parseInt(req.query.page as string || '1') < 0) ? 1 : parseInt(req.query.page as string || '1');
    const repository = getManager().getRepository(Course);
    await repository.findAndCount({

        take,
        skip: (page - 1) * take,
        relations: ['courseCat', "courseitem"]
    }).then((result) => {
        const [data, total] = result;
        // console.log(data)
        return res.status(200).render('Course/index', {
            data,
            page_name: "liste1",
            title: 'Liste des cours',
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

export const fetchAllCourseFront = async (req: Request, res: Response) => {
    const take = 10;
    const page = (parseInt(req.query.page as string || '1') < 0) ? 1 : parseInt(req.query.page as string || '1');
    const repository = getManager().getRepository(Course);
    await repository.findAndCount({

        take,
        skip: (page - 1) * take,
        relations: ['courseCat', "courseitem"]
    }).then(async (result) => {
        const [data, total] = result;
        const repository = getManager().getRepository(CourseCat);
        const cat = await repository.find();
        // console.log(data)
        return res.status(200).render('pages/blogpage', {
            data,
            page_name: "liste1",
            title: 'Liste des cours',
            category: cat,
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

export const fetchAllCoursebyCategoryFront = async (req: Request, res: Response) => {
    const categoryId = parseInt(req.params.cat as string);
    if (!req.params.cat) {
        return res.redirect('/blog')
    }
    const repository = getManager().getRepository(CourseCat);
    await repository.findOne({
        where: { id: categoryId },
        relations: ['courses']
    }).then(async (result) => {
        const repository = getManager().getRepository(CourseCat);
        const cat = await repository.find();
        console.log(result.courses)
        return res.status(200).render('pages/blogbycat', {
            data: result,
            page_name: "liste1",
            title: 'Liste des cours' + result.title,
            category: cat,
        })
    }).catch((err) => {
        return res.status(500).send(err);
    });
};

export const createCourseView = async (req: Request, res: Response) => {
    const repository = getManager().getRepository(CourseCat);
    try {
        const cat = await repository.find();
        return res.render('Course/create', {
            page_name: "createcourse",
            title: 'Creer un cours',
            data: cat
        });
    } catch (error) {
        return res.status(500).send(error);
    }

}

export const createCourse = async (req: Request, res: Response) => {
    const { title, description, imgUrl, category } = req.body;
    const slug: string = titleToSlug(title)
    const readTime = readingTime(description.toString()).text
    console.log(description);
    const repository = getManager().getRepository(Course);
    await repository.save({
        title: title,
        description: description.toString(),
        image: imgUrl,
        readTime,
        slug,
        courseCat: {
            id: parseInt(category || "1")
        }
    }).then((result) => {
        req.flash('success', 'cours creer avec succer')
        return res.redirect('/courses')
    }).catch((err) => {
        return res.status(500).send(err);
    });
};


export const UpdateCourse = async (req: Request, res: Response) => {
    const id = req.params.id;

    const { title, description, image, category } = req.body;

    const slug: string = titleToSlug(title)

    const readTime = readingTime(description.toString()).text

    const repository = getManager().getRepository(Course);
    await repository.update({ id: parseInt(id) }, {
        title: title,
        description: description.toString(),
        image: image,
        readTime,
        slug,
        courseCat: {
            id: category
        }
    }).then((result) => {
        req.flash('success', 'cours mis a jour avec succer')
        return res.redirect('/courses')
    }).catch((err) => {
        return res.status(500).send(err);
    });
};

export const getOneCourse = async (req: Request, res: Response) => {
    const id = req.params.id;
    const repository = getManager().getRepository(Course);
    await repository.findOne({ where: { id: parseInt(id) } }).then((result) => {
        let dat = result.created_at
        let date = dat.toString().split(' ')[0];
        console.log(date);

        return res.render('Course/show', {
            page_name: "createcourse",
            data: result,
            date
        });
    }).catch((err) => {
        return res.status(500).send(err);
    });
};

export const fetchOneCourseFront = async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const repository = getManager().getRepository(Course);
    await repository.findOne({ where: { id: parseInt(id) }, relations: ['courseCat', "courseitem"] }).then(async (result) => {
        const repository = getManager().getRepository(CourseCat);
        const cat = await repository.find();
        let dat = result.created_at.toString().split(' ')
        let t = dat[0] + " " + dat[1] + " " + dat[2] + " " + dat[3];
        return res.render('pages/blogdetail', {
            page_name: "createcourse",
            title: 'Details du cours',
            data: result,
            date: t,
            category: cat
        });
    }).catch((err) => {
        return res.status(500).send(err);
    });
};

export const DeleteCourse = async (req: Request, res: Response) => {
    const id = req.params.id;
    const repository = getManager().getRepository(Course);
    await repository.delete({ id: parseInt(id) }).then((result) => {
        return res.status(200).send(result)
    }).catch((err) => {
        return res.status(500).send(err);
    });
}

const titleToSlug = (title: string): string => {
    let slug: string;

    // convert to lower case
    slug = title.toLowerCase();

    // remove special characters
    slug = slug.replace(/\`|\~|\!|\@|\#|\||\$|\%|\^|\&|\*|\(|\)|\+|\=|\,|\.|\/|\?|\>|\<|\'|\"|\:|\;|_/gi, '');
    // The /gi modifier is used to do a case insensitive search of all occurrences of a regular expression in a string

    // replace spaces with dash symbols
    slug = slug.replace(/ /gi, "-");

    // remove consecutive dash symbols 
    slug = slug.replace(/\-\-\-\-\-/gi, '-');
    slug = slug.replace(/\-\-\-\-/gi, '-');
    slug = slug.replace(/\-\-\-/gi, '-');
    slug = slug.replace(/\-\-/gi, '-');

    // remove the unwanted dash symbols at the beginning and the end of the slug
    slug = '@' + slug + '@';
    slug = slug.replace(/\@\-|\-\@|\@/gi, '');
    return slug;
};

