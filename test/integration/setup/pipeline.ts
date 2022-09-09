import {enableLogging} from "../../../src/utility/logger";
import {testConfiguration} from "../utility/utility";
import {performDatabaseLivenessCheck} from "./setup";

export async function mochaGlobalSetup() {
    enableLogging("integration-test");
    const password = testConfiguration.password;
    const port = testConfiguration.port;

    await performDatabaseLivenessCheck(password, port);
}