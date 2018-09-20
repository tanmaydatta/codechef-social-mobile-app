import React from "react";
import { Platform, Text, View } from "react-native";
import { createMaterialTopTabNavigator } from "react-navigation";
import Icon from "react-native-vector-icons/Ionicons";
import Home from "./src/components/Home/Home";
import ChatContact from "./src/components/Chat/ChatContact";
import NotificationScreen from "./src/components/Notifications/NotificationScreen";
import SideMenuScreen from "./src/components/SideMenu/SideMenuScreen";

export default createMaterialTopTabNavigator(
  {
    Home: {
      screen: Home,
      navigationOptions: ({ navigation }) => ({
        tabBarIcon: ({ focused, tintColor }) => {
          let color;
          color = focused ? "black" : "#A9BCD0";
          return <Icon name="md-paper" size={25} color={color} />;
        }
      })
    },
    Messages: {
      screen: ChatContact,
      navigationOptions: ({ navigation }) => ({
        tabBarIcon: ({ focused, tintColor }) => {
          let color;
          color = focused ? "black" : "#A9BCD0";
          return <Icon name="md-chatbubbles" size={25} color={color} />;
        }
      })
    },
    Notifications: {
      screen: NotificationScreen,
      navigationOptions: ({ navigation }) => ({
        tabBarIcon: ({ focused, tintColor }) => {
          let color;
          color = focused ? "black" : "#A9BCD0";
          return <Icon name="md-notifications" size={25} color={color} />;
        }
      })
    },
    SideMenu: {
      screen: SideMenuScreen,
      navigationOptions: ({ navigation }) => ({
        tabBarIcon: ({ focused, tintColor }) => {
          let color;
          color = focused ? "black" : "#A9BCD0";
          return <Icon name="md-menu" size={25} color={color} />;
        }
      })
    }
  },
  {
    tabBarPosition: "top",
    tabBarOptions: {
      showIcon: true,
      showLabel: false,
      indicatorStyle: {
        backgroundColor: "transparent"
      },
      style: {
        backgroundColor: "#D8DBE2",
        paddingTop: Platform.OS === "ios" ? 20 : 0
      }
    }
  }
);
