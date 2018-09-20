//import liraries
import React, { Component } from "react";
import {
  Platform,
  TouchableOpacity,
  Image,
  RefreshControl,
  TextInput,
  ScrollView,
  View,
  FlatList,
  Text,
  StyleSheet
} from "react-native";
import Network from "../../network/Network";
import TodoRow from "./TodoRow";
import Icon from "react-native-vector-icons/MaterialIcons";
import realm from "../../network/Realm";
import NavigationService from "../../network/NavigationService";
import { BarIndicator } from "react-native-indicators";

// create a component
class Todo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null,
      wholeData: null,
      animating: true,
      reloadTable: true
    };
    this.onSearch = this.onSearch.bind(this);

    this.listener = this.props.navigation.addListener("didFocus", () =>
      this._onRefresh()
    );
  }

  convertToArray(realmObjectsArray) {
    let copyOfJsonArray = Array.from(realmObjectsArray);
    let jsonArray = JSON.parse(JSON.stringify(copyOfJsonArray));
    console.log(jsonArray);
    return jsonArray;
  }

  _onRefresh = () => {
    this.setState({ animating: true });
    console.log("calling api");

    todos = Network.getTodos().then(data => {
      let allTodo = realm.objects("TodoProblems");
      realm.write(() => {
        realm.delete(allTodo); // Deletes all books
        this.reloadFromDelete();
        console.log("deleted");
      });
      this.setState({ animating: false });
      for (var key in data) {
        if (data.hasOwnProperty(key)) {
          var obj = data[key];
          realm.write(() => {
            realm.create(
              "TodoProblems",
              {
                problemCode: obj.problemCode,
                problemUrl: obj.problemUrl,
                problemName: obj.problemName,
                status: obj.status,
                tags: obj.tags
              },
              true
            );
          });
        }
      }
      this.setState({
        data: this.convertToArray(realm.objects("TodoProblems")),
        wholeData: this.convertToArray(realm.objects("TodoProblems"))
      });
      this.setState({
        refresh: !this.state.refresh
      });
    });
  };

  componentWillMount() {
    this.setState({
      data: this.convertToArray(realm.objects("TodoProblems")),
      wholeData: this.convertToArray(realm.objects("TodoProblems"))
    });
  }

  reloadFromDelete() {
    this.setState({
      data: this.convertToArray(realm.objects("TodoProblems")),
      wholeData: this.convertToArray(realm.objects("TodoProblems")),
      refresh: !this.state.refresh
    });
  }

  renderRow = ({ item }) => (
    <TodoRow item={item} onDelete={this.reloadFromDelete.bind(this)} />
  );

  onSearch(text) {
    if (text) {
      var data = this.state.wholeData;
      data = data.filter(item => {
        return (
          item.problemName
            .toLowerCase()
            .indexOf(text.toString().toLowerCase()) > -1
        );
      });
      console.log(data);
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

  _onPressAdd() {
    NavigationService.navigate("Search", { type: "addTodo" });
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
            <Text style={styles.toolbarTitle}>TODOS</Text>
            <TouchableOpacity
              style={{ height: 20, width: 20, marginRight: 10 }}
              onPress={() => {
                this._onPressAdd();
              }}
            >
              <Image
                style={{ height: 20, width: 20, marginRight: 10 }}
                source={require("../../images/add_header.png")}
              />
            </TouchableOpacity>
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
          <FlatList
            refreshControl={
              <RefreshControl
                refreshing={this.state.animating}
                onRefresh={this._onRefresh}
                tintColor="transparent"
              />
            }
            extraData={this.state.reloadTable}
            style={{ flex: 1, backgroundColor: "#F5F5F5" }}
            data={this.state.data}
            renderItem={this.renderRow}
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
    flex: 1,
    backgroundColor: "#F5F5F5"
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
    flex: 1
  },
  search: {
    marginHorizontal: 10,
    flex: 1,
    borderRadius: 10
  },
  searchContainer: {
    flexDirection: "row",
    backgroundColor: "#dedede",
    margin: 5,
    borderRadius: 20
  },
  searchIcon: {
    padding: 10
  },
  backIcon: {
    height: 30,
    width: 30
  }
});

//make this component available to the app
export default Todo;
