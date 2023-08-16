import { Request, Response, NextFunction } from "express";
import { getManager } from "typeorm";
import { User } from "../entity/user.entity";
import { role } from "../constant/constant";
export const checkVIPAuth = (req: Request, res: Response, next: NextFunction) => {
    // Vérifier si l'utilisateur est authentifié
    if (!req.session['uId']) {
      return res.redirect('/login');
    }
  
    // Vérifier le rôle de l'utilisateur
    const session = require('express-session');
    const flash = require('connect-flash');
    const userRole = req.session['uId'].role;
    if (userRole !== role.MEMBER_VIP) {
      return res.redirect('/compte-annuel');
    }
    // Si l'utilisateur est authentifié et a le rôle VIP, passer à l'étape suivante
    next();
  };
  
export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const jwt = req.session['uId'];
    if (!jwt) {
      req.flash('danger', 'Vous devez vous connecter avant de pouvoir accéder à cette page!');
      return res.status(401).redirect('/login-register');
    }

    const repository = getManager().getRepository(User);
    const user: User = await repository.findOne({ where: { id: jwt.id }, relations: ['role', 'role.permissions'] });

    if (!user) {
      req.flash('danger', 'Utilisateur non trouvé');
      return res.status(404).redirect('/login-register');
    }

    if (!user.IsConfirmed) {
      req.flash('danger', 'Vous devez être confirmé avant de pouvoir accéder à cette page!');
      return res.redirect('/pricing');
    }

    next();
  } catch (error) {
    return res.status(401).redirect('/login-register');
  }
};
