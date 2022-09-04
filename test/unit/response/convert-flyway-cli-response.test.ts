import {describe, it} from 'mocha';
import {ConvertJsonToResponse} from "../../../src/response/json-to-response";
import {expect} from "chai";

describe("ConvertFlywayCliResponse", () => {


    it("can convert to migrate response without additional properties",() => {

        const exampleJsonWithExtraFields = {
            "error": {
                "errorCode": "ERROR",
                "message": "Migration V4__NaughtyFailingMigration.sql failed\n------------------------------------------------\nSQL State  : 42P01\nError Code : 0\nMessage    : ERROR: relation \"this_table_does_not_exist\" does not exist\n  Position: 15\nLocation   : migrations/3_failing_migrations/V4__NaughtyFailingMigration.sql (/Users/dominic.dinnes/code/node-flyway-local-testing/migrations/3_failing_migrations/V4__NaughtyFailingMigration.sql)\nLine       : 1\nStatement  : SELECT * FROM this_table_does_not_exist\n",
                "stackTrace": null
            },
            "initialSchemaVersion": null,
            "targetSchemaVersion": null,
            "schemaName": "",
            "migrations": [
                {
                    "category": "Versioned",
                    "version": "1",
                    "description": "TestMigration",
                    "type": "SQL",
                    "filepath": "/Users/dominic.dinnes/code/node-flyway-local-testing/migrations/3_failing_migrations/V1__PreBaselineMigration.sql",
                    "executionTime": 108
                },
                {
                    "category": "Versioned",
                    "version": "2",
                    "description": "AnotherTestMigration",
                    "type": "SQL",
                    "filepath": "/Users/dominic.dinnes/code/node-flyway-local-testing/migrations/3_failing_migrations/V2__AnotherTestMigration.sql",
                    "executionTime": 12
                },
                {
                    "category": "Versioned",
                    "version": "3",
                    "description": "YetAnotherTestMigration",
                    "type": "SQL",
                    "filepath": "/Users/dominic.dinnes/code/node-flyway-local-testing/migrations/3_failing_migrations/V3__YetAnotherTestMigration.sql",
                    "executionTime": 7
                }
            ],
            "migrationsExecuted": 0,
            "success": false,
            "flywayVersion": "8.5.13",
            "database": "postgres",
            "warnings": [],
            "operation": "migrate"
        };


        const convertedResponse = ConvertJsonToResponse.toFlywayMigrateResponse(JSON.stringify(exampleJsonWithExtraFields));

        expect(convertedResponse).to.deep.equal(
            {
                error: {
                    "errorCode": "ERROR",
                    "message": "Migration V4__NaughtyFailingMigration.sql failed\n------------------------------------------------\nSQL State  : 42P01\nError Code : 0\nMessage    : ERROR: relation \"this_table_does_not_exist\" does not exist\n  Position: 15\nLocation   : migrations/3_failing_migrations/V4__NaughtyFailingMigration.sql (/Users/dominic.dinnes/code/node-flyway-local-testing/migrations/3_failing_migrations/V4__NaughtyFailingMigration.sql)\nLine       : 1\nStatement  : SELECT * FROM this_table_does_not_exist\n",
                    "stackTrace": null
                },
                flywayResponse: {
                    "initialSchemaVersion": null,
                    "targetSchemaVersion": null,
                    "schemaName": "",
                    "migrations": [
                        {
                            "category": "Versioned",
                            "version": "1",
                            "description": "TestMigration",
                            "type": "SQL",
                            "filepath": "/Users/dominic.dinnes/code/node-flyway-local-testing/migrations/3_failing_migrations/V1__PreBaselineMigration.sql",
                            "executionTime": 108
                        },
                        {
                            "category": "Versioned",
                            "version": "2",
                            "description": "AnotherTestMigration",
                            "type": "SQL",
                            "filepath": "/Users/dominic.dinnes/code/node-flyway-local-testing/migrations/3_failing_migrations/V2__AnotherTestMigration.sql",
                            "executionTime": 12
                        },
                        {
                            "category": "Versioned",
                            "version": "3",
                            "description": "YetAnotherTestMigration",
                            "type": "SQL",
                            "filepath": "/Users/dominic.dinnes/code/node-flyway-local-testing/migrations/3_failing_migrations/V3__YetAnotherTestMigration.sql",
                            "executionTime": 7
                        }
                    ],
                    "migrationsExecuted": 0,
                    "flywayVersion": "8.5.13",
                    "database": "postgres",
                    "warnings": [],
                    "operation": "migrate"
                }
            }
        );
    });





    it("can handle parsing error",() => {

        const exampleJsonWithExtraFields = {
            "initialSchemaVersion": null,
            "targetSchemaVersion": null,
            "schemaName": "",
            "migrations": [
                {
                    "category": "Versioned",
                    "version": "1",
                    "description": "TestMigration",
                    "type": "SQL",
                    "filepath": "/Users/dominic.dinnes/code/node-flyway-local-testing/migrations/3_failing_migrations/V1__PreBaselineMigration.sql",
                    "executionTime": 108
                }
            ],
            "migrationsExecuted": 0,
            "success": true,
            "flywayVersion": "8.5.13",
            "database": "postgres",
            "warnings": []
        };


        const convertedResponse = ConvertJsonToResponse.toFlywayMigrateResponse(JSON.stringify(exampleJsonWithExtraFields));

        expect(convertedResponse).to.deep.equal(
            {
                "error": {
                    "errorCode": "UNABLE_TO_PARSE_RESPONSE",
                    "message": "Command successful but unable to parse Flyway response."
                }
            }
        );
    });

})