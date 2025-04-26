import { copyFile } from "fs/promises";
import { join } from "path";
import { FlywayCliDownloader } from "../../../src/cli/download/downloader/flyway-cli-downloader";
import { FlywayVersion } from "../../../src/internal/flyway-version";

export class MockFlywayCliDownloader implements FlywayCliDownloader {
        
    private compressedFilename: string = "test-flyway-commandline-8.5.0-macosx-x64.tar.gz";

    public async downloadFlywayCli(
        flywayVersion: FlywayVersion, 
        saveDirectory: string
    ): Promise<string> {
        // Test will only run on mac
        if(flywayVersion != FlywayVersion["V8.5.0"]) {
            throw new Error();
        }
        const path = "./test/unit/resources";
        const destinationPath = this.getFlywayCliDownloadLocation(flywayVersion, saveDirectory);
        await copyFile(join(path, this.compressedFilename), destinationPath);
        return destinationPath;
    }

    public getFlywayCliDownloadLocation(flywayVersion: FlywayVersion, saveDirectory: string): string {
        return join(saveDirectory, this.compressedFilename);
    }

    public getCompressedFlywayCliFileName(): string {
        return this.compressedFilename;
    }

}