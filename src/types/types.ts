export type FlywayConfig = FlywayBasicConfig & { advanced?: FlywayAdvancedConfig }

export type FlywayOptionalConfig = Partial<FlywayConfig>;

export type FlywayBasicConfig = {
    url: string,
    user: string,
    password?: string,
    defaultSchema?: string,
    migrationLocations: string[]
}

export type FlywayAdvancedConfig = {
    // Connection
    driver?: string, // Enum?
    connectRetries?: number,
    connectRetriesInterval?: number,
    initSql?: string,

    // General
    callbacks?: string[],
    configFileEncoding?: "US-ASCII" | "ISO-8859-1" | "UTF-8" | "UTF-16BE" | "UTF-16LE" | "UTF-16";
    configFiles?: string[]
    migrationEncoding?: "US-ASCII" | "ISO-8859-1" | "UTF-8" | "UTF-16BE" | "UTF-16LE" | "UTF-16"
    groupPendingMigrations?: boolean,
    installedBy?: string,
    jarDirs?: string[],
    failOnMissingMigrationLocations?: boolean,
    lockRetryCount?: number,
    mixed?: boolean,
    applyNewMigrationsOutOfOrder?: boolean,
    skipDefaultCallbacks?: boolean,
    skipDefaultResolvers?: boolean,
    schemaHistoryTable?: string,
    schemaHistoryTableSpace?: string,
    target?: string,
    validateMigrationNaming?: boolean,
    validateOnMigrate?: boolean,
    workingDirectory?: string,

    // Schemas
    createSchemas?: boolean,
    schemas?: string[],

    // Baseline
    baselineDescription?: string,
    baselineOnMigrate?: boolean,
    baselineVersion?: string

    // Clean
    cleanDisabled?: boolean,
    cleanOnValidationError?: boolean,

    // Validate
    ignoreMigrationPatterns?: string // Enum?

    // Migrations
    repeatableSqlMigrationPrefix?: string,
    resolvers?: string[],
    sqlMigrationPrefix?: string,
    sqlMigrationSeparator?: string,
    sqlMigrationSuffixes?: string[],

    // Placeholders
    placeHolderReplacement?: boolean,
    placeHolderPrefix?: string
    placeHolderSuffix?: string,
    placeHolders?: Map<string, string>,
    placeHolderSeparator?: string,
    scriptPlaceHolderPrefix?: string,
    scriptPlaceHolderSuffix?: string,

    // Command Line
    edition?: "community" | "teams",


    // Postgres
    postgresqlTransactionLock?: boolean
}

// Not available for now
type FlywayTeamsConfig = {
    // Connection
    jdbcProperties?: Map<string, string>,

    //General
    batch?: boolean,
    cherryPick?: string
    detectEncoding?: boolean,
    dryRunOutput?: string,
    errorOverrides: string,
    kerborosConfigFile?: string
    licenseKey?: string
    outputQueryResults?: boolean,
    skipExecutingMigrations?: boolean
    stream?: boolean,

    // Migrations
    undoSqlMigrationPrefix?: string,
    baselineMigrationPrefix?: string,

    // Oracle
    oracle?: {
        sqlPlus: boolean,
        sqlPlusWarn: boolean,
        kerberosCacheFile: string,
        walletLocation: string
    },
}


export type CommandLineOptionMap = { [Property in (keyof FlywayBasicConfig | keyof  FlywayAdvancedConfig)] : string };

export type FlywayCommand = "migrate" | "clean" | "info" | "validate" | "undo" | "baseline" | "repair";


export type ExecutionOptions = {
    flywayCliLocation?: string,
    flywayCliStrategy?: FlywayCliStrategy
};

export enum FlywayCliStrategy {
    LOCAL_CLI_ONLY,
    LOCAL_CLI_ONLY_OPTIMIZED,
    LOCAL_CLI_WITH_DOWNLOAD_FALLBACK,
    DOWNLOAD_CLI_ONLY,
    DOWNLOAD_CLI_AND_CLEAN
}

export enum FlywayCliSource {
    FILE_SYSTEM,
    DOWNLOAD
}