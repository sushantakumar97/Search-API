var allBeers = [];
var alcoholicBeers = [];
var nonAlcoholicBeers = [];
function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}
function parseJSON(response) {
    if (response.status === 204 || response.status === 205) {
        return null;
    }
    return response.json();
}

function request(url) {
    return fetch(url)
        .then(parseJSON);
}
function loadRandomContent(beer){
	var random_image_container = document.getElementById('random_image_container');
	var random_description_container = document.getElementById('random_description_container');
	var abv = document.getElementById('abv');
	random_image_container.innerHTML=`<img height="150" src="${beer.image_url}" alt="beer"/>`;
	abv.innerHTML = `<span>ABV: ${beer.abv}</span>`;
	random_description_container.innerHTML=beer.description;
}
function loadRandomBear(type){
	if(type == 'alcoholic'){
		var randomIndex = getRandomInt(alcoholicBeers.length);
		loadRandomContent(alcoholicBeers[randomIndex]);
	}else{
		var randomIndex = getRandomInt(nonAlcoholicBeers.length);
		loadRandomContent(nonAlcoholicBeers[randomIndex]);
	}
}

function loadNonAlcoholicBeers(){
	var reqUrl = 'https://api.punkapi.com/v2/beers?abv_lt=6';
	request(reqUrl)
	.then(function(data){
		nonAlcoholicBeers = data;
	}).catch(function(error){

	});
}
function loadAlcoholicBeers(){
	var reqUrl = 'https://api.punkapi.com/v2/beers?abv_gt=6';
	request(reqUrl)
	.then(function(data){
		alcoholicBeers = data;
		loadRandomBear('alcoholic');
		loadAllBeers(alcoholicBeers);
	}).catch(function(error){

	});
}
function loadAllBeers(beers){
	var searched_list_container = document.getElementById('searched_list_container');
	var searched_list = [];
	beers.forEach(beer => {
		searched_list.push(`<div class="row mb16">
			<img height="100" src="${beer.image_url}" alt="${beer.name}" />
			<div class="col-start ml16">
				<label>${beer.name}</label>
				<span>${beer.description}</span>
			</div>
		</div>`);
	});
	searched_list_container.innerHTML = searched_list.length > 0 ? searched_list.join(''): `<span>No Search Result Found!</span`;
}
function searchBeers(){
	allBeers = alcoholicBeers.concat(nonAlcoholicBeers);
	var searchText = document.getElementById('search_input').value.toLocaleLowerCase();
	var searchBy = document.getElementsByName('search-by');
	var index = searchBy[0].checked ? 'name' : 'description';
	var beers = allBeers.filter(beer=>beer[index].toLocaleLowerCase().includes(searchText));
	loadAllBeers(beers);
	console.log("searchBy",searchText);
	console.log("alcoholicBeers",alcoholicBeers);
}
function loadContent(){
	loadAlcoholicBeers();
	loadNonAlcoholicBeers();
}