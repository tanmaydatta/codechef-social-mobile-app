import { AsyncStorage } from "react-native";
import SideMenuScreen from "../components/SideMenu/SideMenuScreen";
import NavigationService from "./NavigationService";
import realm from "./Realm";
import { alibabaUrl, codechefUrl } from "./Url";
class Network {
  static async apiCall(url, method, headers, body, flag, repeated) {
    const token = await AsyncStorage.getItem("accessToken");
    headers = {
      ...headers,
      Authorization: "Bearer " + token
    };
    console.log(headers);
    return fetch(url, {
      method: method,
      headers: headers,
      body: body
    })
      .then(async response => response.json())
      .then(async responseJson => {
        console.log(responseJson);
        if (responseJson.status == "Forbidden") {
          if (flag) {
            return responseJson.result.data.content;
          }
          return responseJson;
        } else if (
          !responseJson.result.data ||
          responseJson.status == "error"
        ) {
          if (repeated) {
            this.logout();
          } else {
            const data = await this.refreshToken();
            const response = await this.apiCall(
              url,
              method,
              headers,
              body,
              flag,
              true
            );
            return response;
          }
        } else {
          if (flag) {
            return responseJson.result.data.content;
          }
          return responseJson;
        }
      })
      .catch(error => {
        console.error(error);
        return {};
      });
  }

  static async apiCustomCall(url, method, headers, body, repeated) {
    const token = await AsyncStorage.getItem("accessToken");
    headers = {
      ...headers,
      token: token
    };
    return fetch(url, {
      method: method,
      headers: headers,
      body: body
    })
      .then(async response => response.json())
      .then(async responseJson => {
        console.log(responseJson);
        if (responseJson.status != 200) {
          if (repeated) {
            this.logout();
          } else {
            const data = await this.refreshToken();
            const response = await this.apiCustomCall(
              url,
              method,
              headers,
              body,
              true
            );
            return response;
          }
        } else {
          return responseJson;
        }
      })
      .catch(error => {
        console.error(error);
        return {};
      });
  }

  static async logout() {
    await AsyncStorage.setItem("accessToken", "");
    realm.write(() => {
      realm.deleteAll();
    });
    console.log("here");
    NavigationService.reset("Login", {});
  }

  static async refreshToken() {
    console.log("refresh");
    const val = await AsyncStorage.getItem("accessToken");
    const response = await fetch(alibabaUrl + "/codechef-social-server/api/users/getNewToken", {
      method: "GET",
      headers: {
        token: val
      }
    })
      .then(async response => response.json())
      .then(async responseJson => {
        console.log("refreshing token");
        console.log(responseJson);
        if (responseJson.status == 200) {
          await AsyncStorage.setItem(
            "accessToken",
            responseJson.result.accessToken
          );
          return responseJson;
        } else {
          this.logout();
        }
      })
      .catch(error => {
        console.error(error);
        return {};
      });
      return response;
  }

  static async getTodos() {
    const val = await AsyncStorage.getItem("accessToken");
    console.log(val);
    return this.apiCall(
      codechefUrl + "todo/problems",
      "GET",
      {
        Accept: "application/json",
        Authorization: "Bearer " + val
      },
      null,
      true,
      false
    );
  }
  static async deleteTodo(problemCode) {
    const val = await AsyncStorage.getItem("accessToken");
    return this.apiCall(
      codechefUrl + "todo/delete/?problemCode=" + problemCode,
      "DELETE",
      {
        Accept: "application/json",
        Authorization: "Bearer " + val
      },
      null,
      false,
      false
    );
  }
  static async getUserProfile(profile) {
    const val = await AsyncStorage.getItem("accessToken");
    return this.apiCall(
      codechefUrl + "users/" + profile,
      "GET",
      {
        Accept: "application/json",
        Authorization: "Bearer " + val
      },
      null,
      true,
      false
    );
  }
  static async getAllSet() {
    const val = await AsyncStorage.getItem("accessToken");
    return this.apiCall(
      codechefUrl + "sets/?fields=setName",
      "GET",
      {
        Accept: "application/json",
        Authorization: "Bearer " + val
      },
      null,
      true,
      false
    );
  }

  static async getFriendsSet(setName) {
    const val = await AsyncStorage.getItem("accessToken");
    return this.apiCall(
      codechefUrl + "sets/members/get?setName=" + setName,
      "GET",
      {
        Accept: "application/json",
        Authorization: "Bearer " + val
      },
      null,
      true,
      false
    );
  }

  static async deleteFriend(setName, memberName) {
    const val = await AsyncStorage.getItem("accessToken");
    return this.apiCall(
      codechefUrl +
        "sets/members/delete?setName=" +
        setName +
        "&memberHandle=" +
        memberName,
      "DELETE",
      {
        Accept: "application/json",
        Authorization: "Bearer " + val
      },
      null,
      false,
      false
    );
  }

