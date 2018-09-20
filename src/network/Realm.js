const Realm = require("realm");

class TodoProblems extends Realm.Object {}
TodoProblems.schema = {
  name: "TodoProblems",
  primaryKey: "problemCode",
  properties: {
    problemCode: "string",
    problemUrl: "string",
    problemName: "string",
    status: "string",
    tags: "string?[]"
  }
};

class Sets extends Realm.Object {}
Sets.schema = {
  name: "Sets",
  primaryKey: "setName",
  properties: {
    setName: "string",
    description: "string"
  }
};

class Friends extends Realm.Object {}
Friends.schema = {
  name: "Friends",
  primaryKey: "memberName",
  properties: {
    memberName: "string",
    arrayPos: { type: "int", default: 0 }
  }
};

class MyProfile extends Realm.Object {}
MyProfile.schema = {
  name: "MyProfile",
  primaryKey: "username",
  properties: {
    username: "string",
    fullName: "string",
    country: "string",
    allContestRankingGlobal: "int",
    allContestRankingCountry: "int",
    longRankingGlobal: "int",
    longRankingCountry: "int",
    shortRankingGlobal: "int",
    shortRankingCountry: "int",
    ltimeRankingGlobal: "int",
    ltimeRankingCountry: "int",
    allSchoolRankingGlobal: "int",
    allSchoolRankingCountry: "int",
    longSchoolRankingGlobal: "int",
    longSchoolRankingCountry: "int",
    shortSchoolRankingGlobal: "int",
    shortSchoolRankingCountry: "int",
    ltimeSchoolRankingGlobal: "int",
    ltimeSchoolRankingCountry: "int",
    allContestRating: "int",
    longRating: "int",
    shortRating: "int",
    lTimeRating: "int",
    allSchoolContestRating: "int",
    longSchoolRating: "int",
    shortSchoolRating: "int",
    lTimeSchoolRating: "int",
    organization: "string",
    partiallySolvedProblems: "int",
    solvedProblems: "int",
    attemptedProblems: "int",
    submittedSolutions: "int",
    wrongSubmissions: "int",
    runTimeError: "int",
    timeLimitExceed: "int",
    compilationError: "int",
    partiallySolvedSubmissions: "int",
    acceptedSubmissions: "int",
    band: "string"
  }
};

class HomeFeed extends Realm.Object {}
HomeFeed.schema = {
  name: "HomeFeed",
  primaryKey: "id",
  properties: {
    id: "int",
    actionUser: { type: "string", default: "0" },
    type: "string",
    postId: { type: "string", default: "0" },
    post: { type: "string", default: "0" },
    postUser: { type: "int", default: 0 },
    postCreatedAt: { type: "string", default: "0" },
    postUpdatedAt: { type: "string", default: "0" },
    postUpVotes: { type: "string", default: "0" },
    postDownVotes: { type: "string", default: "0" },
    postComments: { type: "string", default: "0" },
    submissionResult: { type: "string", default: "0" },
    submissionId: { type: "int", default: 0 },
    contestCode: { type: "string", default: "0" },
    problemCode: { type: "string", default: "0" },
    contestStartDate: { type: "string", default: "0" },
    contestEndDate: { type: "string", default: "0" },
    contestName: { type: "string", default: "0" },
    contestStartDate: { type: "string", default: "0" },
    contestEndDate: { type: "string", default: "0" },
    feedDate: "int",
    createdAt: "int"
  }
};

class NotificationFeed extends Realm.Object {}
NotificationFeed.schema = {
  name: "NotificationFeed",
  primaryKey: "id",
  properties: {
    id: "int",
    actionUser: { type: "string", default: "0" },
    type: "string",
    postId: { type: "string", default: "0" },
    post: { type: "string", default: "0" },
    postUser: { type: "int", default: 0 },
    postCreatedAt: { type: "string", default: "0" },
    postUpdatedAt: { type: "string", default: "0" },
    postUpVotes: { type: "string", default: "0" },
    postDownVotes: { type: "string", default: "0" },
    postComments: { type: "string", default: "0" },
    submissionResult: { type: "string", default: "0" },
    submissionId: { type: "int", default: 0 },
    contestCode: { type: "string", default: "0" },
    problemCode: { type: "string", default: "0" },
    contestStartDate: { type: "string", default: "0" },
    contestEndDate: { type: "string", default: "0" },
    contestName: { type: "string", default: "0" },
    contestStartDate: { type: "string", default: "0" },
    contestEndDate: { type: "string", default: "0" },
    feedDate: "int",
    createdAt: "int"
  }
};

class Message extends Realm.Object {}
Message.schema = {
  name: "Message",
  primaryKey: "id",
  properties: {
    id: "int",
    fromUser: "string",
    toUser: "string",
    message: "string",
    createdAt: "int"
  }
};

export default new Realm({
  schema: [
    TodoProblems,
    Sets,
    Friends,
    MyProfile,
    HomeFeed,
    NotificationFeed,
    Message
  ]
});
