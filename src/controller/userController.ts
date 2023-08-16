import { Request, Response } from "express";
import { getManager, Not } from "typeorm";
import { User } from "../entity/user.entity";
import { updateInfoValidation } from "../validation/user.validation";
import bcryptjs from 'bcryptjs';
import { Formation } from "../entity/formation.entity";
import { Graduation } from "../entity/graduation.entity";
import { ProfessionalExperience } from "../entity/professionalExperience.entity";
import moment from "moment";
import { DATE_FORMAT } from "../constant/constant";
import { Role } from "../entity/role.entity";
export const fetchAllUser = async (req: Request, res: Response) => {
    const take = 10;
    const currentUserId = req.session['uId']?.id
    let pager = parseInt(req.query.page as string || '1');
    const page = (0 < pager) ? pager : 1;
    const repository = getManager().getRepository(User);
    await repository.findAndCount({
        where: { id: Not(currentUserId) },
        take,
        skip: (page - 1) * take,
        relations: ['role']
    }).then((result) => {
        const [data, total] = result;

        return res.status(200).render('user/index', {
            data,
            page_name: "users",
            title: 'Liste des membres',
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

export const createUserFront = async (req: Request, res: Response) => {
    const repository = getManager().getRepository(Role);
    repository.find().then((data) => {
        return res.render('user/create', {
            data,
            page_name: 'create-member',
            title: 'Créer un member',
        })
    })
}

export const createUser = async (req: Request, res: Response) => {
    const body = req.body;
    const { error } = updateInfoValidation.validate({
        username: body.username,
        email: body.email,
    });

    if (error) {
        return res.status(400).send(error.details)
    }
    const repository = getManager().getRepository(User);
    await repository.save({
        email: body.email,
        username: body.username,
        IsConfirmed: true,
        password: await bcryptjs.hash(body?.password, 10),
        role: {
            id: body.roleId
        }
    }).then((result) => {
        const { password, ...user } = result;
        return res.send(user);
    }).catch((err) => {
        return res.status(500).send(err);
    });
};


export const UpdateUser = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const { email, username, roleId } = req.body;

    const { error } = updateInfoValidation.validate({
        username: username,
        email: email
    });

    if (error) {
        return res.status(400).send(error.details)
    }
    const repository = getManager().getRepository(User);
    await repository.update({ id: id }, {
        email: email,
        username: username,
        role: {
            id: roleId
        }
    }).then((result) => {
        return res.status(200).send({
            message: 'Info updated',
            result
        });
    }).catch((err) => {
        return res.status(500).send(err);
    });
};

export const EnableUser = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const repository = getManager().getRepository(User);
    await repository.update({ id: id }, {
        IsConfirmed: true
    }).then((result) => {
        return res.redirect("/users")
    }).catch((err) => {
        return res.status(500).send(err);
    });
};

export const DisableUser = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const repository = getManager().getRepository(User);
    await repository.update({ id: id }, {
        IsConfirmed: false
    }).then((result) => {
        return res.redirect("/users")
    }).catch((err) => {
        return res.status(500).send(err);
    });
};

export const getOneUser = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const repository = getManager().getRepository(User);
    await repository.findOne({ where: { id: id }, relations: { role: true } }).then((result) => {
        return res.status(200).send({
            result
        });
    }).catch((err) => {
        return res.status(500).send(err);
    });
};

export const DeleteUser = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const repository = getManager().getRepository(User);
    await repository.delete({ id: id }).then((result) => {
        return res.status(200).send(result)
    }).catch((err) => {
        return res.status(500).send(err);
    });
}


export const createFormation = async (title: string, date: Date, institution: string, description: string, userId: number): Promise<Formation> | null => {
    const formationRepository = getManager().getRepository(Formation)
    const userRepository = getManager().getTreeRepository(User)
    console.log("create formation", userId);

    const userRecord = await userRepository.findOne({ where: { id: userId } });
    if (!userRecord) {
        return;
    }
    const existing = await formationRepository.findOne({ where: { user: { id: userId }, title: title, date: date, institution: institution } })
    if (!existing) {
        const formation = await formationRepository.save({ title: title, date: date, institution: institution, description: description, user: userRecord })

        return formation
    } else {
        return;
    }

}


