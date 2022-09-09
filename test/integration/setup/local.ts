import {enableLogging} from "../../../src/utility/logger";
import {testConfiguration} from "../utility/utility";
import {createContainerizedDatabase, performDatabaseLivenessCheck} from "./setup";

export async function mochaGlobalSetup() {
    enableLogging("integration-test");
    const password = testConfiguration.password;
    const port = testConfiguration.port;

    await createContainerizedDatabase(password, port);
    await performDatabaseLivenessCheck(password, port);
}

