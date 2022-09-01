import {FlywayCli} from "../cli/flyway-cli";
import {FlywayCliProviderFactory} from "../cli/flyway-cli-provider-factory";
import {ConvertJsonToResponse} from "../response/json-to-response";
import {
    FlywayBaselineResponse,
    FlywayCleanResponse,
    FlywayErrorResponse,
    FlywayInfoResponse,
    FlywayMigrateResponse,
    FlywayRepairResponse,
    FlywayResponse,
    FlywayValidateResponse,
    NodeFlywayResponse
} from "../response/responses";
import {ExecutionOptions, FlywayCliSource, FlywayCliStrategy, FlywayCommand, FlywayConfig} from "../types/types";
import {DEFAULT_FLYWAY_CLI_DIRECTORY, DEFAULT_FLYWAY_CLI_STRATEGY} from "./defaults";
import {FlywayVersion} from "./flyway-version";


export class FlywayInternal {


    public static async migrate(
        config: FlywayConfig,
        version: FlywayVersion,
        executionOptions?: ExecutionOptions
    ): Promise<NodeFlywayResponse<FlywayMigrateResponse>> {
        return FlywayInternal.executeFlywayCommand(
            "migrate",
            ConvertJsonToResponse.toFlywayMigrateResponse,
            config,
            version,
            executionOptions
        );
    }

    public static async clean(
        config: FlywayConfig,
        version: FlywayVersion,
        executionOptions?: ExecutionOptions
    ): Promise<NodeFlywayResponse<FlywayCleanResponse>> {
        return FlywayInternal.executeFlywayCommand(
            "clean",
            ConvertJsonToResponse.toFlywayCleanResponse,
            config,
            version,
            executionOptions
        );
    }

    public static async info(
        config: FlywayConfig,
        version: FlywayVersion,
        executionOptions?: ExecutionOptions
    ): Promise<NodeFlywayResponse<FlywayInfoResponse>> {
        return FlywayInternal.executeFlywayCommand(
            "info",
            ConvertJsonToResponse.toFlywayInfoResponse,
            config,
            version,
            executionOptions
        );
    }

    public static async validate(
        config: FlywayConfig,
        version: FlywayVersion,
        executionOptions?: ExecutionOptions
    ): Promise<NodeFlywayResponse<FlywayValidateResponse>> {
        return FlywayInternal.executeFlywayCommand(
            "validate",
            ConvertJsonToResponse.toFlywayValidateResponse,
            config,
            version,
            executionOptions
        );
    }

    public static async baseline(
        config: FlywayConfig,
        version: FlywayVersion,
        executionOptions?: ExecutionOptions
    ): Promise<NodeFlywayResponse<FlywayBaselineResponse>> {
        return FlywayInternal.executeFlywayCommand(
            "baseline",
            ConvertJsonToResponse.toFlywayBaselineResponse,
            config,
            version,
            executionOptions
        );
    }

    public static async repair(
        config: FlywayConfig,
        version: FlywayVersion,
        executionOptions?: ExecutionOptions
    ): Promise<NodeFlywayResponse<FlywayRepairResponse>> {
        return FlywayInternal.executeFlywayCommand(
            "repair",
            ConvertJsonToResponse.toFlywayRepairResponse,
            config,
            version,
            executionOptions
        );
    }

    public static async install(
        location: string,
        version: FlywayVersion,
    ): Promise<NodeFlywayResponse<any>["additionalDetails"]> { // Improve typing
        const startTimestamp = Date.now();

        const cli = await FlywayInternal.getCli(
            FlywayCliStrategy.DOWNLOAD_CLI_ONLY,
            location,
            version
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

    private static async executeFlywayCommand<T extends FlywayResponse>(
        command: FlywayCommand,
        responseMapper: (json: any) => {
            error?: FlywayErrorResponse,
            flywayResponse?: T
        }, // Link command / T
        config: FlywayConfig,
        version: FlywayVersion,
        executionOptions?: ExecutionOptions
    ): Promise<NodeFlywayResponse<T>> {
        const startTimestamp = Date.now();
        const cli = await FlywayInternal.getCli(
            executionOptions?.flywayCliStrategy || DEFAULT_FLYWAY_CLI_STRATEGY,
            executionOptions?.flywayCliLocation || DEFAULT_FLYWAY_CLI_DIRECTORY,
            version
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

    private static async getCli(
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

}