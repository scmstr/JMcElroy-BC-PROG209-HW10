let dataArray = [];


// song object constructor
var SongObject = function (pSongName, pSongArtist, pSongAlbum, pSongAlbumReleaseDate) {
  this.SongName = pSongName;
  this.SongArtist = pSongArtist;
  this.SongAlbum = pSongAlbum;
  this.SongAlbumReleaseDate = pSongAlbumReleaseDate;
}


document.addEventListener("DOMContentLoaded", function () {
  //when you click this button, sort the list by NAME, create the new list, then take us to the main list PAGE
  var btnSortName = document.getElementById("btnSortName");
  btnSortName.addEventListener("click", function () {
    dataArray.sort(dynamicSort("SongName"));
    createList();
    document.location.href = "index.html#page4";
  });

  //when you click this button, sort the list by YEAR, create the new list, then take us to the main list PAGE
  document.getElementById("btnSortYear").addEventListener("click", function () {
    dataArray.sort(dynamicSort("SongAlbumReleaseDate"));
    createList();
    document.location.href = "index.html#page4";
  });


  //before Page1 loads, recompile the main list - the MAIN LIST page
  $(document).on("pagebeforeshow", "#page1", function (event) {    
    createList();
    console.log("createList has been called and made this array: " + dataArray);
  });

  //before Page2 loads, clear the fields - the ADD SONG page
  $(document).on("pagebeforeshow", "#page2", function (event) {   
    createList();
  });

  //before Page3 loads, fill the existing HTML elements with the selected values from the correct array object
  $(document).on("pagebeforeshow", "#page3", function (event) {    
    if(document.getElementById("secretID").innerHTML == null || document.getElementById("secretID").innerHTML == "" || document.getElementById("secretID").innerHTML == undefined) { //------- you shouldnt be on page3 if you dont belong there
      document.location.href = "index.html#page1";
    }
  });

  //before Page4 loads, do nothing and then go back to page1
  $(document).on("pagebeforeshow", "#page4", function (event) { 
    document.location.href = "index.html#page1";
  });


  //add song button 
  document.getElementById("btnAddSong").addEventListener("click", function() {
  
    //create object and fill it
    var songName = document.getElementById("pSongName").value;
    var songArtist = document.getElementById("pSongArtist").value;
    var songAlbum = document.getElementById("pSongAlbum").value;
    var songAlbumReleaseDate = document.getElementById("pSongAlbumReleaseDate").value;
    var songObject = new SongObject(songName, songArtist, songAlbum, songAlbumReleaseDate);
    
    //push the object to the array
    //dataArray.push(songObject);            // <------------------------------------- push new song to server array instead of client array!
    addNewSong(songObject);

    //reset
    songObject = "";
    clearAddSong();
  
    //go to the list page
    document.location.href = "index.html#page1"
  });
});


//clears the page input boxes
function clearAddSong() {
  document.getElementById("pSongName").value = "";
  document.getElementById("pSongArtist").value = "";
  document.getElementById("pSongAlbum").value = "";
  document.getElementById("pSongAlbumReleaseDate").value = "";
};


//repopulates the client array from the server, and actually creates the unique html page/list   !!!!! NEEDS GET FROM SERVER !!!!!
function createList()
{
  FillArrayFromServer();
};
function createList2() {
  //clear the main list page
  document.getElementById("divUserlist").innerHTML = "";

  //make a new list element
  var ul = document.createElement('ul');

  //do a foreach on the array, append entry on each object onto said list
  dataArray.forEach(function (element,index) {
    var li = document.createElement('li');
    li.innerHTML = "<a data-transition='pop' class='oneSong' onclick=viewDetails(" + index + ")> Details </a> :  " + element.SongName + " - " + element.SongArtist + "<a data-transition='pop' class='oneSong' onclick=deleteSong('" + element.SongName.split(" ").toString().toLowerCase() + "')> DELETE SONG </a>";
    ul.appendChild(li);
  });

  //add that list to the html element
  divUserlist.appendChild(ul);
};


//takes in unique song name from client list, deletes server array object of that same name
function deleteSong(songNameBlurb) {
  // doing the call to the server right here
  fetch('users/deleteSong/' + songNameBlurb , {
    method: 'DELETE'
  })  
  // now wait for 1st promise, saying server was happy with request or not
  .then(responsePromise1 => responsePromise1.text()) // ask for 2nd promise when server is node
  .then(responsePromise2 =>  console.log(responsePromise2), document.location.href = "index.html#page4")  // wait for data from server to be valid
  // force jump off of same page to refresh the data after delete
  .catch(function (err) {
    console.log(err);
    alert(err);
  });

};


