/**
 * Handles the very minimal navigation logic involved
 * in the slideshow.
 * 
 * @author Hakim El Hattab
 */
var Slideshow = (function(){
	
	var indexh = 0,
	    indexv = 0,
      url;
	
	
	function onKeyDown( event ) {
		
		if( event.keyCode >= 37 && event.keyCode <= 40 ) {
			
			switch( event.keyCode ) {
				case 37: indexh--; indexv = 0; break; // left
				case 39: indexh++; indexv = 0; break; // right
				case 38: indexv--; break; // up
				case 40: indexv++; break; // down
			}
			
			updateHorizontalSlide(true);
			updateVerticalSlide(true);
			
			event.preventDefault();
			
		}
	}
	
	// Consider this a bonus function. Definitely not needed for
	// presentation but the cool-factor of CSS 3D transform on iOS
	// is through the roof.
	function onTouchStart( event ) {
		
		// We're only interested in one point taps
		if (event.touches.length == 1) {
			event.preventDefault();
			
			var point = {
				x: event.touches[0].clientX,
				y: event.touches[0].clientY
			};
			
			// Define the extent of the areas that may be tapped
			// to navigate
			var wt = window.innerWidth * 0.3;
			var ht = window.innerHeight * 0.3;
			
			if( point.x < wt ) {
				indexh --;
				indexv = 0;
			}
			else if( point.x > window.innerWidth - wt ) {
				indexh ++;
				indexv = 0;
			}
			else if( point.y < ht ) {
				indexv --;
			}
			else if( point.y > window.innerHeight - ht ) {
				indexv ++;
			}
			
			updateHorizontalSlide(true);
			updateVerticalSlide(true);
			
		}
	}
	
	function updateSlides( selector, index ) {
		
		// Select all slides and convert the NodeList result to
		// an array
		var slides = Array.prototype.slice.call( document.querySelectorAll( selector ) );
		
		if( slides.length ) {
			// Enforce max and minimum index bounds
			index = Math.max(Math.min(index, slides.length - 1), 0);

			slides[index].setAttribute('class', 'current');
		
			// Any element previous to index is given the 'past' class
			slides.slice(0, index).map(function(element){
				element.setAttribute('class', 'past');
			});
			
			// Any element subsequent to index is given the 'future' class
			slides.slice(index + 1).map(function(element){
				element.setAttribute('class', 'future');
			});
		}

		return index;
		
	}
	
	function updateHorizontalSlide(push) {
    var el = '#main>section';

		indexh = updateSlides( el, indexh );

    if( push === false ) return false;

    if( indexh > 0 && $(el).eq(indexh).length > 0) {
      url = "#slide"+indexh;
      $.bbq.pushState(url);
    }

    if( indexh === 0 )
      $.bbq.pushState("#intro");

	}
	
	function updateVerticalSlide(push) {
    var el = 'section.current>section';

		indexv = updateSlides( el, indexv );

    if( push === false ) return false;

    if( indexv > 0 && $(el).eq(indexv).length > 0) {
      url = "#slide"+indexh+","+indexv;
      $.bbq.pushState(url);
    }
	}

	function initialize() {
		$(document).bind('keydown', onKeyDown);
		document.addEventListener('touchstart', onTouchStart, false);

    var frag = location.hash.split('slide')[1] || "";

    indexh = frag.split(',')[0] || 0;
    indexv = frag.split(',')[1] || 0;

		updateHorizontalSlide(false);
		updateVerticalSlide(false);

    $(window).bind('hashchange', function(e){
      var frag = e.fragment.split('slide')[1],

          h = frag.split(',')[0],
          v = frag.split(',')[1] || 0;

      if(indexh !== h) {
        indexh = h;
      }

      if( indexv !== v ){
        indexv = v;
      }

      updateHorizontalSlide(false);
      updateVerticalSlide(false);

    });

    $('#main').fadeIn(1000);
	}

	// Expose some methods publicly
	return {
		initialize: initialize
	};
	
})();

$(Slideshow.initialize);

