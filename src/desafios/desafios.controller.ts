import { Body, Controller, Delete, Get, Param, Post, Put, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { DesafiosService } from './desafios.service';
import { AtribuirDesafioPartidaDto } from './dtos/atribuir-desafio-partida.dto';
import { AtualizarDesafioDto } from './dtos/atualizar-desafio.dto';
import { CriarDesafioDto } from './dtos/criar-desafio.dto';
import { Desafio } from './interfaces/desafio.interface';
import { DesafioStatusValidationPipe } from './pipes/desafio-status-validation.pipe';

@Controller('api/v1/desafios')
export class DesafiosController {

    constructor(private readonly desafiosService: DesafiosService) {}

    @Post()
    @UsePipes(ValidationPipe)
    async criarDesafio(@Body() criarDesafioDto: CriarDesafioDto): Promise<Desafio> {
        return await this.desafiosService.criarDesafio(criarDesafioDto);
    }

    @Get()
    async consultarDesafiosDeUmJogador(@Query('idJogador') idJogador: string): Promise<Array<Desafio>> {
        return await this.desafiosService.consultarDesafiosDeUmJogador(idJogador);
    }

    @Get()
    async consultarTodosDesafios(): Promise<Array<Desafio>> {
        return await this.desafiosService.consultarTodosDesafios();
    }

    @Put('/:desafio')
    async atualizarDesafio(
        @Body(DesafioStatusValidationPipe) atualizarDesafioDto: AtualizarDesafioDto,
        @Param('desafio') _id: string): Promise<void> {
            await this.desafiosService.atualizarDesafio(_id, atualizarDesafioDto);
    }

    @Post('/:desafio/partida')
    async atribuirDesafioPartida(
        @Param('desafio') _id: string,
        @Body(ValidationPipe) atribuirDesafioPartida: AtribuirDesafioPartidaDto): Promise<void> {
            await this.desafiosService.atribuirDesafioPartida(_id, atribuirDesafioPartida);
    }

    @Delete('/:desafio')
    async deletarDesafio(@Param('desafio') _id: string): Promise<void> {
        await this.desafiosService.deletarDesafio(_id);
    }




}
