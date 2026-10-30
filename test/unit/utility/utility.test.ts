import {expect} from "chai";
import {describe, it} from 'mocha';
import {execute} from "../../../src/utility/utility";

describe("execute", () => {

    it("returns stdout when the command succeeds", async () => {
        const response = await execute(`node -e "process.stdout.write('output')"`, {});

        expect(response).to.deep.equal({success: true, response: "output"});
    });


    it("returns stdout when the command fails and writes to stdout", async () => {
        const response = await execute(`node -e "process.stdout.write('{\\"error\\":{}}'); process.exit(1)"`, {});

        expect(response).to.deep.equal({success: false, response: `{"error":{}}`});
    });


    it("returns stderr when the command fails without writing to stdout", async () => {
        const response = await execute(`node -e "process.stderr.write('failure'); process.exit(1)"`, {});

        expect(response).to.deep.equal({success: false, response: "failure"});
    });

});
