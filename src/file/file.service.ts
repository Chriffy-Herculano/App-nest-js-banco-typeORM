import { Injectable } from "@nestjs/common";
import { writeFile } from "fs/promises";


@Injectable()
export class FileService {
    async upload(file: Express.Multer.File, path: string) {
        
        //faz o upload do arquivo para o sistema usando wrieFile
        return writeFile(path, file.buffer)
    }
}