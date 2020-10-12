import { ConfigurationProvider } from './../../provider/configuration.provider';
import { Injectable } from '@nestjs/common';
import * as neo4j from "neo4j-driver";
import { Observable, from } from 'rxjs';
import { SystemConfigurationEnum } from 'src/enum/system-configuration.enum';

@Injectable()
export class Neo4jService {

    private _driver: neo4j.Driver;
    public constructor(
        private _configurationProvider: ConfigurationProvider
    ) {
        const link = this._configurationProvider.provide(SystemConfigurationEnum.Neo4jBoltLink);
        const dbUser = this._configurationProvider.provide(SystemConfigurationEnum.DbUser);
        const dbPassword = this._configurationProvider.provide(SystemConfigurationEnum.DbPasswort);

        this._driver = neo4j.driver(link, neo4j.auth.basic(dbUser, dbPassword));
    }

    public provideSession(): neo4j.Session {
        return this._driver.session();
    }
    private async createNewEntryPromise(): Promise<neo4j.QueryResult> {
        try {
            var session = this._driver.session();
            return await session.writeTransaction(tx =>
                tx.run(
                    'CREATE (a:Greeting) SET a.message = $message RETURN a.message + ", from node " + id(a)',
                    { message: 'hello, Daniel' }
                )
            )
        } catch(err){
            console.log(err);
        } finally {
            session.close()
        }

    }

    private async getAllMaterial(): Promise<neo4j.QueryResult> {
        try {
            var session = this._driver.session();
            return await session.writeTransaction(tx =>
                tx.run(
                    'MATCH(m:Material) RETURN m'
                )
            )
        } finally {
            session.close()
        }

    }
    public createNewEntryObservable(): Observable<neo4j.QueryResult> {
        var result = from(this.createNewEntryPromise());
        return result;
    }
    public getAllMAterialObservable(): Observable<neo4j.QueryResult> {
        var result = from(this.getAllMaterial());
        var parentIds = [];
        result.subscribe((data) => {
            for (const record of data.records) {
                // console.log(record.get("parentID"));
                var arr = Array.from(record.values()) as neo4j.Node[];
                for (const entry of arr) {
                    var parentId = entry.properties['parentID'];
                    if (!parentId) {
                        continue;
                    }
                    if (parentIds.filter((id) => id === parentId).length == 0) {
                        parentIds.push(parentId);
                    }
                }

            }
            for (const id of parentIds) {
                var query = "MATCH (m:Material {id: '" + id + "'})" +
                    "MATCH (m2:Material {parentID:'" + id + "'})" +
                    "CREATE (m) <-[:isParent]-(m2)" +
                    "CREATE (m) -[:isChildren]->(m2)" +
                    "Return m2, m"
                var observable = from(this.runQuery(query));
                observable.subscribe((data) => {
                    console.log(data);
                });
            }

        });
        return result;
    }
    private async runQuery(query: string): Promise<neo4j.QueryResult> {
        try {
            var session = this._driver.session();
            return await session.writeTransaction(tx =>
                tx.run(
                    query
                )
            )
        } finally {
            session.close()
        }
    }

    public getBom(): Observable<neo4j.QueryResult>{
        var query = "MATCH (m:Material{parentID: '0'})-[r:isChildren]->(nodes)-->(n2)RETURN m, nodes, n2"
        return from(this.runQuery(query));
    }
    // private getParentNode(records: neo4j.Record[], parentId: string) {
    //     for (const record of records) {
    //         // console.log(record.get("parentID"));
    //         var arr = Array.from(record.values()) as neo4j.Node[];
    //         for (const entry of arr) {
    //             var id = entry.properties['id'];
    //             if (id === parentId) {

    //             }
    //         }
    //     }
    // }
    // private CreateRelationShip(nodeParent: neo4j.Node, nodeChildren)
}