export const createGraduation = async (title: string, date: Date, institution: string, sector: string, userId: number): Promise<Graduation> | null => {
    const graduationRepository = getManager().getRepository(Graduation)
    const userRepository = getManager().getTreeRepository(User)

    const userRecord = await userRepository.findOne({ where: { id: userId } });
    if (!userRecord) {
        return;
    }
    const existing = await graduationRepository.findOne({ where: { user: { id: userId }, date: date, institution: institution, sector: sector } })
    if (!existing) {
        const graduation = await graduationRepository.save({ title: title, date: date, sector: sector, institution: institution, user: userRecord })
        return graduation
    } else {
        return;
    }

}

export const createProfessionalExperience = async (
    title: string, startDate: Date, endDate: Date, companyName: string, currentlyHeld: boolean, description: string, userId: number): Promise<ProfessionalExperience> | null => {
    const professionalExperienceRepository = getManager().getRepository(ProfessionalExperience)
    const userRepository = getManager().getTreeRepository(User)

    const userRecord = await userRepository.findOne({ where: { id: userId } });
    if (!userRecord) {
        return;
    }
    const existing = await professionalExperienceRepository.findOne({
        where: { user: { id: userId }, companyName: companyName, title: title, startDate: startDate, endDate: endDate }
    })

    if (!existing) {
        const professionalExp = await professionalExperienceRepository.save({ title: title, companyName: companyName, currentlyHeld: currentlyHeld, description: description, startDate: startDate, endDate: endDate, user: userRecord })
        return professionalExp
    } else {
        return;
    }
}

export const createCV = async (req: Request, res: Response) => {

    const { cv } = req.body
    const {
        id,
        civility // string
        , firstName // string,
        , lastName // string
        , dateOfBirth //string
        , adress // string
        , phoneNumber // string 
        , professionalExperiences // array of { title: string, startDate: string, endDate: string, companyName: string, currentlyHeld: boolean, description: string, userId: number}
        , formations // array of {title: string, date: string, institution: string, description: string}
        , graduations // array of {title: string, date: Date, institution: string, sector: string}
    } = cv
    const userId = req?.session['uId']?.id ?? id;
    if (!userId) {
        res.status(401).send({ "message": "Unauthorized" })
    }

    const userRepository = getManager().getTreeRepository(User)

    const userRecord = await userRepository.findOne({ where: { id: userId } })
    if (!userRecord) {
        res.status(404).send({ "message": "User not found" })
    }

    const newFormations = await Promise.all((formations.map(async (item) => {
        const { title, institution, description } = item
        const date = moment(item.date, DATE_FORMAT).toDate()
        return await createFormation(title, date, institution, description, userRecord.id)
    })))

    const newGraduations = await Promise.all((graduations.map(async (item) => {
        const { title, institution, sector } = item
        const date = moment(item.date, DATE_FORMAT).toDate()
        return await createGraduation(title, date, institution, sector, userRecord.id)
    })))

    const newExperiences = await Promise.all((professionalExperiences.map(async (item) => {
        const { title, companyName, description, currentlyHeld } = item
        const startDate = moment(item.startDate, DATE_FORMAT).toDate()
        const endDate = moment(item.endDate, DATE_FORMAT).toDate()
        return await createProfessionalExperience(title, startDate, endDate, companyName, currentlyHeld, description, userRecord.id)
    })))

    await userRepository.update({ id: userRecord.id }, {
        civility: civility, firstName: firstName,
        lastName: lastName, birthDate: moment(dateOfBirth, DATE_FORMAT).toDate(),
        adress: adress, phoneNumber: phoneNumber,

    });



    const updateUserRecord = await userRepository.findOne({
        where: { id: userId }, relations:
            ["formations", "professionalExperiences", "graduations"]
    })

    res.send(updateUserRecord)

}
