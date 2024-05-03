import { Role } from "../enums/role.enum";
import { CreateUserDTO } from "../user/dto/create-user.tdo";

export const createUserDTO:CreateUserDTO = {
    birthAt: '2000-01-01',
    email: 'chriffyh@gmail.com',
    name: 'Chriffy',
    password: '123456',
    role: Role.User
}