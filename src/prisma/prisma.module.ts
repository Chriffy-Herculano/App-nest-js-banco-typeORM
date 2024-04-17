import { Module } from "@nestjs/common";
import { PrimaService } from "./prisma.service";

@Module({
    providers: [PrimaService], //Estou mostrando que ele faz parte dessa caixa
    exports: [PrimaService] //Aqui estou dando acesso a quem importar meu modulo vai ter acesso ao service
})
export class PrismaModule {}