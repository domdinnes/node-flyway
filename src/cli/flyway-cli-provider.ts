import { FlywayVersion } from "../internal/flyway-version";
import { getLogger } from "../utility/logger";
import { FlywayCli } from "./flyway-cli";


export abstract class FlywayCliProvider {

    protected static logger = getLogger("FlywayCliProvider");

    public abstract getFlywayCli(flywayVersion: FlywayVersion) : Promise<FlywayCli | undefined>

    /*
        Used to chain providers together in a fluent interface.
        Multiple strategies can be used to attempt to source a Flyway CLI until one is successful.
     */
    public chain(provider: FlywayCliProvider): FlywayCliProvider {
        
        return {
            getFlywayCli: async (flywayVersion: FlywayVersion) => {                
                let cli;
                try{
                    cli = await this.getFlywayCli(flywayVersion);
                }
                catch (err: any) {
                    FlywayCliProvider.logger.log(
                        `${this.constructor.name}.getFlywayCli() threw exception: ${err.stack}\n This was swallowed as there were other CLI providers next in the chain.`
                    )
                    return provider.getFlywayCli(flywayVersion);
                }
                return cli != null ? cli : provider.getFlywayCli(flywayVersion);
            },
            chain: this.chain
        };
    }
}

