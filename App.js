/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from "react";
import { Platform, StyleSheet, Text, View, AsyncStorage } from "react-native";
import Login from "./src/components/Login/Login";
import Todo from "./src/components/Todo/Todo";
import Friends from "./src/components/Friends/Friends";
import Profile from "./src/components/Profile/Profile";
import Tags from "./src/components/Tags/Tags";
import TabBar from "./TabBar";
import { createStackNavigator } from "react-navigation";
import TagProblemList from "./src/components/Prolems/TagProblemList";
import Contests from "./src/components/Contests/Contests";
import ContestProblems from "./src/components/Prolems/ContestProblems";
import Problem from "./src/components/Prolems/Problem";
import Compare from "./src/components/Compare/Compare";
import Search from "./src/components/Search/Search";
import AddFriend from "./src/components/Friends/AddFriend";
import Submission from "./src/components/Prolems/Submission";
import OAuth from "./src/components/OAuth/OAuth";
import Error from "./src/components/Error/Error";
import Ratings from "./src/components/Ratings/Ratings";
import ChatScreen from "./src/components/Chat/ChatScreen";
import NavigationService from "./src/network/NavigationService";

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      accessToken: "fetching"
    };

    this._loadAccessToken();
  }

  _loadAccessToken = async () => {
    const token = await AsyncStorage.getItem("accessToken");
    this.setState({ accessToken: token });
  };

  render() {
    if (this.state.accessToken === "fetching") return null;

    const AppNavigator = createStackNavigator(
      {
        Login: { screen: Login },
        TabBar: { screen: TabBar },
        Todo: { screen: Todo },
        Friends: { screen: Friends },
        Profile: { screen: Profile },
        Tags: { screen: Tags },
        Problems: { screen: TagProblemList },
        Submission: { screen: Submission },
        Contests: { screen: Contests },
        ContestProblems: { screen: ContestProblems },
        Problem: { screen: Problem },
        Compare: { screen: Compare },
        AddFriend: { screen: AddFriend },
        Search: { screen: Search },
        OAuth: { screen: OAuth },
        Error: { screen: Error },
        Ratings: { screen: Ratings },
        ChatScreen: { screen: ChatScreen }
      },
      {
        initialRouteName:
          this.state.accessToken == null || this.state.accessToken == ""
            ? "Login"
            : "TabBar",
        headerMode: "none"
      }
    );

    return (
      <AppNavigator
        ref={navigatorRef => {
          NavigationService.setTopLevelNavigator(navigatorRef);
        }}
      />
    );
  }
}

export default App;
