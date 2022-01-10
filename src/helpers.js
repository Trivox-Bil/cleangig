import { CommonActions } from "@react-navigation/native";
import { parse } from "date-fns";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import * as Print from "expo-print";
import voca from "voca";
import counties, { county } from "./data/counties";
import { cleangigApi } from "./network";
import { map } from "lodash";

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

export function askForCamera() {
    return ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.5,
    })
}

export async function downloadFile(url) {
    const fileUri = FileSystem.documentDirectory + url.split('/').pop();

    const response = await FileSystem.createDownloadResumable(url, fileUri).downloadAsync();
    await Sharing.shareAsync(response.uri);
}

export function resetRoute(name) {
    return CommonActions.reset({ index: 0, routes: [{ name }] });
}

export function formatDate(dateStr, showTime) {
    const date = parse(dateStr, 'yyyy-MM-dd HH:mm:ss', new Date());
    let result = date.toLocaleDateString('sv-SE');
    if (showTime) result += '    ' + date.toLocaleTimeString('sv-SE');

    return result;
}

export function formatOrgNumber(number) {
    return number.substring(0, 6) + '-' + number.substring(6);
}

export function totalPayment(milestones) {
    const milestonePayment = m => m.rate * m.hours * (100 - m.deduction) / 100;
    return milestones.reduce((sum, m) => sum + milestonePayment(m), 0);
}

export async function createAndSavePdf(html, filename) {
    const { uri } = await Print.printToFileAsync({ html });
    const pdfName = `${FileSystem.documentDirectory}/${filename}.pdf`;

    await FileSystem.moveAsync({ from: uri, to: pdfName, });
    await Sharing.shareAsync(pdfName);
}

const fileToBase64 = (file, cb) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = function () {
        cb(null, reader.result)
    }
    reader.onerror = function (error) {
        cb(error, null)
    }
}

export function invoiceHtml({ job, invoice }) {
    const tableColumn = (carry, { description, rate, hours, deduction }) => {
        return carry + `
        <tr>
            <td>${voca.truncate(description, 20)}</td>
            <td>${rate} kr</td>
            <td>${hours}</td>
            <td>${parseInt(deduction) === 50 ? '50%' : '-'}</td>
            <td>${hours * rate}kr</td>
        </tr>
        `;
    };
    return `
        <!DOCTYPE html>
        <html lang="sv">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
                body { font-size: 12px; font-family: serif; }
                h1 { text-align: center; }
                .desc_table { padding-top: 20px; border-style: solid; border-width: 1px 0; }
                .desc_table td { padding: 12px; font-size: 14px }
                .desc_table tr { border-top: 2px solid #000; }
                table, tr { width: 100%;}
            </style>
        </head>
        <body>
            <h1>Faktura</h1>
            <table>
                <tbody>
                    <tr>
                        <td><img src="https://stadochtradgard.se/sot_api/images/logo-small.png" width="200"></td>
                        <td>
                          <div>Fakturadatum: ${formatDate(job.deadline)}</div>
                          <div>Fakturanummer: ${job.id}</div>
                          <div>Personnummer: ${job.customer.id}</div>
                        </td>
                    </tr>
                </tbody>
            </table>
            <table>
                <tbody>
                    <tr>
                        <td><h2 style="margin-bottom :0; padding-bottom: 0">Från:</h2></td>
                        <td><h2 style="margin-bottom :0; padding-bottom: 0">Faktureras:</h2></td>
                    </tr>
                    <tr>
                        <td>${job.provider.name}</td>
                        <td><span>${job.customer.fname} ${job.customer.lname}</span></td>
                    </tr>
                    <tr>
                        <td><div>${providerCountyName(job.provider.county_code)}</div></td>
                        <td><span>${job.street}${job.city ? `, ${job.city}` : ''}, ${counties.find(c => c.code === job.county_code).name}</span></td>
                    </tr>
                    <tr>
                        <td><img src="${job.provider.picture}" width="50" height="50"></td>
                        <td></td>
                    </tr>
                </tbody>
            </table>
            <table class="desc_table">
                <tbody>
                    <tr style="font-weight: bold">
                        <td>Beskrivning</td>
                        <td>Timtaxa</td>
                        <td>Timmar</td>
                        <td>RUT/ROTavdrag</td>
                        <td>Pris</td>
                    </tr>

                    ${invoice.reduce(tableColumn, '')}
                    <tr style="font-weight: bold">
                        <td></td>
                        <td></td>
                        <td></td>
                        <td>Total pris</td>
                        <td>${totalPayment(invoice)}kr</td>
                    </tr>
                    <tr style="font-weight: bold">
                        <td></td>
                        <td></td>
                        <td></td>
                        <td>Utan MOMS (25%)</td>
                        <td>${totalPayment(invoice) * .75}kr</td>
                    </tr>
                    <tr style="font-weight: bold">
                        <td></td>
                        <td></td>
                        <td></td>
                        <td><h2>Summa</h2></td>
                        <td><h2>${totalPayment(invoice)}kr</h2></td>
                    </tr>
                </tbody>
            </table>
            <p>Vi förbehåller oss rätten att fakturera återstående beloppet, motsvarande skattereduktionen, om begäran från svenska skatteverket avslås.</p>
            <table>
                <tbody>
                    <tr>
                        <td>Organisationsnummer</td>
                        <td>Telefon</td>
                    </tr>
                    <tr>
                        <td>${formatOrgNumber(job.provider.organisation_number)}</td>
                        <td>+46 ${job.provider.phone_number}</td>
                    </tr>
                    <tr>
                        <td>E-post</td>
                        <td></td>
                    </tr>
                    <tr>
                        <td>${job.provider.email}</td>
                        <td></td>
                    </tr>
                </tbody>
            </table>
        </body>
        </html>
        `;
}


// export async function fatchProject(jobId) {
//     const { data } = await cleangigApi.get(`customers/${user.id}/jobs`);
//     console.log(data)
// }

export const providerCountyName = (providerCounties) => {
    let countyName = [];
    map(providerCounties.split(","), countryCode => {
        countyName.push(county(countryCode).name);
    })
    return countyName.join();
}

export const readNotification = async (id) => {
    await cleangigApi.get(`read_notification/${id}`);
}