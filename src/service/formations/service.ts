import { getManager } from "typeorm"
import { Formation } from "../../entity/formation.entity"
import { User } from "../../entity/user.entity"

export class FormationService {
    async findByUser(userId: number): Promise<Formation[]> {
        const userRepository = getManager().getTreeRepository(User)

        const userRecord = userRepository.findOne({ where: { id: userId } });
        if (!userRecord) {
            return []
        }

        const formationRepository = getManager().getRepository(Formation)
        const formations = await formationRepository.find({ where: { user: { id: userId } }, relations: ['user'] })
        return formations
    }

    async createFormation(title: string, date: Date, institution: string, description: string, userId: number): Promise<Formation> | null {
        const formationRepository = getManager().getRepository(Formation)
        const userRepository = getManager().getTreeRepository(User)

        const userRecord = userRepository.findOne({ where: { id: userId } });
        if (!userRecord) {
            return;
        }
        const formation = await formationRepository.create({ title: title, date: date, institution: institution, description: description, user: userRecord })
        return formation
    }
}