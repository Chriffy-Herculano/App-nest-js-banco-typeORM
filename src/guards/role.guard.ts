import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { ROLES_KEY } from "src/decorators/roles.decorator";
import { Role } from "src/enums/role.enum";

@Injectable()
export class RoleGuard implements CanActivate {

    constructor(
        private readonly reflector: Reflector
    ) {}

    //começa o ciclo do request / validação do guards / abrir os dados do token / pegar os dados do payload e colocar dentro request e colocar em uma variavel que não existia no request

    async canActivate(context: ExecutionContext) {

        const requeridRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [context.getHandler(), context.getClass()]);

        if(!requeridRoles) {
            return true;
        }

        const {user} = context.switchToHttp().getRequest();

        const rolesFilted = requeridRoles.filter(role => role === user.role); 

        return rolesFilted.length > 0;

        
    }
}