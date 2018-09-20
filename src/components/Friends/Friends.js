//import liraries
import React, { Component } from 'react';
import { Alert, Image, TouchableOpacity, Platform, RefreshControl, View, Text, StyleSheet, TextInput, SectionList } from 'react-native';
import Network from '../../network/Network';
import Friend from './Friend';
import Icon from 'react-native-vector-icons/MaterialIcons';
import realm from '../../network/Realm';
import NavigationService from '../../network/NavigationService';
import { BarIndicator } from 'react-native-indicators';


// create a component
class Friends extends Component {
    constructor(props) {
        super(props);
        this.state = {
            sectionData: [],
            wholeData: [],
            animating: true,
            reloadTable: true
        };
        this.reload = this.reload.bind(this);
        this.listener = this.props.navigation.addListener('didFocus', () => (
            this._onRefresh()
        ));
    }

    renderRow = ({ item, index, section }) => (
        <Friend
            item={item}
            setName={section.title}
            onDelete={this.reload.bind(this)}
        />
    );

    convertToArray(realmObjectsArray) {
        let copyOfJsonArray = Array.from(realmObjectsArray);
        let jsonArray = JSON.parse(JSON.stringify(copyOfJsonArray));
        console.log(jsonArray);
        return jsonArray;
    }

    convertTo2DArray(realmObjectsArray) {
        let copyOfJsonArray = Array.from(realmObjectsArray);
        let tempArray = [];
        let jsonArray = [];
        copyOfJsonArray.forEach(function (key, i) {
            tempArray[key.arrayPos] = [];
        });
        copyOfJsonArray.forEach(function (key, i) {
            tempArray[key.arrayPos].push(key.memberName);
        });
        tempArray.forEach(function (key, i) {
            jsonArray[i] = JSON.parse(JSON.stringify(tempArray[i]));
        });
        console.log(jsonArray);
        return jsonArray;
    }
    _onRefresh = () => {
        this.setState({ animating: true });
        console.log("calling api");
        var test = this;

        sets = Network.getAllSet()
            .then(data => {
                let allSets = realm.objects("Sets");
                let allFriends = realm.objects("Friends");
                realm.write(() => {
                    realm.delete(allSets); // Deletes all sets
                    realm.delete(allFriends);
                    console.log("deleted");
                });
                var itemsProcessed = 0;
                if (data != null) {
                    data.forEach(function (key, i) {
                        realm.write(() => {
                            realm.create(
                                "Sets",
                                {
                                    setName: key.setName,
                                    description: key.description
                                },
                                true
                            );
                        });
                        Network.getFriendsSet(key.setName)
                            .then(friendsData => {
                                if (friendsData != null) {
                                    friendsData.forEach(function (key, j) {
                                        realm.write(() => {
                                            realm.create(
                                                "Friends",
                                                {
                                                    memberName: key.memberName,
                                                    arrayPos: i
                                                },
                                                true
                                            );
                                        });
                                    });
                                }
                                itemsProcessed++;
                                if (itemsProcessed === data.length) {
                                    test.reload();
                                }
                            })
                            .catch(error => {
                                console.log("Api call error");
                            });
                    });
                }
                this.setState({ animating: false });
            })
            .catch(error => {
                this.setState({ animating: false });
                console.log("Api call error");
            });
    };
    reload() {
        console.log("reload");
        this.setState({
            sectionData: this.convertToArray(realm.objects("Sets")),
            wholeData: this.convertTo2DArray(realm.objects("Friends")),
            refresh: !this.state.refresh
        });
    }

    componentWillMount() {
        this.setState({
            sectionData: this.convertToArray(realm.objects('Sets')),
            wholeData: this.convertTo2DArray(realm.objects('Friends')),
        })
    }

    onAdd(setName) {
        console.log(setName)
        NavigationService.navigate('Search', { type: 'addSetUser', setName: setName });
    }

