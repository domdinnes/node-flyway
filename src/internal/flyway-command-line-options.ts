import {isMap} from "util/types";
import {CommandLineOptionMap, FlywayAdvancedConfig, FlywayBasicConfig, FlywayConfig} from "../types/types";
import {platform} from "os";



export class FlywayCommandLineOptions {

    constructor(
        private readonly options: FlywayCommandLineOption[]
    ) {
        this.options = options;
    }

    public static build(config: FlywayConfig): FlywayCommandLineOptions {
        const options = CommandLineOptionGenerator.generateCommandLineOptions(config);

        return new FlywayCommandLineOptions(
            options
        );
    }

    public getCommandLineOptions(): string[] {
        return this.options.map(option => option.convertToCommandLineString());
    }


    public convertToCommandLineString(): string {
        return this.options.map(option => option.convertToCommandLineString()).join(" ");
    }


}



interface FlywayCommandLineOption {
    convertToCommandLineString(): string;
}

class FlywayCommandLineStandardOption implements FlywayCommandLineOption {

    public constructor(
        private commandLineOptionKey: CommandLineOptionMap[keyof CommandLineOptionMap],
        private commandLineOptionValue: string
    ) {
    }

    convertToCommandLineString(): string {
        const quote = platform() === "win32" ? '"' : "'";
        return `-${this.commandLineOptionKey}=${quote}${this.commandLineOptionValue}${quote}`;
    }
}


class FlywayCommandLineArrayOption<T> implements FlywayCommandLineOption {

    public constructor(
        private commandLineOptionKey: CommandLineOptionMap[keyof CommandLineOptionMap],
        private commandLineOptionValues: T[]
    ) {
    }

    convertToCommandLineString(): string {
        const quote = platform() === "win32" ? '"' : "'";
        return `-${this.commandLineOptionKey}=${quote}${this.commandLineOptionValues.join(',')}${quote}`;
    }

}

class FlywayCommandLineMapOption implements FlywayCommandLineOption {

    public constructor(
        private commandLineOptionKey: CommandLineOptionMap[keyof CommandLineOptionMap],
        private commandLineOptionMapValues: Map<string, string>
    ) {
    }

    convertToCommandLineString(): string {
        const commandLineStringParts: string[] = [];
        const quote = platform() === 'win32' ? '"' : "'";

        // Throw if keys include whitespace
        this.commandLineOptionMapValues.forEach((key, val) => {
            commandLineStringParts.push(`${this.commandLineOptionKey}.${key}=${quote}${val}${quote}`);
        });

        return commandLineStringParts.join(" ");
    }
}


class CommandLineOptionGenerator {

    public static generateCommandLineOptions(config: FlywayConfig): FlywayCommandLineOption[] {
        const mergedConfig: FlywayConfig = this.mergeConfigProperties(config);

        const flatConfig = {
            url: mergedConfig.url,
            user: mergedConfig.user,
            password: mergedConfig.password,
            defaultSchema: mergedConfig.defaultSchema,
            migrationLocations: mergedConfig.migrationLocations,
            ...mergedConfig.advanced
        };

        const configKeys = Object.keys(flatConfig) as (keyof FlywayBasicConfig | keyof FlywayAdvancedConfig)[];

        return configKeys
            .filter(
                configKey => flatConfig[configKey] != undefined
            )
            .map(
                configKey => this.build(
                    flatConfig,
                    configKey,
                    commandLineOptionMap
                )
            )
            .filter(this.isDefined);

    }

    private static mergeConfigProperties(
        config: FlywayConfig
    ): FlywayConfig {

        let defaultSchema: string | undefined;
        let schemas: string[] | undefined;

        if (config.defaultSchema == undefined || config.advanced?.schemas == undefined) {
            defaultSchema = config.defaultSchema;
            schemas = config.advanced?.schemas;
        } else {
            defaultSchema = config.defaultSchema;
            schemas = config.advanced.schemas.filter(schema => schema != config.defaultSchema);
        }

        const basicConfig = {
            ...config,
            defaultSchema: defaultSchema
        };

        const advancedConfig = config.advanced != null
            ? {
                ...config.advanced,
                schemas
            }
            : undefined;

        return {...basicConfig, advanced: advancedConfig};
    }


    private static build<T extends FlywayBasicConfig | FlywayAdvancedConfig>(
        config: T,
        configKey: keyof T,
        commandLineOptionMappings: { [Property in (keyof T)]: string }
    ): FlywayCommandLineOption | undefined {
        const configPropertyValue = config[configKey];

        if (configPropertyValue == undefined) {
            return undefined;
        }

        if (Array.isArray(configPropertyValue)) {
            return new FlywayCommandLineArrayOption(
                commandLineOptionMappings[configKey],
                configPropertyValue
            );
        } else if (isMap(configPropertyValue)) {
            return new FlywayCommandLineMapOption(
                commandLineOptionMappings[configKey],
                configPropertyValue as any // TODO - fix explicit any
            );
        } else {
            return new FlywayCommandLineStandardOption(
                commandLineOptionMappings[configKey],
                `${configPropertyValue}`
            );
        }

    }

    private static isDefined<T>(arg: T | undefined): arg is T {
        return arg != undefined;
    }

}

const commandLineOptionMap: CommandLineOptionMap = {
    url: "url",
    user: "user",
    password: "password",
    defaultSchema: "defaultSchema",
    migrationLocations: "locations",


    driver:"driver",
    connectRetries:"connectRetries",
    connectRetriesInterval:"connectRetriesInterval",
    initSql:"initSql"    ,
    callbacks:"callbacks",
    configFileEncoding:"configFileEncoding",
    configFiles:"configFiles",
    migrationEncoding:"encoding",
    groupPendingMigrations:"group",
    installedBy:"installedBy",
    jarDirs:"jarDirs",
    failOnMissingMigrationLocations:"failOnMissingLocations",
    lockRetryCount:"lockRetryCount",
    mixed:"mixed",
    applyNewMigrationsOutOfOrder:"outOfOrder",
    skipDefaultCallbacks:"skipDefaultCallbacks",
    skipDefaultResolvers:"skipDefaultResolvers",
    schemaHistoryTable:"table",
    schemaHistoryTableSpace:"tableSpace",
    target:"target",
    validateMigrationNaming:"validateMigrationNaming",
    validateOnMigrate:"validateOnMigrate",
    workingDirectory:"workingDirectory",
    createSchemas:"createSchemas",
    schemas:"schemas",
    baselineDescription:"baselineDescription",
    baselineOnMigrate:"baselineOnMigrate",
    baselineVersion:"baselineVersion",
    cleanDisabled:"cleanDisabled",
    cleanOnValidationError:"cleanOnValidationError",
    ignoreMigrationPatterns:"ignoreMigrationPatterns",
    repeatableSqlMigrationPrefix:"repeatableSqlMigrationPrefix",
    resolvers:"resolvers",
    sqlMigrationPrefix:"sqlMigrationPrefix",
    sqlMigrationSeparator:"sqlMigrationSeparator",
    sqlMigrationSuffixes:"sqlMigrationSuffixes",
    placeHolderReplacement:"placeHolderReplacement",
    placeHolderPrefix:"placeHolderPrefix",
    placeHolderSuffix:"placeHolderSuffix",
    placeHolders:"placeHolders",
    placeHolderSeparator:"placeHolderSeparator",
    scriptPlaceHolderPrefix:"scriptPlaceHolderPrefix",
    scriptPlaceHolderSuffix:"scriptPlaceHolderSuffix",
    edition:"edition",
    postgresqlTransactionLock:"postgresqlTransactionLock"
}



