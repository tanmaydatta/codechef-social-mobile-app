import React, { Component } from 'react';
import { Dimensions, FlatList, TouchableOpacity, ScrollView, View, StyleSheet, Text, Image, Linking, Platform } from 'react-native';
import realm from '../../network/Realm';
import Network from '../../network/Network';
import Table from 'react-native-simple-table'
import { VictoryPie, VictoryLegend, VictoryTheme } from "victory-native";
import Flag from 'react-native-round-flags';
import { BarIndicator } from 'react-native-indicators';

class Profile extends Component {

	constructor(props) {
		super(props)
		this.state = { data: null, profile: null, animating: false }
	}

	convertToArray(realmObjectsArray) {
		let copyOfJsonArray = Array.from(realmObjectsArray);
		let jsonArray = JSON.parse(JSON.stringify(copyOfJsonArray));
		let data = {
			"username": jsonArray[0].username,
			"fullname": jsonArray[0].fullName,
			"country": {
				"code": jsonArray[0].country
			},
			"rankings": {
				"allContestRanking": {
					"global": jsonArray[0].allContestRankingGlobal,
					"country": jsonArray[0].allContestRankingCountry
				},
				"longRanking": {
					"global": jsonArray[0].longRankingGlobal,
					"country": jsonArray[0].longRankingCountry
				},
				"shortRanking": {
					"global": jsonArray[0].shortRankingGlobal,
					"country": jsonArray[0].shortRankingCountry
				},
				"ltimeRanking": {
					"global": jsonArray[0].ltimeRankingGlobal,
					"country": jsonArray[0].ltimeRankingCountry
				}
			},
			"ratings": {
				"allContest": jsonArray[0].allContestRating,
				"long": jsonArray[0].longRating,
				"short": jsonArray[0].shortRating,
				"lTime": jsonArray[0].lTimeRating,
			},
			"organization": jsonArray[0].organization,
			"submissionStats": {
				"partiallySolvedProblems": jsonArray[0].partiallySolvedProblems,
				"solvedProblems": jsonArray[0].solvedProblems,
				"attemptedProblems": jsonArray[0].attemptedProblems,
				"submittedSolutions": jsonArray[0].submittedSolutions,
				"wrongSubmissions": jsonArray[0].wrongSubmissions,
				"runTimeError": jsonArray[0].runTimeError,
				"timeLimitExceed": jsonArray[0].timeLimitExceed,
				"compilationError": jsonArray[0].compilationError,
				"partiallySolvedSubmissions": jsonArray[0].partiallySolvedSubmissions,
				"acceptedSubmissions": jsonArray[0].acceptedSubmissions
			},
			"band": jsonArray[0].band
		}
		console.log(data)
		return data;
	}

	componentDidMount() {

		const { navigation } = this.props;
		const profile = navigation.getParam('profile');
		this.state.profile = profile
		console.log(profile)
		console.log(this.state.profile)
		if (this.state.profile == "me") {
			let realmObject = realm.objects('MyProfile')
			if (realmObject.length != 0) {
				this.state.data = this.convertToArray(realmObject)
			}
			this.refresh('me')
		} else {
			this.refresh(this.state.profile)
		}
	}

	refresh(username) {
		this.setState({animating:true})
		Network.getUserProfile(username).then(data => {
			console.log(data)
			if (username == 'me') {
				realm.write(() => {
					realm.create(
						"MyProfile",
						{
							username: data.username,
							fullName: data.fullname,
							country: data.country.code,
							allContestRankingGlobal: Number(data.rankings.allContestRanking.global),
							allContestRankingCountry: Number(data.rankings.allContestRanking.country),
							longRankingGlobal: Number(data.rankings.longRanking.global),
							longRankingCountry: Number(data.rankings.longRanking.country),
							shortRankingGlobal: Number(data.rankings.shortRanking.global),
							shortRankingCountry: Number(data.rankings.shortRanking.country),
							ltimeRankingGlobal: Number(data.rankings.ltimeRanking.global),
							ltimeRankingCountry: Number(data.rankings.ltimeRanking.country),
							allSchoolRankingGlobal: Number(data.rankings.allSchoolRanking.global),
							allSchoolRankingCountry: Number(data.rankings.allSchoolRanking.country),
							longSchoolRankingGlobal: Number(data.rankings.longSchoolRanking.global),
							longSchoolRankingCountry: Number(data.rankings.longSchoolRanking.country),
							shortSchoolRankingGlobal: Number(data.rankings.shortSchoolRanking.global),
							shortSchoolRankingCountry: Number(data.rankings.shortSchoolRanking.country),
							ltimeSchoolRankingGlobal: Number(data.rankings.ltimeSchoolRanking.global),
							ltimeSchoolRankingCountry: Number(data.rankings.ltimeSchoolRanking.country),
							allContestRating: Number(data.ratings.allContest),
							longRating: Number(data.ratings.long),
							shortRating: Number(data.ratings.short),
							lTimeRating: Number(data.ratings.lTime),
							allSchoolContestRating: Number(data.ratings.allSchoolContest),
							longSchoolRating: Number(data.ratings.longSchool),
							shortSchoolRating: Number(data.ratings.shortSchool),
							lTimeSchoolRating: Number(data.ratings.lTimeSchool),
							organization: data.organization == null ? "-": data.organization,
							partiallySolvedProblems: Number(data.submissionStats.partiallySolvedProblems),
							solvedProblems: Number(data.submissionStats.solvedProblems),
							attemptedProblems: Number(data.submissionStats.attemptedProblems),
							submittedSolutions: Number(data.submissionStats.submittedSolutions),
							wrongSubmissions: Number(data.submissionStats.wrongSubmissions),
							runTimeError: Number(data.submissionStats.runTimeError),
							timeLimitExceed: Number(data.submissionStats.timeLimitExceed),
							compilationError: Number(data.submissionStats.compilationError),
							partiallySolvedSubmissions: Number(data.submissionStats.partiallySolvedSubmissions),
							acceptedSubmissions: Number(data.submissionStats.acceptedSubmissions),
							band: data.band
						},
						true
					);
				});
				let realmObject = realm.objects('MyProfile')
				this.setState({ data: this.convertToArray(realmObject),animating:false })

			} else {
				this.setState({ data: data,animating:false })
			}
		}).catch(error => {
			console.log(error)
		})
	}

