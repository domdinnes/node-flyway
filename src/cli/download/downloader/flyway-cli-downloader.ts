import {join} from "path";
import {FlywayVersion, getUrlComponentsForFlywayVersion} from "../../../internal/flyway-version";
import {DownloaderHelper} from "node-downloader-helper";
import {getLogger, Logger} from "../../../utility/logger";
import {
    CpuArchitecture,
    getHostCpuArchitecture,
    getHostOperatingSystem,
    OperatingSystem
} from "../../../utility/utility";

/*
    Takes a flyway version and a save directory.
    Downloads a compressed flyway CLI directory and saves it to the specified directory.
    Return the path of the compressed version
*/

export interface FlywayCliDownloader {

    getFlywayCliDownloadLocation(
        flywayVersion: FlywayVersion,
        saveDirectory: string
    ): string

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
        const url = this.buildUrl(flywayVersion);
        await this.download(url.url, saveDirectory);
        return join(saveDirectory, url.fileName);
    }

    getFlywayCliDownloadLocation(flywayVersion: FlywayVersion, saveDirectory: string): string {
        const url = this.buildUrl(flywayVersion);
        return join(saveDirectory, url.fileName);
    }

    private buildUrl(flywayVersion: FlywayVersion): FlywayCliUrl {
        const operatingSystem = getHostOperatingSystem();
        const cpuArchitecture = getHostCpuArchitecture();
        return FlywayCliUrlBuilder.buildUrl(flywayVersion, operatingSystem, cpuArchitecture);
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

export type FlywayCliUrl = {
    url: string, fileName: string
};

export class FlywayCliUrlBuilder {

    public static buildUrl(
        flywayVersion: FlywayVersion,
        operatingSystem: OperatingSystem,
        cpuArchitecture: CpuArchitecture
    ): FlywayCliUrl  {
        const urlComponents = getUrlComponentsForFlywayVersion(flywayVersion);
        const fileName = this.buildFilename(flywayVersion, operatingSystem, cpuArchitecture);
        
        return {
            url: `https://repo1.maven.org/maven2/org/flywaydb/flyway-commandline/${urlComponents.versionString}/${fileName}`,
            fileName
        }
    }

    private static buildFilename(
        flywayVersion: FlywayVersion,
        operatingSystem: OperatingSystem,
        cpuArchitecture: CpuArchitecture
    ): string {
        const urlComponents = getUrlComponentsForFlywayVersion(flywayVersion);

        if(urlComponents.operatingSystemSpecificUrl) {
            return operatingSystem != "windows"
                ? `flyway-commandline-${urlComponents.versionString}-${operatingSystem}-${cpuArchitecture}.tar.gz`
                : `flyway-commandline-${urlComponents.versionString}-${operatingSystem}-${cpuArchitecture}.zip`
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

    getFlywayCliDownloadLocation(flywayVersion: FlywayVersion, saveDirectory: string): string {
        throw new Error("Method not implemented.");
    }



}
