import {DEFAULT_FLYWAY_CLI_DIRECTORY, DEFAULT_FLYWAY_VERSION} from "./internal/defaults";
import {FlywayInternal} from "./internal/flyway-internal";
import {FlywayVersion} from "./internal/flyway-version";
import {
    FlywayBaselineResponse,
    FlywayCleanResponse,
    FlywayInfoResponse,
    FlywayMigrateResponse,
    FlywayRepairResponse,
    FlywayValidateResponse,
    NodeFlywayResponse
} from "./response/responses";
import {ExecutionOptions, FlywayAdvancedConfig, FlywayConfig, FlywayOptionalConfig} from "./types/types";
import autoBind from "auto-bind";
import {enableLogging} from "./utility/logger";

export class Flyway {

    private static defaultVersion: FlywayVersion = DEFAULT_FLYWAY_VERSION;

    constructor(
        private config: FlywayConfig,
        private executionOptions?: ExecutionOptions,
        private debug?: boolean
    ) {
        if (debug) {
            enableLogging();
        }
        autoBind(this);
    }

    // Tidy up return value
    // Some commands - migrate/info/validate/repair require at least one migration location
    public migrate(config?: FlywayOptionalConfig) : Promise<NodeFlywayResponse<FlywayMigrateResponse>> {
        const mergedConfig = this.mergeConfig(config);
        return FlywayInternal.migrate(mergedConfig, Flyway.defaultVersion, this.executionOptions);
    }

    public clean(config?: FlywayOptionalConfig): Promise<NodeFlywayResponse<FlywayCleanResponse>> {
        const mergedConfig = this.mergeConfig(config);
        return FlywayInternal.clean(mergedConfig, Flyway.defaultVersion, this.executionOptions);
    }

    public info(config?: FlywayOptionalConfig): Promise<NodeFlywayResponse<FlywayInfoResponse>> {
        const mergedConfig = this.mergeConfig(config);
        return FlywayInternal.info(mergedConfig, Flyway.defaultVersion, this.executionOptions);
    }

    public validate(config?: FlywayOptionalConfig): Promise<NodeFlywayResponse<FlywayValidateResponse>> {
        const mergedConfig = this.mergeConfig(config);
        return FlywayInternal.validate(mergedConfig, Flyway.defaultVersion, this.executionOptions);
    }

    public baseline(config?: FlywayOptionalConfig): Promise<NodeFlywayResponse<FlywayBaselineResponse>> {
        const mergedConfig = this.mergeConfig(config);
        return FlywayInternal.baseline(mergedConfig, Flyway.defaultVersion, this.executionOptions);
    }

    public repair(config?: FlywayOptionalConfig): Promise<NodeFlywayResponse<FlywayRepairResponse>> {
        const mergedConfig = this.mergeConfig(config);
        return FlywayInternal.repair(mergedConfig, Flyway.defaultVersion, this.executionOptions);
    }

    public static install(location?: string, version?: FlywayVersion, debug?: boolean): Promise<NodeFlywayResponse<any>["additionalDetails"]> {

        if (debug) {
            enableLogging();
        }

        return FlywayInternal.install(
            location || DEFAULT_FLYWAY_CLI_DIRECTORY,
            version || Flyway.defaultVersion
        );
    }



    private mergeConfig(partialConfig?: Partial<FlywayConfig>): FlywayConfig {

        if(!partialConfig) {
            return this.config;
        }

        const mergedAdvancedConfig: FlywayAdvancedConfig | undefined = !!partialConfig.advanced && !!this.config.advanced
            ? {
                ...this.config.advanced,
                ...partialConfig.advanced
            }
            : this.config.advanced || partialConfig.advanced;

        return {
            ...this.config,
            ...partialConfig,
            advanced: mergedAdvancedConfig
        }
    }
}