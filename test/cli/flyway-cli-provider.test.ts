import { describe, it } from 'mocha';
import { FlywayCliProvider } from '../../src/cli/flyway-cli-provider';
import { expect } from "chai";
import { FlywayVersion } from '../../src';
import { FlywayCli, FlywayExecutable } from '../../src/cli/flyway-cli';
import { FlywayCliSource } from '../../src/types/types';

describe("FlywayCliProvider", () => {

    class ExampleFlywayCliProvider extends FlywayCliProvider {

        public getFlywayCli(): Promise<FlywayCli | undefined> {
            return Promise.resolve(
                new FlywayCli(
                    FlywayVersion["V4.0.0"],
                    FlywayCliSource.FILE_SYSTEM,
                    "example-location",
                    new FlywayExecutable("/some/path/flyway"),
                    "5ccf6ebd575189c2bc66c31ef7b01ae1"
                )
            );
        }

    }


    class UndefinedFlywayCliProvider extends FlywayCliProvider {

        public getFlywayCli(): Promise<FlywayCli | undefined> {
            return Promise.resolve(undefined);
        }

    }

    class ThrowingFlywayCliProvider extends FlywayCliProvider {

        public getFlywayCli(): Promise<FlywayCli | undefined> {
            throw new Error('Method intentionally not implemented.');
        }

    }

    it("can be chained together with other providers", async () => {

        const returningProvider = new ExampleFlywayCliProvider();
        const undefinedProvider = new UndefinedFlywayCliProvider();

        const cli = await undefinedProvider
            .chain(undefinedProvider)
            .chain(returningProvider)
            .chain(undefinedProvider)
            .getFlywayCli(FlywayVersion['V4.0.0']);

        expect(cli?.executable.path).to.equal("/some/path/flyway");
    });


    it("will execute next in the chain even if previous provider throws an error", async () => {

        const returningProvider = new ExampleFlywayCliProvider();
        const undefinedProvider = new UndefinedFlywayCliProvider();
        const throwingProvider = new ThrowingFlywayCliProvider();

        const cli = await undefinedProvider
            .chain(throwingProvider)
            .chain(undefinedProvider)
            .chain(returningProvider)
            .chain(throwingProvider)
            .getFlywayCli(FlywayVersion['V4.0.0']);

        expect(cli?.executable.path).to.equal("/some/path/flyway");
    });


})