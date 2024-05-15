
# Node Flyway
<br>
<br>
<div align="center">
<img src="https://user-images.githubusercontent.com/10658609/187976342-0a8cd5e8-996b-400d-933c-62aa9b621762.svg" style="margin: 0 auto" alt="node-flyway logo" >
</div>
<br>
<br>
Apply version control to databases from within a Node.js application. 

Uses [Flyway](https://flywaydb.org/) for database version control, schema evolution and migrations.

Provides an easy and intuitive Node.js API including all Flyway commands: `migrate`, `clean`, `info`, `validate`, `baseline` & `repair`.

Can also be used as a command line utility to manage, interact with and install a Flyway CLI.



## Table of contents
- [Database version control explained](#database-version-control-explained)
- [Common Use Cases](#common-use-cases)
- [Install](#install)
- [Getting started](#getting-started)
- [API](#api)
  - [migrate](#api-migrate)
  - [clean](#api-clean)
  - [info](#api-info)
  - [validate](#api-validate)
  - [baseline](#api-baseline)
  - [repair](#api-repair)
  - [install](#api-install)
- [Error handling](#error-handling)
- [Configuration options](#configuration-options)
  - [Flyway configuration options](#flyway-configuration-options)
  - [Flyway configuration options (advanced)](#flyway-advanced-configuration)
  - [Execution options](#execution-options)
- [Using older versions of Flyway](#using-older-versions-of-Flyway)
- [Using node-flyway as a command-line tool](#using-node-flyway-as-a-command-line-tool)

<br>
<br>

## Database version control explained

### Why do databases require version control?

Within a code-base, the database will exist in several different places:
- Local developer machines
- Continuous integration pipelines
- Production/Demo/Test environments
- Ephemeral databases created for automated tests


While application data will differ between different environments (obviously customer data won't live on a developer's local machine), the data structure (tables/indexes/views) and the reference data should be identical across all database instances. Ongoing changes to the database structure also need to be applied across all database instances and environments in a way which is consistent, reproducible and deterministic.



### What are migrations?
Database versioning via `migrations` allows changes to the database structure to be managed in a simple way that's applied consistently across all database instances.

Migrations are simple SQL files with a version number which are applied sequentially to the database to modify its structure. 
A migration tool like `Flyway` will track which migrations have already been applied, and ensure that each migration is only applied once.

When we want to make a structural change to a database, new migrations can be created and added to the migration directory within the code-base. 
The migrations - along with the rest of the code are distributed across to the different environments.
The Flyway `migrate` command is executed (either on application start-up or at some other point) which loads all the migrations from the migration directory and applies any new ones against the database.
This process is completely deterministic, reproducible and independent of the environment in which it runs.
This allows the structure of the database to be identical across all environments.



More information about Flyway and database migrations can be found [here](https://flywaydb.org/documentation/getstarted/why).



<br>
<br>


## Common use cases

* To allow Node.js applications to evolve schema and perform database migrations via Flyway. Provides an easy-to-use and intuitive API.
* To manage a single/multiple Flyway installations on a machine. Without having to configure the system path or manually download a Flyway CLI.
* To be used as part of a CI/CD pipeline to execute Flyway commands or as part of a build script.
* For use cases such as running an in-memory/containerized database for testing, where it's necessary to apply Flyway migrations against the database programmatically when the tests execute.

<br>
<br>


## Install

```
npm install node-flyway
```

<br>
<br>

## Getting started

- The `node-flyway` package exports a single class named `Flyway`.
- The `Flyway` class provides instance methods for each Flyway command.
  - Each method returns a promise with the outcome of the command and additional information.
- To construct an instance the `Flyway` constructor accepts two arguments:
  - `config: FlywayConfig` - An object containing configuration properties for Flyway. This is where the database url, the database user/password & the migration locations are specified. More detail about the configuration properties can be found [here](#configuration-options).
  - `executionOptions?: ExecutionOptions` - An object containing options related to the behaviour of `node-flyway`. These options are defined [here](#configuration-options).

Here is some example code showing how to run the Flyway `migrate` command:
```ts
import { Flyway } from "node-flyway";


const flyway = new Flyway(
    {
        url:"jdbc:postgresql://localhost:5432/postgres",
        user:"postgres",
        password:"password",
        defaultSchema: "public",
        migrationLocations: ["src/migrations"]
    }
);


flyway.migrate().then(response => {
    if(!response.success) {
      // Handle failure case
      throw new Error(`Unable to execute migrate command. Error: ${response.error.errorCode}`);
    }
    else {
      // Handle response
    }
});
```

<br>
<br>

## API

### Overview

- The `Flyway` instance provides a method for each Flyway command.
- Each method returns a promise with the outcome of the command and additional information.
- Each method accepts an optional parameter specifying Flyway [configuration properties](#configuration-options).
- This parameter is the same `FlywayConfig` object accepted by the constructor.
- Config properties specified as a method parameter override an identical property passed to the constructor.
- In most use-cases all necessary properties can be defined in the constructor parameter rather than as a parameter on the method.
- As `node-flyway` is a typescript package. Type definitions exist for all methods.

### <a name="api-migrate"></a> migrate(config?: FlywayConfig)
#### Description
Applies migrations against a database.
For more information see the Flyway documentation for the [migrate command](https://flywaydb.org/documentation/command/migrate).

Information about possible configuration options is documented [here](#configuration-options).
#### Usage
```ts
flyway.migrate().then(response => {
  if(!response.success) {
    // Handle failure case
    throw new Error(`Unable to execute migrate command. Error: ${response.error.errorCode}`);
  }
  else {
    // Handle response
  }   
});
```
#### Example response
```js
const response = {
  success: true,
  flywayResponse: {
    initialSchemaVersion: null,
    targetSchemaVersion: '3',
    schemaName: '',
    migrations: [
      {
        category: 'Versioned',
        version: '1',
        description: 'TestMigration',
        type: 'SQL',
        filepath: '/Users/dominic.dinnes/code/node-flyway-local-testing/migrations/1_basic_migrations/V1__TestMigration.sql',
        executionTime: 101
      },
      {
        category: 'Versioned',
        version: '2',
        description: 'AnotherTestMigration',
        type: 'SQL',
        filepath: '/Users/dominic.dinnes/code/node-flyway-local-testing/migrations/1_basic_migrations/V2__AnotherTestMigration.sql',
        executionTime: 15
      }
    ],
    migrationsExecuted: 3,
    flywayVersion: '8.5.13',
    database: 'postgres',
    warnings: [],
    operation: 'migrate'
  },
  additionalDetails: {
    executionTime: 1559,
    flywayCli: {
      location: '/Users/dominic.dinnes/.node-flyway/flyway-8.5.13',
      source: 'FILE_SYSTEM',
      version: 'V8.5.13'
    }
  }
};
```

### <a name="api-clean"></a> clean(config?: FlywayConfig)
#### Description
Removes all schemas, tables and objects managed by Flyway.
This effectively resets a database and shouldn't be run against production.
For more information see the Flyway documentation for the [clean command](https://flywaydb.org/documentation/command/clean).

Information about possible configuration options is documented [here](#configuration-options).
#### Usage
```ts
flyway.clean().then(response => {
  if(!response.success) {
    // Handle failure case
    throw new Error(`Unable to execute clean command. Error: ${response.error.errorCode}`);
  }
  else {
    // Handle response
  }
});
```
#### Example response
```js
const response = {
  success: true,
  flywayResponse: {
    schemasCleaned: [ 'public' ],
    schemasDropped: [],
    flywayVersion: '8.5.13',
    database: 'postgres',
    warnings: [],
    operation: 'clean'
  },
  additionalDetails: {
    executionTime: 1254,
    flywayCli: {
      location: '/Users/dominic.dinnes/.node-flyway/flyway-8.5.13',
      source: 'FILE_SYSTEM',
      version: 'V8.5.13'
    }
  }
}
```


### <a name="api-info"></a> info(config?: FlywayConfig)
#### Description
Returns information about the applied migrations.
For more information see the Flyway documentation for the [info command](https://flywaydb.org/documentation/command/info).

Information about possible configuration options is documented [here](#configuration-options).
#### Usage
```ts
flyway.info().then(response => {
  if(!response.success) {
    // Handle failure case
    throw new Error(`Unable to execute info command. Error: ${response.error.errorCode}`);
  }
  else {
    // Handle response
  }
});
```
#### Example response
```js
const response = {
  success: true,
  flywayResponse: {
    schemaVersion: '3',
    schemaName: '',
    migrations: [
      {
        category: 'Versioned',
        version: '1',
        description: 'TestMigration',
        type: 'SQL',
        installedOnUTC: '2022-08-29T23:23:41.560548Z',
        state: 'Success',
        undoable: '',
        filepath: '/Users/dominic.dinnes/node-flyway-local-testing/migrations/1_basic_migrations/V1__TestMigration.sql',
        undoFilepath: '',
        installedBy: 'postgres',
        executionTime: 108
      },
      {
        category: 'Versioned',
        version: '2',
        description: 'AnotherTestMigration',
        type: 'SQL',
        installedOnUTC: '2022-08-29T23:23:41.572644Z',
        state: 'Success',
        undoable: '',
        filepath: '/Users/dominic.dinnes/node-flyway-local-testing/migrations/1_basic_migrations/V2__AnotherTestMigration.sql',
        undoFilepath: '',
        installedBy: 'postgres',
        executionTime: 13
      }
    ],
    allSchemasEmpty: false,
    flywayVersion: '8.5.13',
    database: 'postgres',
    warnings: [],
    operation: 'info'
  },
  additionalDetails: {
    executionTime: 1267,
    flywayCli: {
      location: '/Users/dominic.dinnes/.node-flyway/flyway-8.5.13',
      source: 'FILE_SYSTEM',
      version: 'V8.5.13'
    }
  }
}
```

### <a name="api-validate"></a> validate(config?: FlywayConfig)
#### Description
Validates the pending migrations against the applied migrations.
For more information see the Flyway documentation for the [validate command](https://flywaydb.org/documentation/command/validate).

Information about possible configuration options is documented [here](#configuration-options).
#### Usage
```js
flyway.validate().then(response => {
  if(!response.success) {
    // Handle failure case
    throw new Error(`Unable to execute validate command. Error: ${response.error.errorCode}`);
  }
  else {
    // Handle response
  }
});
```
#### Example response
```js
const response = {
  success: true,
  flywayResponse: {
    validationFailureDetails: {
      errorCode: 'VALIDATE_ERROR',
      errorMessage: 'Migrations have failed validation'
    },
    invalidMigrations: [
      {
        version: '1',
        description: 'TestMigration',
        filepath: '',
        validationFailureDetails: {
          errorCode: 'APPLIED_VERSIONED_MIGRATION_NOT_RESOLVED',
          errorMessage: 'Detected applied migration not resolved locally: 1.'
        }
      },
      {
        version: '2',
        description: 'AnotherTestMigration',
        filepath: '',
        validationFailureDetails: {
          errorCode: 'APPLIED_VERSIONED_MIGRATION_NOT_RESOLVED',
          errorMessage: 'Detected applied migration not resolved locally: 2'
        }
      }
    ],
    validationSuccessful: false,
    validateCount: 0,
    flywayVersion: '8.5.13',
    database: 'postgres',
    warnings: [],
    operation: 'validate'
  },
  additionalDetails: {
    executionTime: 1238,
    flywayCli: {
      location: '/Users/dominic.dinnes/.node-flyway/flyway-8.5.13',
      source: 'FILE_SYSTEM',
      version: 'V8.5.13'
    }
  }
}

```

### <a name="api-baseline"></a> baseline(config?: FlywayConfig)
#### Description
Creates a baseline migration at a specific version. Pending migrations at or below this version won't be applied.
For more information see the Flyway documentation for the [baseline command](https://flywaydb.org/documentation/command/baseline).

Information about possible configuration options is documented [here](#configuration-options).
#### Usage
```ts
flyway.baseline().then(response => {
  if(!response.success) {
    // Handle failure case
    throw new Error(`Unable to execute baseline command. Error: ${response.error.errorCode}`);
  }
  else {
    // Handle response
  }
});
```


### <a name="api-repair"></a> repair(config?: FlywayConfig)
#### Description
Performs several functions including:
- Aligns checksums of pending migrations, where the checksum has changed vs the applied migration.
- Cleans up failed migrations for databases without DDL transactions. 

For more information see the Flyway documentation for the [repair command](https://flywaydb.org/documentation/command/repair).

Information about possible configuration options is documented [here](#configuration-options).
#### Usage
```ts
flyway.repair().then(response => {
  if(!response.success) {
    // Handle failure case
    throw new Error(`Unable to execute repair command. Error: ${response.error.errorCode}`);
  }
  else {
    // Handle response
  }
});
```

<br>
<br>

## Error handling
To be added.

<br>
<br>

## Configuration options

### Flyway configuration options

These options modify the behaviour of the underlying Flyway instance. 
They form the `FlywayConfig` type, which is passed as a constructor argument into an instance of the `Flyway` class and as an argument into each of the `Flyway` instance methods.
There are five basic configuration properties: `url`/`user`/`password`/`defaultSchema`/`migrationLocations`. 
These five properties cover the majority of use cases. Additional configuration can be specified under the `FlywayConfig.advanced`. 

The `FlywayConfig` type looks like this:

```ts
type FlywayConfig = {
    url: string,
    user: string,
    password?: string,
    defaultSchema?: string,
    migrationLocations: string[],
    advanced: FlywayAdvancedConfig
}
```

#### url
- The url connection string to connect to the database. 
- For example: `jdbc:postgresql://localhost:5432/postgres` 

#### user
- The database user used to connect to the database.

#### password (optional)
- The password used to authenticate.

#### defaultSchema (optional)
- The default schema managed by Flyway.
- This is where the flyway history table will be created.
- Additional schemas can be specified by setting the `advanced.schemas` property.

#### migrationLocations
- An array of strings, where each string corresponds to the path of a directory containing Flyway migrations.


### Flyway advanced configuration
The advanced configuration includes 40+ additional configuration properties. 
Currently these correspond to all the community edition configuration options defined by Flyway. 
These are documented in the [Flyway docs](https://flywaydb.org/documentation/configuration/parameters/).  

### Execution options
The execution options modify the behaviour of `node-flyway`.
For many use-cases these don't need to be specified as the default values are sufficient.

`node-flyway` works by using an underlying Flyway CLI to execute commands. 
The execution options are used to specify how the Flyway CLI is sourced, such as whether it is downloaded automatically or picked up from the host system. 
By default `node-flyway` will look for a target CLI on the host system under the default location: `~/.node-flyway`.
If it's unable to be found here, it will be downloaded and stored in the default location where it will be picked up during subsequent executions.
This process can be modified via the `flywayCliStrategy` property.
The location where the CLI is downloaded to/read from can be specified by using the `flywayCliLocation` property. 

```ts
type ExecutionOptions = {
    flywayCliLocation?: string,
    flywayCliStrategy?: FlywayCliStrategy
};

enum FlywayCliStrategy {
    LOCAL_CLI_ONLY,
    LOCAL_CLI_ONLY_OPTIMIZED,
    LOCAL_CLI_WITH_DOWNLOAD_FALLBACK,
    DOWNLOAD_CLI_AND_CLEAN
}
```

#### flywayCliLocation
The location of the Flyway CLI on the host system.
Depending on the used strategy, this can be either the target location to download a CLI or the location where a pre-installed CLI is expected to exist. 
The default location is `~/.node-flyway`.

#### flywayCliStrategy
The strategy used to find a CLI.
These include:
1. `LOCAL_CLI_ONLY` - Searches the directory specified by `flywayCliLocation` and any subdirectories for the target CLI. Will throw an error if no CLI is found.
2. `LOCAL_CLI_ONLY_OPTIMISED` - Searches only the directory specified by `flywayCliLocation` throwing an exception if the target CLI isn't found. This is the preferred option for environments where performance is critical.
3. `LOCAL_CLI_WITH_DOWNLOAD_FALLBACK` - Searches the directory specified by `flywayCliLocation`. If no Flyway CLI is found, the target version is downloaded and saved to `flywayCliLocation`. This is the default option and is suitable for most use cases.
4. `DOWNLOAD_CLI_AND_CLEAN` - Downloads the target Flyway CLI, storing it in the `flywayCliLocation`. After a command has been executed, the CLI is removed from the local system.

<br>
<br>

## Using older versions of Flyway
Coming soon.

<br>
<br>

## Using node-flyway as a command line tool
Coming soon.



