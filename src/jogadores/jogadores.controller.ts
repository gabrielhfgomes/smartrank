import { Body, Controller, Delete, Get, Inject, Param, Post, Put, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { CriarJogadorDto } from './dtos/criar-jogador.dto';
import { Jogador } from './interfaces/jogador.interface';
import { JogadoresService } from './jogadores.service';
import { ValidacaoParametrosPipe } from '../common/pipes/validacao-parametros.pipe';
import { AtualizarJogadorDto } from './dtos/atualizar-jogador.dto';

@Controller('api/v1/jogadores')
export class JogadoresController {

    constructor(private readonly jogadoresService: JogadoresService) {}

    @Post()
    @UsePipes(ValidationPipe)
    async criarJogador(@Body() criarJogadorDto: CriarJogadorDto): Promise<Jogador> {
        return await this.jogadoresService.criarJogador(criarJogadorDto);
    }

    @Put('/:_id')
    @UsePipes(ValidationPipe)
    async atualizarJogador(@Param('_id') _id: string, @Body() atualizarJogadorDto: AtualizarJogadorDto): Promise<void> {
        await this.jogadoresService.atualizarJogador(_id, atualizarJogadorDto);
    }

    @Delete('/:_id')
    async deletarJogador(@Param('id', ValidacaoParametrosPipe) _id: string) : Promise<void> {
        await this.jogadoresService.deletarJogador(_id);
    }

    @Get()
    async consultarJogadores(): Promise<Jogador[]> {
        return await this.jogadoresService.consultarTodosJogadores();
    }

    @Get('/:_id')
    async consultarJogadorPeloId(@Param('_id', ValidacaoParametrosPipe) _id: string): Promise<Jogador> {
        return await this.jogadoresService.consultarJogadorPeloId(_id);
    }
}
