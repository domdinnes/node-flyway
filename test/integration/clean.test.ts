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


describe("clean()", () => {

    beforeEach(() => {
        return createCleanDatabase();
    });


    it('can perform a basic clean', async () => {

        const flyway = new Flyway(
            {
                ...testConfiguration,
                migrationLocations: [basicMigrations]
            }
        );

        await flyway.migrate();

        const response = await flyway.clean({advanced: {cleanDisabled: false}});


        expect(response.success).to.be.true;
    });



    it('clean will fail when it is disabled', async () => {

        const flyway = new Flyway(
            {
                ...testConfiguration,
                migrationLocations: [basicMigrations]
            }
        );

        await flyway.migrate();

        const response = await flyway.clean();

        expect(response.success).to.be.false;
    });

});
