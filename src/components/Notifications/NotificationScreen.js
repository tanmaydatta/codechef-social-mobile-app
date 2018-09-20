import React, { Component } from 'react'
import { Platform, RefreshControl, Alert, Image, FlatList, StyleSheet, View, Text, AsyncStorage, TouchableOpacity } from "react-native";
import NavigationService from '../../network/NavigationService';
import Network from "../../network/Network";
import realm from '../../network/Realm';
import Moment from 'moment';
import { BarIndicator } from 'react-native-indicators';

class NotificationScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            animating: false,
            lastUpdatedAt: String((new Date).getTime())
        };
        this._onRefresh = this._onRefresh.bind(this);
        this.listener = this.props.navigation.addListener('didFocus', () => (
            this.refresh((String)((new Date).getTime()))
        ));
    }

    predicateBy(prop) {
        return function (a, b) {
            if (a[prop] < b[prop]) {
                return 1;
            } else if (a[prop] > b[prop]) {
                return -1;
            }
            return 0;
        }
    }

    convertToArray(realmObjectsArray) {
        let copyOfJsonArray = Array.from(realmObjectsArray);
        let jsonArray = JSON.parse(JSON.stringify(copyOfJsonArray));
        this.setState({
            ...this.state,
            lastUpdatedAt: jsonArray[jsonArray.length - 1].feedDate
        });
        jsonArray.sort(this.predicateBy("feedDate"))
        return jsonArray;
    }


    componentDidMount() {
        var millisecondsQuery = 'createdAt < ' + String((new Date).getTime() - (7 * 24 * 60 * 60 * 1000));
        let oldPosts = realm.objects('NotificationFeed').filtered(millisecondsQuery);
        realm.write(() => {
            realm.delete(oldPosts);
            console.log("deleted");
        });
        this._onRefresh()
    }

    async _onRefresh() {
        await AsyncStorage.setItem('notificationsColor', '0')
        this.setState({ animating: true });
        this.refresh((String)((new Date).getTime()))
    }

    async refresh(lastUpdatedAt) {
        console.log(lastUpdatedAt)
        Network.getNotifications(lastUpdatedAt, false).then(async data => {
            this.setState({ animating: false })
            if (data != null) {
                let resultArray = data.result
                var queue = [];
                for (let i = 0; i < resultArray.length; i++) {
                    key = resultArray[i]
                    if (key.type == "CONTEST") {
                        queue.push(key)
                        contestData = await Network.getContestDetails(key.contestCode)
                        var temp = queue.shift();
                        realm.write(() => {
                            realm.create(
                                "NotificationFeed",
                                {
                                    type: temp.type,
                                    contestCode: temp.contestCode,
                                    contestName: contestData.name,
                                    feedDate: temp.feedDate,
                                    id: temp.id,
                                    createdAt: temp.createdAt,
                                    contestStartDate: contestData.startDate,
                                    contestEndDate: contestData.endDate
                                },
                                true
                            );
                        });
                    } else if (key.type == "SUBMISSION") {
                        realm.write(() => {
                            realm.create(
                                "NotificationFeed",
                                {
                                    type: key.type,
                                    actionUser: key.actionUser,
                                    submissionResult: key.submissionResult,
                                    submissionId: key.submissionId,
                                    problemCode: key.problemCode,
                                    contestCode: key.contestCode,
                                    feedDate: key.feedDate,
                                    id: key.id,
                                    createdAt: key.createdAt
                                },
                                true
                            );
                        });
                    }
                }
                var milliseconds = (new Date).getTime();
                this.setState({ data: this.convertToArray(realm.objects("NotificationFeed")) })
            }
        })
    }

    msToTime(duration) {
        var date = new Date(duration);
        return Moment(date).format("Do MMM YYYY, HH:mm");
    }

    timeToMs(time) {
        var date = Moment(time, 'YYYY-MM-DD HH:mm:ss').toDate().getTime();
        return date
    }

    onClickContest(item) {
        let data = { "code": item.contestCode }
        let now = (new Date).getTime()
        let contestStart = this.timeToMs(item.contestStartDate)
        if (contestStart < now) {
            NavigationService.navigate('ContestProblems', { item: data });
        } else {
            Alert.alert(
                'Forbidden',
                'Contest is yet to start',
                [
                    { text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel' }
                ],
                { cancelable: false }
            )
        }
    };

    onClickSubmission(submissionId) {
        console.log('here')
        this.setState({animating: true})
        Network.getSourceCode(submissionId).then(data => {
            this.setState({animating: false})
            if (data.status == "OK") {
                console.log(data.result.data.content.code)
                NavigationService.navigate('Submission', { code: data.result.data.content.code });
            } else {
                Alert.alert(
                    'Forbidden',
                    'Submission is not available yet',
                    [
                        { text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel' }
                    ],
                    { cancelable: false }
                )
            }
        })
    }

    renderItem = ({ item }) => {
        if (item.type == 'SUBMISSION') {
            var icon = require('../../images/success.png')
            if (item.submissionResult == 'WA') {
                icon = require('../../images/wrong.png')
            } else if (item.submissionResult == 'CTE') {
                icon = require('../../images/cte.png')
            } else if (item.submissionResult == 'RTE') {
                icon = require('../../images/rte.png')
            }
            return (
                <TouchableOpacity onPress={() => { this.onClickSubmission(item.submissionId) }}>
                    <View style={styles.cardView}>
                        <Image style={{ alignSelf: 'center', height: 30, width: 30, marginTop: 5, marginBottom: 5, marginHorizontal: 10 }} source={icon}></Image>
                        <View style={{ flex: 1, padding: 5 }}>
                            <Text style={{ flex: 1, textAlign: 'left', fontSize: 14, fontWeight: 'bold' }}>{item.actionUser} did a {item.submissionResult} submission of {item.problemCode}</Text>
                            <Text style={{ textAlign: 'left', fontSize: 12, marginTop: 3 }}><Text style={styles.boldText}>Time</Text>: {this.msToTime(item.feedDate)} GMT</Text>
                        </View>
                    </View>
                </TouchableOpacity>
            )
        } else if (item.type == "CONTEST") {
            return (
                <TouchableOpacity onPress={() => { this.onClickContest(item) }}>
                    <View style={styles.cardView}>
                        <Image style={{ alignSelf: 'center', height: 30, width: 30, marginTop: 5, marginBottom: 5, marginHorizontal: 10 }} source={require('../../images/feed_contest.png')}></Image>
                        <View style={{ flex: 1, padding: 5 }}>
                            <Text style={{ flex: 1, textAlign: 'left', fontSize: 14, fontWeight: 'bold' }}>{item.contestName} is gonna start </Text>
                            <Text style={{ textAlign: 'left', fontSize: 12, marginTop: 3 }}><Text style={styles.boldText}>Time</Text>: {this.msToTime(item.feedDate)} GMT</Text>
                        </View>
                    </View>
                </TouchableOpacity>
            )
        }
    }

    endReached() {
        this.refresh(this.state.lastUpdatedAt);
    }

    render() {
        if (this.state.animating) {
            return (
                <BarIndicator color='black' />
            );
        } else {
            return (
                <View style={styles.container}>
                    <FlatList
                        onEndReachedThreshold={0.7}
                        onEndReached={this.endReached.bind(this)}
                        refreshControl={
                            <RefreshControl
                                refreshing={this.state.animating}
                                onRefresh={this._onRefresh}
                                tintColor='transparent'
                            />
                        }
                        extraData={this.state}
                        style={styles.searchList}
                        data={this.state.data}
                        renderItem={this.renderItem}
                        keyExtractor={(item, index) => index.toString()}
                    />
                </View>
            );
        }
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5'
    },
    searchList: {
        flex: 1,
        marginTop: Platform.OS === "ios" ? 0 : 5,
        backgroundColor: '#F5F5F5'
    },
    boldText: {
        // textAlign: 'left', 
        // fontSize: 12,
        fontWeight: 'bold',
        // marginTop: 3
    },
    cardView: {
        margin: 5,
        padding: 5,
        backgroundColor: '#dedede',
        borderRadius: 5,
        flex: 1,
        flexDirection: 'row',
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 0.5,
        shadowRadius: 3,
        elevation: 3,
        shadowColor: '#A9BCD0'
    },
    separator: {
        flex: 1,
        height: 1,
        backgroundColor: "#8E8E8E"
    }
})

export default NotificationScreen
