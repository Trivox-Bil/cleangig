import {CommonActions} from "@react-navigation/native";
import {parse} from "date-fns";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";

export const colors = {
    orange: '#ff7000',
    lightBlue: '#00a2f9',
    blue: '#ff7000',
    gray: '#cacaca',
};

export default function askForPicture() {
    return ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
    });
}

export async function downloadFile(url) {
    const fileUri = FileSystem.documentDirectory + url.split('/').pop();

    const downloadObject = FileSystem.createDownloadResumable(
        url,
        fileUri,
    );
    const response = await downloadObject.downloadAsync();

    await Sharing.shareAsync(response.uri);
}

export function resetRoute(name) {
    return CommonActions.reset({index: 0, routes: [{name}]});
}

export function formatDate(dateStr, showTime) {
    const date = parse(dateStr, 'yyyy-MM-dd HH:mm:ss', new Date());
    let result = date.toLocaleDateString('sv-SE');
    if (showTime) result += '     ' + date.toLocaleTimeString('sv-SE');

    return result;
}

export function formatOrgNumber(number) {
    return number.substring(0, 6) + '-' + number.substring(6);
}
