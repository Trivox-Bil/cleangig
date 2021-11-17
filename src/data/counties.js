const counties = [
    {
        "code": "AB",
        "name": "Stockholm",
        "cities": ["Upplands Väsby", "Vallentuna", "Österåker", "Värmdö", "Järfälla", "Ekerö", "Huddinge", "Botkyrka", "Salem", "Haninge", "Tyresö", "Upplands-Bro", "Nykvarn", "Täby", "Danderyd", "Sollentuna", "Stockholm", "Södertälje", "Nacka", "Sundbyberg", "Solna", "Lidingö", "Vaxholm", "Norrtälje", "Sigtuna", "Nynäshamn"],
    },
    {
        "code": "AC",
        "name": "Västerbotten",
        "cities": ["Nordmaling", "Bjurholm", "Vindeln", "Robertsfors", "Norsjö", "Malå", "Storuman", "Sorsele", "Dorotea", "Vännäs", "Vilhelmina", "Åsele", "Umeå", "Lycksele", "Skellefteå"],
    },
    {
        "code": "BD",
        "name": "Norrbotten",
        "cities": ["Arvidsjaur", "Arjeplog", "Jokkmokk", "Överkalix", "Kalix", "Övertorneå", "Pajala", "Gällivare", "Älvsbyn", "Luleå", "Piteå", "Boden", "Haparanda", "Kiruna"],
    },
    {
        "code": "C",
        "name": "Uppsala",
        "cities": ["Håbo", "Älvkarleby", "Knivsta", "Heby", "Tierp", "Uppsala", "Enköping", "Östhammar"],
    },
    {
        "code": "D",
        "name": "Södermanland",
        "cities": ["Vingåker", "Gnesta", "Nyköping", "Oxelösund", "Flen", "Katrineholm", "Eskilstuna", "Strängnäs", "Trosa"],
    },
    {
        "code": "E",
        "name": "Östergötland",
        "cities": ["Ödeshög", "Ydre", "Kinda", "Boxholm", "Åtvidaberg", "Finspång", "Valdemarsvik", "Linköping", "Norrköping", "Söderköping", "Motala", "Vadstena", "Mjölby"],
    },
    {
        "code": "F",
        "name": "Jönköping",
        "cities": ["Aneby", "Gnosjö", "Mullsjö", "Habo", "Gislaved", "Vaggeryd", "Jönköping", "Nässjö", "Värnamo", "Sävsjö", "Vetlanda", "Eksjö", "Tranås"],
    },
    {
        "code": "G",
        "name": "Kronoberg",
        "cities": ["Uppvidinge", "Lessebo", "Tingsryd", "Alvesta", "Älmhult", "Markaryd", "Växjö", "Ljungby"],
    },
    {
        "code": "H",
        "name": "Kalmar",
        "cities": ["Högsby", "Torsås", "Mörbylånga", "Hultsfred", "Mönsterås", "Emmaboda", "Kalmar", "Nybro", "Oskarshamn", "Västervik", "Vimmerby", "Borgholm"],
    },
    {
        "code": "I",
        "name": "Gotland",
        "cities": ["Gotland"],
    },
    {
        "code": "K",
        "name": "Blekinge",
        "cities": ["Olofström", "Karlskrona", "Ronneby", "Karlshamn", "Sölvesborg"],
    },
    {
        "code": "M",
        "name": "Skåne",
        "cities": ["Svalöv", "Staffanstorp", "Burlöv", "Vellinge", "Östra Göinge", "Örkelljunga", "Bjuv", "Kävlinge", "Lomma", "Svedala", "Skurup", "Sjöbo", "Hörby", "Höör", "Tomelilla", "Bromölla", "Osby", "Perstorp", "Klippan", "Åstorp", "Båstad", "Malmö", "Lund", "Landskrona", "Helsingborg", "Höganäs", "Eslöv", "Ystad", "Trelleborg", "Kristianstad", "Simrishamn", "Ängelholm", "Hässleholm"],
    },
    {
        "code": "N",
        "name": "Halland",
        "cities": ["Hylte", "Halmstad", "Laholm", "Falkenberg", "Varberg", "Kungsbacka"],
    },
    {
        "code": "O",
        "name": "Västra Götaland",
        "cities": ["Härryda", "Partille", "Öckerö", "Göteborg", "Stenungsund", "Tjörn", "Orust", "Sotenäs", "Munkedal", "Tanum", "Dals-Ed", "Färgelanda", "Ale", "Lerum", "Vårgårda", "Bollebygd", "Grästorp", "Essunga", "Karlsborg", "Gullspång", "Tranemo", "Bengtsfors", "Mellerud", "Lilla Edet", "Mark", "Svenljunga", "Herrljunga", "Vara", "Götene", "Tibro", "Töreboda", "Göteborg", "Mölndal", "Kungälv", "Lysekil", "Uddevalla", "Strömstad", "Vänersborg", "Trollhättan", "Alingsås", "Borås", "Ulricehamn", "Åmål", "Mariestad", "Lidköping", "Skara", "Skövde", "Hjo", "Tidaholm", "Falköping"],
    },
    {
        "code": "S",
        "name": "Värmland",
        "cities": ["Kil", "Eda", "Torsby", "Storfors", "Hammarö", "Munkfors", "Forshaga", "Grums", "Årjäng", "Sunne", "Karlstad", "Kristinehamn", "Filipstad", "Hagfors", "Arvika", "Säffle"],
    },
    {
        "code": "T",
        "name": "Örebro",
        "cities": ["Lekeberg", "Laxå", "Hallsberg", "Degerfors", "Hällefors", "Ljusnarsberg", "Örebro", "Kumla", "Askersund", "Karlskoga", "Nora", "Lindesberg"],
    },
    {
        "code": "U",
        "name": "Västmanland",
        "cities": ["Skinnskatteberg", "Surahammar", "Kungsör", "Hallstahammar", "Norberg", "Västerås", "Sala", "Fagersta", "Köping", "Arboga"],
    },
    {
        "code": "W",
        "name": "Dalarna",
        "cities": ["Vansbro", "Malung-Sälen", "Gagnef", "Leksand", "Rättvik", "Orsa", "Älvdalen", "Smedjebacken", "Mora", "Falun", "Borlänge", "Säter", "Hedemora", "Avesta", "Ludvika"],
    },
    {
        "code": "X",
        "name": "Gävleborg",
        "cities": ["Ockelbo", "Hofors", "Ovanåker", "Nordanstig", "Ljusdal", "Gävle", "Sandviken", "Söderhamn", "Bollnäs", "Hudiksvall"],
    },
    {
        "code": "Y",
        "name": "Västernorrland",
        "cities": ["Ånge", "Timrå", "Härnösand", "Sundsvall", "Kramfors", "Sollefteå", "Örnsköldsvik"],
    },
    {
        "code": "Z",
        "name": "Jämtland",
        "cities": ["Ragunda", "Bräcke", "Krokom", "Strömsund", "Åre", "Berg", "Härjedalen", "Östersund"],
    }
];

export function county(code) {
    const county = counties.find(c => c.code === code);
    return county || {code: '', name: '', cities: []};
}

export default counties;
