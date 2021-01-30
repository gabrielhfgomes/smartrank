import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CriarJogadorDto } from './dtos/criar-jogador.dto';
import { Jogador } from './interfaces/jogador.interface';
import { v4 as uuidv4} from 'uuid';


@Injectable()
export class JogadoresService {

    private readonly logger = new Logger(JogadoresService.name)
    private jogadores: Jogador[] = [];


    async criarAtualizarJogador(criarJogadorDto: CriarJogadorDto): Promise<void> {
        const {email} = criarJogadorDto;
        const jogadorEncontrado = await this.jogadores.find(jogador => jogador.email == email);
        jogadorEncontrado ? await this.atualizar(jogadorEncontrado, criarJogadorDto) : await this.criar(criarJogadorDto);
    }

    async deletarJogador(email: string): Promise<void> {
        const jogadorEncontrado = await this.jogadores.find(jogador => jogador.email == email);
        this.jogadores = this.jogadores.filter(jogador => jogador.email != jogadorEncontrado.email);
    }

    async consultarJogadorPeloEmail(email: string) : Promise<Jogador> {
        const jogadorEncontrado = await this.jogadores.find(jogador => jogador.email == email);
        if (!jogadorEncontrado) {
            throw new NotFoundException(`Jogador com email ${email} não foi encontrado`);
        }
        return jogadorEncontrado;
    }

    private atualizar(jogadorEncontrado: Jogador, criarJogadorDto: CriarJogadorDto): void {
        const {nome} = criarJogadorDto;
        jogadorEncontrado.nome = nome;
    }

    async consultarTodosJogadores(): Promise<Jogador[]> {
        return await this.jogadores;
    }

    private criar(criarJogadorDto: CriarJogadorDto): void {
        const {nome, email, telefoneCelular} = criarJogadorDto;
        const jogador: Jogador = {
            _id: uuidv4(),
            nome,
            telefoneCelular,
            email,
            ranking: `A`,
            posicaoRanking: 1,
            urlFotoJogador: 'http://www.google.com/foto123.jpg'
        };
        this.logger.log(`criarJogadorDto: ${JSON.stringify(jogador)}`);
        this.jogadores.push(jogador);
    }

}
