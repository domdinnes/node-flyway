import { copyFile } from "fs/promises";
import { join } from "path";
import { FlywayCliDownloader } from "../../src/cli/download/downloader/flyway-cli-downloader";
import { FlywayVersion } from "../../src/internal/flyway-version";

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
        const path = "./test/resources";
        const destinationPath = join(saveDirectory, this.compressedFilename);
        await copyFile(join(path, this.compressedFilename), destinationPath);
        return destinationPath;
    }

    public getCompressedFlywayCliFileName(): string {
        return this.compressedFilename;
    }

}