//pulls list from server
function FillArrayFromServer(){
  // using fetch call to communicate with node server to get all data
  fetch('/users/songList')
  .then(function (theResponsePromise) {  // wait for reply.  Note this one uses a normal function, not an => function
    return theResponsePromise.json();
  })
  .then(function (serverData) { // now wait for the 2nd promise, which is when data has finished being returned to client
    console.log("serverData : "+serverData);
    dataArray.length = 0;  // clear array
    dataArray = serverData;   // use our server json data which matches our objects in the array perfectly
    createList2();
  })
  .catch(function (err) {
    console.log(err);
  });
};


// using fetch to push an object up to server
function addNewSong(newSong){
   
  // the required post body data is our movie object passed in, newMovie
  
  // create request object
  const request = new Request('/users/addSong', {
    method: 'POST',
    body: JSON.stringify(newSong),
    headers: new Headers({
      'Content-Type': 'application/json'
    })
  });
    
  // pass that request object we just created into the fetch()
  fetch(request)
    // wait for frist server promise response of "200" success (can name these returned promise objects anything you like)
    // Note this one uses an => function, not a normal function, just to show you can do either 
    .then(theResonsePromise => theResonsePromise.json())    // the .json sets up 2nd promise
    // wait for the .json promise, which is when the data is back
    .then(theResonsePromiseJson => console.log(theResonsePromiseJson), document.location.href = "#page1" )
    // that client console log will write out the message I added to the Repsonse on the server
    .catch(function (err) {
      console.log(err);
    });
    
};


function viewDetails(index) {
  //save songid to page
  document.getElementById("secretID").innerHTML = index;

  //remove any prior data before rewriting
  document.getElementById("oneTitle").innerHTML =  "";
  document.getElementById("oneYear").innerHTML =  "";
  document.getElementById("oneGenre").innerHTML =  "";
  document.getElementById("oneWoman").innerHTML =   "";
    
  document.getElementById("oneTitle").innerHTML =  dataArray[index].SongName;
  document.getElementById("oneYear").innerHTML =  dataArray[index].SongArtist;
  document.getElementById("oneGenre").innerHTML =  dataArray[index].SongAlbum;
  document.getElementById("oneWoman").innerHTML =   dataArray[index].SongAlbumReleaseDate;

  makeEmbed(index);

  document.location.href = "index.html#page3";
};


//populate the youtube video section      !!!! has weird cookie bug caused by modern securities/standards, do not plan on fixing because not scope of class
function makeEmbed(index) {
  if (index == undefined || dataArray[index] == undefined || dataArray[index] == "")
  {
    document.location.href = "index.html#page1"
  }
  else
  {
    var embedHere = document.getElementById("ytplayer");  

    var stringOneSongSearch = ""; 
    stringOneSongSearch = "https://www.youtube.com/embed?listType=search&list=" + dataArray[index].SongName + " " + dataArray[index].SongArtist + " " + " " + dataArray[index].SongAlbumReleaseDate + "&sp=CAM%253D?autoplay=0"; //searches by these keywords and picks the highest viewed one //+ dataArray[index].SongAlbum (took out, was getting too many wrong songs)
    
    embedHere.setAttribute("src", ""); 
    embedHere.setAttribute("src", stringOneSongSearch);  
  }
};


function compareYear(a, b) {
  // Use toUpperCase() to ignore character casing

  
  const songA = a.Year.toUpperCase();
  const songB = b.Year.toUpperCase();

  let comparison = 0;
  if (songA > songB) {
    comparison = 1;
  } else if (songA < songB) {
    comparison = -1;
  }
  return comparison;
}
  

function compareName(a, b) {
  // Use toUpperCase() to ignore character casing

  const songA = a.SongName.toUpperCase();
  const songB = b.SongName.toUpperCase();

  let comparison = 0;
  if (songA > songB) {
    comparison = 1;
  } else if (songA < songB) {
    comparison = -1;
  }
  return comparison;
}



function dynamicSort(property) {
  var sortOrder = 1;

  if (property[0] === "-") {
    sortOrder = -1;
    property = property.substr(1);
  }

  return function (a, b) {
    if (sortOrder == -1) {
      return b[property].localeCompare(a[property]);
    } else {
      return a[property].localeCompare(b[property]);
    }
  }
};
