import { FlywayVersion } from "../../internal/flyway-version";
import { FlywayCliSource, FlywayCliStrategy } from "../../types/types";
import { getLogger } from "../../utility/logger";
import { FlywayCli } from "../flyway-cli";
import { FlywayCliProvider } from "../flyway-cli-provider";
import { FlywayCliService } from "../service/flyway-cli-service";



export class ShortCircuitFileSystemFlywayCliProvider extends FlywayCliProvider {

    protected static logger = getLogger("ShortCircuitFileSystemFlywayCliProvider");

    constructor(
        private directory: string
    ) {
        super()
    }


    public async getFlywayCli(
        flywayVersion: FlywayVersion
    ): Promise<FlywayCli> {


        const cliDetails = await FlywayCliService.getFlywayCliDetails(this.directory);

        if(cliDetails == null) {
            throw new Error(
                `Provided directory is not a Flyway CLI. Ensure that the provided directory path points to a Flyway CLI. The execution strategy is set to ${FlywayCliStrategy[FlywayCliStrategy.LOCAL_CLI_ONLY_OPTIMIZED]} meaning that the process immediately fails if no CLI is found.`
            );
        }

        if(flywayVersion != cliDetails.version) {
            throw new Error(
                `Provided directory is a Flyway CLI, but the CLI version: ${FlywayVersion[cliDetails.version]} doesn't match the specified version: ${FlywayVersion[flywayVersion]}. Either replace the Flyway CLI locally with the desired version, or update the target version using the static builder on the Flyway class in your Node.js app. `
            );
        }

        const executable = await FlywayCliService.getExecutableFromFlywayCliDirectory(this.directory);

        ShortCircuitFileSystemFlywayCliProvider.logger.log(
            `Successfully found a Flyway CLI with path: ${this.directory} using the optimized local CLI strategy.`
        );

        return new FlywayCli(
            flywayVersion,
            FlywayCliSource.FILE_SYSTEM,
            this.directory,
            executable,
            cliDetails.hash
        );
    }
    
}
