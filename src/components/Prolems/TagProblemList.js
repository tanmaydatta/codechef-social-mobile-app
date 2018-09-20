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
  Dimensions
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import Table from "../Table/Table";
import Network from "../../network/Network";
import TagProblemRow from "./TagProblemRow";

// create a component
const columns = [
  {
    title: "Code",
    dataIndex: "code"
  },
  {
    title: "Attempted",
    dataIndex: "attempted"
  },
  {
    title: "Solved",
    dataIndex: "solved"
  },
  {
    title: "Partially Solved",
    dataIndex: "psolved"
  }
];

const DEFAULT_COLUMN_WIDTH = 60;

class TagProblemList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      wholeData: [],
      refreshing: false
    };

    this.onSearch = this.onSearch.bind(this);
    this._onRefresh = this._onRefresh.bind(this);
    this.onPressProblem = this.onPressProblem.bind(this);
  }

  _onRefresh = () => {
    this.setState({ refreshing: true });
    console.log("calling api");

    problemData = Network.getProblemsByTag(
      this.props.navigation.getParam("item")
    ).then(data => {
      this.setState({ refreshing: true });
      console.log(data);
      var problems = [];
      for (var key in data) {
        problems.push({
          code: key,
          attempted: data[key]["attempted"],
          solved: data[key]["solved"],
          psolved: data[key]["partiallySolved"]
        });
      }
      this.setState({
        data: problems,
        wholeData: problems,
        refreshing: !this.state.refreshing
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

  onPressProblem = () => {
    // go to problem page
  };

  render() {
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
            PROBLEMS ({this.props.navigation.getParam("item")})
          </Text>
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

        <View style={styles.tableContainer}>
          <Table
            refreshing={this.state.refreshing}
            onRefresh={this._onRefresh}
            height={Dimensions.get("window").height}
            columnWidth={Dimensions.get("window").width / 4}
            columns={columns}
            dataSource={this.state.data}
            renderCell={(item, col) => {
              return (
                <TagProblemRow
                  navigation={this.props.navigation}
                  item={item}
                  col={col}
                />
              );
            }}
            style={styles.table}
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
  tableContainer: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: 10
  },
  table: {
    marginTop: 20,
    width: Dimensions.get("window").width / 4
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
    width: Dimensions.get("window").width / 4,
    backgroundColor: "transparent",
    borderRightWidth: 1,
    borderRightColor: "#dfdfdf",
    alignItems: "center",
    justifyContent: "center"
  }
});

//make this component available to the app
export default TagProblemList;
