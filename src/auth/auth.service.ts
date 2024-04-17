import { BadRequestException, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { User } from "@prisma/client";
import { PrimaService } from "src/prisma/prisma.service";
import { UserService } from "src/user/user.service";
import * as bcrypt from 'bcrypt';
import { MailerService } from "@nestjs-modules/mailer";

@Injectable()
export class AuthService {

    private issuer = 'login';
    private audience = 'users';

    constructor(
        private readonly jwtService: JwtService, 
        private readonly prisma: PrimaService,
        private readonly userService: UserService,
        private readonly mailer: MailerService
    ) {}

    createToken(user: User) {
        return {
            accessToken: this.jwtService.sign({
                id: user.id,
                name: user.name,
                email: user.email
            }, {
                expiresIn: "7 days",
                subject: String(user.id),
                issuer: this.issuer,
                audience: this.audience
            })
        }
    }

    checkToken(token: string) {
        try {
            const data = this.jwtService.verify(token, {
                issuer: this.issuer,
                audience: this.audience
            });

            return data;
        } catch(e) {
            throw new BadRequestException(e);
        }
    }

    isValidToken(token: string) {
        try {
            this.checkToken(token);
            return true;
        } catch (e) {
            return false;
        }
    }

    async login(email: string, password: string) {

        //console.log(process.env)

        // Procura o usuario pelo e-mail
        const user = await this.prisma.user.findFirst({
            where: {
                email
            }
        });

        // Se não achar cai na excessão
        if(!user){
            throw new UnauthorizedException('E-mail e/ou senha incorretos.');
        }

        // Se achar o usuario e se não bater a senha hash do banco com o que está senhdo passado cai na excessão
        if(!await bcrypt.compare(password, user.password)) {
            throw new UnauthorizedException('E-mail e/ou senha incorretos.');
        }

        return this.createToken(user);
    }

    // recuperação de senha
    async forget(email: string) {
        const user = await this.prisma.user.findFirst({
            where: {
                email
            }
        });

        if(!user){
            throw new UnauthorizedException('E-mail está incorreto.');
        }

        const token = this.jwtService.sign({
            id: user.id
        }, {
            expiresIn: "30 minutes",
            subject: String(user.id),
            issuer: 'forget',
            audience: 'users',
        });

        await this.mailer.sendMail({
            subject: 'Recuperação de Senha.',
            to: 'chriffy123@gmail.com.br',
            template: 'forget',
            context: {
                name: user.name,
                token
            }
        });

        return true;
    }

    async reset(password: string, token: string) {

        try {
            const data:any = this.jwtService.verify(token, {
                issuer: 'forget',
                audience: 'users',
            });

            if(isNaN(Number(data.id))) {
                throw new BadRequestException("Token é inválido");
            }

            // fazendo o hash da senha
            const salt = await bcrypt.genSalt();
            password = await bcrypt.hash(password, salt);

            // atualiza a senha do usuario com o id passado
            const user = await this.prisma.user.update({
                where: {
                    id: Number(data.id),
                },
                data: {
                    password,
                },
            });

        return this.createToken(user);

            
        } catch(e) {
            throw new BadRequestException(e);
        }
        
    }

    //async register(data: AuthRegisterDTO) {
        
        //const user = await this.userService.create(data);

        //return this.createToken(user);
    //}
}