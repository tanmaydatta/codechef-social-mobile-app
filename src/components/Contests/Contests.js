//import liraries
import React, { Component } from "react";
import {
  Alert,
  View,
  Text,
  StyleSheet,
  Image,
  Platform,
  TouchableOpacity,
  TextInput,
  SectionList,
  RefreshControl
} from "react-native";
import Moment from "moment";
import Icon from "react-native-vector-icons/MaterialIcons";
import Network from "../../network/Network";
import ContestRow from "./ContestRow";
import { BarIndicator } from "react-native-indicators";

// create a component
const divTime = new Date(1519846261);
const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December"
];
const sectionTemplate = [
  {
    title: "Future Contests",
    data: []
  },
  {
    title: "Present Contests",
    data: []
  },
  {
    title: "Past Contests",
    data: []
  }
];
class Contests extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: sectionTemplate,
      wholeData: sectionTemplate,
      animating: true
    };
    // this.onSearch = this.onSearch.bind(this);
    this.onRefresh = this.onRefresh.bind(this);
    this.isValidContest = this.isValidContest.bind(this);
  }

  renderRow = ({ item, index, section }) => {
    return (
      <ContestRow
        navigation={this.props.navigation}
        item={item}
        index={index}
        section={section}
      />
    );
  };

  onSearch(text) {
    if (text) {
      var data = this.state.wholeData;
      console.log(this.state.wholeData);
      var fdata = data[0]["data"].filter(item => {
        console.log(item["name"]);
        return (
          item["name"].toLowerCase().indexOf(text.toString().toLowerCase()) > -1
        );
      });
      var padata = data[2]["data"].filter(item => {
        console.log(item["name"]);
        return (
          item["name"].toLowerCase().indexOf(text.toString().toLowerCase()) > -1
        );
      });
      var prdata = data[1]["data"].filter(item => {
        console.log(item["name"]);
        return (
          item["name"].toLowerCase().indexOf(text.toString().toLowerCase()) > -1
        );
      });
      // filterData[0]["data"] = filterData[0]["data"].filter(item => {
      //   return false;
      // })
      this.setState({
        ...this.state,
        data: [
          { ...this.state.wholeData[0], data: fdata },
          { ...this.state.wholeData[1], data: prdata },
          { ...this.state.wholeData[2], data: padata }
        ]
      });
    } else {
      let wholeData = this.state.wholeData;
      console.log(wholeData);
      this.setState({
        ...this.state,
        data: wholeData
      });
    }
  }

  isValidContest = contest => {
    if (
      contest.toLowerCase().indexOf("lunchtime") > -1 ||
      contest.toLowerCase().indexOf("cook-off") > -1
    ) {
      return contest.toLowerCase().indexOf("division") > -1;
    }
    if (contest.toLowerCase().indexOf(" challenge ") > -1) {
      for (var i in months) {
        if (contest.toLowerCase().indexOf(months[i].toLowerCase()) > -1) {
          return contest.toLowerCase().indexOf("division") > -1;
        }
      }
    }
    return true;
  };

  onRefresh() {
    // this.setState({
    //   data: sectionTemplate,
    //   wholeData: sectionTemplate,
    //   refreshing: true
    // });
    console.log(sectionTemplate);
    console.log("calling api");
    this.setState({ animating: true });
    Network.getAllContests()
      .then(data => {
        console.log(data);
        var sections = [
          {
            title: "Future Contests",
            data: []
          },
          {
            title: "Present Contests",
            data: []
          },
          {
            title: "Past Contests",
            data: []
          }
        ];
        // console.log(data.contestList[0]);
        for (var i in data.contestList) {
          var item = data.contestList[i];
          if (!this.isValidContest(item["name"])) {
            continue;
          }
          var currTime = Moment.now();
          var sdate = Moment(item["startDate"], "YYYY-MM-DD HH:mm:ss");
          var edate = Moment(item["endDate"], "YYYY-MM-DD HH:mm:ss");

          if (currTime < sdate) {
            sections[0].data.push(item);
          } else if (currTime > sdate && currTime < edate) {
            sections[1].data.push(item);
          } else {
            sections[2].data.push(item);
          }

          // console.log(data.contestList[i]["name"]);
        }

        return sections;
      })
      .then(sections => {
        console.log(sections);
        // var data = this.state.wholeData;
        // data[1] = sections[1];
        // data[2] = sections[2];
        // data[0] = sections[0];
        this.setState({
          data: sections,
          wholeData: sections,
          animating: false
        });
      });

    console.log("outside request");
  }

  componentDidMount() {
    // this.setState({
    //   data: sectionTemplate,
    //   wholeData: sectionTemplate,
    //   refreshing: true
    // });
    this.onRefresh();
  }

  render() {
    if (this.state.animating) {
      return <BarIndicator color="black" />;
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
            <Text style={styles.toolbarTitle}>CONTESTS</Text>
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
          <View style={styles.contestContainer}>
            <SectionList
              refreshControl={
                <RefreshControl
                  refreshing={this.state.animating}
                  onRefresh={this.onRefresh}
                  tintColor="transparent"
                />
              }
              renderItem={this.renderRow}
              ItemSeparatorComponent={() => <View style={styles.separator} />}
              renderSectionHeader={({ section: { title } }) => (
                <Text
                  style={{
                    fontSize: 16,
                    backgroundColor: "#dedede",
                    padding: 10,

                    fontWeight: "bold"
                  }}
                >
                  {title}
                </Text>
              )}
              sections={this.state.data}
              keyExtractor={(item, index) => index.toString()}
            />
          </View>
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
    marginVertical: 10,
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
  separator: {
    flex: 1,
    height: 1,
    backgroundColor: "#8E8E8E",
    marginHorizontal: 5
  },
  contestContainer: {
    padding: 10
  }
});

//make this component available to the app
export default Contests;
