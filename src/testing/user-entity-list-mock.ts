import { Role } from "../enums/role.enum";
import { UserEntity } from "../user/entity/user.entity";

export const userEntityList: UserEntity[] = [{
    name: 'Chriffy',
    email: 'chriffyh@gmail.com',
    birthAt: new Date('2000-01-01'),
    id: 1,
    password: 'bdciywbewhdciycwebc',
    role: Role.Admin,
    createdAt: new Date(),
    updatedtAt: new Date()
}, {
    name: 'Gustavo',
    email: 'gustavoh@gmail.com',
    birthAt: new Date('2000-01-01'),
    id: 2,
    password: 'bdciywbewhdciycwebc',
    role: Role.Admin,
    createdAt: new Date(),
    updatedtAt: new Date()
}, {
    name: 'Joao',
    email: 'joaoh@gmail.com',
    birthAt: new Date('2000-01-01'),
    id: 3,
    password: 'bdciywbewhdciycwebc',
    role: Role.Admin,
    createdAt: new Date(),
    updatedtAt: new Date()
}]