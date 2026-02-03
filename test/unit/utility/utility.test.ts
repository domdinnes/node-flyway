import {describe, it} from 'mocha';
import {expect} from 'chai';
import {execute} from '../../../src/utility/utility';
import {ExecOptions} from 'node:child_process';

describe('execute', () => {
    it('should parse stdout even when process exits with failure', async () => {
        // Mock exec function that simulates a failed process with JSON output in stdout
        const mockExec = (
            command: string,
            options: ExecOptions,
            callback: (error: Error | null, stdout: string | Buffer, stderr: string | Buffer) => void
        ) => {
            const error = new Error('Command failed with exit code 1') as any;
            error.code = 1;

            const jsonOutput = JSON.stringify({
                "error": {
                    "errorCode": "ERROR",
                    "message": "Migration failed",
                    "stackTrace": null,
                    "lineNumber": null,
                    "path": null,
                },
            });

            // Simulate process failure but with JSON output in stdout
            callback(error, jsonOutput, '');

            return {} as any; // Return mock ChildProcess
        };

        const result = await execute('flyway migrate -outputType=json', {}, mockExec as any);

        expect(result.success).to.be.false;
        expect(result.response).to.equal(JSON.stringify({
            "error": {
                "errorCode": "ERROR",
                "message": "Migration failed",
                "stackTrace": null,
                "lineNumber": null,
                "path": null,
            },
        }));
    });

    it('should parse stdout when process exits successfully', async () => {
        // Mock exec function that simulates a successful process
        const mockExec = (
            command: string,
            options: ExecOptions,
            callback: (error: Error | null, stdout: string | Buffer, stderr: string | Buffer) => void
        ) => {
            const jsonOutput = JSON.stringify({
                "initialSchemaVersion": "1",
                "targetSchemaVersion": null,
                "schemaName": "",
                "migrations": [],
                "success": true,
                "operation": "migrate",
                "migrationsExecuted": 0
            });

            // Simulate successful execution
            callback(null, jsonOutput, '');

            return {} as any; // Return mock ChildProcess
        };

        const result = await execute('flyway migrate -outputType=json', {}, mockExec as any);

        expect(result.success).to.be.true;
        expect(result.response).to.equal(JSON.stringify({
            "initialSchemaVersion": "1",
            "targetSchemaVersion": null,
            "schemaName": "",
            "migrations": [],
            "success": true,
            "operation": "migrate",
            "migrationsExecuted": 0
        }));
    });
});
