import { Neo4jService } from './services/neo4j/neo4j.service';
import { Controller, Get, Post, Res, HttpStatus } from '@nestjs/common';
import { AppService } from './app.service';
import { Response } from 'express';
import * as neo4j from "neo4j-driver";
import { from } from 'rxjs';

@Controller('neo4j')
export class AppController {
  constructor(private readonly appService: AppService,
    private readonly _neo4jService: Neo4jService
  ) { }

  @Get()
  getHello(@Res() res: Response) {
    var result$= this._neo4jService.getAllMAterialObservable();
    result$.subscribe(result => {
      res.status(HttpStatus.OK).json(result);
    });
  }
  @Post()
  public saveTestData(@Res() res: Response) {
    try {
      var result$= this._neo4jService.createNewEntryObservable();
      result$.subscribe(result => {
        res.status(HttpStatus.OK).json(result);
      });
    }catch(error){
      res.status(HttpStatus.OK).json(error);
    } 
    finally {
    }
  }
  @Get('bom')
  getBom(@Res() res: Response) {
    var result$= this._neo4jService.getBom();
    result$.subscribe(result => {
      res.status(HttpStatus.OK).json(result);
    });
  }
}
