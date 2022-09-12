import _temp from "temp";
import { FlywayVersion } from "../../internal/flyway-version";
import { FlywayCli } from "../flyway-cli";
import { FlywayCliProvider } from "../flyway-cli-provider";
import { DownloadProvider } from "./download-provider";
import { FlywayCliDownloader } from "./downloader/flyway-cli-downloader";

export class SelfCleaningDownloadProvider extends FlywayCliProvider {

    private temp = _temp.track();

    constructor(
        private downloader: FlywayCliDownloader
    ) {
        super();
    }

    public async getFlywayCli(flywayVersion: FlywayVersion): Promise<FlywayCli | undefined> {
        const temporaryDirectory = await this.temp.mkdir();
        const downloadProvider = new DownloadProvider(temporaryDirectory, this.downloader);
        return downloadProvider.getFlywayCli(flywayVersion);
    }
    
}