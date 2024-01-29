import HttpClient from '../apis/HttpClient';

export async function getTopPostItemService() {
    const COUNT = 5;
    try {
        const res = await HttpClient.get(`api/v1/post/top/${COUNT}`);
        return res.data;
    } catch (error) {
        console.error(error);
    }
}
