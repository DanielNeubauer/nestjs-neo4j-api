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
      // var session = this._neo4jService.provideSession();
      // var create$ = from(session.writeTransaction(tx =>
      //   tx.run(
      //     'CREATE (a:Greeting) SET a.message = $message RETURN a.message + ", from node " + id(a)',
      //     { message: 'hello, world' }
      //   )
      // ));
      // create$.subscribe((result) => {
      //   const singleRecord = result.records[0]
      //   const node = singleRecord.get(0)
      //   session.close()
      // });


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
