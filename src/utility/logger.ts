import * as debug from "debug";


export type Logger = {
  log: debug.Debugger  
};


export const getLogger = (loggerName: string): Logger => {
    return {
        log:  debug(`node-flyway:${loggerName}`)
    };
}
