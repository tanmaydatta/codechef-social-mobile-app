import React, { Component } from "react";
import {
  Platform,
  StyleSheet,
  FlatList,
  RefreshControl,
  Image,
  TouchableOpacity,
  View,
  Text
} from "react-native";
import firebase from "react-native-firebase";
import { GiftedChat, Send } from "react-native-gifted-chat";
import Network from "../../network/Network";
import realm from "../../network/Realm";

class ChatScreen extends React.Component {
  state = {
    messages: []
  };

  constructor(props) {
    super(props);
    this.listener = this.props.navigation.addListener("didFocus", () =>
      this._onRefresh("0")
    );
  }

  predicateBy(prop) {
    return function(a, b) {
      if (a[prop] < b[prop]) {
        return 1;
      } else if (a[prop] > b[prop]) {
        return -1;
      }
      return 0;
    };
  }

  _onRefresh(lastUpdatedAt) {
    this.setState({ messages: [] });
    const { navigation } = this.props;
    const sender = navigation.getParam("sender");
    const reciever = navigation.getParam("reciever");
    var newData = this.convertToArray("Message", sender, reciever);
    this.setState({ messages: newData });
    Network.getMessages(sender, lastUpdatedAt).then(data => {
      data = data.result;
      if (data != null) {
        for (let i = 0; i < data.length; i++) {
          key = data[i];
          realm.write(() => {
            realm.create(
              "Message",
              {
                id: key.id,
                fromUser: key.fromUser,
                toUser: key.toUser,
                message: key.message,
                createdAt: key.createdAt
              },
              true
            );
          });
        }
        var newData = this.convertToArray("Message", sender, reciever);
        this.setState({ messages: newData });
      }
    });
  }

  convertToArray(realmObject, sender, reciever) {
    var userQuery =
      'fromUser == "' + sender + '" OR toUser == "' + sender + '"';
    let copyOfJsonArray = Array.from(
      realm.objects(realmObject).filtered(userQuery)
    );
    let jsonArray = JSON.parse(JSON.stringify(copyOfJsonArray));
    let newArray = [];
    for (let i = 0; i < jsonArray.length; i++) {
      key = jsonArray[i];
      let id = 1;
      let name = reciever;
      if (key.fromUser == sender) {
        id = 2;
        name = sender;
      }
      newArray.push({
        _id: key.id,
        text: key.message,
        createdAt: key.createdAt,
        user: {
          _id: id,
          name: name,
          avatar: "https://identicon.org?t=" + sender + "&s=512.png"
        }
      });
    }

    newArray.sort(this.predicateBy("createdAt"));
    return newArray;
  }

  onSend(messages = []) {
    console.log(messages);
    const sender = this.props.navigation.getParam("sender");
    for (let i = 0; i < messages.length; i++) {
      Network.sendMessage(sender, messages[i].text).then(data => {
        console.log(data);
        realm.write(() => {
          realm.create(
            "Message",
            {
              id: data.result.id,
              fromUser: data.result.fromUser,
              toUser: data.result.toUser,
              message: data.result.message,
              createdAt: data.result.createdAt
            },
            true
          );
        });
        this.setState(previousState => ({
          messages: GiftedChat.append(previousState.messages, messages[i])
        }));
      });
    }
  }

  componentDidMount() {
    this.notificationListener = firebase
      .notifications()
      .onNotification(notification => {
        notification.android.setChannelId("test-channel");
        if (notification.title === "New Message") {
          if (this.props.navigation.isFocused()) {
            fiveMinutesAgo = String(new Date().getTime() - 5 * 60 * 1000);
            this._onRefresh(fiveMinutesAgo);
          }
        }
      });
  }

  componentWillUnmount() {
    this.notificationListener();
  }

  renderSend(props) {
    return (
      <Send {...props}>
        <View style={{ marginRight: 10, marginBottom: 5 }}>
          <Image
            style={{ height: 30, width: 30 }}
            source={require("../../images/send.png")}
            resizeMode={"center"}
          />
        </View>
      </Send>
    );
  }

  render() {
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
            {this.props.navigation.getParam("sender")}
          </Text>
          <View />
        </View>
        <GiftedChat
          style={{ flex: 1 }}
          messages={this.state.messages}
          onSend={messages => this.onSend(messages)}
          user={{
            _id: 1
          }}
          renderSend={this.renderSend}
        />
      </View>
    );
  }
}
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
    flex: 1,
    alignSelf: "center"
  },
  searchList: {
    flex: 1
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
    elevation: 3,
    shadowColor: "#A9BCD0"
  },
  separator: {
    flex: 1,
    height: 1,
    backgroundColor: "#8E8E8E"
  }
});

export default ChatScreen;
