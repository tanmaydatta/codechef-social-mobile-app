//import liraries
import React, { Component } from "react";
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    Platform,
    TextInput,
    ScrollView
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import Network from "../../network/Network";
import Tag from "./Tag";
import { BarIndicator } from 'react-native-indicators';

// create a component
class Tags extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            wholeData: [],
            animating: true
        };
        this.onSearch = this.onSearch.bind(this);
    }

    async _onRefresh() {
        this.setState({ animating: true });
        console.log("calling api");

        todos = Network.getTags().then(data => {
            this.setState({ animating: true });
            console.log(data);
            var tags = [];
            for (var key in data) {
                // if (data.hasOwnProperty(key)) {
                //   var obj = data[key];
                //   realm.write(() => {
                //     realm.create(
                //       "TodoProblems",
                //       {
                //         problemCode: obj.problemCode,
                //         problemUrl: obj.problemUrl,
                //         problemName: obj.problemName,
                //         status: obj.status,
                //         tags: obj.tags
                //       },
                //       true
                //     );
                //   });
                // }
                // console.log(key);
                tags.push(key);
            }
            this.setState({
                data: tags,
                wholeData: tags,
                animating: !this.state.animating
            });
            // this.setState({
            //   refresh: !this.state.refresh
            // });
        });
    }

    componentDidMount() {
        this._onRefresh();
    }

    onSearch(text) {
        if (text) {
            var data = this.state.wholeData;
            data = data.filter(item => {
                return item.toLowerCase().indexOf(text.toString().toLowerCase()) > -1;
            });
            this.setState({
                ...this.state,
                data: data
            });
        } else {
            var wholeData = this.state.wholeData;
            console.log(wholeData);
            this.setState({
                ...this.state,
                data: wholeData
            });
        }
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
                        <Text style={styles.toolbarTitle}>TAGS</Text>
                    </View>
                    <View style={styles.searchContainer}>
                        <Icon style={styles.searchIcon} name="search" size={20} />
                        <TextInput
                            underlineColorAndroid="transparent"
                            style={styles.search}
                            onChangeText={text => this.onSearch(text)}
                            placeholder="search"
                        />
                    </View>
                    <ScrollView>
                        <View style={styles.tagsContainer}>
                            {!this.state.animating ? (
                                this.state.data.map(element => (
                                    <Tag
                                        navigation={this.props.navigation}
                                        key={element}
                                        tag={element}
                                    />
                                ))
                            ) : (
                                    // <Text style={{ padding: 10, margin: 10 }}>Loading ...</Text>
                                    <Text style={{ padding: 10, margin: 10 }}>Loading ...</Text>
                                )}
                        </View>
                    </ScrollView>
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
        alignSelf: "center"
    },
    searchContainer: {
        flexDirection: "row",
        backgroundColor: "#dedede",
        margin: 5,
        borderRadius: 20
    },
    search: {
        marginHorizontal: 10,
        flex: 1,
        borderRadius: 10
    },
    searchIcon: {
        padding: 10
    },
    tagsContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        padding: 10
    }
});

//make this component available to the app
export default Tags;
