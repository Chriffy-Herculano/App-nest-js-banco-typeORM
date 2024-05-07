import { Controller, Post, Body, Get, Put, Patch, Delete, UseInterceptors, UseGuards } from "@nestjs/common";
import { UserService } from "./user.service";
import { Roles } from "../decorators/roles.decorator";
import { Role } from "../enums/role.enum";
import { AuthGuard } from "../guards/auth.guard";
import { RoleGuard } from "../guards/role.guard";
import { LogInterceptor } from "../interceptors/log.interceptor";
import { CreateUserDTO } from "./dto/create-user.tdo";
import { ParamId } from "../decorators/param-id.decorator";
import { UpdatePutUserDTO } from "./dto/update-put-user.dto";
import { UpdatePatchUserDTO } from "./dto/update-patch-user.dto";
//import { SkipThrottle, Throttle } from "@nestjs/throttler";

@Roles(Role.Admin)
@UseGuards(AuthGuard, RoleGuard) //Valida se esta autenticado / qual permissão esse usuario autenticado tem
@UseInterceptors(LogInterceptor)
@Controller('users')
export class UserController {

    constructor(private readonly userService: UserService) {}


    //Insert
    //@SkipThrottle() //estou ignorando a segurançao de acesso para essa rota
    @Post() //name, email, password OU o body mas aqui especifico qual quero pegar
    async create(@Body() data: CreateUserDTO) {
        return this.userService.create(data);
    }

    
    //Retorna todos
    //@Throttle({ default: { limit: 3, ttl: 60 } }) //sobreescrevendo o padrão para essa rota em especifico.
    @Get() 
    async list() {
        //return {users:[]};
        return this.userService.list();
    }

    //Retorna um específico
    
    @Get(':id') //ParseIntPipe transforma em number
    async show(@ParamId() id: number) {
        console.log(id)
        //return {user:{}, id}
        return this.userService.show(id);
    }

    //Alteração completa / precisa passar todos os se não ele vai ficar null
    
    @Put(':id')
    async update(@Body() data: UpdatePutUserDTO, @ParamId() id: number) {
        return this.userService.update(id, data);
    }

    //Alteração parcial
    
    @Patch(':id')
    async updatePartial(@Body() data: UpdatePatchUserDTO, @ParamId() id: number) {
        return this.userService.updatePartial(id, data);
    }

    
    @Delete(':id') //estou apenas pegando o id e transformando ele em number usando o ParseIntPipe
    async delete(@ParamId() id: number) {
        return {
            success: await this.userService.delete(id),
        };
    }
}