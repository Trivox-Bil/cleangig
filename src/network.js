import axios from "axios";

export const cleangigApi = axios.create({
    baseURL: 'https://cleangig.se/api',
    timeout: 10000,
    headers: {'Authorization': 'GgDg3XEb0ExiLFHupcujnTPZkWEZug5UHD2smprETO7eenYVN3ff6ypScBbmeCbR'},
});
