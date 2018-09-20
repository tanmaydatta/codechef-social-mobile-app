import React, { Component } from 'react';
import { EmptyList, FlatList, Image, TouchableOpacity, Platform, View, Text, StyleSheet, TextInput } from 'react-native';
import Network from '../../network/Network';
import Icon from 'react-native-vector-icons/MaterialIcons';


class Search extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: []
        };
    }

    onSearch(text) {
        if (text) {
            const { navigation } = this.props;
            const type = navigation.getParam('type');
            if (type == 'addSetUser' || type == 'returnUsername') {
                Network.getUsers('username', 10, 0, text).then(data => {
                    console.log(data);
                    this.setState({ data: data })
                }).catch(error => {
                    console.log(error)
                })
            } else if (type == 'addTodo') {
                console.log(text)
                Network.searchTodos(text).then(data => {
                    console.log(data)
                    this.setState({ data: data.result.problems  })
                }).catch(error => {
                    console.log(error)
                })
            } else if (type == 'messageUsers') {
                console.log(text)
                Network.getMessageUsers(text).then(data => {
                    console.log(data)
                    this.setState({ data: data.result })
                }).catch(error => {
                    console.log(error)
                })
            }
        } else {
            this.setState({
                ...this.state,
                data: null
            })
        }
    }

    goBackToCompare(data) {
        const { navigation } = this.props;
        navigation.goBack();
        navigation.state.params.onSelect(data);
    }

    goBackToMessage(data) {
        const { navigation } = this.props;
        navigation.goBack();
        navigation.state.params.onSelect(data);
    }

    addUser(memberHandle) {
        console.log(memberHandle);
        const { navigation } = this.props;
        const setName = navigation.getParam('setName');
        Network.addFriend(setName, memberHandle).then(data => {
            console.log(data);
            this.props.navigation.goBack(null)
        }).catch(error => {
            console.log(error)
        })
    }

    addTodo(problemId) {
        console.log(problemId);
        const { navigation } = this.props;
        Network.addTodo(problemId).then(data => {
            console.log(data);
            this.props.navigation.goBack(null)
        }).catch(error => {
            console.log(error)
        })
    }

    onPress(item) {
        const { navigation } = this.props;
        const type = navigation.getParam('type');
        if (type == 'addTodo') {
            this.addTodo(item.code)
        } else if (type == 'addSetUser') {
            this.addUser(item.username)
        } else if (type == 'returnUsername') {
            this.goBackToCompare(item.username)
        } else {
            this.goBackToMessage(item)
        }
    }


    renderItem = ({ item }) => {
        var textString = null
        const { navigation } = this.props;
        const type = navigation.getParam('type');
        if (type == 'addTodo') {
            textString = item.name + ', ' + item.code
        } else if (type == 'addSetUser' || type == 'returnUsername') {
            textString = item.username
        } else {
            textString = item
        }
        return (
            <TouchableOpacity onPress={() => { this.onPress(item) }}>
                <View style={{ margin: 5, padding: 10, backgroundColor: '#dedede', borderRadius: 5, flex: 1, flexDirection: 'row' }}>
                    <Text style={{ flex: 1, textAlign: 'center', fontSize: 16, marginHorizontal: 5, fontWeight: 'bold' }}>{textString}</Text>
                </View>
            </TouchableOpacity>
        );
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.toolbar}>
                    <TouchableOpacity style={styles.toolbarButton} onPress={() => { this.props.navigation.goBack(null) }}>
                        <Image style={styles.toolbarButton} source={require("../../images/back.png")} />
                    </TouchableOpacity>
                    <Text style={styles.toolbarTitle}>Search</Text>
                    <View></View>
                </View>
                <View style={styles.searchContainer}>
                    <Icon style={styles.searchIcon} name='search' size={20} />
                    <TextInput underlineColorAndroid="transparent" style={styles.search} onChangeText={(text) => this.onSearch(text)} placeholder="search" />
                </View>
                <FlatList
                    extraData={this.state}
                    style={styles.searchList}
                    data={this.state.data}
                    renderItem={this.renderItem}
                    keyExtractor={(item, index) => index.toString()}
                />
            </View >
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    searchList: {
        flex: 1,
        margin: 10,
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
        alignSelf: 'center'
    },
    applyScreenButton: {
        alignSelf: 'center',
        width: 100,
        marginRight: 40,
        marginLeft: 40,
        marginTop: 10,
        paddingTop: 10,
        paddingBottom: 10,
        backgroundColor: '#dedede',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#F5F5F5'
    },
    applyText: {
        textAlign: 'center',
        paddingLeft: 10,
        paddingRight: 10,
        fontSize: 16
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
})

export default Search;
