import {exec as execute} from "shelljs";
import {getLogger} from "../../../src/utility/logger";
import {Flyway} from "../../../src";
import {testConfiguration} from "../utility/utility";

export const logger = getLogger("DatabaseSetup", "integration-test");


export const performDatabaseLivenessCheck = async (password: string, port: number) => {
    const pollCount = 10;
    const databaseLivenessCheckResult = await pollDatabaseForLiveness(password, port, pollCount, 300);

    if (databaseLivenessCheckResult.success) {
        logger.log(`Database is live and ready to receive connections on port: ${port}. Liveness check completed after ${databaseLivenessCheckResult.attempts} attempts.`)
    }
    else {
        throw Error(`Database not ready after polling ${pollCount} times.`);
    }
}


export const cleanDatabase = async () => {
    const flyway = new Flyway(
        {
            ...testConfiguration,
            migrationLocations: [],
            advanced: {
                cleanDisabled: false,
                schemas: ["public", "random"]
            }
        },
    );

    await flyway.clean();
}




export const createContainerizedDatabase = async (password: string, port: number) => {

    // Kills a running postgres container if one exists
    // Starts a new container with the expected values
    const createContainerizedPostgresCommand = `
        docker container stop node_flyway_postgres_db
        docker container rm node_flyway_postgres_db
        docker run -d --name node_flyway_postgres_db --env POSTGRES_PASSWORD=${password} -p ${port}:5432 postgres
    `;

    logger.log("Creating clean database build for integration test...");


    try {
      await new Promise<void>((resolve, reject) => {
         execute(createContainerizedPostgresCommand, {silent: false}, (code, stdout) => {
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
        throw Error("Requires docker to be installed and a docker daemon to be running in order to execute the integration tests locally.");
    }
};


const pollDatabaseForLiveness = async (
    password: string,
    port: number,
    maxAttempts: number,
    waitInterval: number
) => {
    const checkDatabaseLiveness = `EXPORT PGPASSWORD=${password}; psql --host=localhost --port=${port} --username=postgres --dbname=postgres --command="\\d"`;

    for (let i = 0; i < maxAttempts; i++) {

        try {
            await new Promise<void>((resolve, reject) => {
                logger.log(`Attempt ${i+1}/${maxAttempts} to check liveness of database.`)
                execute(checkDatabaseLiveness, {silent: true}, (code, stdout, stderr) => {
                    if (code == 0) {
                        resolve();
                    }
                    else {
                        console.log(code);
                        console.log(stdout);
                        console.log(stderr);
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



