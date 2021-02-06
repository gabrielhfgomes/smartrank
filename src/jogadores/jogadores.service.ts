import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CriarJogadorDto } from './dtos/criar-jogador.dto';
import { Jogador } from './interfaces/jogador.interface';
import { v4 as uuidv4} from 'uuid';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AtualizarJogadorDto } from './dtos/atualizar-jogador.dto';

@Injectable()
export class JogadoresService {

    constructor(@InjectModel('Jogador') private readonly jogadorModel : Model<Jogador>){}

    async criarJogador(criarJogadorDto: CriarJogadorDto): Promise<Jogador> {
        const { email } = criarJogadorDto;
        const jogadorEncontrado = await this.jogadorModel.findOne({email}).exec();
        if(jogadorEncontrado) {
            throw new BadRequestException(`Jogador com o e-mail ${email} já cadastrado`);
        }
        const jogadorCriado = new this.jogadorModel(criarJogadorDto);
        return await jogadorCriado.save();
    }

    async atualizarJogador(_id: string, atualizarJogadorDto: AtualizarJogadorDto): Promise<void> {
        const jogadorEncontrado = await this.jogadorModel.findOne({_id}).exec();

        if(!jogadorEncontrado) {
            throw new NotFoundException(`Jogador com id ${_id} não encontrado`);
        }
        await this.jogadorModel.findOneAndUpdate({_id}, {$set: atualizarJogadorDto}).exec();
    }

    async deletarJogador(_id: string): Promise<any> {
        const jogadorEncontrado = await this.jogadorModel.findOne({_id}).exec();

        if (!jogadorEncontrado) {
            throw new NotFoundException(`Jogador com ${_id} não foi encontrado`);
        }
        return await this.jogadorModel.deleteOne({_id}).exec();
    }

    async consultarJogadorPeloId(_id: string) : Promise<Jogador> {
        const jogadorEncontrado = await this.jogadorModel.findOne({_id}).exec();
        if (!jogadorEncontrado) {
            throw new NotFoundException(`Jogador com ${_id} não foi encontrado`);
        }
        return jogadorEncontrado;
    }

    async consultarTodosJogadores(): Promise<Jogador[]> {
        return await this.jogadorModel.find().exec();
    }
}
