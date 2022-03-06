
var searchBtn = document.getElementById('searchBtn');
var searchBox = document.getElementById('searchText');
var localBtn = document.getElementById('localButton');
var randomBox = document.getElementById('randomBox');

// function to fetch restaurant data from Worldwide Restaurants API hartford=33804 westHartford=33970
function getRandomRest() {
    fetch("https://worldwide-restaurants.p.rapidapi.com/search?currency=USD&language=en_US&location_id=33970&limit=1000", 
    {
	"method": "POST",
	"headers": {
		"content-type": "application/x-www-form-urlencoded",
		"x-rapidapi-host": "worldwide-restaurants.p.rapidapi.com",
		"x-rapidapi-key": "b08cbdf9d7msh01230dec8986b34p18bd3ejsn14224ffe0fe4"
	}
})
    .then(function (response) {
        return response.json();        
    })
    .then(function (data) {
        // remove old randRestArr from local storage
        //localStorage.removeItem('randRestArr');
        var restArr = data.results.data;
        var randRestArr = [];
        // create restaurant objects for local storage
        for (var i=0; i<restArr.length; i++) {
            var restObj = {
                "name": restArr[i].name,
                "localId": i
            }
            // add restaurant objects to array
            randRestArr.push(restObj);
            }

            // save array of restaurant objects to local storage
            localStorage.setItem("randRestArr", JSON.stringify(randRestArr));

        displayRandRest();
    });
  }

  //function to display random restaurants 
  var displayRandRest = function() {
    var randRestArr = JSON.parse(localStorage.getItem("randRestArr"));

    console.log("DISPLAY");
    console.log("restaurant array: ");
    console.log(randRestArr);
    console.log("array length : "+ randRestArr.length);

    // choose random index
    for (var i=0; i<5; i++){
        var randIndex = Math.floor(Math.random() * randRestArr.length);
        console.log("ranIndex: " + randIndex);
        console.log("random restaurant: ");
        console.log(randRestArr[randIndex]);

        // retrieve restaurant data
        var restName = randRestArr[randIndex].name;
        console.log("restaurant name: " + restName);
        
        // create empty HTML 
        var restSnippet = document.createElement('p');

        // append to random box
        $(randomBox).append(restSnippet);

        // add content to HTML 
        restSnippet.outerHTML = "<p class='py-2 px-4 border-b-2 border-green-800'>" + restName + "</p>"; 
    }

    
  }

  

searchBtn.addEventListener('click', getRandomRest);