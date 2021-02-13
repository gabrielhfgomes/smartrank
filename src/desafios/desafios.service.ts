import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, now } from 'mongoose';
import { CategoriasService } from 'src/categorias/categorias.service';
import { Categoria } from 'src/categorias/interfaces/categoria.interface';
import { Jogador } from 'src/jogadores/interfaces/jogador.interface';
import { JogadoresService } from 'src/jogadores/jogadores.service';
import { DesafioStatus } from './desafio-status.enum';
import { AtribuirDesafioPartidaDto } from './dtos/atribuir-desafio-partida.dto';
import { CriarDesafioDto } from './dtos/criar-desafio.dto';
import { Desafio, Partida } from './interfaces/desafio.interface';

@Injectable()
export class DesafiosService {
    constructor(
        private readonly jogadoresService: JogadoresService,
        private readonly categoriasService: CategoriasService,
        @InjectModel('Desafio') private readonly desafioModel: Model<Desafio>,
        @InjectModel('Partida') private readonly partidaModel: Model<Partida>){}

    async criarDesafio(criarDesafioDto: CriarDesafioDto): Promise<Desafio> {
        const { jogadores } = criarDesafioDto;
        const { solicitante } = criarDesafioDto;


        await this.jogadoresService.consultarJogadorPeloId(jogadores[0]._id);
        await this.jogadoresService.consultarJogadorPeloId(jogadores[1]._id);
        const jogadorSolicitante = await this.jogadoresService.consultarJogadorPeloId(solicitante._id);

        const solicitanteEMembroDaPartida = await jogadores.filter(jogador => jogador._id == jogadorSolicitante._id);
        if(solicitanteEMembroDaPartida.length == 0) {
            throw new BadRequestException(`O jogador solicitante ${jogadorSolicitante.nome} não é um dos jogadores da partida`)
        }

        const categoriaSolicitante = await this.categoriasService.consultarJogadorNaCategoria(solicitante)

        if(!categoriaSolicitante) {
            throw new BadRequestException(`O solicitante precisar estar em uma categoria!`);
        }

        const desafioCriado = new this.desafioModel({
            dataHoraDesafio: criarDesafioDto.dataHoraDesafio,
            status: DesafioStatus.PENDENTE,
            dataHoraSolicitacao: now(),
            solicitante: solicitante,
            categoria: categoriaSolicitante.categoria,
            jogadores: jogadores,
        });
        return await desafioCriado.save()
    }

    async consultarDesafiosDeUmJogador(idJogador: any): Promise<Array<Desafio>> {

        await this.jogadoresService.consultarJogadorPeloId(idJogador);
        
        return this.desafioModel.find({})
            .where('jogadores')
            .in(idJogador)
            .populate("jogadores")
            .populate("solicitante")
            .populate("partida").exec();
    }

    async consultarTodosDesafios(): Promise<Array<Desafio>> {
        return await this.desafioModel.find({})
            .populate("jogadores")
            .populate("solicitante")
            .populate("partida").exec();
    }

    async atualizarDesafio(_id, atualizarDesafioDto): Promise<void> {

        const desafioEncontrado = await this.desafioModel.findById(_id).exec();

        if (!desafioEncontrado) {
            throw new BadRequestException(`Desafio ${_id} não cadastrado`);
        }

        if(atualizarDesafioDto.status) {
            desafioEncontrado.dataHoraResposta = new Date();
        }
        desafioEncontrado.status = atualizarDesafioDto.status;
        desafioEncontrado.dataHoraDesafio = atualizarDesafioDto.dataHoraDesafio;

        await this.desafioModel.findOneAndUpdate({_id}, {$set: desafioEncontrado}).exec();
    }

    async atribuirDesafioPartida(_id: string, atribuirDesafioPartidaDto: AtribuirDesafioPartidaDto): Promise<void> {
        const desafioEncontrado = await this.desafioModel.findById(_id).exec();

        if (!desafioEncontrado) {
            throw new BadRequestException(`Desafio ${_id} não cadastrado`);
        }

        console.log(desafioEncontrado   );

        const jogadorFilter = desafioEncontrado.jogadores.filter(jogador => jogador == atribuirDesafioPartidaDto.def);
        console.log(jogadorFilter)
        if(jogadorFilter.length == 0) {
            throw new BadRequestException(`O jogador vencedor não faz parte do desafio`);
        }

        const partidaCriada = new this.partidaModel(atribuirDesafioPartidaDto); 

        partidaCriada.categoria = desafioEncontrado.categoria;
        partidaCriada.jogadores = desafioEncontrado.jogadores;
        partidaCriada.def = atribuirDesafioPartidaDto.def;
        partidaCriada.resultado = atribuirDesafioPartidaDto.resultado;
        const resultado = await partidaCriada.save();

        console.log(resultado);
        desafioEncontrado.status = DesafioStatus.REALIZADO;
        desafioEncontrado.partida = resultado._id;

        try {
            await this.desafioModel.findOneAndUpdate({_id}, {$set: desafioEncontrado}).exec();
        } catch(error) {
            await this.partidaModel.deleteOne({_id: resultado._id}).exec();
            throw new InternalServerErrorException()
        }

    }

    async deletarDesafio(_id: string): Promise<void> {
        const desafioEncontrado = await this.desafioModel.findById({_id}).exec();

        if (!desafioEncontrado) {
            throw new BadRequestException(`Desafio ${_id} não cadastrado!`);
        }

        desafioEncontrado.status = DesafioStatus.CANCELADO;
        
        await this.desafioModel.findOneAndUpdate({_id}, {$set: desafioEncontrado}).exec();
    }
}
