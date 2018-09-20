//import liraries
import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity
} from "react-native";
import NavigationService from "../../network/NavigationService";

// create a component
const DEFAULT_COLUMN_WIDTH = 60;
class TagProblemRow extends Component {
  constructor(props) {
    super(props);
  }
  onPress = () => {
    console.log("onpress");
    NavigationService.navigate("Problem", {
      pcode: this.props.item,
      code: "PRACTICE"
    });
  };
  render() {
    let style = {
      width:
        this.props.col.width ||
        Dimensions.get("window").width / 4 ||
        DEFAULT_COLUMN_WIDTH
    };
    res =
      this.props.col.dataIndex === "code" ? (
        <TouchableOpacity onPress={this.onPress.bind(this)}>
          <View key={this.props.col.dataIndex} style={[styles.cell, style]}>
            <Text style={{ color: "blue" }}>{this.props.item}</Text>
          </View>
        </TouchableOpacity>
      ) : (
        <View key={this.props.col.dataIndex} style={[styles.cell, style]}>
          <Text>{this.props.item}</Text>
        </View>
      );
    return res;
  }
}

// define your styles
const styles = StyleSheet.create({
  cell: {
    minHeight: 40,
    width: Dimensions.get("window").width / 4,
    backgroundColor: "transparent",
    borderRightWidth: 1,
    borderRightColor: "#dfdfdf",
    alignItems: "center",
    justifyContent: "center"
  }
});

//make this component available to the app
export default TagProblemRow;
