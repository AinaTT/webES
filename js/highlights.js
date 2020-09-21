function TestPerformance(callback, resultsContainer) {

	var ITERATIONS = 1;

	var returnedValue;
	var numberOfCalls = 0;
	var totalTime = 0;
	var $results, $calls, $totalTime, $avgTime;

	this.measureTime = function() {
		var start = performance.now();
		for (var i = 0; i < ITERATIONS; i++) {
		    returnedValue = callback();
		}
		if (returnedValue != 'aborted') {
		    var time = performance.now() - start;
		    totalTime += time;
		    numberOfCalls++;
		    this.printResults();
		}
	}

	this.printResults = function() {
		if (!$calls) {
		    resultsContainer.prepend(
		        '<div id="' + callback.name + '">' +
				    '<h2>' + callback.name + '</h2>' +
				    '<p>' +
						'<span><b>Calls</b>: <span class="calls"></span> - </span>' +
						'<span><b>Time</b>: <span class="totalTime"></span> - </span>' +
						'<span><b>Avg.</b>: <span class="avgTime"></span></span>' +
				    '</p>' +
		        '</div>'
		    );
		    $results = $('#' + callback.name);
		    $calls = $results.find('.calls');
		    $totalTime = $results.find('.totalTime');
		    $avgTime = $results.find('.avgTime');
		}
		$calls.html(numberOfCalls);
		$totalTime.html(Math.round(100 * totalTime) / 100 + 'ms');
		$avgTime.html(Math.round(100 * totalTime / numberOfCalls) / 100 + 'ms');
	}
}

// modified throttle function to adapt it to the test  
var lastCall, timeoutId;
function throttle(fn, interval) {
	var now = new Date().getTime();
	if (lastCall && now < lastCall + interval) {
		clearTimeout(timeoutId);
		timeoutId = setTimeout(function () {
			lastCall = now;
			fn.call();
		}, interval - (now - lastCall) );
		return 'aborted';
	} else {
		lastCall = now;
		fn.call();
	}
}

$(document).ready(function() {

	var $navigationLinks = $('#navigation > ul > li > a');
	var $sections = $(".section");
	var $sectionsReversed = $($(".section").get().reverse());
	var sectionIdTonavigationLink = {};

	$sections.each(function() {
		sectionIdTonavigationLink[$(this).attr('id')] = $('#navigation > ul > li > a[href=#' + $(this).attr('id') + ']');
	});

	function unoptimized() {
		var scrollPosition = $(window).scrollTop();

		$('.section').each(function() {
		    var sectionTop = $(this).offset().top;
		    var id = $(this).attr('id');

		    if (scrollPosition >= sectionTop) {
		        $('#navigation > ul > li > a').removeClass('active');
		        $('#navigation > ul > li > a[href=#' + id + ']').addClass('active');
		    }
		});
	}

	function cachingObjects() {
		var scrollPosition = $(window).scrollTop();

		$sections.each(function() {
		    var sectionTop = $(this).offset().top;
		    var id = $(this).attr('id');

		    if (scrollPosition >= sectionTop) {
		        $navigationLinks.removeClass('active');
		        $navigationLinks.filter('[href=#' + id + ']').addClass('active');
		    }
		});
	}

	function improvedLoop() {
		var scrollPosition = $(window).scrollTop();

		$($(".section").get().reverse()).each(function() {
		    var currentSection = $(this);
		    var sectionTop = currentSection.offset().top;

		    if (scrollPosition >= sectionTop) {
		        var id = currentSection.attr('id');
		        var $navigationLink = $('#navigation > ul > li > a[href=#' + id + ']');
		        if (!$navigationLink.hasClass('active')) {
		            $('#navigation > ul > li > a').removeClass('active');
		            $navigationLink.addClass('active');
		        }
		        return false;
		    }
		});
	}

	function mapSections() {
		var scrollPosition = $(window).scrollTop();

		$('.section').each(function() {
		    var sectionTop = $(this).offset().top;
		    var id = $(this).attr('id');

		    if (scrollPosition >= sectionTop) {
		        $('#navigation > ul > li > a').removeClass('active');
		        sectionIdTonavigationLink[id].addClass('active');
		    }
		});
	}

	function optimized() {
		var scrollPosition = $(window).scrollTop();

		$sectionsReversed.each(function() {
		    var currentSection = $(this);
		    var sectionTop = currentSection.offset().top;

		    if (scrollPosition >= sectionTop) {
		        var id = currentSection.attr('id');
		        var $navigationLink = sectionIdTonavigationLink[id];
		        if (!$navigationLink.hasClass('active')) {
		            $navigationLinks.removeClass('active');
		            $navigationLink.addClass('active');
		        }
		        return false;
		    }
		});
	}

	function throttleUnoptimized() {
		return throttle( unoptimized, 100 );
	}

	function throttleOptimized() {
		return throttle( optimized, 100 );
	}

	$('#clear').click(function() {
		$('#results').html('');
		iniTests();
	});

	$('#autoscroll').click(function() {
		var position = 0;
		var direction = 1;
		var intervalId = setInterval(scrollMe, 16);

		function scrollMe() {
		    position += 20 * direction;
		    if (position >= $(document).height() - $(window).height() || position == 0) {
		        clearInterval(intervalId);
		        if (direction == 1) {
		            direction = -1;
		            intervalId = setInterval(scrollMe, 16);
		        }
		    }
		    $(window).scrollTop(position);
		}
	});

	var test = {};

	function iniTests() {
		test = {
		    unoptimized: new TestPerformance(unoptimized, $('#results')),
		    cachingObjects: new TestPerformance(cachingObjects, $('#results')),
		    improvedLoop: new TestPerformance(improvedLoop, $('#results')),
		    mapSections: new TestPerformance(mapSections, $('#results')),
		    optimized: new TestPerformance(optimized, $('#results')),
		    throttleUnoptimized: new TestPerformance( throttleUnoptimized, $('#results')),
		    throttleOptimized: new TestPerformance(throttleOptimized, $('#results'))
		}
	}
	iniTests();

	$(window).scroll(function() {
		test[$("input[name='test']:checked").val()].measureTime();
	});

});