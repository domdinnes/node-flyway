import {describe, it} from 'mocha';
import {cleanDatabase, logger} from "./setup/setup";
import {Flyway, FlywayCliStrategy} from "../../src";
import {expect} from "chai";
import {
    basicMigrations,
    disconnectDatabase,
    failingMigrations,
    getDatabaseConnection,
    missingMigrations,
    multipleSchemaMigrations,
    outOfOrderMigrations,
    testConfiguration
} from "./utility/utility";
import {DEFAULT_FLYWAY_VERSION} from "../../src/internal/defaults";
import {DirectFlywayCliDownloader} from "../../src/cli/download/downloader/flyway-cli-downloader";
import _temp from "temp";
import {enableLogging} from "../../src/utility/logger";

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
    it('can migrate a schema when configuration contains shell-expansion characters', async () => {

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

    /*
        This test verifies a fix against the following bug:

        Partially completed/duplicate downloads which haven't been cleaned up will cause an error to occur.
        This will happen when one or more download attempts are interrupted, leaving incomplete files in the download directory.
        The first download attempt will leave a file with name `flyway-cli-9.0.0.tar.gz`, the second `flyway-cli-9.0.0.tar.gz (1)` and so on.
        When the next complete download happens, the process will fail at the extract stage as the extraction url will reference an incorrect url.
        The url of the completed download will be: `flyway-cli-9.0.0.tar.gz (2)` whereas the extraction url will reference flyway-cli-9.0.0.tar.gz which refers to the first incomplete download.
    */
    it('can download a Flyway CLI and perform a basic migration when incomplete download exists in CLI', async () => {

        // Given
        // ... a previously downloaded version that hasn't been cleaned up
        const defaultVersion = DEFAULT_FLYWAY_VERSION;

        enableLogging("default");

        const flywayDownloader = new DirectFlywayCliDownloader();

        const temp = _temp.track();

        await flywayDownloader.downloadFlywayCli(
            defaultVersion, temp.dir
        )

        // When
        // ... an attempt is made to download and migrate a flyway cli
        const flyway = new Flyway(
            {
                ...testConfiguration,
                migrationLocations: [basicMigrations]
            },
            {
                flywayCliStrategy: FlywayCliStrategy.DOWNLOAD_CLI_ONLY
            }
        );

        // Then
        // ... the migration attempt is successful
        const response = await flyway.migrate();

        expect(response.success).to.be.true;
    });


});
