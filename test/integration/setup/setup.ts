import {exec as execute} from "shelljs";
import {enableLogging, getLogger} from "../../../dist/utility/logger";

const logger = getLogger("DatabaseSetup", "integration-test");


export const createCleanDatabase = async () => {
    enableLogging("integration-test");
    await createContainerizedPostgres();
    const pollCount = 10;
    const databaseLivenessCheckResult = await pollDatabaseForLiveness(pollCount, 300);

    if (databaseLivenessCheckResult.success) {
        logger.log(`Database is live and ready to receive connections. Liveness check completed after ${databaseLivenessCheckResult.attempts} attempts.`)
    }
    else {
        throw Error(`Database not ready after polling ${pollCount} times.`);
    }
}



export const createContainerizedPostgres = async () => {

    logger.log("Creating clean database build for integration test...");

    const command = "sh test/integration/setup/create-postgres-container.sh";

    try {
      await new Promise<void>((resolve, reject) => {
         execute(command, {silent: true}, (code, stdout) => {
             if (code == 0) {
                 resolve();
             }
             else {
                 reject();
             }
         });
     });
        logger.log("Successfully created clean database.")
    }
    catch(err: any) {
        throw Error("Requires docker to be installed and a docker daemon to be running in order to execute the integration tests.");
    }
};


export const pollDatabaseForLiveness = async (maxAttempts: number, waitInterval: number) => {

    const checkDatabaseLiveness = `psql postgresql://postgres:password123@localhost:2575 -c "\\d"`;

    for (let i = 0; i < maxAttempts; i++) {

        try {
            await new Promise<void>((resolve, reject) => {
                logger.log(`Attempt ${i+1}/${maxAttempts} to check liveness of database.`)
                execute(checkDatabaseLiveness, {silent: true}, (code, stdout, stderr) => {
                    if (code == 0) {
                        resolve();
                    }
                    else {
                        reject(stderr);
                    }
                });
            });

            return {
                attempts: i+1,
                success: true
            };
        }
        catch(err: any) {}

        logger.log(`Database failed liveness check. Waiting ${waitInterval}ms to retry.`)
        await sleep(waitInterval);
    }

    return {
        attempts: maxAttempts,
        success: false
    };
};


const sleep = (sleepInterval: number): Promise<void> => {
    return new Promise(
        (resolve) => {
            setTimeout(() => {
                resolve();
            }, sleepInterval);
        }
    );
}



