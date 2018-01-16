require("dotenv").config();

var fs = require('fs');
var keys = require('./keys.js');
var Twitter = require('twitter');
var Spotify = require('node-spotify-api');
var request = require('request');
var argOne = process.argv[2];
var argTwo = process.argv[3];

//Twitter
var client = new Twitter(keys.twitter);
var params = {count: 20};

function getTweets() {
	client.get('statuses/user_timeline', params, function(error, tweets, response){
		if (!error) {
			for (var i = 0; i < tweets.length; i++){
				console.log(tweets[i].text + ' Created at: ' + tweets[i].created_at + '\n');
			}
			fs.appendFile('log.txt', '===================================================');
		} else {
			console.log('Twitter error: ' + error);
		}
	});
}

// //Spotify
var spotify = new Spotify(keys.spotify);

function getSong() {
	var queryInput = 'Ace of Base The Sign';
	if (argTwo !== undefined) {
		queryInput = argTwo;
	}
	spotify.search({ type: 'track', query: queryInput}, function(error, data) {
		if (error) {
			console.log('Spotify error: ' + error);
			return;
		}
		console.log('Artist: ' + data.tracks.items[0].artists[0].name);
		console.log('Song Name: ' + data.tracks.items[0].name);
		console.log('Spotify Preview Link: ' + data.tracks.items[0].external_urls.spotify);
		console.log('Album: ' + data.tracks.items[0].album.name);
		fs.appendFile('log.txt', 'Artist: ' + data.tracks.items[0].artists[0].name 
						+ '\n' + 'Song Name: ' + data.tracks.items[0].name
						+ '\n' + 'Spotify Preview Link: ' + data.tracks.items[0].external_urls.spotify 
						+ '\n' + 'Album: ' + data.tracks.items[0].album.name  
						+ '\n' + '=================================================================');
	});
}

function getMovie() {
	var queryInput = 'Mr. Nobody';
	if (argTwo !== undefined) {
		queryInput = argTwo;
	}
	request('http://www.omdbapi.com/?t=' + queryInput + '&y=&plot=short&apikey=trilogy', function (error, response, body) {
	console.log(queryInput);
		if (!error && response.statusCode == 200) {
			var movieData = JSON.parse(body);
			console.log('Title: ' + movieData.Title);
			console.log('Year: ' + movieData.Year);
			console.log('IMDB Rating: ' + movieData.imdbRating);
			console.log('Country: ' + movieData.Country);
			console.log('Language: ' + movieData.Language);
			console.log('Plot: ' + movieData.Plot);
			console.log('Actors: ' + movieData.Actors);
			console.log('Rotten Tomatoes Rating: ' + movieData.tomatoUserRating);
			fs.appendFile('log.txt', 'Title: ' + movieData.Title 
							+ '\n' + 'Year: ' + movieData.Year 
							+ '\n' + 'IMDB Rating: ' + movieData.imdbRating 
							+ '\n' + 'Country: ' + movieData.Country 
							+ '\n' + 'Language: ' + movieData.Language 
							+ '\n' + 'Plot: ' + movieData.Plot 
							+ '\n' + 'Actors: ' + movieData.Actors 
							+ '\n' + 'Rotten Tomatoes Rating: ' + movieData.tomatoUserRating 
							+ '\n' + '=================================================================');
		}
		else {
			console.log('OMDB error: ' + error);
		}
	});
}

function getRandom() {
	fs.readFile('random.txt', 'utf8', function(error, data) {
		if(error) {
			console.log('Random error: ' + error);
		}
		else {
			var dataArray = data.split(',');
			var argOne = dataArray[0];
			var argTwo = dataArray[1];
			console.log(argOne);
			console.log(argTwo);
				switch(argOne) {
					case 'my-tweets':
					getTweets();
					break;
					case 'spotify-this-song':
				    getSong();
				    break;
				    case 'movie-this':
				    getMovie();
				    break;
				}
		}
	});
}

switch(argOne) {
     case 'my-tweets':
          getTweets();
          break;
     case 'spotify-this-song':
          getSong();
          break;
     case 'movie-this':
          getMovie();
          break;
     case 'do-what-it-says':
          getRandom();
          break;
}