import { Request, Response } from "express"
import { getManager } from "typeorm";
import { role } from "../constant/constant";
import { User } from "../entity/user.entity";

export const permissionMiddleware = (access: string) => {
    return async (req: Request, res: Response, next: Function) => {
        const id = req.session['uId']?.id;
        console.log(id);

        const repository = getManager().getRepository(User);
        try {
            const user: User = await repository.findOne({ where: { id: id }, relations: ['role', 'role.permissions'] });
            const permission = user.role.permissions;

            if (req.method === 'GET') {
                console.log(access, permission, user);

                if (!(permission.some(p => (p.name === `view${access}`) && (p.name === `edit${access}`))) && user?.role?.name !== role.ADMIN) {
                    return res.status(401).send({
                        message: 'unauthorized'
                    })
                }
            } else {
                if (!permission.some(p => (p.name === `edit${access}`)) && user?.role?.name !== role.ADMIN) {
                    return res.status(401).send({
                        message: 'unauthorized'
                    })
                }
            }
            next()
        } catch (error) {
            return res.status(500).send({ "error": "server Error" });
        }
    }
}