  static async getTags() {
    const val = await AsyncStorage.getItem("accessToken");
    return this.apiCall(
      codechefUrl + "tags/problems",
      "GET",
      {
        Accept: "application/json",
        Authorization: "Bearer " + val
      },
      null,
      true,
      false
    );
  }

  static async getProblemsByTag(tag) {
    const val = await AsyncStorage.getItem("accessToken");
    return this.apiCall(
      codechefUrl + "tags/problems?filter=" + tag,
      "GET",
      {
        Accept: "application/json",
        Authorization: "Bearer " + val
      },
      null,
      true,
      false
    );
  }

  static async getAllContests() {
    const val = await AsyncStorage.getItem("accessToken");
    return this.apiCall(
      codechefUrl + "contests",
      "GET",
      {
        Accept: "application/json",
        Authorization: "Bearer " + val
      },
      null,
      true,
      false
    );
  }

  static async getPastContests() {
    const val = await AsyncStorage.getItem("accessToken");
    return this.apiCall(
      codechefUrl + "contests?status=past",
      "GET",
      {
        Accept: "application/json",
        Authorization: "Bearer " + val
      },
      null,
      true,
      false
    );
  }

  static async getFutureContests() {
    const val = await AsyncStorage.getItem("accessToken");
    return this.apiCall(
      codechefUrl + "contests?status=future",
      "GET",
      {
        Accept: "application/json",
        Authorization: "Bearer " + val
      },
      null,
      true,
      false
    );
  }
  static async getPresentContests() {
    const val = await AsyncStorage.getItem("accessToken");
    return this.apiCall(
      codechefUrl + "contests?status=present",
      "GET",
      {
        Accept: "application/json",
        Authorization: "Bearer " + val
      },
      null,
      true,
      false
    );
  }

  static async getContestProblems(contest) {
    const val = await AsyncStorage.getItem("accessToken");
    return this.apiCall(
      codechefUrl +
        "contests/" +
        contest +
        "?fields=problemsList,announcements",
      "GET",
      {
        Accept: "application/json",
        Authorization: "Bearer " + val
      },
      null,
      true,
      false
    );
  }

  static async getProblem(contest, problem) {
    const val = await AsyncStorage.getItem("accessToken");
    return this.apiCall(
      codechefUrl + "contests/" + contest + "/problems/" + problem,
      "GET",
      {
        Accept: "application/json",
        Authorization: "Bearer " + val
      },
      null,
      true,
      false
    );
  }

  static async deleteSet(setName) {
    const val = await AsyncStorage.getItem("accessToken");
    return this.apiCall(
      "https://api.codechef.com/sets/delete?setName=" + setName,
      "DELETE",
      {
        Accept: "application/json",
        Authorization: "Bearer " + val
      },
      null,
      false,
      false
    );
  }

  static async addSet(setName, description) {
    const val = await AsyncStorage.getItem("accessToken");
    return this.apiCall(
      "https://api.codechef.com/sets/add",
      "POST",
      {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: "Bearer " + val
      },
      JSON.stringify({
        setName: setName,
        description: description
      }),
      false,
      false
    );
  }

  static async addFriend(setName, memberHandle) {
    const val = await AsyncStorage.getItem("accessToken");
    return this.apiCall(
      "https://api.codechef.com/sets/members/add",
      "POST",
      {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: "Bearer " + val
      },
      JSON.stringify({
        setName: setName,
        memberHandle: memberHandle
      }),
      false,
      false
    );
  }

  static async getUsers(fields, limit, offset, search) {
    const val = await AsyncStorage.getItem("accessToken");
    return this.apiCall(
      "https://api.codechef.com/users?fields=" +
        fields +
        "&limit=" +
        limit +
        "&offset=" +
        offset +
        "&search=" +
        search,
      "GET",
      {
        Accept: "application/json",
        Authorization: "Bearer " + val
      },
      null,
      true,
      false
    );
  }

