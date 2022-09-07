import {describe, it} from 'mocha';
import {cleanDatabase} from "./setup/setup";
import {Flyway} from "../../src";
import {expect} from "chai";
import {migrationsToBeValidated, testConfiguration} from "./utility/utility";


describe("validate()", () => {

    beforeEach(() => {
        return cleanDatabase();
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
