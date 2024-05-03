import { Test, TestingModule } from "@nestjs/testing"
import { AuthService } from "./auth.service";
import { userRepositoryMock } from "../testing/user-repository.mock";
import { jwtServiceMock } from "../testing/jwt-service.mock";
import { userServiceMock } from "../testing/user-service.mock";
import { mailerServiceMock } from "../testing/mailer-service.mock";

describe('AuthService', () => {

    let authService: AuthService;

    beforeEach(async () => {

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthService,
                userRepositoryMock,
                jwtServiceMock,
                userServiceMock,
                mailerServiceMock
            ]
        }).compile();

        authService = module.get<AuthService>(AuthService);
    });

    test('Validar a definição', () => {
        expect(authService).toBeDefined();
    });

    describe('Token', () => {

    });

    describe('Autenticação', () => {
        
    });
});