  static async getAccessToken(code) {
    return fetch("https://api.codechef.com/oauth/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },

      body: JSON.stringify({
        grant_type: "authorization_code",
        code: code,
        client_id: "7cecd56796986a7d2d5d9f8a78b050f1",
        client_secret: "676ab57a5a93b4ca9979b9771de136b9",
        redirect_uri: "codechefsocial://launch"
      })
    })
      .then(response => response.json())
      .then(responseJson => {
        console.log(responseJson);
        if (responseJson.status != "error") {
          return responseJson.result.data;
        }
        return null;
      })
      .catch(error => {
        console.error(error);
        return {};
      });
  }

  static async registerUser(userId, accessToken, refreshToken) {
    return this.apiCustomCall(
      alibabaUrl + "/codechef-social-server/api/users/register/" + userId,
      "POST",
      {
        "Content-Type": "application/json"
      },
      JSON.stringify({
        accessToken: accessToken,
        refreshToken: refreshToken
      }),
      false
    );
  }

  static async registerFcm(fcmToken, accessToken) {
    return this.apiCustomCall(
      alibabaUrl + "/codechef-social-server/api/users/fcmToken/set",
      "POST",
      {
        "Content-Type": "application/json",
        token: accessToken
      },
      JSON.stringify({
        token: fcmToken
      }),
      false
    );
  }

  static async getFeed(lastUpdatedAt) {
    const val = await AsyncStorage.getItem("accessToken");
    console.log(val);
    return this.apiCustomCall(
      alibabaUrl +
        "/codechef-social-server/api/users/feed/get?lastUpdatedAt=" +
        lastUpdatedAt,
      "GET",
      {
        "Content-Type": "application/json",
        token: val
      },
      null,
      false
    );
  }

  static async getNotifications(lastUpdatedAt) {
    const val = await AsyncStorage.getItem("accessToken");
    return this.apiCustomCall(
      alibabaUrl +
        "/codechef-social-server/api/users/notifications/get?lastUpdatedAt=" +
        lastUpdatedAt,
      "GET",
      {
        token: val
      },
      null,
      false
    );
  }

  static async getMessageList(lastUpdatedAt, repeated) {
    const val = await AsyncStorage.getItem("accessToken");
    return this.apiCustomCall(
      alibabaUrl + "/codechef-social-server/api/users/messages/list",
      "GET",
      {
        token: val
      },
      null,
      false
    );
  }

  static async getMessages(user, lastUpdatedAt) {
    const val = await AsyncStorage.getItem("accessToken");
    return this.apiCustomCall(
      alibabaUrl +
        "/codechef-social-server/api/users/messages/" +
        user +
        "/get?lastUpdatedAt=" +
        lastUpdatedAt,
      "GET",
      {
        token: val
      },
      null,
      false
    );
  }

  static async sendMessage(user, message) {
    console.log("sending");
    const val = await AsyncStorage.getItem("accessToken");
    console.log(user);
    console.log(message);
    return this.apiCustomCall(
      alibabaUrl + "/codechef-social-server/api/users/messages/" + user,
      "POST",
      {
        "Content-Type": "application/json",
        token: val
      },
      JSON.stringify({
        message: message
      }),
      false
    );
  }

  static async getSourceCode(submissionId) {
    const val = await AsyncStorage.getItem("accessToken");
    return this.apiCall(
      "https://api.codechef.com/submissions/" + submissionId,
      "GET",
      {
        "Content-Type": "application/json",
        Authorization: "Bearer " + val
      },
      null,
      false,
      false
    );
  }

  static async searchTodos(problemId) {
    return this.apiCustomCall(
      alibabaUrl + "/codechef-social-server/api/problems/search/" + problemId,
      "GET",
      null,
      null,
      false
    );
  }

  static async addTodo(problemId) {
    const val = await AsyncStorage.getItem("accessToken");
    return this.apiCall(
      "https://api.codechef.com/todo/add",
      "POST",
      {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: "Bearer " + val
      },
      JSON.stringify({
        problemCode: problemId,
        contestCode: "PRACTICE"
      }),
      false,
      false
    );
  }

  static async getContestDetails(contestCode) {
    const val = await AsyncStorage.getItem("accessToken");
    const response = await this.apiCall(
      codechefUrl + "contests/" + contestCode,
      "GET",
      {
        "Content-Type": "application/json",
        Authorization: "Bearer " + val
      },
      null,
      true,
      false
    );
    return response;
  }

  static async getRatings(contestType, offset) {
    const val = await AsyncStorage.getItem("accessToken");
    return this.apiCall(
      "https://api.codechef.com/ratings/" +
        contestType +
        "?limit=25&offset=" +
        offset,
      "GET",
      {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: "Bearer " + val
      },
      null,
      true,
      false
    );
  }

  static async getFriendsRatings() {
    const val = await AsyncStorage.getItem("accessToken");
    return this.apiCustomCall(
      alibabaUrl + "/codechef-social-server/api/users/friends/get",
      "GET",
      {
        "Content-Type": "application/json",
        Accept: "application/json",
        token: val
      },
      null,
      false
    );
  }

  static async getMessageUsers(name) {
    const val = await AsyncStorage.getItem("accessToken");
    return this.apiCustomCall(
      alibabaUrl + "/codechef-social-server/api/users/search/" + name,
      "GET",
      {
        "Content-Type": "application/json",
        token: val
      },
      null,
      false
    );
  }
}
export default Network;
