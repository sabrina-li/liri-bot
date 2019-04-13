var axios = require("axios");
var moment = require('moment');
require("dotenv").config();
var keys = require("./keys.js");
var Spotify = require('node-spotify-api');



var args = process.argv.slice(2);
if(args[0]){
    switch(args[0]){
        case "concert-this": concertThis(args[1]); break;
        case "spotify-this-song":spotifyThis(args[1]);break;
        case "movie-this":movieThis(args[1]);break;
        case "do-what-it-says": random(args[1]);break;
        default: console.log("invalid input!");
    }
}


async function concertThis(input){
    try{
        let url = "https://rest.bandsintown.com/artists/" + input + "/events?app_id=524629e5-647f-49ba-b51c-c67d60e6bc39&date=upcoming";
        let getBand = await axios.get(url);
        getBand.data.forEach(concert => {
            console.log("================");
            console.log("Venue Name:",concert.venue.name);
            console.log("Venue Location:",concert.venue.city,concert.venue.country);
            console.log("Date of Event:",moment(concert.datetime).format('MM/DD/YYYY'))
         });
        
    }catch(err){
        console.error(err);//handle error
    }
    
}
function spotifyThis(input){
    var spotify = new Spotify(keys.spotify);
    input = input ? input: "the Sign";

    console.log("Searching....",input);
    spotify
        .request('https://api.spotify.com/v1/search?q="'+input+'"&type=track&limit=5')
        .then(function(data) {
            data.tracks.items.forEach(song=>{
                console.log("==================");
                console.log("Song found:",song.name);
                let artistsName = ""
                song.artists.forEach(artist=>{
                    artistsName+=artist.name+', '
                });
                artistsName = artistsName.substring(0, artistsName.length - 2); 
                console.log("Artists: ", artistsName);

            })
        })
        .catch(function(err) {
            console.error('Error occurred: ' + err); 
        });
}
function movieThis(){
    
}
function random(){
    
}

