import axios from "axios";

export const cleangigApi = axios.create({
    baseURL: 'https://cleangig.se/api',
    timeout: 20000,
    headers: {'Authorization': 'GgDg3XEb0ExiLFHupcujnTPZkWEZug5UHD2smprETO7eenYVN3ff6ypScBbmeCbR'},
});

export const sotApi = axios.create({
    baseURL: 'https://stadochtradgard.se/sot_api/',
    timeout: 20000,
    headers: {'Authorization': 'GgDg3XEb0ExiLFHupcujnTPZkWEZug5UHD2smprETO7eenYVN3ff6ypScBbmeCbR'},
});
