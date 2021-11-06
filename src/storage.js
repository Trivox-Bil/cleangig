import NativeAsyncStorage from "@react-native-async-storage/async-storage";

export const USER_DATA_KEY = '@user';

export async function storeLocal(key, value) {
    try {
        await NativeAsyncStorage.setItem(JSON.stringify(key), JSON.stringify(value));
        return true;
    } catch (e) {
        console.error(e);
        return false;
    }
}

export async function getLocal(key, defaultValue = undefined) {
    try {
        const value = await NativeAsyncStorage.getItem(JSON.stringify(key));
        return value || defaultValue;
    } catch (e) {
        console.error(e);
        return null;
    }
}
