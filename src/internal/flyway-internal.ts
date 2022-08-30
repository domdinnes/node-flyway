import * as debug from "debug";
import {FlywayCli} from "../cli/flyway-cli";
import {FlywayCliProviderFactory} from "../cli/flyway-cli-provider-factory";
import {ConvertJsonToResponse} from "../response/json-to-response";
import {
    FlywayBaselineResponse,
    FlywayCleanResponse, FlywayErrorResponse,
    FlywayInfoResponse,
    FlywayMigrateResponse, FlywayRepairResponse,
    FlywayResponse,
    FlywayValidateResponse,
    NodeFlywayResponse, ParsedFlywayResponse
} from "../response/responses";
import {
    ExecutionOptions, FlywayAdvancedConfig,
    FlywayCliSource,
    FlywayCliStrategy,
    FlywayCommand,
    FlywayConfig,
    FlywayOptionalConfig
} from "../types/types";
import {getLogger, Logger} from "../utility/logger";
import {DEFAULT_FLYWAY_CLI_DIRECTORY, DEFAULT_FLYWAY_CLI_STRATEGY} from "./defaults";
import {FlywayVersion} from "./flyway-version";
import * as autoBind from "auto-bind";


export class FlywayInternal {

    private static logger: Logger = getLogger("FlywayInternal");

    constructor(
        private config: FlywayConfig,
        private version: FlywayVersion,
        private executionOptions?: ExecutionOptions,
        enableDebugging: boolean = false
    ) {
        if (enableDebugging) {
            debug.enable("node-flyway:*");
        }
        autoBind(this);
        // Perform config validation and throw error if invalid
    }

    public async migrate(config?: FlywayOptionalConfig): Promise<NodeFlywayResponse<FlywayMigrateResponse>> {
        const mergedConfig = this.mergeConfig(config);
        return this.executeFlywayCommand("migrate", ConvertJsonToResponse.toFlywayMigrateResponse, mergedConfig)
    }

    public async clean(config?: FlywayOptionalConfig): Promise<NodeFlywayResponse<FlywayCleanResponse>> {
        const mergedConfig = this.mergeConfig(config);
        return this.executeFlywayCommand("clean", ConvertJsonToResponse.toFlywayCleanResponse, mergedConfig)
    }

    public async info(config?: FlywayOptionalConfig): Promise<NodeFlywayResponse<FlywayInfoResponse>> {
        const mergedConfig = this.mergeConfig(config);
        return this.executeFlywayCommand("info", ConvertJsonToResponse.toFlywayInfoResponse, mergedConfig)
    }

    public async validate(config?: FlywayOptionalConfig): Promise<NodeFlywayResponse<FlywayValidateResponse>> {
        const mergedConfig = this.mergeConfig(config);
        return this.executeFlywayCommand("validate", ConvertJsonToResponse.toFlywayValidateResponse, mergedConfig);
    }

    public async baseline(config?: FlywayOptionalConfig): Promise<NodeFlywayResponse<FlywayBaselineResponse>> {
        const mergedConfig = this.mergeConfig(config);
        return this.executeFlywayCommand("baseline", ConvertJsonToResponse.toFlywayBaselineResponse, mergedConfig);
    }

    public async repair(config?: FlywayOptionalConfig): Promise<NodeFlywayResponse<FlywayRepairResponse>> {
        const mergedConfig = this.mergeConfig(config);
        return this.executeFlywayCommand("repair", ConvertJsonToResponse.toFlywayRepairResponse, mergedConfig);
    }

    public async install(location?: string, version?: FlywayVersion): Promise<NodeFlywayResponse<any>["additionalDetails"]> { // Improve typing
        const startTimestamp = Date.now();

        const cli = await this.getCli(
            FlywayCliStrategy.DOWNLOAD_CLI_ONLY,
            location || this.executionOptions?.flywayCliLocation || DEFAULT_FLYWAY_CLI_DIRECTORY,
            version != undefined ? version : this.version
        );

        const executionTime = Date.now() - startTimestamp;

        return {
            executionTime,
            flywayCli: {
                location: cli.location,
                source: FlywayCliSource[cli.source],
                version: FlywayVersion[cli.version],
                hash: cli.hash
            }
        }
    }

    private async executeFlywayCommand<T extends FlywayResponse>(
        command: FlywayCommand,
        responseMapper: (json: any) => {
            error?: FlywayErrorResponse,
            flywayResponse?: T
        }, // Link command / T
        config: FlywayConfig
    ): Promise<NodeFlywayResponse<T>> {
        const startTimestamp = Date.now();
        const cli = await this.getCli(
            this.executionOptions?.flywayCliStrategy || DEFAULT_FLYWAY_CLI_STRATEGY,
            this.executionOptions?.flywayCliLocation || DEFAULT_FLYWAY_CLI_DIRECTORY,
            this.version
        );

        const rawResponse = await cli.executable.execute(command, config);
        const executionTime = Date.now() - startTimestamp;
        const parsedResponse = responseMapper(rawResponse.response);

       return {
            success: rawResponse.success,
            ...parsedResponse,
            additionalDetails: {
                executionTime,
                flywayCli: {
                    location: cli.location,
                    source: FlywayCliSource[cli.source],
                    version: FlywayVersion[cli.version],
                    hash: cli.hash
                }
            }
        };

    }

    private async getCli(
        strategy: FlywayCliStrategy,
        location: string,
        version: FlywayVersion
    ): Promise<FlywayCli> {
        const flywayCliProvider = FlywayCliProviderFactory.createFlywayCliProvider(strategy, location);

        const cli = await flywayCliProvider.getFlywayCli(version);

        if (cli == null) {
            throw new Error("Unable to source Flyway CLI.");
        }
        return cli;
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
