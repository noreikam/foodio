
var searchBtn = document.getElementById('searchBtn');
var searchBox = document.getElementById('searchText');
var localBtn = document.getElementById('localButton');
var randomBox = document.getElementById('randomBox');
var citySelect = document.getElementById('citySelect');
var restCard = document.getElementById('restCard');

function getLocationId(event) {
    event.preventDefault();
    var locationId = "33804";
    const citySelected = document.querySelector('#citySelect');
    var cityArrIndex = citySelected.selectedIndex-1;
    var citySelectedText=cityArr[cityArrIndex].cityText;
    
    locationId = cityArr[cityArrIndex].locationId;
    getRandomRest(locationId);
}

// function to fetch restaurant data from Worldwide Restaurants API hartford=33804 westHartford=33970
function getRandomRest(locationId) {
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
        console.log(restArr);
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
    randomBox.innerHTML = "<div class='px-5 py-8 border-2 border-green-800'><h2 class='font-bold'>Local Restaurants</h2>";
    var randRestArr = JSON.parse(localStorage.getItem("randRestArr"));
    var maxDisplay = 5;
    if(randRestArr.length<maxDisplay) {
        maxDisplay = randRestArr.length;
    }
    var randIndexArr = [];

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
        
        // create empty HTML 
        var restSnippet = document.createElement('p');

        // append to random box
        randomBox.appendChild(restSnippet);

        // add content to HTML 
        restSnippet.outerHTML = "<p class='py-2 px-4 border-b-2 border-green-800'>" + restName + "</p>"; 
    }
    displayRestCard(randIndexArr[0]);    
  }

// function to display restaurant details in page's hero section
var displayRestCard = function(index) {
    
    console.log("displayRestCard()");
    console.log(index);
    console.log(restObj);

    var randRestArr = JSON.parse(localStorage.getItem("randRestArr"));
    var restObj = randRestArr[index];
    var imageURL = 'http://www.ncenet.com/wp-content/uploads/2020/04/No-image-found.jpg';
    if ('photo' in restObj) {
        console.log("has photo");
        imageURL = 'https://media-cdn.tripadvisor.com/media/photo-l/06/7f/6b/2a/lime-bar-grill.jpg';
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

    restCard.innerHTML = 
        "<div class='flex'><div><h1>" + restObj.name + "</h1><img src='" + imageURL + "'</img><h5>Cuisine: " + cuisine + "</h5></div><div><h3>" + restObj.street + "</h3><h3>" + restObj.city + ", " + restObj.state + "<div><a href='" + restObj.trip_advisor_url + "'>Restaurant Website</a></div><div><a href='" + restObj.website_url + "'>Reviews</a></div><h3>Price Range: " + priceRange + "</h3><h3>Rating: " + rating + "/4</h3><h3>" + award + "</h3></div></div><div><p>" + restObj.description + "</p></div>"
}


// this array of objects allows the City dropdown to be populated and maps the selected text to a locationId that the Worldwide Restaurant API needs to use
var cityArr = [
{cityText: "Avon", locationId: "29154"},
{cityText: "Berlin", locationId: "33716"},
{cityText: "Bloomfield", locationId: "33721"},
{cityText: "Bristol", locationId: "33728"},
{cityText: "Burlington", locationId: "33721"},
{cityText: "Collinsville", locationId: "33746"},
{cityText: "East Windsor", locationId: "33771"},
{cityText: "Hartford", locationId: "33804"},
{cityText: "West Hartford", locationId: "33970"},
{cityText: "Windsor", locationId: "33986"}

]
  
// load cities on page load
window.addEventListener("load", () => {
    for(var i=0; i<cityArr.length; i++) {
        var cityOption = document.createElement("option");
        cityOption.textContent = cityArr[i].cityText;
        citySelect.appendChild(cityOption);
  }});


//citySelect.addEventListener('change', getLocationId);
searchBtn.addEventListener('click', getLocationId);

