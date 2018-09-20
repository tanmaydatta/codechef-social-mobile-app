import React, { Component } from "react";
import {
  AsyncStorage,
  Dimensions,
  Platform,
  TouchableOpacity,
  Image,
  Button,
  TextInput,
  ScrollView,
  View,
  FlatList,
  Text,
  StyleSheet
} from "react-native";
import Network from "../../network/Network";
import Icon from "react-native-vector-icons/MaterialIcons";
import NavigationService from "../../network/NavigationService";

class Compare extends Component {
  constructor(props) {
    super(props);
    this.state = {
      firstText: "",
      secondText: "",
      dataRecovered: 0,
      firstProfile: null,
      secondProfile: null
    };
    this.callApi = this.callApi.bind(this);
  }

  componentDidMount() {
    const { navigation } = this.props;
    this.getFirstProfile();
  }

  async getFirstProfile() {
    let username = await AsyncStorage.getItem("username");
    this.setState({ firstText: username });
  }

  callApi() {
    if (this.state.firstText != "" && this.state.secondText != "") {
      Network.getUserProfile(this.state.firstText).then(data => {
        this.setState({
          dataRecovered: this.state.dataRecovered + 1,
          firstProfile: data
        });
        console.log(data);
      });
      Network.getUserProfile(this.state.secondText).then(data => {
        this.setState({
          dataRecovered: this.state.dataRecovered + 1,
          secondProfile: data
        });
        console.log(data);
      });
    }
  }

  onSelectFirst = data => {
    this.setState({ firstText: data });
  };

  onPressFirst = () => {
    NavigationService.navigate("Search", {
      type: "returnUsername",
      onSelect: this.onSelectFirst
    });
  };

  onSelectSecond = data => {
    this.setState({ secondText: data });
  };

  onPressSecond = () => {
    NavigationService.navigate("Search", {
      type: "returnUsername",
      onSelect: this.onSelectSecond
    });
  };

