import client from "../../client";

export async function progressSummary() {
    try {
        const response = await client.get('/progress/summary/');
        return response
    } catch (e) {
        return (e)
    }
}

export async function progressHistory() {
    try {
        const response = await client.get('/progress/history/');
        return response
    } catch (e) {
        return (e)
    }
}