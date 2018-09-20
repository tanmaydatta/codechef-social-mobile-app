//import liraries
import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Platform,
  TouchableOpacity,
  TextInput,
  Dimensions,
  ScrollView,
  RefreshControl
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import Table from "../Table/Table";
import HTML from "react-native-render-html";
import Network from "../../network/Network";
import ContestProblemRow from "./ContestProblemRow";
import { BarIndicator } from "react-native-indicators";

// create a component
const columns = [
  {
    title: "Code",
    dataIndex: "code"
  },
  {
    title: "Submissions",
    dataIndex: "submissions"
  },
  {
    title: "Accuracy",
    dataIndex: "accuracy"
  }
];

const DEFAULT_COLUMN_WIDTH = 60;
const decode = require("decode-html");
class ContestProblems extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      wholeData: [],
      animating: false,
      announcements: "<body></body>"
    };
    // var x = new DOMParser()

    this.onSearch = this.onSearch.bind(this);
    this._onRefresh = this._onRefresh.bind(this);
    // console.log(decode('&lt;div class="hidden"&gt;NON&amp;SENSE&apos;s&lt;/div&gt;'));
  }

  _onRefresh = () => {
    this.setState({ animating: true });
    console.log("calling api");

    problemData = Network.getContestProblems(
      this.props.navigation.getParam("item").code
    ).then(data => {
      console.log(data.problemsList);
      var problems = [];
      var p = data.problemsList;
      for (var key in data.problemsList) {
        problems.push({
          code: p[key]["problemCode"],
          submissions: p[key]["successfulSubmissions"],
          accuracy: p[key]["accuracy"]
        });
      }
      this.setState({
        data: problems,
        wholeData: problems,
        announcements: data.announcements,
        animating: false
      });
    });
  };

  componentDidMount() {
    this._onRefresh();
  }

  onSearch(text) {
    if (text) {
      var data = this.state.wholeData;
      data = data.filter(item => {
        return (
          item.code.toLowerCase().indexOf(text.toString().toLowerCase()) > -1
        );
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
      return <BarIndicator color="black" />;
    } else {
      const dataSource = [];
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
            <Text style={styles.toolbarTitle}>
              {this.props.navigation.getParam("item").code}
            </Text>
          </View>
          <ScrollView
            style={{ flex: 1 }}
            refreshControl={
              <RefreshControl
                refreshing={this.state.animating}
                onRefresh={this._onRefresh}
                tintColor="transparent"
              />
            }
          >
            <View style={styles.searchContainer}>
              <Icon style={styles.searchIcon} name="search" size={20} />
              <TextInput
                underlineColorAndroid="transparent"
                style={styles.search}
                onChangeText={text => this.onSearch(text)}
                placeholder="search"
              />
            </View>
            {!this.state.animating ? (
              <View style={{ padding: 10 }}>
                <HTML
                  html={decode(this.state.announcements)}
                  imagesMaxWidth={Dimensions.get("window").width}
                />
              </View>
            ) : (
              <Text>Loading</Text>
            )}
            <View style={styles.tableContainer}>
              <Table
                refreshing={this.state.animating}
                onRefresh={this._onRefresh}
                height={Dimensions.get("window").height}
                columnWidth={Dimensions.get("window").width / 3}
                columns={columns}
                dataSource={this.state.data}
                renderCell={(item, col) => {
                  return (
                    <ContestProblemRow
                      navigation={this.props.navigation}
                      item={item}
                      col={col}
                      contest={this.props.navigation.getParam("item").code}
                    />
                  );
                }}
                style={styles.table}
              />
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
  tableContainer: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: 10
  },
  table: {
    marginTop: 20,
    width: Dimensions.get("window").width / 3
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
  cell: {
    minHeight: 40,
    width: Dimensions.get("window").width / 3,
    backgroundColor: "transparent",
    borderRightWidth: 1,
    borderRightColor: "#dfdfdf",
    alignItems: "center",
    justifyContent: "center"
  }
});

//make this component available to the app
export default ContestProblems;
