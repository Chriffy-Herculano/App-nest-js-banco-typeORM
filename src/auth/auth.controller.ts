import {
  Controller,
  Post,
  Body,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  UploadedFiles,
  ParseFilePipe,
  FileTypeValidator,
  MaxFileSizeValidator,
} from '@nestjs/common';
import { AuthLoginDTO } from './dto/auth-login.dto';
import { AuthResetDTO } from './dto/auth-reset.dto';
import { AuthForgetDTO } from './dto/auth-forget.dto';
import { AuthService } from './auth.service';
import {
  FileFieldsInterceptor,
  FileInterceptor,
  FilesInterceptor,
} from '@nestjs/platform-express';
//import { join } from "path";
//import { UserService } from "../user/user.service";
import { FileService } from '../file/file.service';
import { AuthGuard } from '../guards/auth.guard';
import { User } from '../decorators/user.decorator';
import { AuthRegisterDTO } from './dto/auth-register.dto';
import { UserEntity } from '../user/entity/user.entity';

@Controller('auth')
export class AuthController {
  //injetando serviços a classe
  constructor(
    private readonly authService: AuthService,
    private readonly fileService: FileService,
  ) {}

  @Post('login')
  async login(@Body() { email, password }: AuthLoginDTO) {
    return this.authService.login(email, password);
  }

  @Post('register')
  async register(@Body() body: AuthRegisterDTO) {
    return this.authService.register(body);
  }

  @Post('forget')
  async forget(@Body() { email }: AuthForgetDTO) {
    return this.authService.forget(email);
  }

  @Post('reset')
  async reset(@Body() { password, token }: AuthResetDTO) {
    return this.authService.reset(password, token);
  }

  // quando o request chegar eu tenho os dados do usuario
  @UseGuards(AuthGuard)
  @Post('me')
  async me(@User() user: UserEntity) {
    return user;
  }

  // Rota para upload
  @UseInterceptors(FileInterceptor('file')) //nome do campo que to passando na requisição
  @UseGuards(AuthGuard)
  @Post('photo')
  async uploadPhoto(
    @User() user: UserEntity,
    @UploadedFile(
      new ParseFilePipe({
        //validando upload usando Pipes
        validators: [
          new FileTypeValidator({ fileType: 'image/png' }),
          new MaxFileSizeValidator({ maxSize: 1024 * 45 }),
        ],
      }),
    )
    photo: Express.Multer.File,
  ) {
    // renomeia a foto
    const filename = `photo-${user.id}.png`;

    try {
      // chamando o metodo upload dentro de fileService
      await this.fileService.upload(photo, filename);
    } catch (e) {
      throw new BadRequestException(e);
    }

    return photo;
  }

  // upload de varios arquivos
  // procura o campo enviado no body chamado files (FilesInterceptor)
  // (UploadedFiles) detecta e retorna todos os arquivos
  @UseInterceptors(FilesInterceptor('files')) //nome do campo que to passando na requisição
  @UseGuards(AuthGuard)
  @Post('files')
  async uploadFiles(
    @User() user,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return files;
  }

  // Aqui escolho qual campo eu pego e a quantidade de arquivo
  @UseInterceptors(
    FileFieldsInterceptor([
      {
        name: 'photo',
        maxCount: 1,
      },
      {
        name: 'documentos',
        maxCount: 10,
      },
    ]),
  ) //nome do campo que to passando na requisição
  @UseGuards(AuthGuard)
  @Post('files-fields')
  async uploadFilesFields(
    @User() user,
    @UploadedFiles()
    files: { photo: Express.Multer.File; documentos: Express.Multer.File[] },
  ) {
    return files;
  }
}
