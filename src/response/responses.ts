import { FlywayVersion } from "../internal/flyway-version";
import { FlywayCommand } from "../types/types";

// Maybe converter accepts raw response - if no error field is found on the raw response the converter populates the value
export type FlywayRawExecutionResponse = {
    success: boolean,
    response: string
}


export type FlywayMigrateResponse = {
    initialSchemaVersion: string | undefined,
    targetSchemaVersion: string | undefined,
    schemaName: string,
    migrations: {
        category: string,
        version: string,
        description: string,
        type: string,
        filepath: string,
        executionTime: number
    }[],
    migrationsExecuted: number,
    success: boolean,
    flywayVersion: string,
    database: string,
    warnings: Array<any>,
    operation: FlywayCommand
}

export type FlywayCleanResponse = {
    schemasCleaned: Array<string>,
    schemasDropped: Array<string>,
    flywayVersion: string,
    database: string,
    warning: Array<any>,
    operation: FlywayCommand
};

export type FlywayInfoResponse = {
    schemaVersion: string | undefined,
    schemaName: string,
    migrations: {
        category: string,
        version: string,
        description: string,
        type: string,
        installedOnUTC: string,
        state: string,
        undoable: string,
        filepath: string,
        installedBy: string,
        executionTime: number
    }[],
    allSchemasEmpty: boolean,
    flywayVersion: string,
    database: string,
    warning: Array<any>,
    operation: FlywayCommand    
};

export type FlywayValidateResponse = {
    operation: FlywayCommand
};


export type FlywayUndoResponse = {
    operation: FlywayCommand
};


export type FlywayBaselineResponse = {
    operation: FlywayCommand
};

export type FlywayRepairResponse = {
    operation: FlywayCommand
};

export type FlywayResponse = FlywayMigrateResponse | FlywayCleanResponse | FlywayInfoResponse | FlywayValidateResponse | FlywayUndoResponse | FlywayBaselineResponse | FlywayRepairResponse;

export type FlywayErrorResponse = {
    errorCode?: string,
    message?: string
    stackTrace?: string
}

export type ParsedFlywayResponse<T extends FlywayResponse> = {
    error?: FlywayErrorResponse,
    flywayResponse?: T
}

export type NodeFlywayResponse<T extends FlywayResponse> = {
    success: boolean;
    error?: FlywayErrorResponse,
    flywayResponse?: T
    additionalDetails: {
        executionTime: number,
        flywayCli: {
            location: string,
            source: string, // To be converted to - keyof typeof FlywayCliSource
            version: string, // To be converted to - keyof typeof FlywayVersion
            hash: string
        }
    }
}
