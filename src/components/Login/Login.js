//import liraries
import React, { Component } from "react";
import {
  TouchableOpacity,
  Alert,
  View,
  StyleSheet,
  Text,
  Image,
  Linking,
  Platform
} from "react-native";
import { StackActions, NavigationActions } from "react-navigation";
import firebase from "react-native-firebase";
import NavigationService from "../../network/NavigationService";

// create a component
class Login extends Component {
  constructor(props) {
    super(props);
    console.log("constructor");
  }

  onLoginPress = async () => {
    console.log("Login.js onLoginPress");
    NavigationService.navigate("OAuth", {});
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.logoContainer}>
          <Image
            style={styles.logo}
            source={require("../../images/logo.png")}
          />
        </View>
        <TouchableOpacity
          style={styles.applyScreenButton}
          onPress={this.onLoginPress}
        >
          <Text style={styles.applyText}>Login With Codechef</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5"
  },
  logoContainer: {
    alignItems: "center",
    flexGrow: 1,
    justifyContent: "center"
  },
  logo: {
    width: 250,
    height: 250,
    resizeMode: "contain"
  },
  title: {
    textAlign: "center",
    color: "#e17055",
    width: 200,
    marginTop: 10,
    fontSize: 25
  },
  applyScreenButton: {
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 80,
    height: 50,
    width: 250,
    backgroundColor: "#C9ADA7",
    borderRadius: 5,
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 3,
    elevation: 3,
    shadowColor: "#A9BCD0"
  },
  applyText: {
    textAlign: "center",
    paddingLeft: 10,
    paddingRight: 10,
    fontSize: 18
  }
});

//make this component available to the app
export default Login;
