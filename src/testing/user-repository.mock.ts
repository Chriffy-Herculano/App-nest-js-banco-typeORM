import { getRepositoryToken } from "@nestjs/typeorm";
import { UserEntity } from "../user/entity/user.entity";

export const userRepositoryMock = {
    provide: getRepositoryToken(UserEntity),
    useValue: {
        exists: jest.fn(),
        create: jest.fn(),
        save: jest.fn(),
        find: jest.fn(),
        findOneBy: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
    }
}

