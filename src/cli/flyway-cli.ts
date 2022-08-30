import {exec as execute} from "shelljs";
import {FlywayCliSource, FlywayCommand, FlywayConfig} from "../types/types";
import {FlywayVersion} from "../internal/flyway-version";
import {FlywayCommandLineOptions} from "../internal/flyway-command-line-options";
import {getLogger} from "../utility/logger";
import {FlywayRawExecutionResponse} from "../response/responses";

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

        const response = await new Promise<FlywayRawExecutionResponse>((resolve, reject) => {
            execute(command, {silent: true}, (code, stdout) => {
                if (code == 0) {
                    resolve({success: true, response: stdout});
                }
                if (code == 2 && !stdout) {
                    // Handle non-zero code and empty output to stdout. Output to stdout appears to be "" when the error code is 2.
                    reject();
                }
                else {
                    FlywayExecutable.logger.log(`Code: ${code} returned when executing command.`);
                    resolve({success: false, response: stdout}); // Nothing is piped to stderr by the CLI. Maybe in some cases it is?
                }
            });
        });

        FlywayExecutable.logger.log(`Successfully executed command`);
        FlywayExecutable.logger.log(`Received response from Flyway CLI: ${response.response}`);

        return response;


    }
}