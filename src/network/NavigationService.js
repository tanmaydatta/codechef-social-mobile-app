import { StackActions, NavigationActions } from 'react-navigation';
import { func } from 'prop-types';

let _navigator;
let _routeName;
let _params;

function setTopLevelNavigator(navigatorRef) {
    _navigator = navigatorRef;
}

function navigate(routeName, params) {
    _routeName = routeName
    _params = params
    _navigator.dispatch(
        NavigationActions.navigate({
            routeName,
            params,
        })
    );
}

function getRouteName() {
    return _routeName
}

function getParams() {
    return _params
}

function reset(routeName, params) {
    _navigator.dispatch(
        StackActions.reset({
            index: 0,
            actions: [
                NavigationActions.navigate({
                    routeName,
                    params,
                }),
            ],
        }),
    );
}

// add other navigation functions that you need and export them

export default {
    navigate,
    setTopLevelNavigator,
    reset,
    getRouteName,
    getParams
};