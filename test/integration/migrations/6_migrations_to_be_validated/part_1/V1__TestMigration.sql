CREATE TABLE application_user (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    email TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL
);