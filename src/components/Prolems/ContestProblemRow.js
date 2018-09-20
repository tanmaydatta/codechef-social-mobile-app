//import liraries
import React, { Component } from "react";
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    TouchableOpacity
} from "react-native";
import NavigationService from '../../network/NavigationService';

// create a component
const DEFAULT_COLUMN_WIDTH = 60;
class ContestProblemRow extends Component {
    constructor(props) {
        super(props);
    }

    onPress = () => {
        NavigationService.navigate('Problem', { pcode: this.props.item, code: this.props.contest });
    };

    render() {
        let style = {
            width:
                this.props.col.width ||
                Dimensions.get("window").width / 3 ||
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
        width: Dimensions.get("window").width / 3,
        backgroundColor: "transparent",
        borderRightWidth: 1,
        borderRightColor: "#dfdfdf",
        alignItems: "center",
        justifyContent: "center"
    }
});

//make this component available to the app
export default ContestProblemRow;
