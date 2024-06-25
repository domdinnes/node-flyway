import {inspect} from "util";


export const port = 5432;

export const testConfiguration = {
    url: `jdbc:postgresql://localhost:${port}/postgres`,
    user: "postgres",
    password: "postgres",
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

