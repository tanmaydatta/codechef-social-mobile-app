//import liraries
import React, { Component } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import NavigationService from '../../network/NavigationService';

// create a component
class ContestRow extends Component {
    constructor(props) {
        super(props);
    }

    onPress = () => {
        console.log(this.props.section);
        if (this.props.section.title !== "Future Contests") {
            NavigationService.navigate('ContestProblems', { item: this.props.item });
        }
    };

    render() {
        return (
            <TouchableOpacity onPress={this.onPress}>
                <View style={styles.container}>
                    <Text style={styles.name}>{this.props.item.name}</Text>
                </View>
            </TouchableOpacity>
        );
    }
}

// define your styles
const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        height: 55,
        padding: 15,
        justifyContent: "space-between"
    },
    text: {
        fontSize: 18,
        flexWrap: "wrap"
    },
    name: {
        fontSize: 18
    }
});

//make this component available to the app
export default ContestRow;
