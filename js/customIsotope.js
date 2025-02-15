// external js: isotope.pkgd.js

// init Isotope
var $grid = $('.items').isotope({
	itemSelector: '.item'
});

var filters = {};

$('.filters').on('click', '.button', function (event) {
	var $button = $(event.currentTarget);
	// get group key
	var $buttonGroup = $button.parents('.button-group');
	var filterGroup = $buttonGroup.attr('data-filter-group');
	// set filter for group
	filters[filterGroup] = $button.attr('data-filter');
	// combine filters
	/* console.log(concatValues(filters)); */ // .room - .banyo -> filterValue
	var filterValue = concatValues(filters);

	// set filter for Isotope
	$grid.isotope({
		filter: filterValue
	});
});

// change is-checked class on buttons
$('.button-group').each(function (i, buttonGroup) {
	var $buttonGroup = $(buttonGroup);
	$buttonGroup.on('click', 'button', function (event) {
		$buttonGroup.find('.is-checked').removeClass('is-checked');
		var $button = $(event.currentTarget);
		$button.addClass('is-checked');
	});
});

// flatten object by concatting values
function concatValues(obj) {
	var value = '';
	for (var prop in obj) {
		value += obj[prop];
	}
	return value;
}
/* Start filter by HASH */

$(window).on('load', function () {
	/* console.log("??") */
	var $container = $('.items');
	var hashID = window.location.hash.substring(1);
	/* console.log(hashID); */
	$grid.isotope({
		filter: "." + hashID
	});
});