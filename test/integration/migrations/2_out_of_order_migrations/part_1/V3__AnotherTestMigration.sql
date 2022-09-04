CREATE ROLE behemoth_role LOGIN PASSWORD 'behemoth_password';
GRANT ALL PRIVILEGES ON DATABASE behemoth_test TO behemoth_role;


CREATE TABLE application_user (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    email TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL
);