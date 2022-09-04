import {describe, it} from 'mocha';
import {createCleanDatabase} from "./setup/setup";
import {Flyway} from "../../dist";
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




});
