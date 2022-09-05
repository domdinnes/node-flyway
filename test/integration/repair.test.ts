import {describe, it} from 'mocha';
import {createCleanDatabase} from "./setup/setup";
import {Flyway, FlywayCliStrategy} from "../../dist";
import {expect} from "chai";
import {
    baselineMigrations,
    basicMigrations,
    failingMigrations, migrationsToBeRepaired, migrationsToBeValidated,
    missingMigrations, multipleSchemaMigrations,
    outOfOrderMigrations,
    testConfiguration
} from "./utility/utility";


describe("repair()", () => {

    beforeEach(() => {
        return createCleanDatabase();
    });


    it('can repair a database that requires a repair', async () => {

        const flyway = new Flyway(
            {
                ...testConfiguration,
                migrationLocations: [`${migrationsToBeRepaired}/part_1`]
            }
        );

        await flyway.migrate();

        const response = await flyway.repair(
            {migrationLocations: ["migrations/7_migrations_to_be_repaired/part_2"]}
        );

        expect(response.success).to.be.true;
    });




    it('can gracefully handle a database where no repair is required', async () => {

        const flyway = new Flyway(
            {
                ...testConfiguration,
                migrationLocations: [`${migrationsToBeRepaired}/part_1`]
            }
        );

        await flyway.migrate();

        const response = await flyway.repair();

        expect(response.success).to.be.true;
    });

});
