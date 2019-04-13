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
        writeToFile("\n\ncommand args:"+args);
    }
    
    
    async function concertThis(input){
        if(input){
            try{
                let url = "https://rest.bandsintown.com/artists/" + input + "/events?app_id=524629e5-647f-49ba-b51c-c67d60e6bc39&date=upcoming";
                let getBand = await axios.get(url);
                // console.log(url);
                if(getBand.data.length>0){
                    getBand.data.forEach(concert => {
                        let thisconcert = ""
                        thisconcert+="\n\t================";
                        thisconcert+="\n\tVenue Name: "+concert.venue.name;
                        thisconcert+="\n\tVenue Location: "+concert.venue.city,concert.venue.country;
                        thisconcert+="\n\tDate of Event: "+ moment(concert.datetime).format('MM/DD/YYYY');
                        console.log(thisconcert);
                        writeToFile(thisconcert);
                     });
                }else{
                    
                     console.error("Error occured with API: No concerts found")
                }
                
                
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
            if(data.tracks.items.length >0){
                data.tracks.items.forEach(song=>{
                    let thisSong = ""
                    thisSong+="\n\t==================";
                    thisSong+="\n\tSong found: "+song.name;
                    let artistsName = ""
                    song.artists.forEach(artist=>{
                        artistsName+=artist.name+', '
                    });
                    artistsName = artistsName.substring(0, artistsName.length - 2); 
                    thisSong+="\n\tArtists: "+ artistsName;
                    thisSong+="\n\tFrom album: "+song.album.name;
                    console.log(thisSong);
                    writeToFile(thisSong);
                })
            }else{
                console.error("Error occured with API: No music found")
           }
           
            
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
        // console.log(url);
        let getMovie = await axios.get(url);
        getMovie = getMovie.data;
        if(getMovie){
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
    
            console.log("===============");
            writeToFile("\n\t===============");
            for(key in output){
                console.log(key,":",output[key]);
                writeToFile("\n\t"+key," : ",output[key]);
            }
            
            
        }else{
            console.error("Error occured with API: No movie found")
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



function writeToFile(text){
    try {
        fs.appendFileSync('log.txt', text);
    } catch (err) {
        /* Handle the error */
    }
}