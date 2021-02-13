import { IsDateString, IsNotEmpty, IsString } from "class-validator";

export class AtualizarDesafioDto {

    @IsNotEmpty()
    @IsDateString()
    dataHoraDesafio: Date;

    @IsNotEmpty()
    @IsString()
    status: String;

}