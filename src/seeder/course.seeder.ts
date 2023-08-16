import { createConnection, getManager } from "typeorm";
import { Course } from "../entity/course.entity";
import faker from "faker";
import { CourseCat } from "../entity/courseCat.entity";

createConnection().then(async (connection) => {

    const Repository = getManager().getRepository(Course);
    const CatRepository = getManager().getRepository(CourseCat);

    try {
        const categories = [
            {
                title: "Preparer son embauche",
                description: faker.lorem.paragraph(2),
                image: faker.image.imageUrl(200, 200, '', true),
            },
            {
                title: "Soft Skills",
                description: faker.lorem.paragraph(2),
                image: faker.image.imageUrl(200, 200, '', true),
            },
            {
                title: "Les metiers du web",
                description: faker.lorem.paragraph(2),
                image: faker.image.imageUrl(200, 200, '', true),
            },
            {
                title: "Gestion de projet",
                description: faker.lorem.paragraph(2),
                image: faker.image.imageUrl(200, 200, '', true),
            },
            {
                title: "P.A.O et Design",
                description: faker.lorem.paragraph(2),
                image: faker.image.imageUrl(200, 200, '', true),
            }
        ]
        await Promise.all(categories.map(async (item) => {
            const existing = await CatRepository.find({ where: { title: item.title } })
            if (existing.length == 0) {
                await CatRepository.save(item)
            }
        }))





         const courseCat = await CatRepository.find();

        for (let i = 0; i < 5; i++) {
         await Repository.save({
                 title: faker.lorem.words(2),
                description: faker.lorem.words(200),
                 image: faker.image.imageUrl(200, 200, '', true),
                 IsPublished: (i % 2 == 0) ? true : false,
                courseCat: courseCat[1]
            });
        }

        // for (let i = 0; i < 5; i++) {
        //     await Repository.save({
        //         title: faker.lorem.words(2),
        //         description: faker.lorem.paragraph(2),
        //         image: faker.image.imageUrl(200, 200, '', true),
        //         IsPublished: (i % 2 == 0) ? true : false,
        //         courseCat: courseCat[2]
        //     });
        // }

        // for (let i = 0; i < 5; i++) {
        //     await Repository.save({
        //         title: faker.lorem.words(2),
        //         description: faker.lorem.words(200),
        //         image: faker.image.imageUrl(200, 200, '', true),
        //         IsPublished: (i % 2 == 0) ? true : false,
        //         courseCat: courseCat[0]
        //     });
        // }

        // for (let i = 0; i < 5; i++) {
        //     await Repository.save({
        //         title: faker.lorem.words(2),
        //         description: faker.lorem.words(200),
        //         image: faker.image.imageUrl(200, 200, '', true),
        //         IsPublished: (i % 2 == 0) ? true : false,
        //         courseCat: courseCat[0]
        //     });
        // }

    } catch (error) {
        return 0;
    }
    process.exit(0)
});