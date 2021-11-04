import {CommonActions} from "@react-navigation/native";

export function resetRoute(name) {
    return CommonActions.reset({index: 0, routes: [{name}]});
}
