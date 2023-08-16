import { Request, Response } from "express";
import { getConnection, getManager } from "typeorm";
import { User } from "../entity/user.entity";
import { RegisterValidation, updateInfoValidation, updatePasswordValidation } from "../validation/user.validation";
import bcryptjs from 'bcryptjs';
import { sign } from "jsonwebtoken";
import { Role } from "../entity/role.entity";
import { role } from "../constant/constant";
import { sendMail } from "./emailController";
import { env } from "../../env";
import { ProfessionalExperience } from "../entity/professionalExperience.entity";
import { Formation } from "../entity/formation.entity";
import { createLogger, transports } from 'winston';
import { database } from "faker/locale/az";

const logger = createLogger({
    transports: [
      new transports.Console(),
    ],
  });

export const Register = async (req: Request, res: Response) => {
    const { email, confirmPassword, password, phoneNumber, firstName, lastName, birthDate, adress } = req.body;
    const type = req.body.userType || role.MEMBER_FREE;
    const { error } = RegisterValidation.validate({
        email: email,
        password: password,
        passwordConf: confirmPassword
    });

    if (error) {
        logger.error("Les mots de passe ne sont pas identiques");
        return res.redirect('/inscription');
    }

    let username = email.split('@')[0];
    const repository = getManager().getRepository(User);
    const roleRepository = getManager().getRepository(Role);
    const userType = await roleRepository.findOne({ where: { name: type?.toString() } });
    const user = await repository.findOne({ where: { email: email } });

    if (!userType) {
        logger.error("Oops, une erreur est survenue lors de votre inscription, veuillez réessayer plus tard");
        return res.redirect('/inscription');

    }

    if (user) {
        logger.error("L'adresse email que vous avez entrée est déjà utilisée par un autre utilisateur, veuillez utiliser une autre");
        return res.redirect('/inscription');

    }

    const memberType = userType.name === role.MEMBER_MONTHLY ? "Trimestriel" : userType.name === role.MEMBER_VIP ? "VIP" : "Annuel";
    const message = `L'utilisateur ${firstName} ${lastName}, avec l'email ${email} et le numéro: ${phoneNumber}, vient de créer un compte avec un abonnement <b>${memberType}</b>`;

    await repository.save({
        email: email,
        username: username,
        IsConfirmed: false,
        password: password,
        role: userType,
        phoneNumber: phoneNumber,
        firstName: firstName,
        lastName: lastName,
        birthDate: birthDate,
        adress: adress
    }).then(async (result) => {
        const { password, ...user } = result;
        await sendMail(env.contact, message, "New account", "");
        logger.info("Votre compte a été créé, nous vous contacterons pour l'activation.");
        return res.redirect('/inscriptionstep2');
    }).catch((err) => {
        return res.status(500).send(err);
    });
};

export const Login = async (req: Request, res: Response) => {
    const email: string = req.body.email;
    const password: string = req.body.password;
  
    const repository = getManager().getRepository(User);
    let alertDanger = null; // Initialisez la variable alertDanger à null par défaut
  
    await repository.findOne({ where: { email: email }, relations: ['role'] }).then(async (result) => {
      if (!result) {
        alertDanger = 'Les informations que vous avez fournies sont incorrectes';
        return res.redirect('/login-register');
      }
      if (!await bcryptjs.compare(password, result.password)) {
        alertDanger = 'Les informations que vous avez fournies sont incorrectes, veuillez réessayer';
        return res.redirect('/login-register');
      }
  
      if (!result.IsConfirmed) {
        alertDanger = "Votre compte n'est pas encore activé, veuillez nous contacter pour plus d'informations";
        return res.redirect('/login-register');
      }
  
      const payload = {
        id: result.id,
        email: result.email,
        role: result?.role?.name
      };
  
      const token = sign(payload, process.env.SECRETE_TOKEN!);
      res.cookie('jwt', token, {
        httpOnly: true,
        maxAge: 24 * 26 * 60 * 1000 // 1 day
      });
  
      req.session['uId'] = payload;
  
      if (result.role.name === role.MEMBER_VIP) {
        return res.redirect('/compte-annuel-vip');
      } else {
        return res.redirect('/compte-annuel');
      }
    }).catch((err) => {
      alertDanger = err.message; // Utilisez le message d'erreur comme alerte
      logger.error(err);
      return res.status(500).send(err);
    });

    // Passez la variable alertDanger à votre vue lors du rendu
    return res.render('/login-register', {
        alertDanger: alertDanger,
        // ... autres variables à passer à la vue ...
    });
};


