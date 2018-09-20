import React, { Component } from "react";
import { AsyncStorage, Platform, Linking, WebView, View } from "react-native";
import { NavigationActions, StackActions } from "react-navigation";
import RNSecureKeyStore from "react-native-secure-key-store";
import Network from "../../network/Network";
import firebase from "react-native-firebase";
import NavigationService from "../../network/NavigationService";

const url =
  "https://api.codechef.com/oauth/authorize?response_type=code&client_id=7cecd56796986a7d2d5d9f8a78b050f1&redirect_uri=codechefsocial://launch&state=xyz";

class OAuth extends Component {
  componentDidMount() {
    Linking.addEventListener("url", this.handleOpenURL);
  }

  componentWillUnmount() {
    Linking.removeEventListener("url", this.handleOpenURL);
  }

  handleOpenURL = event => {
    this.navigate(event.url);
  };

  reset = () => {
    NavigationService.reset("TabBar", {});
  };

  goToError = () => {
    NavigationService.reset("Error", {});
  };

  navigate = url => {
    code = url.substring(url.indexOf("code=") + 5, url.indexOf("&state"));
    Network.getAccessToken(code).then(async data => {
      if (data.scope.split(" ").length == 5) {
        console.log(data.access_token);
        await AsyncStorage.setItem("accessToken", data.access_token);
        await AsyncStorage.setItem("lastUpdatedAt", "0");
        await AsyncStorage.setItem("lastUpdatedAtNotifications", "0");
        await AsyncStorage.setItem("notificationsColor", "0");
        await AsyncStorage.setItem("messageColor", "0");
        Network.getUserProfile("me").then(async userData => {
          await AsyncStorage.setItem("username", userData.username);
          Network.registerUser(
            userData.username,
            data.access_token,
            data.refresh_token
          ).then(finalData => {
            firebase
              .messaging()
              .getToken()
              .then(fcmToken => {
                if (fcmToken) {
                  Network.registerFcm(fcmToken, data.access_token).then(
                    registeredData => {
                      if (registeredData.result) {
                        this.reset();
                      }
                    }
                  );
                }
              });
          });
        });
      } else {
        this.goToError();
      }
    });
  };

  render() {
    return <WebView source={{ uri: url }} style={{ marginTop: 20 }} />;
  }
}

export default OAuth;
