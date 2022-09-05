import {describe, it} from 'mocha';
import {createCleanDatabase} from "./setup/setup";
import {Flyway, FlywayCliStrategy} from "../../dist";
import {expect} from "chai";
import {
    basicMigrations,
    failingMigrations,
    missingMigrations, multipleSchemaMigrations,
    outOfOrderMigrations,
    testConfiguration
} from "./utility/utility";


describe("info()", () => {

    beforeEach(() => {
        return createCleanDatabase();
    });


    it('can get info on applied migrations', async () => {

        const flyway = new Flyway(
            {
                ...testConfiguration,
                migrationLocations: [basicMigrations]
            }
        );

        await flyway.migrate();

        const response = await flyway.info();

        expect(response.success).to.be.true;
    });

});
