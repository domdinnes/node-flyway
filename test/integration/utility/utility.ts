import {inspect} from "util";
import {Client} from "pg";


export const port = 5432;

export const testConfiguration = {
    url: `jdbc:postgresql://localhost:${port}/postgres`,
    user: "postgres",
    password: "password123",
    defaultSchema: "public",
    port: port
};

export const basicMigrations = "test/integration/migrations/1_basic_migrations";
export const outOfOrderMigrations = "test/integration/migrations/2_out_of_order_migrations";
export const failingMigrations = "test/integration/migrations/3_failing_migrations";
export const multipleSchemaMigrations = "test/integration/migrations/4_migrations_with_multiple_schemas";
export const baselineMigrations = "test/integration/migrations/5_baseline_migrations";
export const migrationsToBeValidated = "test/integration/migrations/6_migrations_to_be_validated";
export const migrationsToBeRepaired = "test/integration/migrations/7_migrations_to_be_repaired";
export const missingMigrations = "test/integration/migrations/99_this_location_does_not_exist";


export const inspectResponse = (response: any) => {
    return inspect(response, {showHidden: false, depth: null, colors: true});
}

export const logResponse = (response: any) => {
    console.log(inspectResponse(response));
}

type DatabaseConfiguration = {
    host: string,
    databaseName: string,
    user: string,
    password: string,
    port: number
}

class DatabaseClient {

    private connected: boolean = false;
    private client?: Client;

    constructor() {
    }

    public async connect(
        configuration: DatabaseConfiguration
    ) {

        if(this.connected) {
            return;
        }

        const client = new Client(
            {
                user: configuration.user,
                password: configuration.password,
                host: configuration.host,
                port: configuration.port,
                database: configuration.databaseName
            }
        );


        await client.connect();
        this.connected = true;
        this.client = client;
    }

    public async disconnect() {
        await this.client?.end()
        this.connected = false;
    }


    public getConnection(): Client {
        if(!this.connected || !this.client) {
            throw new Error("No database connection. Ensure #connect has been called earlier in the application lifecycle.");
        }

        return this.client;
    }

}

const databaseClient = new DatabaseClient();

export async function getDatabaseConnection(
    password: string,
    port: number
) {
    const configuration: DatabaseConfiguration = {
        user: 'postgres',
        password,
        host: 'localhost',
        port,
        databaseName: 'postgres'
    }
    await databaseClient.connect(configuration);
    return databaseClient.getConnection();
}

export async function disconnectDatabase() {
    await databaseClient.disconnect();
}