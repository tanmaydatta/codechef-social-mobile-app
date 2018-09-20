//import liraries
import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  Platform,
  Image,
  TouchableOpacity,
  WebView,
  Linking
} from "react-native";
import Markdown from "react-native-markdown-text";
import Network from "../../network/Network";
import HTML from "react-native-render-html";
import HTMLView from "react-native-htmlview";
import { BarIndicator } from "react-native-indicators";
import { alibabaUrl } from "../../network/Url";

const errorPage = () => {
  return <Text>{"page not found "}</Text>;
};
const decode = require("decode-html");
var DomParser = require("react-native-html-parser").DOMParser;
const server = "10.14.123.46:8090";
class Problem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: "",
      name: "",
      animating: true
    };
    this.listener = this.props.navigation.addListener("didFocus", () =>
      this.onLoad()
    );

    this.onLoad = this.onLoad.bind(this);

    // console.log(decode('&lt;div class="hidden"&gt;NON&amp;SENSE&apos;s&lt;/div&gt;'));
  }

  onError = () => {
    return <View />;
  };

  onLoad = () => {
    console.log("calling api");
    this.setState({ animating: true });
    problemData = Network.getProblem(
      this.props.navigation.getParam("code"),
      this.props.navigation.getParam("pcode")
    ).then(data => {
      console.log(data.body);
      let doc = new DomParser().parseFromString(data.body, "text/html");
      console.log(doc);
      this.setState({
        data: data.body,
        name: data.problemName,
        animating: false
      });
      console.log(this.state.data);
    });
  };

  render() {
    if (this.state.animating) {
      return <BarIndicator color="black" />;
    } else {
      return (
        <View style={styles.container}>
          <View style={styles.toolbar}>
            <TouchableOpacity
              style={styles.toolbarButton}
              onPress={() => {
                this.props.navigation.goBack(null);
              }}
            >
              <Image
                style={styles.toolbarButton}
                source={require("../../images/back.png")}
              />
            </TouchableOpacity>
            <Text style={styles.toolbarTitle}>
              {this.props.navigation.getParam("pcode")}
            </Text>
            <Text> </Text>
          </View>
          <WebView
            javaScriptEnabled={true}
            originWhitelist={["*"]}
            style={styles.container}
            renderError={errorPage}
            onError={() => {}}
            source={{
              uri:
                alibabaUrl +
                "/codechef-social-server/api/problems/" +
                this.props.navigation.getParam("code") +
                "/code/" +
                this.props.navigation.getParam("pcode") +
                "/get"
            }}
          />
        </View>
      );
    }
  }
}

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  toolbar: {
    backgroundColor: "#dedede",
    paddingTop: Platform.OS === "ios" ? 25 : 10,
    paddingBottom: 10,
    flexDirection: "row",
    alignItems: "center" //Step 1
  },
  toolbarButton: {
    height: 20,
    width: 20,
    marginLeft: 3
  },
  toolbarTitle: {
    fontSize: 20,
    textAlign: "center",
    fontWeight: "bold",
    flex: 1
  }
});

//make this component available to the app
export default Problem;
