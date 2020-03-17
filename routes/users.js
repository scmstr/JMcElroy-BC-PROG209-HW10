
var express = require('express');
var router = express.Router();

var serverDataArray = []; // our "permanent storage" on the web server

var SongObject = function (pSongName, pSongArtist, pSongAlbum, pSongAlbumReleaseDate) {
  this.SongName = pSongName;
  this.SongArtist = pSongArtist;
  this.SongAlbum = pSongAlbum;
  this.SongAlbumReleaseDate = pSongAlbumReleaseDate;
}

serverDataArray = [
  
  {
    SongName: "Take on Me",
    SongArtist: "a-ha",
    SongAlbum: "Hunting High and Low",
    SongAlbumReleaseDate: '1985'
  },
  {
    SongName: "Never Gonna Give You Up",
    SongArtist: "Rick Astley",
    SongAlbum: "Whenever You Need Somebody",
    SongAlbumReleaseDate: '1987'
  },    
  {
    SongName: "Africa",
    SongArtist: "Toto",
    SongAlbum: "Toto IV",
    SongAlbumReleaseDate: '1982'
  },    
  {
    SongName: "You Spin Me Round (Like a Record)",
    SongArtist: "Dead Or Alive",
    SongAlbum: "Youthquake",
    SongAlbumReleaseDate: '1985'
  },    
  {
    SongName: "We Didn't Start The Fire",
    SongArtist: "Billy Joel",
    SongAlbum: "Storm Front",
    SongAlbumReleaseDate: '1989'
  },    
  {
    SongName: "Sweet Dreams (Are Made of This)",
    SongArtist: "Eurythmics",
    SongAlbum: "Sweet Dreams (Are Made of This)",
    SongAlbumReleaseDate: '1983'
  },
  {
    SongName: "I'm Still Standing",
    SongArtist: "Elton John",
    SongAlbum: "Too Low For Zero",
    SongAlbumReleaseDate: '1983'
  },
  {
    SongName: "Video Killed The Radio Star",
    SongArtist: "The Buggles",
    SongAlbum: "The Age Of Plastic",
    SongAlbumReleaseDate: '1980'
  },
  {
    SongName: "Come On Eileen",
    SongArtist: "Dexys Midnight Runners",
    SongAlbum: "Too Rye Ay",
    SongAlbumReleaseDate: '1982'
  },
  {
    SongName: "Uptown Girl",
    SongArtist: "Billy Joel",
    SongAlbum: "An Innocent Man",
    SongAlbumReleaseDate: '1983'
  }
]







/* POST to addMovie */
router.post('/addSong', function(req, res) {
  console.log(req.body);
  serverDataArray.push(req.body);
  console.log(serverDataArray);
  //res.sendStatus(200);
  res.status(200).send(JSON.stringify('success'));
});


/* GET movieList. */
router.get('/songList', function(req, res) {
  res.json(serverDataArray);
});


/* DELETE to deleteMovie. */
router.delete('/deleteSong/:SongName', function(req, res) {
let SongName = req.params.SongName;
SongName = SongName.toLowerCase();  // allow user to be careless about capitalization
console.log('deleting ID: ' + SongName);
  for(let i=0; i < serverDataArray.length; i++) {
    if(SongName == (serverDataArray[i].SongName).split(" ").toString().toLowerCase()) {
    serverDataArray.splice(i,1);
    }
  }
  res.status(200).send(JSON.stringify('deleted successfully'));
});


//  router.???('/userlist', function(req, res) {
//  users.update({name: 'foo'}, {name: 'bar'})


module.exports = router;