	getStars(band) {
		let items = [];
		for (let i = 1; i <= Number(band.charAt(0)); i++) {
			items.push(<Image source={require("../../images/star.png")} style={{
				alignSelf: 'center',
				width: 20,
				height: 20
			}} />);
		}
		return <View style={styles.starsView}>{items}</View>
	}

	displayJsxMessage() {
		if (this.state.data) {
			const columns = [
				{
					title: 'Rankings',
					dataIndex: 'rankings'
				},
				{
					title: 'Global',
					dataIndex: 'global',
					width: 100
				},
				{
					title: 'Country',
					dataIndex: 'country',
					width: 100
				}
			];
			const dataSource = [
				{
					'rankings': 'All Contest',
					'global': this.state.data.rankings.allContestRanking.global,
					'country': this.state.data.rankings.allContestRanking.country
				},
				{
					'rankings': 'Long Contest',
					'global': this.state.data.rankings.longRanking.global,
					'country': this.state.data.rankings.longRanking.country
				},
				{
					'rankings': 'Short Contest',
					'global': this.state.data.rankings.shortRanking.global,
					'country': this.state.data.rankings.shortRanking.country
				},
				{
					'rankings': 'Lunchtime Contest',
					'global': this.state.data.rankings.ltimeRanking.global,
					'country': this.state.data.rankings.ltimeRanking.country
				},
			]
			return (
				<View style={styles.container}>
					<View style={styles.toolbar}>
						<TouchableOpacity style={styles.toolbarButton} onPress={() => { this.props.navigation.goBack(null) }}>
							<Image style={styles.toolbarButton} source={require("../../images/back.png")} />
						</TouchableOpacity>
						<Text style={styles.toolbarTitle}>{this.state.data.fullname}</Text>
					</View>
					<ScrollView contentContainerStyle={styles.scrollViewStyle}>
						<View style={{ margin: 5, flexDirection: 'row', height: 100 }}>
							<Image style={styles.profileImage} borderRadius={50} source={{ uri: 'https://identicon.org?t=' + this.state.data.username + '&s=512.png' }} />
							<View style={{ marginLeft: 5, flex: 1, justifyContent: 'space-between', }}>
								<Text style={{ textAlign: 'left', fontSize: 15 }}><Text style={styles.boldText}>Username: </Text>: {this.state.data.username}</Text>
								<Text style={{ textAlign: 'left', fontSize: 15 }}><Text style={styles.boldText}>Organization: </Text>: {this.state.data.organization}</Text>
								<View style={{ flex: 1, flexDirection: 'row' }}>
									<Text style={{ width: '60%', maxWidth: 100, textAlign: 'left', fontSize: 15, fontWeight: 'bold'}}>Country: </Text><Flag style={{ height: 20, resizeMode: 'contain', width: 20 }} code={this.state.data.country.code} />
								</View>
								<View style={{ flex: 1, flexDirection: 'row' }}>
									<Text style={{ alignSelf: 'center', textAlign: 'left', fontSize: 15, fontWeight: 'bold' }}>Stars: </Text>{this.getStars(this.state.data.band)}
								</View>
							</View>
						</View>
						<View style={{ height: 60, marginBottom: 10, justifyContent: 'space-between', flexDirection: 'row', marginTop: 20, marginLeft: 5, marginRight: 5 }}>
							<View style={styles.ratingContainer}>
								<Text style={{ textAlign: 'center', fontSize: 12 }}>All Contest:{"\n"}{this.state.data.ratings.allContest}</Text>
							</View>
							<View style={styles.ratingContainer}>
								<Text style={{ textAlign: 'center', fontSize: 12 }}>Long Contest:{"\n"}{this.state.data.ratings.long}</Text>
							</View>
							<View style={styles.ratingContainer}>
								<Text style={{ textAlign: 'center', fontSize: 12 }}>Short Contest:{"\n"}{this.state.data.ratings.short}</Text>
							</View>
							<View style={styles.ratingContainer}>
								<Text style={{ textAlign: 'center', alignSelf: 'center', fontSize: 12 }}>Lunchtime:{"\n"}{this.state.data.ratings.lTime}</Text>
							</View>
						</View>
						<View style={styles.tableContainer}>
							<Table height={220} columnWidth={180} columns={columns} dataSource={dataSource} />
						</View>
						<View style={styles.pieChartContainer}>
							<VictoryPie
								height={350}
								colorScale={["#238B1C", "#D8B541", "#E36358", "#8F5B33", "#F47526", "#6F6D6E"]}
								data={[
									{ x: this.state.data.submissionStats.acceptedSubmissions, y: this.state.data.submissionStats.acceptedSubmissions },
									{ x: this.state.data.submissionStats.partiallySolvedSubmissions, y: this.state.data.submissionStats.partiallySolvedSubmissions },
									{ x: this.state.data.submissionStats.wrongSubmissions, y: this.state.data.submissionStats.wrongSubmissions },
									{ x: this.state.data.submissionStats.runTimeError, y: this.state.data.submissionStats.runTimeError },
									{ x: this.state.data.submissionStats.timeLimitExceed, y: this.state.data.submissionStats.timeLimitExceed },
									{ x: this.state.data.submissionStats.compilationError, y: this.state.data.submissionStats.compilationError },
								]}
							/>
						</View>
						<View style={styles.pieChartLegendContainer}>
							<VictoryLegend
								itemsPerRow={2}
								orientation="horizontal"
								style={{ title: { fontSize: 18 }, }}
								height={150}
								data={[
									{ name: "solutions_accepted", symbol: { fill: "#238B1C" } },
									{ name: "time_limit_exceeded", symbol: { fill: "#F47526" } },
									{ name: "compile_error", symbol: { fill: "#6F6D6E" } },
									{ name: "solutions_partially_accepted", symbol: { fill: "#D8B541" } },
									{ name: "runtime_error", symbol: { fill: "#8F5B33" } },
									{ name: "wrong_answers", symbol: { fill: "#E36358" } },
								]}
							/>
						</View>
					</ScrollView>
				</View >
			)
		} else {
			return <View></View>
		}

	}
	render() {
		if (this.state.animating) {
			return (
				<BarIndicator color='black' />
			);
		} else {
			return (
				this.displayJsxMessage()
			);
		}
	}
}
const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#F5F5F5'
	},
	starsView: {
		flexDirection: 'row',
		borderRadius: 5,
		justifyContent: 'center',
		alignItems: 'center',
	},
	applyScreenButton: {
		alignSelf: 'center',
		width: 100,
		height: 50,
		marginTop: 10,
		paddingTop: 10,
		paddingBottom: 10,
		backgroundColor: '#dedede',
		borderRadius: 10,
		borderWidth: 1,
		borderColor: '#F5F5F5'
	},
	tableContainer: {
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'center',
		height: 150
	},
	pieChartContainer: {
		marginTop: 10,
		justifyContent: 'center',
		alignItems: 'center',
		height: 350
	},
	boldText: {
		// textAlign: 'left', 
		// fontSize: 12,
		fontWeight: 'bold',
		// marginTop: 3
	},
	pieChartLegendContainer: {

		margin: 10,
		justifyContent: 'center',
		alignItems: 'center',
		height: 150,
	},
	rankingContainer: {
		height: 220,
		margin: 5,
		marginTop: 15,
		padding: 5,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: '#F5F5F5',
		borderRadius: 5,
		shadowColor: '#000000',
		shadowOffset: {
			width: 0,
			height: 1
		},
		shadowRadius: 1,
		shadowOpacity: 0.3
	},
	ratingContainer: {
		height: 40,
		padding: 5,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#dedede',
		borderRadius: 5,
		shadowOffset: { width: 2, height: 2 },
		shadowOpacity: 0.5,
		shadowRadius: 3,
		elevation: 2,
		shadowColor: '#A9BCD0'
	},
	titleContainer: {
		padding: 5,
		flexDirection: 'row',
		marginTop: 10,
		marginBottom: 10,
		alignSelf: 'center',
		height: 30,
		backgroundColor: '#F5F5F5',
		borderRadius: 5,
		shadowColor: '#000000',
		shadowOffset: {
			width: 0,
			height: 1
		},
		alignItems: 'center',
		shadowRadius: 1,
		shadowOpacity: 0.3
	},
	profileImage: {
		margin: 5,
		height: 100,
		width: 100,
		alignSelf: 'center'
	},
	scrollViewStyle: {
		// flex: 1,
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
		alignSelf: 'center'
	},
})

export default Profile;