  render() {
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
          <Text style={styles.toolbarTitle}>Compare</Text>
        </View>
        {this.displayFirstProfile()}
        {this.displaySecondProfile()}
        <TouchableOpacity
          style={styles.applyScreenButton}
          onPress={this.callApi}
          underlayColor="#fff"
        >
          <Text style={styles.applyText}>Apply</Text>
        </TouchableOpacity>
        <View style={{ flex: 1 }} />
        {this.displayJsxMessage()}
      </View>
    );
  }

  getStars(profile) {
    let items = [];
    for (let i = 1; i <= Number(profile.band.charAt(0)); i++) {
      items.push(
        <Image
          source={require("../../images/star.png")}
          style={{
            alignSelf: "center",
            width: 20,
            height: 20
          }}
        />
      );
    }
    return <View style={styles.starsView}>{items}</View>;
  }

  displayFirstProfile() {
    if (this.state.firstText != "") {
      return (
        <View style={styles.cardView}>
          <Text
            style={{
              alignSelf: "center",
              flex: 1,
              fontWeight: "bold",
              fontSize: 16
            }}
          >
            {this.state.firstText}
          </Text>
          <TouchableOpacity
            style={{ width: 25, height: 25, alignSelf: "center" }}
            onPress={() => this.setState({ firstText: "" })}
          >
            <Image
              style={{ width: 25, height: 25, alignSelf: "center", flex: 1 }}
              source={require("../../images/delete-red.png")}
            />
          </TouchableOpacity>
        </View>
      );
    } else {
      return (
        <View style={styles.cardView}>
          <Text
            style={{
              alignSelf: "center",
              flex: 1,
              fontWeight: "normal",
              fontSize: 16,
              color: "gray"
            }}
          >
            Add First Profile
          </Text>
          <TouchableOpacity
            style={{ width: 25, height: 25, alignSelf: "center" }}
            onPress={this.onPressFirst}
          >
            <Image
              style={{ width: 25, height: 25, alignSelf: "center", flex: 1 }}
              source={require("../../images/add_colored.png")}
            />
          </TouchableOpacity>
        </View>
      );
    }
  }

  displaySecondProfile() {
    if (this.state.secondText != "") {
      return (
        <View style={styles.cardView}>
          <Text
            style={{
              alignSelf: "center",
              flex: 1,
              fontWeight: "bold",
              fontSize: 16
            }}
          >
            {this.state.secondText}
          </Text>
          <TouchableOpacity
            style={{ width: 25, height: 25, alignSelf: "center" }}
            onPress={() => this.setState({ secondText: "" })}
          >
            <Image
              style={{ width: 25, height: 25, alignSelf: "center", flex: 1 }}
              source={require("../../images/delete-red.png")}
            />
          </TouchableOpacity>
        </View>
      );
    } else {
      return (
        <View style={styles.cardView}>
          <Text
            style={{
              alignSelf: "center",
              flex: 1,
              fontWeight: "normal",
              fontSize: 16,
              color: "gray"
            }}
          >
            Add Second Profile
          </Text>
          <TouchableOpacity
            style={{ width: 25, height: 25, alignSelf: "center" }}
            onPress={this.onPressSecond}
          >
            <Image
              style={{ width: 25, height: 25, alignSelf: "center", flex: 1 }}
              source={require("../../images/add_colored.png")}
            />
          </TouchableOpacity>
        </View>
      );
    }
  }

  displayJsxMessage() {
    if (this.state.dataRecovered >= 2) {
      return (
        <View style={styles.compareView}>
          <View style={styles.headerRow}>
            <Text style={styles.headerTextTableView}>
              {this.state.firstProfile.fullname}
            </Text>
            <View style={styles.divider} />
            <Text style={styles.headerTextTableView}>
              {this.state.secondProfile.fullname}
            </Text>
          </View>

          <View style={styles.normalRow}>
            {this.getStars(this.state.firstProfile)}
            <View style={styles.dividerView}>
              <Text
                style={{
                  textAlign: "center",
                  alignSelf: "center",
                  fontSize: 12
                }}
              >
                Stars
              </Text>
            </View>
            {this.getStars(this.state.secondProfile)}
          </View>
          <View style={styles.normalRow}>
            <Text
              style={[
                styles.textTableView,
                Number(this.state.firstProfile.ratings.allContest) >=
                  Number(this.state.secondProfile.ratings.allContest) &&
                  styles.boldView
              ]}
            >
              {this.state.firstProfile.ratings.allContest}
            </Text>
            <View style={styles.dividerView}>
              <Text
                style={{
                  textAlign: "center",
                  alignSelf: "center",
                  fontSize: 12
                }}
              >
                All Contest
              </Text>
            </View>
            <Text
              style={[
                styles.textTableView,
                Number(this.state.firstProfile.ratings.allContest) <=
                  Number(this.state.secondProfile.ratings.allContest) &&
                  styles.boldView
              ]}
            >
              {this.state.secondProfile.ratings.allContest}
            </Text>
          </View>
          <View style={styles.normalRow}>
            <Text
              style={[
                styles.textTableView,
                Number(this.state.firstProfile.ratings.long) >=
                  Number(this.state.secondProfile.ratings.long) &&
                  styles.boldView
              ]}
            >
              {this.state.firstProfile.ratings.long}
            </Text>
            <View style={styles.dividerView}>
              <Text
                style={{
                  textAlign: "center",
                  alignSelf: "center",
                  fontSize: 12
                }}
              >
                Long
              </Text>
            </View>
            <Text
              style={[
                styles.textTableView,
                Number(this.state.firstProfile.ratings.long) <=
                  Number(this.state.secondProfile.ratings.long) &&
                  styles.boldView
              ]}
            >
              {this.state.secondProfile.ratings.long}
            </Text>
          </View>
          <View style={styles.normalRow}>
            <Text
              style={[
                styles.textTableView,
                Number(this.state.firstProfile.ratings.short) >=
                  Number(this.state.secondProfile.ratings.short) &&
                  styles.boldView
              ]}
            >
              {this.state.firstProfile.ratings.short}
            </Text>
            <View style={styles.dividerView}>
              <Text
                style={{
                  textAlign: "center",
                  alignSelf: "center",
                  fontSize: 12
                }}
              >
                Short
              </Text>
            </View>
            <Text
              style={[
                styles.textTableView,
                Number(this.state.firstProfile.ratings.short) <=
                  Number(this.state.secondProfile.ratings.short) &&
                  styles.boldView
              ]}
            >
              {this.state.secondProfile.ratings.short}
            </Text>
          </View>
          <View style={styles.normalRow}>
            <Text
              style={[
                styles.textTableView,
                Number(this.state.firstProfile.ratings.lTime) >=
                  Number(this.state.secondProfile.ratings.lTime) &&
                  styles.boldView
              ]}
            >
              {this.state.firstProfile.ratings.lTime}
            </Text>
            <View style={styles.dividerView}>
              <Text
                style={{
                  textAlign: "center",
                  alignSelf: "center",
                  fontSize: 12
                }}
              >
                Lunchtime
              </Text>
            </View>
            <Text
              style={[
                styles.textTableView,
                Number(this.state.firstProfile.ratings.lTime) <=
                  Number(this.state.secondProfile.ratings.lTime) &&
                  styles.boldView
              ]}
            >
              {this.state.secondProfile.ratings.lTime}
            </Text>
          </View>
          <View style={styles.normalLongRow}>
            <Text style={styles.longLefttextTableView}>
              Global:{" "}
              {this.state.firstProfile.rankings.allContestRanking.global}
              {"\n"}
              Country:{" "}
              {this.state.firstProfile.rankings.allContestRanking.country}
            </Text>
            <View style={styles.dividerView}>
              <Text
                style={{
                  textAlign: "center",
                  alignSelf: "center",
                  fontSize: 12
                }}
              >
                All Contest
              </Text>
            </View>
            <Text style={styles.longRighttextTableView}>
              Global:{" "}
              {this.state.secondProfile.rankings.allContestRanking.global}
              {"\n"}
              Country:{" "}
              {this.state.secondProfile.rankings.allContestRanking.country}
            </Text>
          </View>
          <View style={styles.normalLongRow}>
            <Text style={styles.longLefttextTableView}>
              Global: {this.state.firstProfile.rankings.longRanking.global}
              {"\n"}
              Country: {this.state.firstProfile.rankings.longRanking.country}
            </Text>
            <View style={styles.dividerView}>
              <Text
                style={{
                  textAlign: "center",
                  alignSelf: "center",
                  fontSize: 12
                }}
              >
                Long
              </Text>
            </View>
            <Text style={styles.longRighttextTableView}>
              Global: {this.state.secondProfile.rankings.longRanking.global}
              {"\n"}
              Country: {this.state.secondProfile.rankings.longRanking.country}
            </Text>
          </View>
          <View style={styles.normalLongRow}>
            <Text style={styles.longLefttextTableView}>
              Global: {this.state.firstProfile.rankings.shortRanking.global}
              {"\n"}
              Country: {this.state.firstProfile.rankings.shortRanking.country}
            </Text>
            <View style={styles.dividerView}>
              <Text
                style={{
                  textAlign: "center",
                  alignSelf: "center",
                  fontSize: 12
                }}
              >
                Short
              </Text>
            </View>
            <Text style={styles.longRighttextTableView}>
              Global: {this.state.secondProfile.rankings.shortRanking.global}
              {"\n"}
              Country: {this.state.secondProfile.rankings.shortRanking.country}
            </Text>
          </View>
          <View style={styles.normalLongRow}>
            <Text style={styles.longLefttextTableView}>
              Global: {this.state.firstProfile.rankings.ltimeRanking.global}
              {"\n"}
              Country: {this.state.firstProfile.rankings.ltimeRanking.country}
            </Text>
            <View style={styles.dividerView}>
              <Text
                style={{
                  textAlign: "center",
                  alignSelf: "center",
                  fontSize: 12
                }}
              >
                Lunchtime
              </Text>
            </View>
            <Text style={styles.longRighttextTableView}>
              Global: {this.state.secondProfile.rankings.ltimeRanking.global}
              {"\n"}
              Country: {this.state.secondProfile.rankings.ltimeRanking.country}
            </Text>
          </View>
        </View>
      );
    } else {
      return;
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  cardView: {
    height: 50,
    margin: 5,
    padding: 5,
    paddingLeft: 10,
    backgroundColor: "#dedede",
    borderRadius: 5,
    flexDirection: "row",
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 3,
    elevation: 2,
    shadowColor: "#A9BCD0"
  },
  starsView: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#B8BEDD",
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center"
  },
  divider: {
    width: 1,
    backgroundColor: "black"
  },
  dividerView: {
    alignSelf: "center",
    justifyContent: "center",
    backgroundColor: "#F5F5F5",
    height: 20,
    borderRadius: 5,
    width: 75,
    borderColor: "black"
  },
  compareView: {
    marginLeft: 5,
    marginRight: 5,
    marginBottom: 5,
    padding: 5,
    backgroundColor: "#F5F5F5",
    borderRadius: 5,
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowRadius: 1,
    shadowOpacity: 0.3
  },
  headerRow: {
    flexDirection: "row",
    alignSelf: "stretch",
    borderRadius: 5,
    height: 35,
    backgroundColor: "#dedede"
  },
  normalRow: {
    marginTop: 5,
    borderRadius: 5,
    flexDirection: "row",
    alignSelf: "stretch",
    height: 35,
    backgroundColor: "#B8BEDD"
  },
  normalLongRow: {
    marginTop: 5,
    borderRadius: 5,
    flexDirection: "row",
    alignSelf: "stretch",
    height: 40,
    backgroundColor: "#B8BEDD"
  },
  headerTextTableView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    marginLeft: 10,
    alignSelf: "center",
    fontSize: 15
  },
  textTableView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    marginLeft: 10,
    alignSelf: "center",
    fontSize: 12
  },
  boldView: {
    fontWeight: "bold",
    fontSize: 14
  },
  longLefttextTableView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    textAlign: "left",
    marginLeft: 20,
    alignSelf: "center"
  },
  longRighttextTableView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    textAlign: "right",
    marginRight: 20,
    alignSelf: "center"
  },
  applyScreenButton: {
    alignSelf: "center",
    width: 100,
    marginRight: 40,
    marginLeft: 40,
    marginTop: 5,
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: "#dedede",
    borderRadius: 5,
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 3,
    elevation: 3,
    shadowColor: "#A9BCD0"
  },
  applyText: {
    textAlign: "center",
    paddingLeft: 10,
    paddingRight: 10,
    fontSize: 18
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
  }
});

export default Compare;