    onDelete(setName) {
        console.log(setName)
        Alert.alert(
            'Remove ' + setName + '?',
            'Are you sure you want to continue?',
            [
                { text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
                {
                    text: 'OK', onPress: () => Network.deleteSet(setName).then(data => {
                        console.log(data);
                        this._onRefresh()
                    }
                    )
                },
            ],
            { cancelable: false }
        )
    }

    getDataSource() {
        let temp = []
        for (var i = 0; i < this.state.sectionData.length; ++i) {
            if (i >= this.state.wholeData.length) {
                temp.push({ title: this.state.sectionData[i].setName, data: [] })
            } else {
                temp.push({ title: this.state.sectionData[i].setName, data: this.state.wholeData[i] })
            }
        }
    }

    onDelete(setName) {
        console.log(setName);
        Alert.alert(
            "Remove " + setName + "?",
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
                        Network.deleteSet(setName).then(data => {
                            console.log(data);
                            this._onRefresh();
                        })
                }
            ],
            { cancelable: false }
        );
    }

    getDataSource() {
        let temp = [];
        for (var i = 0; i < this.state.sectionData.length; ++i) {
            if (i >= this.state.wholeData.length) {
                temp.push({ title: this.state.sectionData[i].setName, data: [] });
            } else {
                temp.push({
                    title: this.state.sectionData[i].setName,
                    data: this.state.wholeData[i]
                });
            }
        }
        return temp;
    }

    render() {
        if (this.state.animating) {
            return (
                <BarIndicator color='black' />
            );
        } else {
            return (
                <View style={styles.container}>
                    <View style={styles.toolbar}>
                        <TouchableOpacity
                            style={styles.toolbarButton}
                            onPress={() => {
                                this.props.navigation.goBack(null);
                            }}
                        >
                            <Image
                                style={styles.toolbarButton}
                                source={require("../../images/back.png")}
                            />
                        </TouchableOpacity>
                        <Text style={styles.toolbarTitle}>Set</Text>
                        <TouchableOpacity
                            style={{ height: 20, width: 20, marginRight: 10 }}
                            onPress={() => {
                                NavigationService.navigate('AddFriend', {});
                            }}
                        >
                            <Image
                                style={{ height: 20, width: 20, marginRight: 10 }}
                                source={require("../../images/add_header.png")}
                                name="arrow_back_ios"
                                size={30}
                            />
                        </TouchableOpacity>
                        <View />
                    </View>
                    <SectionList
                        refreshControl={
                            <RefreshControl
                                refreshing={this.state.animating}
                                onRefresh={this._onRefresh.bind(this)}
                                tintColor='transparent'
                            />
                        }
                        renderItem={this.renderRow}
                        ItemSeparatorComponent={() => <View style={styles.separator} />}
                        renderSectionHeader={({ section: { title } }) => (
                            <View
                                style={{
                                    margin: 5,
                                    padding: 10,
                                    backgroundColor: "#dedede",
                                    borderRadius: 5,
                                    flex: 1,
                                    flexDirection: "row"
                                }}
                            >
                                <Text
                                    style={{ width: 100, marginHorizontal: 5, fontSize: 16, fontWeight: "bold" }}
                                >
                                    {title}
                                </Text>
                                <View style={{ flex: 1 }} />
                                <TouchableOpacity
                                    onPress={() => {
                                        this.onAdd(title);
                                    }}
                                >
                                    <Image
                                        style={{ height: 20, width: 20, marginRight: 10 }}
                                        source={require("../../images/add.png")}
                                    />
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => {
                                        this.onDelete(title);
                                    }}
                                >
                                    <Image
                                        style={{ height: 20, width: 20 }}
                                        source={require("../../images/delete.png")}
                                    />
                                </TouchableOpacity>
                            </View>
                        )}
                        sections={this.getDataSource()}
                        keyExtractor={(item, index) => index.toString()}
                    />
                </View>
            );
        }
    }
}

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    toolbar: {
        backgroundColor: "#dedede",
        paddingTop: Platform.OS === "ios" ? 25 : 10,
        paddingBottom: 10,
        flexDirection: "row",
        alignItems: "center" //Step 1
    },
    toolbarButton: {
        height: 20,
        width: 20,
        marginLeft: 3
    },
    toolbarTitle: {
        fontSize: 20,
        textAlign: "center",
        fontWeight: "bold",
        flex: 1,
    },
    search: {
        marginHorizontal: 10,
        flex: 1,
        borderRadius: 10
    },
    searchContainer: {
        flexDirection: "row",
        backgroundColor: "#dedede",
        margin: 10,
        borderRadius: 20
    },
    searchIcon: {
        padding: 10
    },
    separator: {
        flex: 1,
        height: 1,
        marginLeft: 10,
        marginRight: 10,
        backgroundColor: "#8E8E8E"
    }
});

//make this component available to the app
export default Friends;
