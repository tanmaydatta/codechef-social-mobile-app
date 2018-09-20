//import liraries
import React, { Component } from "react";
import {Image, TouchableOpacity, Platform, Text, View, Dimensions, StyleSheet, FlatList } from "react-native";
import { Dropdown } from "react-native-material-dropdown";
import Network from "../../network/Network";

// create a component
let contestTypes = [
    {
        value: "all",
        label: "All Contests"
    },
    {
        value: "cookOff",
        label: "Cook Off"
    },
    {
        value: "longChallenge",
        label: "Long Challenge"
    },
    {
        value: "lunchTime",
        label: "LunchTime"
    },
    {
        value: "cookOffSchool",
        label: "Cook Off School"
    },
    {
        value: "longChallengeSchool",
        label: "Long School"
    },
    {
        value: "lunchTimeSchool",
        label: "LunchTime School"
    },
    {
        value: "allSchool",
        label: "All School"
    }
];

let userTypes = [
    {
        value: "all",
        label: "All Users"
    },
    {
        value: "friends",
        label: "Only Friends"
    }
];

const contestTypeToRatingType = {
    cookOff: "shortContestRating",
    all: "allContestRating",
    longChallenge: "longContestRating",
    lunchTime: "lTimeContestRating",
    cookOffSchool: "shortSchoolContestRating",
    longChallengeSchool: "longSchoolContestRating",
    lunchTimeSchool: "lTimeSchoolContestRating",
    allSchool: "allSchoolContestRating"
};

class Ratings extends Component {
    constructor(props) {
        super(props);
        this.state = {
            contest: "",
            users: "",
            data: [],
            offset: 0
        };
    }

    onChangeContestType(value) {
        this.setState({
            contest: value
        });
        console.log(value);
        if (this.canMakeCall()) {
            this.getRatings(0);
        }
    }

    onChangeUsersType(value) {
        this.setState({
            users: value
        });
        console.log(value);
        if (this.canMakeCall()) {
            this.getRatings(0);
        }
    }

    valueExtractor(item) {
        return item.value;
    }

    labelExtractor(item) {
        return item.label;
    }

    endReached() {
        //   alert("hello")
        // Network.getRatings("cookOff", this.state.offset).then(data => {
        //   this.setState({
        //     ...this.state,
        //     data: data,
        //     offset: this.state.offset + 25
        //   });
        // });
        if (this.state.users !== "friends" && this.state.users !== "") {
            this.getRatings(this.state.offset);
        }
    }

    renderItem = ({ item }) => {
        var rating = 0;
        if (this.state.users !== "friends") {
            rating = item.rating ? item.rating : 0;
        } else {
            rating = item[contestTypeToRatingType[this.state.contest]]
                ? item[contestTypeToRatingType[this.state.contest]]
                : 0;
        }
        return (
        
            <View
                style={{
                    margin: 10,
                    padding: 10,
                    backgroundColor: "#dedede",
                    borderRadius: 5,
                    flex: 1,
                    flexDirection: "row",
                    justifyContent: "space-between"
                }}
            >
                <Text
                    style={{
                        flex: 1,
                        textAlign: "left",
                        fontSize: 16,
                        marginHorizontal: 5
                    }}
                >
                    {this.state.users !== "friends" ? item.username : item.userName}
                </Text>
                <Text
                    style={{
                        flex: 1,
                        textAlign: "right",
                        fontSize: 16,
                        marginHorizontal: 5
                    }}
                >
                    {rating}
                </Text>
            </View>
        );
    };

    componentDidMount() {
        // Network.getRatings("cookOff", this.state.offset).then(data => {
        //   this.setState({
        //     ...this.state,
        //     data: data,
        //     offset: this.state.offset + 25
        //   });
        // });
    }

    getRatings(offset) {
        if (offset == 0) {
            this.setState({
                ...this.state,
                data: []
            });
        }
        if (this.state.users !== "all" && this.state.users !== "") {
            Network.getFriendsRatings().then(data => {
                this.setState({
                    ...this.state,
                    data: data.result
                });
                // console.log(data);
            });
        } else {
            Network.getRatings(this.state.contest, offset).then(data => {
                let newData = this.state.data;
                for (var i in data) {
                    newData.push(data[i]);
                }
                this.setState({
                    ...this.state,
                    data: newData,
                    offset: offset + 25
                });
            });
        }
    }

    canMakeCall() {
        return this.state.contest !== "" && this.state.users !== "";
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.toolbar}>
					<TouchableOpacity style={styles.toolbarButton} onPress={() => { this.props.navigation.goBack(null) }}>
						<Image style={styles.toolbarButton} source={require("../../images/back.png")}/>
					</TouchableOpacity>
					<Text style={styles.toolbarTitle}>RATINGS</Text>
                    <Text>   </Text>
				</View>
                <View style={styles.dropDownContainer}>
                    <Dropdown
                        overlayStyle={styles.overlayStyle}
                        containerStyle={styles.dropdown}
                        label="Select ContestType"
                        value={this.state.contest}
                        data={contestTypes}
                        onChangeText={this.onChangeContestType.bind(this)}
                        valueExtractor={this.valueExtractor.bind(this)}
                        labelExtractor={this.labelExtractor.bind(this)}
                    />
                    <Dropdown
                        overlayStyle={styles.overlayStyle}
                        containerStyle={styles.dropdown}
                        value={this.state.users}
                        label="Select Users"
                        data={userTypes}
                        onChangeText={this.onChangeUsersType.bind(this)}
                        valueExtractor={this.valueExtractor.bind(this)}
                        labelExtractor={this.labelExtractor.bind(this)}
                    />
                </View>
                <View style={styles.ratingListContainer}>
                    <View
                        style={{
                            margin: 10,
                            padding: 10,
                            backgroundColor: "#dedede",
                            borderRadius: 5,
                            flexDirection: "row",
                            justifyContent: "space-between"
                        }}
                    >
                        <Text
                            style={{
                                flex: 1,
                                textAlign: "left",
                                fontSize: 16,
                                marginHorizontal: 5,
                                fontWeight: "bold"
                            }}
                        >
                            Name
            </Text>
                        <Text
                            style={{
                                flex: 1,
                                textAlign: "right",
                                fontSize: 16,
                                marginHorizontal: 5,
                                fontWeight: "bold"
                            }}
                        >
                            Rating
            </Text>
                    </View>
                    <FlatList
                        style={styles.ratingList}
                        onEndReachedThreshold={0.7}
                        data={this.state.data}
                        renderItem={this.renderItem}
                        onEndReached={this.endReached.bind(this)}
                        keyExtractor={(item, index) => index.toString()}
                    />
                </View>
            </View>
        );
    }
}

// define your styles
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
	},
    overlayStyle: {
        top: 50
    },
    ratingListContainer: {
        flex: 1
    },
    ratingList: {
        flex: 1
    },
    dropDownContainer: {
        flexDirection: "row",
        justifyContent: "space-around",
        padding: 15,
    },
    dropdown: {
        width: Dimensions.get("window").width / 3 + 10
    }
});

//make this component available to the app
export default Ratings;
