import {CommonActions} from "@react-navigation/native";
import {parse} from "date-fns";

export function resetRoute(name) {
    return CommonActions.reset({index: 0, routes: [{name}]});
}

export function formatDate(dateStr) {
    const date = parse(dateStr, 'yyyy-MM-dd HH:mm:ss', new Date());
    return date.toLocaleDateString('sv-SE');
}
