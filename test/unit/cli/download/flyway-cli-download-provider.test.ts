import { expect } from "chai";
import { stat } from "fs/promises";
import { describe } from "mocha";
import { join } from "path";
import * as _temp from "temp";
import { DownloadProvider } from "../../../../src/cli/download/download-provider";
import { FlywayVersion } from "../../../../src";
import { MockFlywayCliDownloader } from "../../utility/mock-flyway-cli-downloader";

describe("FlywayCliDownloadProvider", () => {

    const temp = _temp.track();


    it("can download and extract a Flyway CLI", async () => {
        const temporaryDirectory = await temp.mkdir();
        const downloadProvider = new DownloadProvider(
            temporaryDirectory,
            new MockFlywayCliDownloader()
        );
        const cli = await downloadProvider.getFlywayCli(FlywayVersion["V8.5.0"]);
        expect(cli.executable.path).to.equal(join(temporaryDirectory, "flyway-8.5.0", "flyway"));
        await temp.cleanup();
    });


    it("won't error when a pre-existing Flyway CLI directory exists for the desired version at the location", async () => {
        const temporaryDirectory = await temp.mkdir();
        const downloadProvider = new DownloadProvider(
            temporaryDirectory,
            new MockFlywayCliDownloader()
        );
        
        // CLI has already been added to location and extracted
        await downloadProvider.getFlywayCli(FlywayVersion["V8.5.0"]);
        
        const cli = await downloadProvider.getFlywayCli(FlywayVersion["V8.5.0"]);
        expect(cli.executable.path).to.equal(join(temporaryDirectory, "flyway-8.5.0", "flyway"));
        await temp.cleanup();
    });

    
    it("won't error when a pre-existing archive exists at the location", async () => {
        const temporaryDirectory = await temp.mkdir();
        const mockFlywayCliDownloader = new MockFlywayCliDownloader();
        const downloadProvider = new DownloadProvider(
            temporaryDirectory,
            mockFlywayCliDownloader
        );

        // Archive has already been added to location
        await mockFlywayCliDownloader.downloadFlywayCli(FlywayVersion["V8.5.0"], temporaryDirectory);
        
        const cli = await downloadProvider.getFlywayCli(FlywayVersion["V8.5.0"]);
        expect(cli.executable.path).to.equal(join(temporaryDirectory, "flyway-8.5.0", "flyway"));
        await temp.cleanup();
    });


    it("will clean up .tar.gz file for Flyway CLI", async () => {
        const temporaryDirectory = await temp.mkdir();
        const mockFlywayCliDownloader = new MockFlywayCliDownloader();
        const downloadProvider = new DownloadProvider(
            temporaryDirectory,
            mockFlywayCliDownloader
        );

        // Archive has already been added to location
        await mockFlywayCliDownloader.downloadFlywayCli(FlywayVersion["V8.5.0"], temporaryDirectory);
        await stat(join(temporaryDirectory, mockFlywayCliDownloader.getCompressedFlywayCliFileName()));
        
        await downloadProvider.getFlywayCli(FlywayVersion["V8.5.0"]);
        
        let error;
        try {
            stat(join(temporaryDirectory, mockFlywayCliDownloader.getCompressedFlywayCliFileName()));
        }
        catch (err) {
            error = err;
        }

        expect(error).to.not.be.null;

        await temp.cleanup();
    });

});

