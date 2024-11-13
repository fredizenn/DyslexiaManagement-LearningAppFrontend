/* eslint-disable @typescript-eslint/no-explicit-any */
import client from "../../client";

export async function signUp(data: any) {
    try {
        const response = await client.post('/register/', {...data});
        return response;
    } catch (e) {
        return e;
    }
}