import { Test, TestingModule } from "@nestjs/testing";
import { UserService } from "./user.service";
import { userRepositoryMock } from "../testing/user-repository.mock";
import { userEntityList } from "../testing/user-entity-list-mock";
import { createUserDTO } from "../testing/create-user-dto.mock";
import { Repository } from "typeorm";
import { UserEntity } from "./entity/user.entity";
import { getRepositoryToken } from "@nestjs/typeorm";
import { updatePutUserDTO } from "../testing/update-put-user-tdo.mock";
import { updatePatchUserDTO } from "../testing/update-patch-user-tdo.mock";

// agrupando testes
describe('UserService', () => {

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    let userService: UserService;
    let userRepository: Repository<UserEntity>

    // Criando um module fake para continuar usando os serviços, a parte de teste é uma aplicação independente 
    beforeEach(async () => {

        const module: TestingModule = await Test.createTestingModule({

            providers: [
                UserService,
                userRepositoryMock
            ]

        }).compile();

        userService = module.get<UserService>(UserService);
        userRepository = module.get(getRepositoryToken(UserEntity))
    });

    test('Validar a definição', () => {
        expect(userService).toBeDefined();
        expect(userRepository).toBeDefined();
    });

    describe('Create', () => {
        test('method create', async () => {

            jest.spyOn(userRepository, 'exists').mockResolvedValueOnce(false);

            const resut = await userService.create(createUserDTO);

            expect(resut).toEqual(userEntityList[0]);
        });
    });

    describe('Read', () => {
        test('method list', async () => {

            const resut = await userService.list();

            expect(resut).toEqual(userEntityList);
        });

        test('method show', async () => {

            const resut = await userService.show(1);

            expect(resut).toEqual(userEntityList[0]);
        });
    });

    describe('Update', () => {
        test('method update', async () => {

            const resut = await userService.update(1, updatePutUserDTO);

            expect(resut).toEqual(userEntityList[0]);
        });

        test('method updatePartial', async () => {

            const resut = await userService.updatePartial(1, updatePatchUserDTO);

            expect(resut).toEqual(userEntityList[0]);
        });

    }); 

    describe('Delete', () => {
        test('method delete', async () => {

            const resut = await userService.delete(1);

            expect(resut).toEqual(true);
        });
    });
});