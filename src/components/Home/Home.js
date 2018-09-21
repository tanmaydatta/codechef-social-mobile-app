import React, { Component } from "react";
import {
  Platform,
  RefreshControl,
  Alert,
  Image,
  FlatList,
  StyleSheet,
  View,
  Text,
  AsyncStorage,
  TouchableOpacity
} from "react-native";
import firebase from "react-native-firebase";
import Network from "../../network/Network";
import Moment from "moment";
import realm from "../../network/Realm";
import TimerMixin from "react-timer-mixin";
import NavigationService from "../../network/NavigationService";
import { BarIndicator } from "react-native-indicators";

mixins: [TimerMixin];
class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      animating: false,
      lastUpdatedAt: String(new Date().getTime())
    };
    this._onRefresh = this._onRefresh.bind(this);
    this.listener = this.props.navigation.addListener("didFocus", () => {
      console.log("didfocus");
      this._onRefresh();
    });
  }
  componentDidMount() {
    var millisecondsQuery =
      "createdAt < " + String(new Date().getTime() - 7 * 24 * 60 * 60 * 1000);
    console.log(millisecondsQuery);
    let oldPosts = realm.objects("HomeFeed").filtered(millisecondsQuery);
    realm.write(() => {
      realm.delete(oldPosts);
      console.log("deleted");
    });
    // console.log("componentDidMount");
    // this._onRefresh();
    firebase
      .messaging()
      .hasPermission()
      .then(enabled => {
        if (enabled) {
          // user has permissions
          console.log("enabld");
        } else {
          // user doesn't have permission
          firebase
            .messaging()
            .requestPermission()
            .then(() => {
              // User has authorised
            })
            .catch(error => {
              // User has rejected permissions
            });
        }
      });
    firebase
      .messaging()
      .getToken()
      .then(fcmToken => {
        if (fcmToken) {
          // user has a device token
          console.log("has token: " + fcmToken);
        } else {
          // user doesn't have a device token yet
          console.log("no token");
        }
      });
    const channel = new firebase.notifications.Android.Channel(
      "test-channel",
      "Test Channel",
      firebase.notifications.Android.Importance.Max
    ).setDescription("My apps test channel");
    firebase.notifications().android.createChannel(channel);

    this.notificationOpenedListener = firebase
      .notifications()
      .onNotificationOpened(notificationOpen => {
        // Get the action triggered by the notification being opened
        const action = notificationOpen.action;
        // Get information about the notification that was opened
        const notification = notificationOpen.notification;
        console.log(action);
        console.log(notification);
        if (notification.title !== "New Message") {
          NavigationService.navigate("Notifications");
        } else {
          NavigationService.navigate("Messages");
        }
        firebase
          .notifications()
          .removeDeliveredNotification(notification._notificationId);
      });

    this.notificationListener = firebase
      .notifications()
      .onNotification(async notification => {
        console.log(notification);
        notification.android.setChannelId("test-channel");
        //     console.log(notification);
        console.log("Home Screen");
        console.log(NavigationService.getRouteName());
        console.log(NavigationService.getParams());
        let body = notification.body.split(" ");
        if (
          notification.title === "New Message" &&
          NavigationService.getRouteName() === "ChatScreen" &&
          NavigationService.getParams().sender === body[0]
        ) {
          await AsyncStorage.setItem("messageColor", "1");
        } else {
          await AsyncStorage.setItem("notificationsColor", "1");
          firebase.notifications().displayNotification(notification);
        }
        // Process your notification as required
      });
  }

  componentWillUnmount() {
    this.notificationListener();
    this.messageListener();
    clearTimeout(this.interval);
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

  convertToArray(realmObjectsArray) {
    let copyOfJsonArray = Array.from(realmObjectsArray);
    let jsonArray = JSON.parse(JSON.stringify(copyOfJsonArray));
    jsonArray.sort(this.predicateBy("feedDate"));
    this.setState({
      ...this.state,
      lastUpdatedAt: jsonArray[jsonArray.length - 1].feedDate
    });
    console.log(jsonArray[jsonArray.length - 1]);
    return jsonArray;
  }

  async _onRefresh() {
    this.setState({ animating: true });
    this.refresh(String(new Date().getTime()));
  }

  async refresh(lastUpdatedAt) {
    console.log(lastUpdatedAt);
    Network.getFeed(lastUpdatedAt).then(async data => {
      if (data != null) {
        let resultArray = data.result;
        var queue = [];
        for (let i = 0; i < resultArray.length; i++) {
          key = resultArray[i];
          if (key.type == "CONTEST") {
            queue.push(key);
            contestData = await Network.getContestDetails(key.contestCode);
            var temp = queue.shift();
            realm.write(() => {
              realm.create(
                "HomeFeed",
                {
                  type: temp.type,
                  contestCode: temp.contestCode,
                  contestName: contestData.name,
                  feedDate: temp.feedDate,
                  id: temp.id,
                  createdAt: temp.createdAt,
                  contestStartDate: contestData.startDate,
                  contestEndDate: contestData.endDate
                },
                true
              );
            });
          } else if (key.type == "SUBMISSION") {
            realm.write(() => {
              realm.create(
                "HomeFeed",
                {
                  type: key.type,
                  actionUser: key.actionUser,
                  submissionResult: key.submissionResult,
                  submissionId: key.submissionId,
                  problemCode: key.problemCode,
                  contestCode: key.contestCode,
                  feedDate: key.feedDate,
                  id: key.id,
                  createdAt: key.createdAt
                },
                true
              );
            });
          }
        }
        var newData = this.convertToArray(realm.objects("HomeFeed"));
        this.setState({ data: newData, animating: false });
      }
    });
  }

  msToTime(duration) {
    var date = new Date(duration);
    return Moment(date).format("Do MMM YYYY, HH:mm");
  }

  timeToMs(time) {
    var date = Moment(time, "YYYY-MM-DD HH:mm:ss")
      .toDate()
      .getTime();
    return date;
  }

  onClickContest(item) {
    let data = { code: item.contestCode };
    let now = new Date().getTime();
    let contestStart = this.timeToMs(item.contestStartDate);
    if (contestStart < now) {
      NavigationService.navigate("ContestProblems", { item: data });
    } else {
      Alert.alert(
        "Forbidden",
        "Contest is yet to start",
        [
          {
            text: "Cancel",
            onPress: () => console.log("Cancel Pressed"),
            style: "cancel"
          }
        ],
        { cancelable: false }
      );
    }
  }

  onClickSubmission(submissionId) {
    console.log("here");
    this.setState({ animating: true });
    Network.getSourceCode(submissionId).then(data => {
      this.setState({ animating: false });
      if (data.status == "OK") {
        console.log(data.result.data.content.code);
        NavigationService.navigate("Submission", {
          code: data.result.data.content.code
        });
      } else {
        Alert.alert(
          "Forbidden",
          "Submission is not available yet",
          [
            {
              text: "Cancel",
              onPress: () => console.log("Cancel Pressed"),
              style: "cancel"
            }
          ],
          { cancelable: false }
        );
      }
    });
  }

  renderItem = ({ item }) => {
    if (item.type == "SUBMISSION") {
      var icon = require("../../images/success.png");
      if (item.submissionResult == "WA") {
        icon = require("../../images/wrong.png");
      } else if (item.submissionResult == "CTE") {
        icon = require("../../images/cte.png");
      } else if (item.submissionResult == "RTE") {
        icon = require("../../images/rte.png");
      }
      return (
        <TouchableOpacity
          onPress={() => {
            this.onClickSubmission(item.submissionId);
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
              source={icon}
            />
            <View style={{ flex: 1, padding: 5 }}>
              <Text
                style={{
                  flex: 1,
                  textAlign: "left",
                  fontSize: 14,
                  fontWeight: "bold"
                }}
              >
                {item.actionUser} did a submission
              </Text>
              <Text style={{ textAlign: "left", fontSize: 12, marginTop: 3 }}>
                <Text style={styles.boldText}>Problem</Text>: {item.problemCode}{" "}
                <Text style={styles.boldText}>Contest</Text>: {item.contestCode}
              </Text>
              <Text style={{ textAlign: "left", fontSize: 12, marginTop: 3 }}>
                <Text style={styles.boldText}>Verdict</Text>:{" "}
                {item.submissionResult}{" "}
                <Text style={styles.boldText}>Time</Text>:{" "}
                {this.msToTime(item.feedDate)} GMT
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      );
    } else if (item.type == "CONTEST") {
      return (
        <TouchableOpacity
          onPress={() => {
            this.onClickContest(item);
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
              source={require("../../images/feed_contest.png")}
            />
            <View style={{ flex: 1, padding: 5 }}>
              <Text
                style={{
                  flex: 1,
                  textAlign: "left",
                  fontSize: 14,
                  fontWeight: "bold"
                }}
              >
                {item.contestName} is gonna start
              </Text>
              <Text style={{ textAlign: "left", fontSize: 12, marginTop: 3 }}>
                <Text style={styles.boldText}>Start Time</Text>:{" "}
                {item.contestStartDate} IST{" "}
              </Text>
              <Text style={{ textAlign: "left", fontSize: 12, marginTop: 3 }}>
                <Text style={styles.boldText}>End Time</Text>:{" "}
                {item.contestEndDate} IST
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      );
    }
  };

  endReached() {
    this.refresh(this.state.lastUpdatedAt);
  }

  render() {
    if (this.state.animating) {
      return <BarIndicator color="black" />;
    } else {
      return (
        <View style={styles.container}>
          <FlatList
            onEndReachedThreshold={0.7}
            onEndReached={this.endReached.bind(this)}
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
    elevation: 3,
    shadowColor: "#A9BCD0"
  }
});

export default Home;
