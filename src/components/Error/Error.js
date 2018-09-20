import React, { Component } from "react";
import {TouchableOpacity, StyleSheet, View, Text } from "react-native";
import NavigationService from '../../network/NavigationService';

class Error extends React.Component {
    
    onReLoginPress = async () => {
        console.log('Login.js onLoginPress');
        NavigationService.navigate('OAuth', {});
    }

    render() {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ fontSize: 18 }}>Please select all the options</Text>
                <TouchableOpacity
                    onPress={this.onReLoginPress}
                    style={styles.buttonContainer}
                >
                    <Text style={styles.buttonText}>Re-Login</Text>
                </TouchableOpacity>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        marginBottom: 20
    },
    input: {
        height: 40,
        backgroundColor: 'rgba(225, 112, 85, 0.2)',
        marginBottom: 10,
        paddingHorizontal: 10
    },
    buttonContainer: {
        height: 30,
        width: 80,
        borderRadius: 5,
        marginTop:60,
        backgroundColor: '#e17055',
    },
    buttonText: {
        textAlign: 'center',
        fontSize: 14,
        padding: 5
    }
});

export default Error