import React, { Component } from "react";
import {
  Platform,
  AsyncStorage,
  StyleSheet,
  FlatList,
  RefreshControl,
  Image,
  TouchableOpacity,
  View,
  Text,
  NetInfo
} from "react-native";
import firebase from "react-native-firebase";
import NavigationService from "../../network/NavigationService";
import Network from "../../network/Network";
import { BarIndicator } from "react-native-indicators";

class ChatContact extends React.Component {
  constructor(props) {
    super(props);
    this.state = { data: [], animating: false };
    this._onRefresh = this._onRefresh.bind(this);
    this.listener = this.props.navigation.addListener("didFocus", () =>
      this.refresh()
    );
  }

  componentDidMount() {
    this._onRefresh();
  }

  async _onRefresh() {
    this.setState({ animating: true });
    this.refresh();
  }

  async refresh() {
    await AsyncStorage.setItem("messageColor", "0");
    Network.getMessageList().then(data => {
      this.setState({ data: data.result.users, animating: false });
    });
  }

  async openChatOf(user) {
    console.log(user);
    let username = await AsyncStorage.getItem("username");
    console.log(username);
    NavigationService.navigate("ChatScreen", {
      sender: user,
      reciever: username
    });
  }

  onSelectFirst = data => {
    this.openChatOf(data);
  };

  newMessage = () => {
    NavigationService.navigate("Search", {
      type: "messageUsers",
      onSelect: this.onSelectFirst
    });
  };

  renderItem = ({ item }) => {
    return (
      <TouchableOpacity
        onPress={() => {
          this.openChatOf(item);
        }}
      >
        <View style={styles.cardView}>
          <Image
            style={{
              alignSelf: "center",
              height: 30,
              width: 30,
              marginTop: 5,
              marginBottom: 5,
              marginHorizontal: 10
            }}
            source={{ uri: "https://identicon.org?t=" + item + "&s=512.png" }}
          />
          <View
            style={{
              flexDirection: "row",
              flex: 1,
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <Text
              style={{
                paddingLeft: 20,
                flex: 1,
                textAlign: "left",
                fontSize: 14,
                fontWeight: "bold"
              }}
            >
              {item}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  render() {
    if (this.state.animating) {
      return <BarIndicator color="black" />;
    } else {
      return (
        <View style={styles.container}>
          <FlatList
            refreshControl={
              <RefreshControl
                refreshing={this.state.animating}
                onRefresh={this._onRefresh}
                tintColor="transparent"
              />
            }
            extraData={this.state}
            style={styles.searchList}
            data={this.state.data}
            renderItem={this.renderItem}
            keyExtractor={(item, index) => index.toString()}
          />
          <TouchableOpacity
            activeOpacity={0.5}
            onPress={this.newMessage}
            style={styles.TouchableOpacityStyle}
          >
            <Image
              source={require("../../images/new_message.png")}
              style={styles.FloatingButtonStyle}
            />
          </TouchableOpacity>
        </View>
      );
    }
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5"
  },
  searchList: {
    flex: 1,
    marginTop: Platform.OS === "ios" ? 0 : 5,
    backgroundColor: "#F5F5F5"
  },
  boldText: {
    // textAlign: 'left',
    // fontSize: 12,
    fontWeight: "bold"
    // marginTop: 3
  },
  cardView: {
    margin: 5,
    padding: 5,
    backgroundColor: "#dedede",
    borderRadius: 5,
    flex: 1,
    flexDirection: "row",
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 3,
    elevation: 2,
    shadowColor: "#A9BCD0"
  },
  separator: {
    flex: 1,
    height: 1,
    backgroundColor: "#8E8E8E"
  },
  TouchableOpacityStyle: {
    position: "absolute",
    width: 60,
    backgroundColor: "#B8BEDD",
    height: 60,
    alignItems: "center",
    justifyContent: "center",
    right: 30,
    bottom: 30,
    borderRadius: 30,
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 3,
    elevation: 2,
    shadowColor: "#A9BCD0"
  },
  FloatingButtonStyle: {
    resizeMode: "contain",
    width: 35,
    height: 35
  }
});

export default ChatContact;
