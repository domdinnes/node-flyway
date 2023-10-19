import { readdir } from "fs/promises";
import path = require("path");
import { FlywayVersion } from "../../internal/flyway-version";
import { FlywayCliSource } from "../../types/types";
import { getLogger } from "../../utility/logger";
import { FlywayCli } from "../flyway-cli";
import { FlywayCliProvider } from "../flyway-cli-provider";
import { FlywayCliService } from "../service/flyway-cli-service";


export class FileSystemFlywayCliProvider extends FlywayCliProvider {
    
    protected static logger = getLogger("FileSystemFlywayCliProvider");
    
    constructor(
        private flywayCliDirectory: string
    ) {
        super()
    }

    /**
     *  Checks whether the provided directory is a matching Flyway CLI.
     *  Otherwise, checks nested directories to find a suitable Flyway CLI candidate.
     *  If no suitable CLI candidates are found, throws an exception.
     */
    public async getFlywayCli(
        flywayVersion: FlywayVersion
    ): Promise<FlywayCli | undefined> {

        const existingVersionDetails = await FlywayCliService.getFlywayCliDetails(this.flywayCliDirectory);
        
        if(existingVersionDetails != null) {
            if(existingVersionDetails.version == flywayVersion) {
                const executable = await FlywayCliService.getExecutableFromFlywayCliDirectory(this.flywayCliDirectory);
                return new FlywayCli(
                    existingVersionDetails.version,
                    FlywayCliSource.FILE_SYSTEM,
                    this.flywayCliDirectory,
                    executable,
                    existingVersionDetails.hash
                );
            }
            else {
                throw new Error(`Filesystem location is a Flyway CLI directory. However the Flyway CLI version is ${FlywayVersion[existingVersionDetails.version]} whereas the requested version is ${FlywayVersion[flywayVersion]}`);
            }
        }

        FileSystemFlywayCliProvider.logger.log(
            `Provided directory ${this.flywayCliDirectory} is not a Flyway CLI. Searching nested directories to find a Flyway CLI candidate with version ${FlywayVersion[flywayVersion]}.`
        );
        
        const otherVersions: FlywayVersion[] = [];

        // Iterate through all child directories searching for CLI with matching version
        const directories: string[] = (await readdir(this.flywayCliDirectory, { withFileTypes : true}))
            .filter(file => file.isDirectory())
            .map(dir => path.join(this.flywayCliDirectory, dir.name));

        const targetFlywayCli = (await Promise.all(
            directories.map(async directory => {
                const details = await FlywayCliService.getFlywayCliDetails(directory);

                if(details == null) {
                    return undefined;
                }

                if(this.flywayCliVersionsMatch(details.version, flywayVersion)) {
                    return {
                        directory,
                        hash: details.hash
                    };
                }
                else {
                    otherVersions.push(details.version);
                }
                
            })
        )).find(directory => !!directory);


        if(targetFlywayCli == null) {
            const error = otherVersions.length == 0
                ? new Error(`No child directory of ${this.flywayCliDirectory} is a Flyway CLI with version ${FlywayVersion[flywayVersion]}.`)
                : new Error(`No child directory of ${this.flywayCliDirectory} is a Flyway CLI with version ${FlywayVersion[flywayVersion]}. Only found versions: ${otherVersions.map(version => FlywayVersion[version])}.`);
            throw error;
            // Suggest either enabling downloads or adding a new version to the source directory
        }
        
        const executable = await FlywayCliService.getExecutableFromFlywayCliDirectory(targetFlywayCli.directory);

        return new FlywayCli(
            flywayVersion,
            FlywayCliSource.FILE_SYSTEM,
            targetFlywayCli.directory,
            executable,
            targetFlywayCli.hash
        );
    }


    private flywayCliVersionsMatch(
        version1: FlywayVersion | undefined, 
        version2: FlywayVersion | undefined
    ): boolean {    
        FileSystemFlywayCliProvider.logger.log(`Comparing Flyway versions. Target version: ${version2 && FlywayVersion[version2]}. Found version: ${version1 && FlywayVersion[version1]}.`);

        if(version1 == null || version2 == null) {
            return false;
        }
        return version1 == version2;
    }
    
}
