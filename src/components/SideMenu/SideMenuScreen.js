import React, { Component } from 'react'
import {Platform, TouchableOpacity, TouchableHighlight, Image, FlatList, View, Text, StyleSheet, AsyncStorage } from 'react-native'
import { NavigationActions, StackActions, StackNavigator } from 'react-navigation'
import Todo from '../Todo/Todo'
import Friends from '../Friends/Friends'
import realm from '../../network/Realm'
import NavigationService from '../../network/NavigationService';

const customData = [
    {
        "text": "Profile",
        "imageText": require("../../images/profile.png"),
        "row": '0'
    },
    {
        "text": "Contests",
        "imageText": require("../../images/contest.png"),
        "row": '1'
    },
    {
        "text": "Friends",
        "imageText": require("../../images/friendship.png"),
        "row": '2'
    },
    {
        "text": "Todo",
        "imageText": require("../../images/to_do.png"),
        "row": '3'
    },
    {
        "text": "Compare",
        "imageText": require("../../images/compare.png"),
        "row": '4'
    },
    {
        "text": "Tags",
        "imageText": require("../../images/tag.png"),
        "row": '5'
    },
    {
        "text": "Ratings",
        "imageText": require("../../images/rating.png"),
        "row": '6'
    }
]

class SideMenuScreen extends React.Component {

    onClick(item) {
        console.log(item.row + "Pressed");
        switch (item.row) {
            case '0':
                NavigationService.navigate('Profile', { profile: 'me' });
                break;
            case '1':
                NavigationService.navigate('Contests', {});
                break;
                break;
            case '2':
                NavigationService.navigate('Friends', {});
                break;
            case '3':
                NavigationService.navigate('Todo', {});
                break;
            case '4':
                NavigationService.navigate('Compare', {});
                break;
            case '5':
                NavigationService.navigate('Tags', {});
                break;
            default:
                NavigationService.navigate('Ratings', {});

        }
    }

    renderRow = ({ item }) => (

        <TouchableHighlight underlayColor={'white'} onPress={() => this.onClick(item)}>
            <View style={styles.row}>
                <Image style={styles.image} source={item.imageText} />
                <View style={styles.textView}>
                    <Text style={styles.text}>{item.text}</Text>
                </View>
            </View>

        </TouchableHighlight>
    );

    async logoutClicked() {
        console.log('here')
        await AsyncStorage.setItem('accessToken', '')
        realm.write(() => {
            realm.deleteAll()
        })
        console.log('here')
        NavigationService.reset('Login', {});
    }

    render() {
        return (
            <View style={styles.container}>
                <FlatList
                    style = {{marginTop: Platform.OS === "ios" ? 0 : 5,}}
                    data={customData}
                    renderItem={this.renderRow}
                    keyExtractor={(item, index) => index.toString()}
                />
                <TouchableOpacity onPress={() => { this.logoutClicked() }}>
                    <View style={styles.logoutView}>
                        <Text style={{ alignSelf: 'center', fontSize: 19 }}>LOGOUT</Text>
                    </View>
                </TouchableOpacity>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
        flexDirection: 'column',
    },
    row: {
        flex: 1,
        flexDirection: 'row',
        margin: 5,
        backgroundColor: "#dedede",
        borderRadius: 5,
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 0.5,
        shadowRadius: 3,
        elevation: 3,
        shadowColor: '#A9BCD0'
    },
    image: {
        height: 30,
        width: 30,
        marginTop: 10,
        marginBottom: 10,
        marginLeft: 15
    },
    text: {
        marginLeft: 15,
        fontSize: 20,
        alignSelf: 'flex-start'
    },
    textView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    logoutView: {
        alignSelf: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 30,
        height: 50,
        width: 110,
        backgroundColor: "#dedede",
        borderRadius: 5,
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 0.5,
        shadowRadius: 3,
        elevation: 3,
        shadowColor: '#A9BCD0'
    }
})

export default SideMenuScreen;
