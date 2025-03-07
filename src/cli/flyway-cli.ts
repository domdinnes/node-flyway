import {FlywayCliSource, FlywayCommand, FlywayConfig} from "../types/types";
import {FlywayVersion} from "../internal/flyway-version";
import {FlywayCommandLineOptions} from "../internal/flyway-command-line-options";
import {getLogger} from "../utility/logger";
import {FlywayRawExecutionResponse} from "../response/responses";
import {execute} from "../utility/utility";

export class FlywayCli {

    constructor(
        public readonly version: FlywayVersion,
        public readonly source: FlywayCliSource,
        public readonly location: string,
        public readonly executable: FlywayExecutable,
        public readonly hash: string
    ) {}

}

export class FlywayExecutable {

    private static readonly logger = getLogger("FlywayExecutable");

    constructor(
        public readonly path: string
    ) {
    }

    public async execute(
        flywayCommand: FlywayCommand,
        config: FlywayConfig
    ): Promise<FlywayRawExecutionResponse> {

        const commandLineOptions = FlywayCommandLineOptions.build(config);
        const command = `${this.path} ${commandLineOptions.convertToCommandLineString()} ${flywayCommand} -outputType=json`;

        FlywayExecutable.logger.log(`Executing flyway command: ${command}`);

        const response: FlywayRawExecutionResponse = await execute(command, {});

        if(response.success) {
            FlywayExecutable.logger.log(`Successfully executed command`);
            FlywayExecutable.logger.log(`Received response from Flyway CLI: ${response.response}`);
        }
        else {
            FlywayExecutable.logger.log(`Error returned when executing command: ${command}`);
        }

        return response;

    }
}