import {describe, it} from 'mocha';
import {Flyway} from "../../src";
import {expect} from "chai";
import {baselineMigrations, testConfiguration} from "./utility/utility";
import {cleanDatabase} from "./setup/setup";


describe("baseline()", () => {

    beforeEach(() => {
        return cleanDatabase();
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
