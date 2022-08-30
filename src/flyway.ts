
import { DEFAULT_FLYWAY_VERSION } from "./internal/defaults";
import { FlywayInternal } from "./internal/flyway-internal";
import { FlywayVersion } from "./internal/flyway-version";
import {
    FlywayBaselineResponse,
    FlywayCleanResponse,
    FlywayInfoResponse,
    FlywayMigrateResponse,
    FlywayRepairResponse,
    FlywayValidateResponse,
    NodeFlywayResponse
} from "./response/responses";
import {ExecutionOptions, FlywayConfig, FlywayOptionalConfig} from "./types/types";
import * as autoBind from "auto-bind";

export class Flyway {

    private internal: FlywayInternal;

    private version: FlywayVersion = DEFAULT_FLYWAY_VERSION;

    constructor(
        config: FlywayConfig,
        executionOptions?: ExecutionOptions,
        debug?: boolean
    ) {
        this.internal = new FlywayInternal(config, this.version, executionOptions, debug);
        autoBind(this);
    }

    public migrate(config?: FlywayOptionalConfig) : Promise<NodeFlywayResponse<FlywayMigrateResponse>> { // Tidy up return value.
        return this.internal.migrate(config);
    }

    public clean(config?: FlywayOptionalConfig): Promise<NodeFlywayResponse<FlywayCleanResponse>> {
        return this.internal.clean(config);
    }

    public info(config?: FlywayOptionalConfig): Promise<NodeFlywayResponse<FlywayInfoResponse>> {
        return this.internal.info(config);
    }

    public validate(config?: FlywayOptionalConfig): Promise<NodeFlywayResponse<FlywayValidateResponse>> {
        return this.internal.validate(config);
    }

    public baseline(config?: FlywayOptionalConfig): Promise<NodeFlywayResponse<FlywayBaselineResponse>> {
        return this.internal.baseline(config);
    }

    public repair(config?: FlywayOptionalConfig): Promise<NodeFlywayResponse<FlywayRepairResponse>> {
        return this.internal.repair(config);
    }

    public install(location?: string, version?: FlywayVersion): Promise<NodeFlywayResponse<any>["additionalDetails"]> {
        return this.internal.install(location, version);
    }

    public static version(
        version: FlywayVersion,
        config: FlywayConfig,
        executionOptions?: ExecutionOptions,
        debug?: boolean
    ){
        return new FlywayInternal(
            config,
            version,
            executionOptions,
            debug
        );
    }
}