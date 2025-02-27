import { readFile } from "fs/promises";
import { join } from "path";
import { FlywayVersion, getFlywayCliVersionForHash } from "../../internal/flyway-version";
import {
    existsAndIsDirectory,
    findAllExecutableFilesInDirectory,
    getHostOperatingSystem
} from "../../utility/utility";
import md5 = require("md5");
import { FlywayExecutable } from "../flyway-cli";
import { glob } from "glob";


export class FlywayCliService {

    /*
        Given a directory path, determine if this is a flyway CLI and the version
    */
    static async getFlywayCliDetails(
        flywayCliDirectory: string
    ): Promise<{version: FlywayVersion, hash: string} | undefined> {

        if(!await existsAndIsDirectory(flywayCliDirectory)) {
            return undefined;
        }

        const hash = await this.getFlywayCliHash(flywayCliDirectory);

        if(hash == undefined) {
            return undefined;
        }

        try {
            return {
                version: getFlywayCliVersionForHash(hash),
                hash
            };
        }
        catch(err) {
            console.log(err)
            return undefined;
        }
    }

    /*
        Returns an MD5 hash of the Flyway CLI if the provided directory contains a Flyway CLI.
        Otherwise, returns undefined.
     */
    static async getFlywayCliHash(
        flywayCliDirectory: string
    ): Promise<string | undefined> {
        const paths = await FlywayCliService.getFlywayCommandLineFiles(flywayCliDirectory);

        if(paths.length == 0) {
            return undefined;
        }

        if(paths.length > 1) {
            throw new Error("Expected single filepath.");
        }

        const content = await readFile(paths[0]);

        if(content == null) {
            throw new Error();
        }

        return md5(content);
    }



    static async getExecutableFromFlywayCliDirectory(
        flywayCliDirectory: string
    ): Promise<FlywayExecutable> {
        const executableFiles = await findAllExecutableFilesInDirectory(flywayCliDirectory);

        if (executableFiles.length == 0) {
            throw new Error(`Unable to find an executable Flyway CLI in target directory: ${flywayCliDirectory}`);
        }

        if (executableFiles.length > 1) {

            const executableFilesWithCorrectName = executableFiles.filter(file => file.name.includes("flyway"));

            if (executableFilesWithCorrectName.length > 1) {
                throw new Error(
                    `Expecting only one executable Flyway CLI to be found. Instead found multiple executable files: ${executableFiles.map(ex => ex.name)}`
                );
            }
            else {
                join(flywayCliDirectory, executableFilesWithCorrectName[0].name);
            }
        }

        return new FlywayExecutable(join(flywayCliDirectory, executableFiles[0].name));
    }


    /*
        Specifically looks for the command-line JAR files to compute the hash.
        This archive file is a good candidate to compute the hash as it is easily accessible, represents the entire library & is unique per Flyway version.
     */
    private static async getFlywayCommandLineFiles(directory: string) {
        const mappedDirectory = getHostOperatingSystem() == 'windows' ? directory.replaceAll('\\', '/') : directory;
        const paths_a = await glob(`${mappedDirectory}/lib/community/flyway-commandline-*.jar`);
        const paths_b = await glob(`${mappedDirectory}/lib/flyway-commandline-*.jar`);

        return paths_a.concat(paths_b);
    }
}