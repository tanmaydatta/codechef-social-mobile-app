//import liraries
import SyntaxHighlighter from 'react-native-syntax-highlighter';
import { monokai } from 'react-syntax-highlighter/styles/hljs';
import React, { Component } from "react";
import {TouchableOpacity,Image, Platform, View, Text, StyleSheet } from "react-native";

// create a component
class Submission extends Component {
    constructor(props) {
        super(props);
        console.log(props)
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.toolbar}>
                    <TouchableOpacity style={styles.toolbarButton} onPress={() => { this.props.navigation.goBack(null) }}>
                        <Image style={styles.toolbarButton} source={require("../../images/back.png")} />
                    </TouchableOpacity>
                    <Text style={styles.toolbarTitle}>Submission</Text>
                    <Text>  </Text>
                </View>
                <SyntaxHighlighter
                    style={monokai}
                    highlighter={"hljs"}
                    paddingTop={Platform.OS === "ios" ? 20 : 0}
                >
                    {this.props.navigation.getParam("code")}
                </SyntaxHighlighter>
            </View>
        );
    }
}

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    toolbar: {
        backgroundColor: '#dedede',
        paddingTop: Platform.OS === 'ios' ? 25 : 10,
        paddingBottom: 10,
        flexDirection: 'row',
        alignItems: 'center'    //Step 1
    },
    toolbarButton: {
        height: 20,
        width: 20,
        marginLeft: 3
    },
    toolbarTitle: {
        fontSize: 20,
        textAlign: 'center',
        fontWeight: 'bold',
        flex: 1,
    },
});

//make this component available to the app
export default Submission;
