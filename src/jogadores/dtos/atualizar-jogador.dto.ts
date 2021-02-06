import { IsEmail, IsNotEmpty } from 'class-validator';

export class AtualizarJogadorDto {
    @IsNotEmpty()
    readonly telefoneCelular: string;
    @IsNotEmpty()
    nome: string;
}