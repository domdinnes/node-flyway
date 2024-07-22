import {describe, it} from 'mocha';
import {cleanDatabase} from "./setup/setup";
import {Flyway, FlywayCliStrategy} from "../../src";
import {expect} from "chai";
import {
    basicMigrations, disconnectDatabase,
    failingMigrations,
    getDatabaseConnection,
    missingMigrations,
    multipleSchemaMigrations,
    outOfOrderMigrations,
    testConfiguration
} from "./utility/utility";


describe("migrate()", () => {

    beforeEach(async () => {
        await cleanDatabase();
    });

    afterEach(async () => {
        await disconnectDatabase();
    })


    it('can perform a basic migrate', async () => {

        const flyway = new Flyway(
            {
                ...testConfiguration,
                migrationLocations: [basicMigrations]
            }
        );

        const response = await flyway.migrate();

        expect(response.success).to.be.true;
    });


    it('can perform a basic migrate specifying connect retries', async () => {

        const flyway = new Flyway(
            {
                ...testConfiguration,
                migrationLocations: [basicMigrations],
                advanced: {
                    connectRetries: 1,
                    connectRetriesInterval: 2
                }
            }
        );

        const response = await flyway.migrate();

        expect(response.success).to.be.true;
    });


    it('can perform a basic migrate with initial sql', async () => {

        const flyway = new Flyway(
            {
                ...testConfiguration,
                defaultSchema: "random",
                migrationLocations: [basicMigrations],
                advanced: {
                    createSchemas: true,
                    // initSql: "CREATE TABLE public.some_table (id INTEGER PRIMARY KEY, some_column TEXT NOT NULL);"
                }
            }
        );

        const response = await flyway.migrate();

        expect(response.success).to.be.true;
    });


    it('can perform out of order migrations', async () => {

        const flyway = new Flyway(
            {
                ...testConfiguration,
                migrationLocations: [`${outOfOrderMigrations}/part_1`],
            }
        );


        await flyway.migrate();

        const response = await flyway.migrate(
            {
                migrationLocations: [`${outOfOrderMigrations}/part_1`, `${outOfOrderMigrations}/part_2`],
                advanced: {
                    applyNewMigrationsOutOfOrder: true
                }
            }
        );

        expect(response.success).to.be.true;
    });


    it('can specify execution strategy', async () => {

        const flyway = new Flyway(
            {
                ...testConfiguration,
                migrationLocations: [basicMigrations]
            },
            {
                flywayCliStrategy: FlywayCliStrategy.LOCAL_CLI_WITH_DOWNLOAD_FALLBACK
            }
        );

        const response = await flyway.migrate();

        expect(response.success).to.be.true;
    });


    it('can use config files', async () => {

        const flyway = new Flyway(
            {
                url: testConfiguration.url,
                user: testConfiguration.user,
                migrationLocations: [basicMigrations],
                advanced: {
                    configFileEncoding: "UTF-8",
                    configFiles: ["test/integration/config-files/example-1.conf", "test/integration/config-files/example-2.conf"],
                    connectRetries: 2,
                    connectRetriesInterval: 2
                }
            }
        );

        const response = await flyway.migrate();

        expect(response.success).to.be.true;
    });

    it('can group pending migrations', async () => {

        const flyway = new Flyway(
            {
                ...testConfiguration,
                migrationLocations: [basicMigrations]
            }
        );

        const response1 = await flyway.migrate(
            {
                advanced: {
                    groupPendingMigrations: true,
                    migrationEncoding: "UTF-8",
                    installedBy: "Dom Dinnes",
                    mixed: true
                }
            }
        );

        expect(response1.success).to.be.true;

        const response2 = await flyway.migrate(
            {
                migrationLocations: [failingMigrations],
                advanced: {
                    groupPendingMigrations: true,
                    migrationEncoding: "UTF-8",
                    installedBy: "Dom Dinnes",
                    mixed: true
                }
            }
        );

        expect(response2.success).to.be.false;

    });



    it('can specify to fail on missing locations', async () => {

        const flyway = new Flyway(
            {
                ...testConfiguration,
                migrationLocations: [basicMigrations, missingMigrations],
                advanced: {
                    failOnMissingMigrationLocations: true
                }
            }
        );

        const response = await flyway.migrate();

        expect(response.success).to.be.false;

    });





    it('can specify the schema history table', async () => {

        const flyway = new Flyway(
            {
                ...testConfiguration,
                migrationLocations: [basicMigrations],
                advanced: {
                    schemaHistoryTable: "renamed_schema_history"
                }
            }
        );

        const response = await flyway.migrate();

        expect(response.success).to.be.true;

    });



    it('can specify the migration target', async () => {

        const flyway = new Flyway(
            {
                ...testConfiguration,
                migrationLocations: [basicMigrations],
                advanced: {
                    target: "2"
                }
            }
        );

        const response = await flyway.migrate();

        expect(response.success).to.be.true;

    });


    it('can perform migrations across multiple schemas', async () => {

        const flyway = new Flyway(
            {
                ...testConfiguration,
                migrationLocations: [multipleSchemaMigrations],
                advanced: {
                    schemas:["random"]
                }
            }
        );

        const response = await flyway.migrate();

        expect(response.success).to.be.true;

    });


    /*
        Handles the case where a generated Flyway command-line string should escape all substrings that can be interpreted
        by the shell as anything other than a string literal.

        This test case includes a shell variable within the configuration properties.
        The desired behaviour is that this should be escaped and treated as a string literal.

     */
    xit('can migrate a schema when configuration contains shell-expansion characters', async () => {

        // Given
        // ... the schemas property includes a shell variable
        const flyway = new Flyway(
            {
                ...testConfiguration,
                migrationLocations: [basicMigrations],
                advanced: {
                    schemas: [
                        "__test_$PWD_schema"
                    ]
                }
            }
        );

        // When
        // ... the Flyway migrate command is applied
        await flyway.migrate();



        // Then
        // ... a schema exists with the exact name specified in the configuration
        const connection = await getDatabaseConnection(
            testConfiguration.password,
            testConfiguration.port
        );

        const results =await connection.query(`
            SELECT CATALOG_NAME, SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = '__test_$PWD_schema'
        `);

        expect(results.rowCount).to.equal(1);
    });



});
