import debug from "debug";


export type Logger = {
  log: debug.Debugger  
};

export type LoggerType = "default" | "integration-test";


export const getLogger = (loggerName: string, loggerType?: LoggerType): Logger => {

    const namespace = loggerType == undefined || loggerType == "default" ? "node-flyway" : loggerType;

    return {
        log:  debug(`${namespace}:${loggerName}`)
    };
}

export const enableLogging = (loggerType?: LoggerType) => {
    const namespace = loggerType == undefined || loggerType == "default" ? "node-flyway" : loggerType;

    debug.enable(`${namespace}:*`);
}

