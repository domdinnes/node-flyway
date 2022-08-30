import { FlywayCliStrategy } from "../types/types";
import { DownloadProvider } from "./download/download-provider";
import { DirectFlywayCliDownloader } from "./download/downloader/flyway-cli-downloader";
import { SelfCleaningDownloadProvider } from "./download/self-cleaning-download-provider";
import { FileSystemFlywayCliProvider } from "./filesystem/file-system-provider";
import { ShortCircuitFileSystemFlywayCliProvider } from "./filesystem/short-circuit-file-system-provider";
import { FlywayCliProvider } from "./flyway-cli-provider";

export class FlywayCliProviderFactory {

    static createFlywayCliProvider(
        strategy: FlywayCliStrategy,
        flywayCliDirectory: string
    ): FlywayCliProvider {

        if (strategy == FlywayCliStrategy.LOCAL_CLI_WITH_DOWNLOAD_FALLBACK) {
            return FlywayCliProviderFactory.createFileSystemProviderWithDownloadFallback(flywayCliDirectory);
        }
        
        else if (strategy == FlywayCliStrategy.LOCAL_CLI_ONLY) {
            return new FileSystemFlywayCliProvider(flywayCliDirectory);
        }

        else if (strategy == FlywayCliStrategy.LOCAL_CLI_ONLY_OPTIMIZED) {
            return new ShortCircuitFileSystemFlywayCliProvider(flywayCliDirectory);
        }

        else if (strategy == FlywayCliStrategy.DOWNLOAD_CLI_AND_CLEAN) {
            return new SelfCleaningDownloadProvider(new DirectFlywayCliDownloader());
        }

        else if (strategy == FlywayCliStrategy.DOWNLOAD_CLI_ONLY) {
            return new DownloadProvider(
                flywayCliDirectory,
                new DirectFlywayCliDownloader()
            );
        }

        else {
            console.error("Falling back to default provider. This shouldn't happen...");
            return FlywayCliProviderFactory.createFileSystemProviderWithDownloadFallback(flywayCliDirectory);
        }
    }


    static createFileSystemProviderWithDownloadFallback(
        cliDirectory: string
    ) {
        const fileSystemProvider = new FileSystemFlywayCliProvider(
            cliDirectory
        );

        const downloadProvider = new DownloadProvider(
            cliDirectory,
            new DirectFlywayCliDownloader()
        );

        return fileSystemProvider.chain(downloadProvider);
    }

    /*
        static chainProvidersList(
            ...providers: FlywayExecutableProvider[]
        ): FlywayExecutableProvider {
            return {
                getFlywayExecutable: () => {
                    return providers.reduce<Promise<FlywayExecutable | undefined>>(async (accumulator, currentValue) => {
                        if(await accumulator != null) {
                            return accumulator;
                        }
                        return await currentValue.getFlywayExecutable();
                    }, Promise.resolve(undefined));
                }
            };
        }
    */
}