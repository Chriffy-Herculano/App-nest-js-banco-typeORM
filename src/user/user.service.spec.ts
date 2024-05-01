import { Test, TestingModule } from "@nestjs/testing";
import { UserService } from "./user.service";
import { getRepositoryToken } from "@nestjs/typeorm";
import { UserEntity } from "./entity/user.entity";
import { userRepositoryMock } from "../testing/user-repository.mock";

// agrupando testes
describe('UserService', () => {

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    let userService: UserService;

    // Criando um module fake para continuar usando os serviços, a parte de teste é uma aplicação independente 
    beforeEach(async () => {

        const module: TestingModule = await Test.createTestingModule({

            providers: [
                UserService,
                userRepositoryMock
            ]

        }).compile();

        userService = module.get<UserService>(UserService);
    });

    test('Validar a definição', () => {
        expect(userService).toBeDefined();
    })

});