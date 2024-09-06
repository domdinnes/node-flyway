import { homedir } from "os"
import { join } from "path"
import { FlywayCliStrategy } from "../types/types"
import { FlywayVersion } from "./flyway-version";

export const DEFAULT_FLYWAY_CLI_DIRECTORY = `${join(homedir(), ".node-flyway")}`;
export const DEFAULT_FLYWAY_CLI_STRATEGY = FlywayCliStrategy.LOCAL_CLI_WITH_DOWNLOAD_FALLBACK;
export const DEFAULT_FLYWAY_VERSION = FlywayVersion["V9.22.3"];