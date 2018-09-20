//import liraries
import React, { Component } from "react";
import {
  Image,
  Alert,
  TouchableOpacity,
  View,
  Text,
  StyleSheet
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import Network from "../../network/Network";
import realm from "../../network/Realm";
import Swipeout from "react-native-swipeout";
import NavigationService from "../../network/NavigationService";

class Friend extends Component {
  constructor(props) {
    super(props);
    console.log(props);
    this.state = {
      item: props.item,
      setName: props.setName
    };
    this.onDelete = this.onDelete.bind(this);
  }

  onDelete() {
    console.log(this.props.setName);
    Alert.alert(
      "Remove " + this.state.item + " from Friends",
      "Are you sure you want to continue?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        {
          text: "OK",
          onPress: () =>
            Network.deleteFriend(this.props.setName, this.props.item).then(
              data => {
                console.log("****");
                console.log(this.props.item);
                realm.write(() => {
                  realm.delete(
                    realm.objectForPrimaryKey("Friends", this.props.item)
                  );
                });
                {
                  this.props.onDelete();
                }
              }
            )
        }
      ],
      { cancelable: false }
    );
  }

  _onPressItem = item => {
    console.log("here");
    NavigationService.navigate("Profile", { profile: item });
  };

  render() {
    var swipeoutBtns = [
      {
        component: (
          <View
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column"
            }}
          >
            <Image
              source={require("../../images/delete-red.png")}
              style={{ alignSelf: "center", width: 20, height: 20 }}
            />
          </View>
        ),
        backgroundColor: "transparent",
        onPress: () => {
          this.onDelete();
        }
      }
    ];
    return (
      <Swipeout
        width={10}
        autoClose={true}
        backgroundColor="transparent"
        right={swipeoutBtns}
      >
        <TouchableOpacity
          onPress={() => {
            this._onPressItem(this.props.item);
          }}
        >
          <View style={styles.container}>
            <Text style={styles.text}>{this.props.item}</Text>
          </View>
        </TouchableOpacity>
      </Swipeout>
    );
  }
}

// define your styles
const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    height: 35,
    margin: 5,
    padding: 5,
    justifyContent: "space-between"
  },
  rowIcon: {
    padding: 2,
    height: 18,
    width: 18
  },
  text: {
    fontSize: 18
  }
});

//make this component available to the app
export default Friend;
