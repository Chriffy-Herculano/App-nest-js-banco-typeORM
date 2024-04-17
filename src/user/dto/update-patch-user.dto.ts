import { PartialType } from "@nestjs/mapped-types";
import { CreateUserDTO } from "./create-user.tdo";

export class UpdatePatchUserDTO extends PartialType(CreateUserDTO) {
    
    

}