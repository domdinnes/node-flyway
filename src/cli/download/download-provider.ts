import decompress from "decompress";
import {mkdir, rm, stat} from "fs/promises";
import {FlywayVersion} from "../../internal/flyway-version";
import {hasFullPermissionsOnFile} from "../../utility/utility";
import {FlywayCliProvider} from "../flyway-cli-provider";
// @ts-ignore - fix missing types
import decompressTargz from "decompress-targz";
// @ts-ignore - fix missing types
import decompressUnzip from "decompress-unzip";
import {resolve} from "path";
import {FlywayCliSource} from "../../types/types";
import {getLogger} from "../../utility/logger";
import {FlywayCli} from "../flyway-cli";
import {FlywayCliService} from "../service/flyway-cli-service";
import {FlywayCliDownloader} from "./downloader/flyway-cli-downloader";
import path = require("path");


/*
    Downloads a compressed Flyway CLI into the specified save directory.
    The CLI is decompressed into a Flyway CLI directory.
    The specified directory becomes the parent directory of the newly created Flyway CLI directory.
*/
export class DownloadProvider extends FlywayCliProvider {

    protected static logger = getLogger("DownloadProvider");

    constructor(
        private saveDirectory: string,
        private flywayCliDownloader: FlywayCliDownloader
    ) {
        super();
    }


    async getFlywayCli(flywayVersion: FlywayVersion): Promise<FlywayCli> {

        /* 
            Check directory exists otherwise create it.
        */

        let stats;
        try {
            stats = await stat(this.saveDirectory);
        }
        catch(error) {
            await mkdir(this.saveDirectory, {recursive: true});
        }

        if(stats != null && !stats.isDirectory()) {
            throw new Error("Specified path isn't directory");
        }

        if(!await hasFullPermissionsOnFile(this.saveDirectory)) {
            throw new Error();
        }

        DownloadProvider.logger.log(`Downloading Flyway CLI ${FlywayVersion[flywayVersion]}...`)

        const archiveLocation = this.flywayCliDownloader.getFlywayCliDownloadLocation(flywayVersion, this.saveDirectory);

        /*
            Clean out any partially downloaded files
         */
        await this.removeArchiveFile(archiveLocation);

        await this.flywayCliDownloader.downloadFlywayCli(
            flywayVersion,
            this.saveDirectory
        );

        const saveDirectoryAbsolutePath = resolve(this.saveDirectory);

        DownloadProvider.logger.log(`Successfully downloaded Flyway CLI ${FlywayVersion[flywayVersion]} to location: ${this.saveDirectory}`)

        const decompressedFiles = await this.decompressFiles(archiveLocation, saveDirectoryAbsolutePath);
        
        const extractedDirectory = this.getExtractLocationFromDecompressedFiles(decompressedFiles, this.saveDirectory);

        DownloadProvider.logger.log(`Successfully extracted Flyway CLI ${FlywayVersion[flywayVersion]} to location: ${extractedDirectory}`)

        await this.removeArchiveFile(archiveLocation);
        
        const executable = await FlywayCliService.getExecutableFromFlywayCliDirectory(extractedDirectory);

        const hash = await FlywayCliService.getFlywayCliHash(extractedDirectory);

        if(hash == undefined) {
            throw new Error("Unable to compute hash for downloaded Flyway CLI.");
        }

        return new FlywayCli(
            flywayVersion,
            FlywayCliSource.DOWNLOAD,
            extractedDirectory,
            executable,
            hash
        );
    }

    private getExtractLocationFromDecompressedFiles(
        files: decompress.File[],
        outerDirectory: string
    ): string {
        if(files.length == 0) {
            throw new Error("Weird. Expected some files to be extracted.");
        }
        // Files returned by decompress always use path separator '/' rather than the platform specific version.
        return path.join(outerDirectory, files[0].path.split('/')[0]);
    }

    private async decompressFiles(
        archiveLocation: string,
        saveDirectory: string
    ) {

        const plugins = archiveLocation.includes(".zip") ? [decompressUnzip()] : [decompressTargz()];

        return decompress(
            archiveLocation,
            saveDirectory,
            {plugins, filter: file => file.type === "file"}
        );

        /*
            [Error: ENOENT: no such file or directory, symlink 'ja_JP.UTF-8' -> '.../code/node-flyway/cli/flyway-8.5.11/jre/man/ja/'] {
            errno: -2,
            code: 'ENOENT',
            syscall: 'symlink',
            path: 'ja_JP.UTF-8',
            dest: '.../code/node-flyway/cli/flyway-8.5.11/jre/man/ja/'
            }
            Referenced here: https://github.com/kevva/decompress/issues/93
            Not an issue, only impacts 'man'. The symlinks can be excluded using a filter.
        */
    }

    private async removeArchiveFile(archiveLocation: string) {
        try {
            await rm(archiveLocation, {force: true});
        }
        catch (err: any) {
            if(err.code === "ENOENT") {
                // When attempting an early clean of the archive it is possible that it doesn't exist. In this case, do nothing.
            }
        }

    }
}

