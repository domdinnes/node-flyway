import {describe, it} from 'mocha';
import {cleanDatabase} from "./setup/setup";
import {Flyway} from "../../src";
import {expect} from "chai";
import {basicMigrations, testConfiguration} from "./utility/utility";


describe("clean()", () => {

    beforeEach(() => {
        return cleanDatabase();
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
