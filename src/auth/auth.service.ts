import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { MailerService } from '@nestjs-modules/mailer';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserService } from '../user/user.service';
import { UserEntity } from '../user/entity/user.entity';
import { AuthRegisterDTO } from './dto/auth-register.dto';

@Injectable()
export class AuthService {
  private issuer = 'login';
  private audience = 'users';

  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly mailer: MailerService,
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
  ) {}

  createToken(user: UserEntity) {
    return {
      accessToken: this.jwtService.sign(
        {
          id: user.id,
          name: user.name,
          email: user.email,
        },
        {
          expiresIn: '7 days',
          subject: String(user.id),
          issuer: this.issuer,
          audience: this.audience,
        },
      ),
    };
  }

  checkToken(token: string) {
    try {
      const data = this.jwtService.verify(token, {
        issuer: this.issuer,
        audience: this.audience,
      });

      return data;
    } catch (e) {
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
    const user = await this.usersRepository.findOneBy({
      email,
    });

    // Se não achar cai na excessão
    if (!user) {
      throw new UnauthorizedException('E-mail e/ou senha incorretos.');
    }

    // Se achar o usuario e se não bater a senha hash do banco com o que está senhdo passado cai na excessão
    if (!(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('E-mail e/ou senha incorretos.');
    }

    return this.createToken(user);
  }

  // recuperação de senha
  async forget(email: string) {
    const user = await this.usersRepository.findOneBy({
      email,
    });

    if (!user) {
      throw new UnauthorizedException('E-mail está incorreto.');
    }

    const token = this.jwtService.sign(
      {
        id: user.id,
      },
      {
        expiresIn: '30 minutes',
        subject: String(user.id),
        issuer: 'forget',
        audience: 'users',
      },
    );

    await this.mailer.sendMail({
      subject: 'Recuperação de Senha.',
      to: 'chriffy123@gmail.com.br',
      template: 'forget',
      context: {
        name: user.name,
        token,
      },
    });

    return { success: true };
  }

  async reset(password: string, token: string) {
    try {
      const data: any = this.jwtService.verify(token, {
        issuer: 'forget',
        audience: 'users',
      });

      if (isNaN(Number(data.id))) {
        throw new BadRequestException('Token é inválido');
      }

      // fazendo o hash da senha
      const salt = await bcrypt.genSalt();
      password = await bcrypt.hash(password, salt);

      // atualiza a senha do usuario com o id passado
      await this.usersRepository.update(Number(data.id), {
        password,
      });

      const user = await this.userService.show(Number(data.id)); // Retornando os dados do usuario editado

      return this.createToken(user);
    } catch (e) {
      throw new BadRequestException(e);
    }
  }

  //VOLTAR ESTA COM ERRO
  async register(data: AuthRegisterDTO) {
    delete data.role;

    const user = await this.userService.create(data);

    return this.createToken(user);
  }
}
