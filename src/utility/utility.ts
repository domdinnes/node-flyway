import { constants as FS_CONSTANTS } from "fs";
import { access, readdir, stat } from "fs/promises";
import { join } from "path";

export type OperatingSystem = "macosx" | "linux" | "windows";



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
