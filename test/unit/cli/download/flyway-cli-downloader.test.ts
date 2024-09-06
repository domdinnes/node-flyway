import {describe} from "mocha";
import { expect } from "chai";
import {FlywayCliUrlBuilder} from "../../../../src/cli/download/downloader/flyway-cli-downloader";
import {FlywayVersion} from "../../../../src";

describe("FlywayCliDownloader", () => {

});



describe("FlywayCliUrlBuilder", () => {

    it("can build a correct URL for different Flyway CLI versions", async () => {
        // V4.0.0
        const v400 = FlywayCliUrlBuilder.buildUrl(FlywayVersion["V4.0.0"], "macosx", "x64");
        expect(v400.url).to.equal("https://repo1.maven.org/maven2/org/flywaydb/flyway-commandline/4.0/flyway-commandline-4.0-macosx-x64.tar.gz");

        // V5.0.0
        const v500 = FlywayCliUrlBuilder.buildUrl(FlywayVersion["V5.0.0"], "macosx", "x64");
        expect(v500.url).to.equal("https://repo1.maven.org/maven2/org/flywaydb/flyway-commandline/5.0.0/flyway-commandline-5.0.0.tar.gz");

        // V6.0.1
        const v601 = FlywayCliUrlBuilder.buildUrl(FlywayVersion["V6.0.1"], "windows", "x64");
        expect(v601.url).to.equal("https://repo1.maven.org/maven2/org/flywaydb/flyway-commandline/6.0.1/flyway-commandline-6.0.1-windows-x64.zip");

        // V7.11.2
        const v7112 = FlywayCliUrlBuilder.buildUrl(FlywayVersion["V7.11.2"], "linux", "x64");
        expect(v7112.url).to.equal("https://repo1.maven.org/maven2/org/flywaydb/flyway-commandline/7.11.2/flyway-commandline-7.11.2-linux-x64.tar.gz");

        // V8.5.6
        const v856 = FlywayCliUrlBuilder.buildUrl(FlywayVersion["V8.5.6"], "linux", "x64");
        expect(v856.url).to.equal("https://repo1.maven.org/maven2/org/flywaydb/flyway-commandline/8.5.6/flyway-commandline-8.5.6-linux-x64.tar.gz");

        // V9.22.3
        const v9223 = FlywayCliUrlBuilder.buildUrl(FlywayVersion["V9.22.3"], "macosx", "arm64");
        expect(v9223.url).to.equal("https://repo1.maven.org/maven2/org/flywaydb/flyway-commandline/9.22.3/flyway-commandline-9.22.3-macosx-arm64.tar.gz");
    });

});
