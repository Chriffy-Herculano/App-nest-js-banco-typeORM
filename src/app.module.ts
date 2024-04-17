import { Module, forwardRef } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';
import { PugAdapter } from '@nestjs-modules/mailer/dist/adapters/pug.adapter';

@Module({
  imports: [ 
    ConfigModule.forRoot(),
    ThrottlerModule.forRoot([{
      ttl: 60,
      limit: 3,
      //ignoreUserAgents: [/google/gi]
    }]),
    forwardRef(() => UserModule), 
    forwardRef(() => AuthModule),
    MailerModule.forRoot({
      //usuario | senha | smpt servidor
      //transport: 'smtps://alec.welch@ethereal.email:tfy3jz5MS3YsxhveBs@smtp.ethereal.email',
      transport: {
        host: 'smtp.ethereal.email',
        port: 587,
        auth: {
            user: 'alec.welch@ethereal.email',
            pass: 'tfy3jz5MS3YsxhveBs'
        }
      },
      defaults: {
        //Nome que vai sair e qual e-mail
        from: '"Testando email" <alec.welch@ethereal.email>',
      },
      template: {
        dir: __dirname + '/templates',
        adapter: new PugAdapter(),
        options: {
          strict: true,
        },
      },
    }),
  ], 
  controllers: [AppController],
  providers: [AppService, {
    provide: APP_GUARD, 
    useClass: ThrottlerGuard
  }],
  exports: [AppService]
})
export class AppModule {}
