var axios = require("axios");
var moment = require('moment');
var Spotify = require('node-spotify-api');
var fs = require("fs");

const util = require('util');
const exec = util.promisify(require('child_process').exec);



require("dotenv").config();
var keys = require("./keys.js");



var args = process.argv.slice(2);

runLIRI(args);

function runLIRI(args){

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
        if(input){
            try{
                let url = "https://rest.bandsintown.com/artists/" + input + "/events?app_id=524629e5-647f-49ba-b51c-c67d60e6bc39&date=upcoming";
                let getBand = await axios.get(url);
                console.log(url);
                getBand.data.forEach(concert => {
                    console.log("================");
                    console.log("Venue Name:",concert.venue.name);
                    console.log("Venue Location:",concert.venue.city,concert.venue.country);
                    console.log("Date of Event:",moment(concert.datetime).format('MM/DD/YYYY'))
                 });
                
            }catch(err){
                console.error(err);//handle error
            }
        }else{
            console.error("not enough input arguments!")
        }
        
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
                console.log("From album:",song.album.name);
            })
        })
        .catch(function(err) {
            console.error('Error occurred: ' + err); 
        });
}

async function movieThis(input){
    input = input ? input: "Mr. Nobody";
    let appkey = keys.omdb.appkey;

    try{
        let url = "http://www.omdbapi.com/?t="+input+"&apikey="+appkey;
        console.log(url);
        let getMovie = await axios.get(url);
        getMovie = getMovie.data;

        let output={}
        output.Title = getMovie.Title;
        output.ReleaseYear = getMovie.Year;
        output["IMDB Rating"] = getMovie.imdbRating;

        RTR = getMovie.Ratings.find(function(element) {
            return element.Source == 'Rotten Tomatoes';
        });
        
        output["Rotten Tomatoes Rating"] = RTR.Value;
        output.Country = getMovie.Country;
        output.Language = getMovie.Language;
        output.Plot = getMovie.Plot;
        output.Actors = getMovie.Actors;

        console.log("===============")
        for(key in output){
            console.log(key,":",output[key]);
        }
        
    }catch(err){
        console.error(err);//handle error
    }
    
    
}
async function random(){
    random = await fs.readFileSync('random.txt','utf-8');
    // console.log(random.split(","));
    random =random.replace(/\"/g, "");
    let command = random.split(",");
    
    runLIRI(command);
}