export const authenticatedUser = async (req: Request, res: Response) => {
    try {
        const repository = getManager().getRepository(User);

        await repository.findOne({ where: { id: req.session['uId'].id }, relations: ["role"] })
            .then(async (result) => {
                if (!result) {
                    return res.status(401).send({
                        message: "an error occured"
                    })
                }
                const { password, ...user } = result;

                return res.render('pages/userprofile', {
                    user,
                    page_name: "liste4",
                    title: 'A propos de moi',
                })
            })
            .catch(async (err) => {
                return res.status(500).send(err);
            });
    } catch (error) {
        return res.status(401).send({
            message: "unauthenticated",
            error
        })
    }

};
export const updateUserview = async (req: Request, res: Response) => {
    try {
        const repository = getManager().getRepository(User);
        await repository.findOne({ where: { id: req.session['uId'].id }, relations: ["role"] })
            .then(async (result) => {
                if (!result) {
                    return res.status(401).send({
                        message: "an error occured"
                    })
                }
                const { password, ...user } = result;

                return res.render('pages/updateuser', {
                    user,
                    page_name: "liste4",
                    title: 'A propos de moi',
                })
            })
            .catch(async (err) => {
                return res.status(500).send(err);
            });
    } catch (error) {
        return res.status(401).send({
            message: "unauthenticated",
            error
        })
    }

};


export const UpdateInfo = async (req: Request, res: Response) => {
    const id = req.session['uId'].id;

    const { email, username } = req.body;

    const { error } = updateInfoValidation.validate({
        username: username,
        email: email
    });

    if (error) {
        return res.status(400).send(error.details)
    }
    const repository = getManager().getRepository(User);
    repository.update({ id: id }, {
        email: email,
        username: username
    }).then((result) => {
        return res.status(200).send({
            message: 'Info updated',
            result
        });
    }).catch((err) => {
        return res.status(500).send(err);
    });
}
export const UpdatePassword = async (req: Request, res: Response) => {
    const id = req.session['uId'].id;
    let user;
    const { oldPass, newpass, passwordConf } = req.body;

    const { error } = updatePasswordValidation.validate({
        newpass: newpass,
        passwordConf: passwordConf
    });

    if (error) {
        return res.status(400).send(error.details)
    }
    const repository = getManager().getRepository(User);
    try {
        user = await repository.findOneBy({ id: id });
    } catch (err) {
        return res.send(err)
    }
    if (!user) {
        return res.status(401).send({
            message: "an error occured"
        })
    }
    if (!await bcryptjs.compare(user.password, oldPass)) {
        // throw new Error("passwordError");
        return res.status(500).send({
            message: "Password incorrect"
        })
    }
    await repository.update({ id: id }, {
        password: await bcryptjs.hash(newpass, 10)
    }).then((result) => {
        return res.status(200).send({
            message: 'Info updated',
            result
        });
    }).catch((err) => {
        return res.status(500).send(err);
    });
}

export const Logout = (req: Request, res: Response) => {
    req.session.destroy((err) => {
      if (err) {
        console.log(err);
        return res.status(500).send(err);
      }
      res.clearCookie('jwt');
      console.log('Déconnecté');
  
      // Ajouter les en-têtes de cache pour empêcher la mise en cache de la page d'accueil
      res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
      res.set('Expires', '0');
      res.set('Pragma', 'no-cache');
  
      return res.redirect('/login-register');
    });
  };
  


export const saveProfessionalExperience = async (req: Request, res: Response) => {
    try {
      const {
        titrepost1,
        debutpost1,
        finpost1,
        'en-cours-post1': enCoursPost1,
        descriptionpost1,
        companyname1,
        titrepost2,
        debutpost2,
        finpost2,
        'en-cours-post2': enCoursPost2,
        descriptionpost2,
        companyname2,
      } = req.body;
  
      const experience1 = new ProfessionalExperience();
      experience1.title = titrepost1;
      experience1.description = descriptionpost1;
      experience1.companyName = companyname1;
      experience1.startDate = debutpost1;
      experience1.endDate = finpost1;
      experience1.currentlyHeld = enCoursPost1 === 'on';
  
      const experience2 = new ProfessionalExperience();
      experience2.title = titrepost2;
      experience2.description = descriptionpost2;
      experience2.companyName = companyname2;
      experience2.startDate = debutpost2;
      experience2.endDate = finpost2;
      experience2.currentlyHeld = enCoursPost2 === 'on';
  
      const connection = getConnection();
      const experienceRepository = connection.getRepository(ProfessionalExperience);
  
      await experienceRepository.save([experience1, experience2]);
  
      res.redirect('/inscriptionstep3');
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "An error occurred while saving professional experiences." });
    }
  };

  
  export const saveFormation = async (req: Request, res: Response) => {
    try {
        const { diplome, form1, form2, etablissement1, etablissement2,date } = req.body;

        const formation1 = new Formation();
        formation1.title = diplome;
        formation1.institution = etablissement1;
        formation1.description = form1;
        formation1.date = date;
        const connection = getConnection();
        const formationRepository = connection.getRepository(Formation);

        await formationRepository.save([formation1]);

        res.redirect('/login-register');
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Une erreur s'est produite lors de l'enregistrement des formations." });
    }
};
