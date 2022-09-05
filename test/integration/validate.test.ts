import {describe, it} from 'mocha';
import {createCleanDatabase} from "./setup/setup";
import {Flyway, FlywayCliStrategy} from "../../dist";
import {expect} from "chai";
import {
    baselineMigrations,
    basicMigrations,
    failingMigrations, migrationsToBeValidated,
    missingMigrations, multipleSchemaMigrations,
    outOfOrderMigrations,
    testConfiguration
} from "./utility/utility";


describe("validate()", () => {

    beforeEach(() => {
        return createCleanDatabase();
    });


    it('can validate migrations passing validation', async () => {

        const flyway = new Flyway(
            {
                ...testConfiguration,
                migrationLocations: [`${migrationsToBeValidated}/part_1`]
            }
        );

        const response = await flyway.validate();

        expect(response.success).to.be.true;
    });



    it('can validate migrations failing validation', async () => {

        const flyway = new Flyway(
            {
                ...testConfiguration,
                migrationLocations: [`${migrationsToBeValidated}/part_2`]
            }
        );

        const response = await flyway.validate();

        expect(response.success).to.be.true;
    });

});
