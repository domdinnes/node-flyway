import { constants as FS_CONSTANTS } from "fs";
import { access, readdir, stat } from "fs/promises";
import { glob } from "glob";
import { join } from "path";

export const findAllExecutableFilesInDirectory = async (path: string) => {
    const entries = await readdir(path, { withFileTypes : true})
    
    const executables = await Promise.all(
        entries
            .filter(file => file.isFile())
            .map(
                async file => await canExecuteFile(join(path, file.name)) ? file : undefined
            )
    );
    return executables.filter(isDefined);
}

export const canExecuteFile = async (path: string) => {
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

export const globPromise = (path: string): Promise<string[]> => {

    return new Promise(
        (resolve, reject) => {
            glob(path, (err, matches) => {
                if(err){
                    reject(err);
                }
                else {
                    resolve(matches);
                }
            })
        }
    );
}
