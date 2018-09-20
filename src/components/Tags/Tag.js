//import liraries
import React, { Component } from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import NavigationService from "../../network/NavigationService";

// create a component
class Tag extends Component {
  constructor(props) {
    super(props);
  }

  onPress = () => {
    NavigationService.navigate("Problems", { item: this.props.tag });
  };

  render() {
    return (
      <TouchableOpacity onPress={() => this.onPress()}>
        <Text style={styles.tag}>{this.props.tag}</Text>
      </TouchableOpacity>
    );
  }
}

// define your styles
const styles = StyleSheet.create({
  tag: {
    padding: 10,
    borderRadius: 5,
    backgroundColor: "#dedede",
    margin: 5
  }
});

//make this component available to the app
export default Tag;
