import { ArgumentMetadata, BadRequestException, PipeTransform } from "@nestjs/common";
import { isEmpty } from "class-validator";

export class ValidacaoParametrosPipe implements PipeTransform{

    transform(value: any, metadata: ArgumentMetadata) {
        if(isEmpty(value)) {
            throw new BadRequestException(`O valor do parâmetro ${metadata.data} deve ser informado!`);
        }
        return value;
    }
}