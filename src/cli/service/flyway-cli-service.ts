/*
    Given a directory path, determine if this is a flyway CLI and the version
*/

import { readFile } from "fs/promises";
import { join } from "path";
import { FlywayVersion, getFlywayCliVersionForHash } from "../../internal/flyway-version";
import { existsAndIsDirectory, findAllExecutableFilesInDirectory, globPromise } from "../../utility/utility";
import md5 = require("md5");
import { FlywayExecutable } from "../flyway-cli";


export class FlywayCliService {

    static async getFlywayCliDetails(
        directory: string
    ): Promise<{version: FlywayVersion, hash: string} | undefined> {

        if(!existsAndIsDirectory(directory)) {
            return undefined;
        }

        const hash = await this.getFlywayCliHash(directory);

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

    static async getFlywayCliHash(
        directory: string
    ): Promise<string | undefined> {
        const paths = await FlywayCliService.getFlywayCommandLineFiles(directory);

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



    static async getExecutableFromFlywayCli(
        directory: string
    ): Promise<FlywayExecutable> {
        const executableFiles = await findAllExecutableFilesInDirectory(directory);

        if (executableFiles.length == 0) {
            throw new Error(`Unable to find an executable Flyway CLI in target directory: ${directory}`);
        }

        if (executableFiles.length > 1) {

            const executableFilesWithCorrectName = executableFiles.filter(file => file.name.includes("flyway"));

            if (executableFilesWithCorrectName.length > 1) {
                throw new Error(
                    `Expecting only one executable Flyway CLI to be found. Instead found multiple executable files: ${executableFiles.map(ex => ex.name)}`
                );
            }
            else {
                join(directory, executableFilesWithCorrectName[0].name);
            }
        }

        return new FlywayExecutable(join(directory, executableFiles[0].name));
    }



    private static async getFlywayCommandLineFiles(directory: string) {
        const paths_a = await globPromise(`${directory}/lib/community/flyway-commandline-*.jar`);
        const paths_b = await globPromise(`${directory}/lib/flyway-commandline-*.jar`);

        return paths_a.concat(paths_b);
    }

}