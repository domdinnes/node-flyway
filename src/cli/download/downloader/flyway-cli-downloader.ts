import download = require("download");
import { join } from "path";
import { FlywayVersion, getUrlComponentsForFlywayVersion } from "../../../internal/flyway-version";

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

    public async downloadFlywayCli(
        flywayVersion: FlywayVersion,
        saveDirectory: string
    ): Promise<string> {
        const operatingSystem = FlywayCliUrlBuilder.getUrlRepresentationOfHostOperatingSystem();
        const url = FlywayCliUrlBuilder.buildUrl(flywayVersion, operatingSystem);
        await download(url.url, saveDirectory, {});
        return join(saveDirectory, url.fileName);
    }

}

type OperatingSystem = "macosx" | "linux" | "windows";


export class FlywayCliUrlBuilder {

    public static getUrlRepresentationOfHostOperatingSystem(): OperatingSystem {
        const platform = process.platform;

        if(platform == "win32") {
            return "windows";
        }
        if(platform == "darwin") {
            return "macosx";
        }
        return "linux";
    }

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