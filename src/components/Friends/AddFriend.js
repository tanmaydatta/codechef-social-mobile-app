import React, { Component } from 'react';
import { Alert, Image, TouchableOpacity, Platform, RefreshControl, View, Text, StyleSheet, TextInput, SectionList } from 'react-native';
import Network from '../../network/Network';

class AddFriend extends Component {
    constructor(props) {
        super(props);
        this.state = {
            setName: null,
            description: null,
        };
        this.addSet = this.addSet.bind(this);
    }

    addSet() {
        console.log(this.state.setName);
        console.log(this.state.description);
        if (this.state.setName && this.state.description) {
            Network.addSet(this.state.setName, this.state.description).then(data => {
                console.log(data)
                this.props.navigation.goBack(null)
            }).catch(error => {
                console.log(error)
            })
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.toolbar}>
                    <TouchableOpacity style={styles.toolbarButton} onPress={() => { this.props.navigation.goBack(null) }}>
                        <Image style={styles.toolbarButton} source={require("../../images/back.png")} />
                    </TouchableOpacity>
                    <Text style={styles.toolbarTitle}>Add Set</Text>
                    <View></View>
                </View>
                <TextInput
                    underlineColorAndroid="transparent"
                    style={{ paddingLeft: 10, margin: 15, height: 40, borderRadius: 5, borderColor: 'gray', borderWidth: 1 }}
                    onChangeText={(text) => this.setState({ setName: text })}
                    placeholder={'Set Name'}
                />
                <TextInput
                    underlineColorAndroid="transparent"
                    style={{ paddingLeft: 10, marginLeft: 15, marginRight: 15, height: 40, borderRadius: 5, borderColor: 'gray', borderWidth: 1 }}
                    onChangeText={(text) => this.setState({ description: text })}
                    placeholder={'Set Description'}
                />
                <View style={{ flex: 1 }}></View>
                <TouchableOpacity
                    style={styles.applyScreenButton}
                    onPress={this.addSet}
                    underlayColor='#fff'>
                    <Text style={styles.applyText}>Apply</Text>
                </TouchableOpacity>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
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
        marginBottom: 60,
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
})

export default AddFriend;
