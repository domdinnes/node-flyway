import { join } from "path";
import { FlywayVersion, getUrlComponentsForFlywayVersion } from "../../../internal/flyway-version";
import {DownloaderHelper} from "node-downloader-helper";
import {getLogger, Logger} from "../../../utility/logger";
import {getHostOperatingSystem, OperatingSystem} from "../../../utility/utility";

/*
    Takes a flyway version and a save directory.
    Downloads a compressed flyway CLI directory and saves it to the specified directory.
    Return the path of the compressed version
*/

export interface FlywayCliDownloader {

    downloadFlywayCli(
        flywayVersion: FlywayVersion, 
        saveDirectory: string
    ): Promise<string>

}

export class DirectFlywayCliDownloader implements FlywayCliDownloader {

    private logger: Logger = getLogger("DirectFlywayCliDownloader");


    public async downloadFlywayCli(
        flywayVersion: FlywayVersion,
        saveDirectory: string
    ): Promise<string> {
        const operatingSystem = getHostOperatingSystem();
        const url = FlywayCliUrlBuilder.buildUrl(flywayVersion, operatingSystem);
        await this.download(url.url, saveDirectory);
        return join(saveDirectory, url.fileName);
    }

    private async download(url: string, saveDirectory: string): Promise<void> {
        const downloader = new DownloaderHelper(url, saveDirectory);
        return new Promise(
            (resolve, reject) => {
                downloader.on("end", () =>resolve());
                downloader.on("error", (err) => reject(err));
                downloader.on("progress.throttled", (downloadEvents) => {
                    const percentageComplete = downloadEvents.progress < 100 ? downloadEvents.progress.toPrecision(2) : 100;
                    this.logger.log(`Downloaded: ${percentageComplete}%`)
                });
                downloader.start();
            }
        );

    }

}



export class FlywayCliUrlBuilder {


    public static buildUrl(
        flywayVersion: FlywayVersion,
        operatingSystem: OperatingSystem
    ): {url: string, fileName: string} {
        const urlComponents = getUrlComponentsForFlywayVersion(flywayVersion);
        const fileName = this.buildFilename(flywayVersion, operatingSystem);
        return {
            url: `https://repo1.maven.org/maven2/org/flywaydb/flyway-commandline/${urlComponents.versionString}/${fileName}`,
            fileName
        }
    }

    private static buildFilename(
        flywayVersion: FlywayVersion,
        operatingSystem: OperatingSystem
    ): string {
        const urlComponents = getUrlComponentsForFlywayVersion(flywayVersion);

        if(urlComponents.operatingSystemSpecificUrl) {
            return operatingSystem != "windows"
                ? `flyway-commandline-${urlComponents.versionString}-${operatingSystem}-x64.tar.gz`
                : `flyway-commandline-${urlComponents.versionString}-${operatingSystem}-x64.zip`
        }

        return `flyway-commandline-${urlComponents.versionString}.tar.gz`;
    }
}


/**
 * Downloads CLI via Maven.
 */
export class MavenFlywayCliDownloader implements FlywayCliDownloader {
    
    downloadFlywayCli(
        flywayVersion: FlywayVersion, saveDirectory: string
    ): Promise<string> {
        throw new Error("Method not implemented.");
    }

}