import {inspect} from "util";

export const testUrl = "jdbc:postgresql://localhost:2575/postgres";
export const testUser = "postgres";
export const testPassword = "password123";
export const testSchema = "public";


export const testConfiguration = {
    url: "jdbc:postgresql://localhost:2575/postgres",
    user: "postgres",
    password: "password123",
    defaultSchema: "public"
};

export const inspectResponse = (response: any) => {
    return inspect(response, {showHidden: false, depth: null, colors: true});
}

export const logResponse = (response: any) => {
    console.log(inspectResponse(response));
}

