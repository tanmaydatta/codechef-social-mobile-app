//import liraries
import React, { Component } from 'react';
import { Image, Alert, View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Network from '../../network/Network';
import realm from '../../network/Realm';
import NavigationService from '../../network/NavigationService';

// create a component
class TodoRow extends Component {

    constructor(props) {
        super(props);
        console.log(props);
        this.state = {
            item: props.item,
            attemptedIcon: props.item.status == "attempted" ? 'close' : 'error-outline',
            attemptedIconColor: props.item.status == "attempted" ? '#e74c3c' : '#2f3640'
        }
        this.onDelete = this.onDelete.bind(this);
    }

    onDelete() {
        Alert.alert(
            'Remove ' + this.state.item.problemName + ' from Todo',
            'Are you sure you want to continue?',
            [
                { text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
                {
                    text: 'OK', onPress: () => Network.deleteTodo(this.props.item.problemCode).then(data => {
                        console.log(data);
                        realm.write(() => { realm.delete(realm.objectForPrimaryKey('TodoProblems', this.props.item.problemCode)); })
                        { this.props.onDelete() }
                    })
                },
            ],
            { cancelable: false }
        )
    }

    _onPressProblem(item) {
        NavigationService.navigate('Problem', { pcode: item.problemCode, code: "PRACTICE" });
    }

    render() {
        console.log(this.props);
        temp = []
        for (var key in this.props.item.tags) {
            if (this.props.item.tags.hasOwnProperty(key)) {
                var val = this.props.item.tags[key];
                temp.push(val)
            }
        }
        var icon = require('../../images/wrong.png')
        if (this.props.item.status != 'attempted') {
            icon = require('../../images/forbidden.png')
        }
        return (
            <View key={this.props.item.problemCode} style={styles.cardView}>
                <Image style={{ height: 25, width: 25, alignSelf: 'center', marginLeft: 4 }} source={icon}></Image>
                <View style={styles.rowContent}>
                    <TouchableOpacity onPress={() => { this._onPressProblem(this.props.item) }}>
                        <Text style={styles.problemName}>{this.props.item.problemName}</Text>
                    </TouchableOpacity>
                    <View style={styles.tagContainer}>
                        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                            {temp.map((prop, key) => {
                                return (
                                    <Text key={key} style={styles.tag}>{prop}</Text>
                                );
                            })}
                        </ScrollView>
                    </View>
                </View>
                <TouchableOpacity style={{ width: 25, height: 25, alignSelf: 'center', marginRight: 4 }} onPress={this.onDelete}>
                    <Image style={{ width: 25, height: 25, alignSelf: 'center', flex: 1 }} source={require('../../images/delete-red.png')}></Image>
                </TouchableOpacity>
            </View>
        );
    }
}

// define your styles
const styles = StyleSheet.create({

    cardView: {
        margin: 5,
        paddingTop: 10,
        paddingBottom: 10,
        backgroundColor: '#dedede',
        borderRadius: 5,
        flex: 1,
        flexDirection: 'row',
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 0.5,
        shadowRadius: 3,
        elevation: 2,
        shadowColor: '#A9BCD0'
    },
    rowIcon: {
        padding: 10
    },
    rowContent: {
        flex: 1,
        marginLeft: 5,
        flexDirection: "column"
    },
    problemName: {
        fontSize: 18,
        textAlign: 'left',
        marginLeft: 8,
        marginRight: 8
    },
    tagContainer: {
        flexDirection: "row",
        marginTop: 5,
        marginLeft: 4,
        marginRight: 4
    },
    tag: {
        overflow: 'hidden',
        backgroundColor: '#C0C0C0',
        borderRadius: 5,
        padding: 2,
        marginHorizontal: 3
    }
});

//make this component available to the app
export default TodoRow;
