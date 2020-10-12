import { ConfigurationProvider } from './provider/configuration.provider';
import { Neo4jService } from './services/neo4j/neo4j.service';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [
    AppService,
    Neo4jService, 
    ConfigurationProvider
  ],
})
export class AppModule { }
