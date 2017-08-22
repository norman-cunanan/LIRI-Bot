
//Grabs data from keys.js and store it in a variable
var twitterKeyExport = require("./keys.js");
var twitterKey = twitterKeyExport.twitterKeys;

var Twitter = require("twitter");
var Spotify = require("node-spotify-api");
var request = require("request");

var fs = require('fs');


/* Following Commands:
	- my-tweets = show last 20 tweets and when they were created
	- spotify-this-song <song name here> = show artist, song's name, preview link, and album
	- movie-this
	- do-what-it-says
*/

var commands = process.argv[2];
// console.log(commands);

//song or movie
var nodeArgs = process.argv;

var item = "";

var blank = process.argv[3];

for (var i = 3; i < nodeArgs.length; i++) {
  if (i > 3 && i < nodeArgs.length) {
    item = item + " " + nodeArgs[i];
  } else {

    item += nodeArgs[i];

  }
}

// console.log(blank);

// console.log("Twitter Consumer Key: " + twitterKey.consumer_key)

//Twitter Command
if (commands === "my-tweets") {
	// console.log("THIS WORKS");
	
	var client = new Twitter ({
		consumer_key: twitterKey.consumer_key,
  		consumer_secret: twitterKey.consumer_secret,
  		access_token_key: twitterKey.access_token_key,
  		access_token_secret: twitterKey.access_token_secret
	});



	var params = {screen_name: 'JayQuery01', count: 20};
	client.get('statuses/user_timeline', params, function(error, tweets, response) {
  		
  		if (!error) {
    		// console.log(tweets);
    		// console.log(response);
    		// console.log("Twitter works!");

    		for (var i = 0; i < tweets.length; i++) {
    			console.log("Tweet: " + tweets[i].text);
    			console.log("Created at: " + tweets[i].created_at + '\n');
    		}
  		}
	});

//Spotify Command
} else if (commands === "spotify-this-song") {
	
	if (blank === undefined) {
		var songItem = "The Sign Ace of Base";
		searchSong(songItem);
	} else {
		var songItem = item;
		searchSong(songItem);
	}	

} else if (commands === "movie-this") {

	if (blank === undefined){
		var movieItem = "Mr.Nobody";
		searchMovie(movieItem)
	} else {
		var movieItem = item;
		searchMovie(movieItem);
	}
	

} else if (commands === "do-what-it-says") {
	fs.readFile("random.txt", "utf8", function(error,data) {
		if (error) {
			return console.log(error);
		}
		var dataArr = data.split(",");
		// console.log(dataArr)

		var fileCommand = dataArr[0];
		var fileSong = dataArr[1];
		
		// console.log(fileCommand);
		// console.log(fileSong);

		if (fileCommand === "spotify-this-song") {
		
			var songItem = fileSong;
			searchSong(songItem);

		} else if (fileCommand === "movie-this") {

			var movieItem = item;
			searchMovie(movieItem);
		}
	})
}

function searchMovie (movieItem) {
	
	// var movieItem = item;
	var queryUrl = "http://www.omdbapi.com/?t=" + movieItem + "&y=&plot=short&apikey=40e9cece";
	console.log(queryUrl);

	request(queryUrl, function(error, response, body) {
		if (!error && response.statusCode === 200) {
			
			// console.log(body);
			// console.log(JSON.stringify(body, null, 2));

    		var obj = JSON.parse(body);
    		console.log('\n' + "Title of the movie: " + obj["Title"]);
   			console.log("Year: " + obj["Year"]);
   			console.log("IMDB Rating: " + obj["imdbRating"]);
   			console.log("Rotten Tomatoes Rating: " + obj["Ratings"][1]["Value"]);
   			console.log("Country where the movie was produced: " + obj["Country"]);
   			console.log("Language of the movie: " + obj["Language"] + '\n');
   			console.log("Plot of the movie: " + '\n' +  obj["Plot"] + '\n');
   			console.log("Actors in the movie: " + '\n' + obj["Actors"] + '\n');


  		}
	});
}
function searchSong (songItem) {
	var spotify = new Spotify({
  		id: '027bce4503db49fc89c7397fa5fed267',
  		secret: '8e7da570d7e14ed088354e3e89512298'
	});

 	console.log("Song Selected: " + songItem);

	spotify.search({ type: 'track', query: songItem }, function(err, data) {
  		if (err) {
    		return console.log('Error occurred: ' + err);
  		}

 		// console.log(JSON.stringify(data, null, 2));
		// console.log(data);
		console.log("Artist: " + data.tracks.items[0].artists[0].name); 
		console.log("Song: " + data.tracks.items[0].name);
		console.log("Preview: " + data.tracks.items[0].preview_url);
		console.log("Album: " + data.tracks.items[0].album.name);
	});
}


