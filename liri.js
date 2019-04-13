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
function spotifyThis(){
    var spotify = new Spotify(keys.spotify);
    
    spotify.search({ type: 'track', query: 'All the Small Things' }, function(err, data) {
        if (err) {
        return console.log('Error occurred: ' + err);
        }
   
    console.log(data); 
    })
}
function movieThis(){
    
}
function random(){
    
}

