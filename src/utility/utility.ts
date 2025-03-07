import { constants as FS_CONSTANTS } from "fs";
import { access, readdir, stat } from "fs/promises";
import { join } from "path";
import {exec, ExecOptions} from "node:child_process";
import {FlywayRawExecutionResponse} from "../response/responses";
import {FlywayExecutable} from "../cli/flyway-cli";
import {getLogger} from "./logger";

export type OperatingSystem = "macosx" | "linux" | "windows";
export type CpuArchitecture = "arm" | "arm64" | "ia32" | "mips" | "mipsel" | "ppc" | "ppc64" | "s390" | "s390x" | "x64";

export const getHostOperatingSystem = (): OperatingSystem => {
    const platform = process.platform;

    if(platform == "win32") {
        return "windows";
    }
    if(platform == "darwin") {
        return "macosx";
    }
    return "linux";
}

export const getHostCpuArchitecture = (): CpuArchitecture => {
    return process.arch;
};

export const findAllExecutableFilesInDirectory = async (path: string) => {
    const entries = await readdir(path, { withFileTypes : true})
    
    const executables = await Promise.all(
        entries
            .filter(file => file.isFile())
            .map(
                async file => await canExecuteFile(join(path, file.name), getHostOperatingSystem()) ? file : undefined
            )
    );
    return executables.filter(isDefined);
}

export const canExecuteFile = async (path: string, system: OperatingSystem) => {
    if(system == 'windows') {
        return path.endsWith('.cmd');
    }


    try {
        await access(path, FS_CONSTANTS.X_OK);
        return true;
    }
    catch (err) {
        return false;
    }
}

export const hasFullPermissionsOnFile = async (path: string) => {
    // TODO = implement this
    return true;
}

export const isDefined = <T>(argument: T | undefined): argument is T => {
    return argument !== undefined
}


export const existsAndIsDirectory = async (directory: string) => {
    let stats;
    try {
        stats = await stat(directory);
    }
    catch(error) {
        return false;
    }

    return stats.isDirectory();
}

export type ExecutionResponse = {
    success: boolean,
    response: string
}


export const execute = async (command: string, options: ExecOptions): Promise<ExecutionResponse> => {
    return new Promise((resolve, reject) => {
        try {
            exec(
                command,
                options,
                (err, stdout, stderr) => {
                    if (err == null) {
                        resolve(
                            {success: true, response: stdout.toString()}
                        );
                    } else {
                        resolve({success: false, response: stderr.toString()});
                    }
                }
            )
        } catch (error) {
            getLogger("Utility").log(`Error executing command ${command}. Error: ${error}`);
            resolve({success: false, response: ""});
        }
    });
}

