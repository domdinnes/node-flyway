import {describe, it} from 'mocha';
import {createCleanDatabase} from "./setup/setup";
import {Flyway, FlywayCliStrategy} from "../../dist";
import {expect} from "chai";
import {
    baselineMigrations,
    basicMigrations,
    failingMigrations,
    missingMigrations, multipleSchemaMigrations,
    outOfOrderMigrations,
    testConfiguration
} from "./utility/utility";


describe("baseline()", () => {

    beforeEach(() => {
        return createCleanDatabase();
    });


    it('can baseline a database at a particular version', async () => {

        const flyway = new Flyway(
            {
                ...testConfiguration,
                migrationLocations: [baselineMigrations]
            }
        );

        await flyway.baseline(
            {
                advanced: {
                    baselineDescription: "This is the baseline description",
                    baselineVersion: "2"
                }
            }
        );

        const response = await flyway.migrate();

        expect(response.success).to.be.true;
    });

});
