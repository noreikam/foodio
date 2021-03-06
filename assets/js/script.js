
var searchBtn = document.getElementById('searchBtn');
var searchBox = document.getElementById('searchText');
var localBtn = document.getElementById('localButton');
var restList = document.getElementById('restList');
var citySelect = document.getElementById('citySelect');;
var restCard = document.getElementById('restCard');
var addFavoriteBtn = document.getElementById('addFavorite');
var favoriteBtn = document.getElementById('favoriteBtn');
var indexDisplayed;


function getLocationId(event) {
    event.preventDefault();
    const citySelected = document.querySelector('#citySelect');
    var cityArrIndex = citySelected.selectedIndex-1;
    
    var locationId = cityArr[cityArrIndex].locationId;
    getRandomRest(locationId);
}

// function to fetch restaurant data from Worldwide Restaurants API 
function getRandomRest(locationId) {
    // Worldwide Restaurants API fetch
    fetch("https://worldwide-restaurants.p.rapidapi.com/search?currency=USD&language=en_US&location_id=" + locationId + "&limit=1000", 
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
        var restArr = data.results.data;
        var randRestArr = [];
        // create restaurant objects for local storage
        for (var i=0; i<restArr.length; i++) {
            var restObj = {
                "localId": i,
                "name": restArr[i].name,
                "awards": restArr[i].awards,               
                "cuisine": restArr[i].cuisine,
                "description": restArr[i].description,
                "street": restArr[i].address_obj.street1,
                "city": restArr[i].address_obj.city,
                "state": restArr[i].address_obj.state,
                "photo": restArr[i].photo,
                "price_range": restArr[i].price,
                "raw_ranking": restArr[i].raw_ranking,
                "trip_advisor_url": restArr[i].web_url,
                "website_url": restArr[i].website
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
    // display list title
    restList.innerHTML = "<div class='px-5 py-8 border-2 border-green-800'><h2 class='font-bold'>Local Restaurants</h2>";
    // retrieve restaurant array from local storage
    var randRestArr = JSON.parse(localStorage.getItem("randRestArr"));
    var maxDisplay = 5;
    if(randRestArr.length<maxDisplay) {
        maxDisplay = randRestArr.length;
    }
    var randIndexArr = [];
    var displayedArr = [];

    // choose random index
    for (var i=0; i<maxDisplay; i++){
        var randIndex = Math.floor(Math.random() * randRestArr.length);
        // check for redundant index
        while(randIndexArr.includes(randIndex)) {
            randIndex = Math.floor(Math.random() * randRestArr.length);
        }
        randIndexArr.push(randIndex);

        // retrieve restaurant data
        var restName = randRestArr[randIndex].name;
        var displayedId = 'displayed' + i;

        var restSnippet = $("<p>").attr("id", displayedId)
            .addClass("displayed py-2 px-4 border-b-2 border-green-800")
            .text(restName);
        $("#restList").append(restSnippet);

        // store id to array of displayed restaurant indices
        displayedArr.push({displayedId, randIndex});
    }

    localStorage.setItem("displayedArr", JSON.stringify(displayedArr));

    // display first result
    displayRestCard("randRestArr", randIndexArr[0]);

    // jquery event listener for restaurant list
    $("#restList .displayed").click(function() {
        var displayNext = $(this).attr('id');
        for (var i=0; i<displayedArr.length; i++) {
            if (displayedArr[i].displayedId === displayNext) {
                displayRestCard("randRestArr", displayedArr[i].randIndex);
            }
        }
    
    });

    }

// function to display restaurant details in page's hero section
var displayRestCard = function(arrayName, index) {
    indexDisplayed = index;

    // choose a restaurant
    var restArr = JSON.parse(localStorage.getItem(arrayName));
    var restObj = restArr[index];

    // assign restaurant details to local variables
    var imageURL = 'http://www.ncenet.com/wp-content/uploads/2020/04/No-image-found.jpg';
    if ('photo' in restObj) {
        imageURL = restObj.photo.images.small.url;
    }
    var priceRange = "Unknown";
    if ('price' in restObj) {
        priceRange = restObj.price;
    }
    var cuisine = "Unknown";
    if (restObj.cuisine.length > 0) {
        cuisine = restObj.cuisine[0].name;
    }
    var rating = Math.round(restObj.raw_ranking*10)/10;
    var award = "No awards";
    if (restObj.awards.length > 0) {
        award = restObj.awards[0].display_name;
    }
    // use innerHTML to display restaurant details
    restCard.innerHTML = 
        "<div class='flex mx-8'><div class='flex flex-wrap m-auto justify-center'><h1 class='font-extrabold py-1.5'>" + restObj.name + "</h1><img class='w-full border-4 border-green-800' src='" + imageURL + "'</img><h3 class='font-semibold py-1.5'>Cuisine: " + cuisine + "</h3></div><div class='text-lg text-center py-1.5 px-1.5'><h3>" + restObj.street + "</h3><h3>" + restObj.city + ", " + restObj.state + "</h3><div class='py-1.5'><a class='text-green-700 visited:text-green-400 hover:text-green-900 underline' href='" + restObj.website_url + "'>Restaurant Website</a></div><div><a href='" + restObj.trip_advisor_url + "'>Reviews</a></div><h3>Price Range: " + priceRange + "</h3><h3>Rating: " + rating + "/5</h3><h3>" + award + "</h3><button id='addFavorite' class = 'box-shadow py-1 px-4 my-4 bg-green-300 rounded-full' type='submit'>Add Favorite</button></div></div></div><div><p>" + restObj.description + "</p></div>";

        addFavoriteBtn = document.getElementById('addFavorite');
        addFavoriteBtn.addEventListener('click', addFavorite);
}

// add currently displayed restaurant to local storage favorites array
var addFavorite = function() {
    var randRestArr = JSON.parse(localStorage.getItem("randRestArr"));
    var restObj = randRestArr[indexDisplayed];
    var favRestArr;

    if(JSON.stringify(localStorage.favRestArr)){
        favRestArr = JSON.parse(localStorage.favRestArr);
    }
    else{ 
        favRestArr = [];
    }
    favRestArr.push(restObj);

    localStorage.setItem("favRestArr", JSON.stringify(favRestArr));

}

// display favorites 
var displayFavorites = function() {

    // change heading to favorites
    restList.innerHTML = "<div class='card my-auto mx-auto text-2xl flex-col border-4 border-green-800 order-2'><h2 class='font-bold'>Favorite Restaurants</h2>";
    // retrieve favorites from local storage
    var favRestArr = JSON.parse(localStorage.getItem("favRestArr"));
    
    // loop over favorites array and display each
    for (var i=0; i<favRestArr.length; i++){
        // retrieve restaurant data
        var restName = favRestArr[i].name;
        var displayedId = 'displayed' + i;
        favRestArr[i].displayedId = displayedId;
        
        var restSnippet = $("<p>").attr("id", displayedId)
            .addClass("displayed py-2 px-4 border-b-2 border-green-800")
            .text(restName);
        $("#restList").append(restSnippet);
    }

    // jquery event listener for favorites list
    $("#restList .displayed").click(function() {
        var displayNext = $(this).attr('id');
        for (var i=0; i<favRestArr.length; i++) {
            if (favRestArr[i].displayedId === displayNext) {
                displayRestCard("favRestArr", i);
            }
        }
    
    });
        

        
    }
    


// this array of objects allows the City dropdown to be populated and maps the selected text to a locationId that the Worldwide Restaurant API needs to use
var cityArr = [
    {cityText: "Avon", locationId: "29154"},
    {cityText: "Berlin", locationId: "33716"},
    {cityText: "Bloomfield", locationId: "33721"},
    {cityText: "Bristol", locationId: "33728"},
    {cityText: "Burlington", locationId: "33721"},
    {cityText: "Collinsville", locationId: "33746"},
    {cityText: "East Berlin", locationId: "33760"},
    {cityText: "East Glastonbury", locationId: "33762"},
    {cityText: "East Granby", locationId: "33763"},
    {cityText: "East Hartford", locationId: "33766"},
    {cityText: "East Hartland", locationId: "33767"},
    {cityText: "East Windsor", locationId: "33771"},
    {cityText: "Enfield", locationId: "33777"},
    {cityText: "Farmington", locationId: "33782"},
    {cityText: "Glastonbury", locationId: "33789"},
    {cityText: "Granby", locationId: "33791"},
    {cityText: "Hartford", locationId: "33804"},
    {cityText: "Manchester", locationId: "33823"},
    {cityText: "Marlborough", locationId: "33830"},
    {cityText: "Milldale", locationId: "33839"},
    {cityText: "New Britain", locationId: "33847"},
    {cityText: "New Haven", locationId: "33851"},
    {cityText: "Newington", locationId: "33855"},
    {cityText: "North Canton", locationId: "33861"},
    {cityText: "North Granby", locationId: "33863"},
    {cityText: "Plainville", locationId: "33886"},
    {cityText: "Plantsville", locationId: "33887"},
    {cityText: "Poquonock", locationId: "33892"},
    {cityText: "Rocky Hill", locationId: "33905"},
    {cityText: "Simsbury", locationId: "33918"},
    {cityText: "South Glastonbury", locationId: "33922"},
    {cityText: "South Windsor", locationId: "33928"},
    {cityText: "Southington", locationId: "33931"},
    {cityText: "Suffield", locationId: "33942"},
    {cityText: "Tariffville", locationId: "33945"},
    {cityText: "Unionville", locationId: "33954"},
    {cityText: "Weatogue", locationId: "33967"},
    {cityText: "West Hartford", locationId: "33970"},
    {cityText: "West Hartland", locationId: "33971"},
    {cityText: "West Simsbury", locationId: "33975"},
    {cityText: "West Suffield", locationId: "33976"},
    {cityText: "Wethersfield", locationId: "33980"},
    {cityText: "Windsor", locationId: "33986"},
    {cityText: "Windsor Locks", locationId: "33987"}
]
  
// load cities on page load

window.addEventListener("load", () => {
    for(var i=0; i<cityArr.length; i++) {
        var cityOption = document.createElement("option");
        cityOption.textContent = cityArr[i].cityText;
        citySelect.appendChild(cityOption);
  }
  // call getRandomRest and use Hartford location id as default for beta release
  getRandomRest(33804);
});

// event listener for Find My Food button
searchBtn.addEventListener('click', getLocationId);

// event listener for favorites button
favoriteBtn.addEventListener('click',displayFavorites);