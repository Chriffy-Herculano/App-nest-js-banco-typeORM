import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { AuthService } from "src/auth/auth.service";
import { UserService } from "src/user/user.service";

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(
        private readonly authService: AuthService,
        private readonly userService: UserService
    ) {}

    //começa o ciclo do request / validação do guards / abrir os dados do token / pegar os dados do payload e colocar dentro request e colocar em uma variavel que não existia no request

    async canActivate(context: ExecutionContext) {

        const request = context.switchToHttp().getRequest();
        const {authorization} = request.headers;

        try {
            const data = this.authService.checkToken((authorization ?? '').split(' ')[1]);

            request.tokenPayload = data;

            request.user = await this.userService.show(data.id);

            return true;
        } catch(e) {
            return false;
        }
    }
}