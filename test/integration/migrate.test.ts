import {describe, it} from 'mocha';
import {createCleanDatabase} from "./setup/setup";
import {Flyway, FlywayCliStrategy} from "../../dist";
import {expect} from "chai";
import {testConfiguration} from "./utility/utility";


describe("migrate()", ()  => {

    beforeEach(() => {
        return createCleanDatabase();
    });


    it('can perform a basic migrate', async () => {

        const flyway = new Flyway(
            {
                ...testConfiguration,
                migrationLocations: ["test/integration/migrations/1_basic_migrations"]
            }
        );

        const response = await flyway.migrate();

        //logger.log(inspectResponse(response));

        expect(response.success).to.be.true;
    });




    it('can perform a basic migrate specifying connect retries', async () => {

        const flyway = new Flyway(
            {
                ...testConfiguration,
                migrationLocations: ["test/integration/migrations/1_basic_migrations"],
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
                migrationLocations: ["migrations/1_basic_migrations"],
                advanced: {
                    createSchemas: true,
                    initSql: "CREATE TABLE public.some_table (id INTEGER PRIMARY KEY, some_column TEXT NOT NULL);"
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
                migrationLocations: ["migrations/2_out_of_order_migrations/part_1"]
            }
        );


        await flyway.migrate();

        const response = await flyway.migrate(
            {
                migrationLocations: ["migrations/2_out_of_order_migrations/part_1", "migrations/2_out_of_order_migrations/part_2"],
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
                migrationLocations: ["test/integration/migrations/1_basic_migrations"]
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
                url:"jdbc:postgresql://localhost:2575/postgres",
                user: "postgres",
                migrationLocations: ["migrations/1_basic_migrations"],
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


});
