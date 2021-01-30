import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JogadoresModule } from './jogadores/jogadores.module';

@Module({
  imports: [
    JogadoresModule, 
    MongooseModule.forRoot('mongodb+srv://admin:qS7JWE9YFFZHmvak@cluster0.zmmp7.mongodb.net/smartrank?retryWrites=true&w=majority',
    { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true, useFindAndModify: true })],
  controllers: [],
  providers: [],
})
export class AppModule {}
