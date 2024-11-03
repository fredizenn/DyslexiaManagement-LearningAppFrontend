import client from "../../client";

export async function getReadingContents() {
    try {
        const response = await client.get('/text-content/');
        const data = response;
        return data;
    } catch (e) {
        console.log(e);
        return [];
    }
}