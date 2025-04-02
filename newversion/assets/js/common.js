/*
 * Author: ArtStyles (ArtTemplate)
 * Template Name: vCard
 * Version: 1.0.0
*/

$(document).ready(function() {

    'use strict';

    /*-----------------------------------------------------------------
      Detect device mobile
    -------------------------------------------------------------------*/
	
    var isMobile = false; 
    if( /Android|webOS|iPhone|iPod|iPad|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        $('html').addClass('touch');
        isMobile = true;
    }
    else {
        $('html').addClass('no-touch');
        isMobile = false;
    }

    /*-----------------------------------------------------------------
      Loaded
    -------------------------------------------------------------------*/

	var tweenTime = 4; //sec

	var master = new TimelineMax({delay: tweenTime-2});
	master.eventCallback('onComplete', function() {
		progressBar(); //Init progress bar
    });

	$('body, .js-img-load').imagesLoaded({ background: !0 }).always( function( instance ) {
	    preloader(); //Init preloader
    });

	/**
	 * Initializes and plays the preloader animation sequence using GSAP TimelineMax.
	 *
	 * This function creates a paused TimelineMax, configures several animations to fade out the preloader element,
	 * dim the circle pulse, and fill the progress bar. The animation duration is adjusted using the external tweenTime
	 * variable before the timeline is played.
	 *
	 * @returns {TimelineMax} The timeline instance managing the preloader animations.
	 */
	function preloader() {
		var tl = new TimelineMax({paused: true});
		tl.set('.preloader', {
			opacity: '1'
		})
		.addLabel('first')
		.to('.preloader', .6, {
			delay: 1,
			opacity: '0',
			zIndex: '-1',
			ease: 'Power3.easeInOut'
		})
		.to('.circle-pulse', .5, {
			opacity: 0,
			ease: 'Power3.easeInOut'
		},'+=.5')
		.to('.preloader__progress span', 1, {
			width: '100%',
			ease: 'Power3.easeInOut'
		}, 'first+=.5');

        tl.duration(tweenTime).play();
			
		return tl;
	};

	/*-----------------------------------------------------------------
      Theme switcher
    -------------------------------------------------------------------*/
    /**
     * Updates the page theme by switching the stylesheet.
     *
     * Locates the <link> element with the ID "theme-style" and sets its href attribute to the 
     * dark theme stylesheet if the provided theme is "dark"; otherwise, it applies the light theme.
     *
     * @param {string} theme - The theme identifier; set to "dark" for dark mode, any other value applies the light mode.
     */
    function setTheme(theme) {
        const themeLink = document.getElementById('theme-style');
        if (theme === 'dark') {
            themeLink.href = 'assets/styles/style-dark.css';
        } else {
            themeLink.href = 'assets/styles/style-light.css';
        }
    };
    
    // Detect system preference
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    setTheme(prefersDarkScheme.matches ? 'dark' : 'light');
    
    // Listen for changes in system preference
    prefersDarkScheme.addEventListener('change', (e) => {
        setTheme(e.matches ? 'dark' : 'light');
    });

    /*-----------------------------------------------------------------
      Hamburger
    -------------------------------------------------------------------*/

    $('.hamburger').on('click', function() {
        $(this).toggleClass('is-active');
	    $('.inner-menu').toggleClass('is-active');
		$('body').toggleClass('open-menu');
    });
	
	
    /*-----------------------------------------------------------------
      Nav
    -------------------------------------------------------------------*/
  
    var $sideNavOpen = $('.hamburger');
    var tl = new TimelineMax({paused:true, reversed:true});

    if (window.matchMedia("(max-width: 580px)").matches) {
        $('.inner-menu').each(function(i) {
            tl.timeScale(1);
            tl.fromTo('.nav', 1.0, {
			    width: '0'
            }, {
			    width: '100%',
			    ease: Back.easeOut
		    })
            .staggerFrom('.nav__item', 0.2, {
                opacity: 0,
                x: 70,
                ease: Back.easeOut
            },0.06, '-=0.5');
        }); 
    } else {
        $('.inner-menu').each(function(i) {
            tl.timeScale(1);
            tl.fromTo('.nav', 1.0, {
			    width: '0'
            }, {
			    width: '100%',
			    ease: 'Bounce.easeOut'
		    })
            .staggerFrom('.nav__item', 0.2, {
                opacity: 0,
                x: 70,
                ease: Back.easeOut
            },0.06, '-=0.25');
        });  
    }
  
    $sideNavOpen.on('click', function() {
        tl.reversed() ? tl.play() : tl.reverse();	
    });

	
    /*-----------------------------------------------------------------
      Carousel
    -------------------------------------------------------------------*/	
    
	// Testimonials
	$('.js-carousel-review').each(function() {
		var carousel = new Swiper('.js-carousel-review', {
            slidesPerView: 2,
			spaceBetween: 30,
			//loop: true,
			grabCursor: true,
			watchOverflow: true,
            pagination: {
                el: '.swiper-pagination',
		        clickable: true
            },
			autoplay: {
                delay: 5000,
            },
			breakpoints: {
                991: {
                    slidesPerView: 1,
                    spaceBetween: 0
                }
            }
		});
	});
	
	// Clients
	$('.js-carousel-clients').each(function() {
		var carousel = new Swiper('.js-carousel-clients', {
            slidesPerView: 4,
			spaceBetween: 30,
			//loop: true,
			grabCursor: true,
			watchOverflow: true,
            pagination: {
                el: '.swiper-pagination',
		        clickable: true
            },
			breakpoints: {
                320: {
                    slidesPerView: 1,
                    spaceBetween: 0
                },				
                580: {
                    slidesPerView: 2,
                    spaceBetween: 30
                },				
                991: {
                    slidesPerView: 3,
                    spaceBetween: 30
                }
            }
		});
	});
	
	
    /**
     * Activates sticky sidebar functionality on elements with the "sticky-column" class.
     *
     * Applies the sticky kit plugin to designated elements within a parent container (".sticky-parent") 
     * and adjusts the parent's CSS positioning based on the element's sticky state. Sets the parent's 
     * position to "static" when the sticky element reaches the bottom, and reverts it to "relative" when unsticking.
     */

    function activeStickyKit() {
        $('.sticky-column').stick_in_parent({
            parent: '.sticky-parent'
        });

        // bootstrap col position
        $('.sticky-column')
        .on('sticky_kit:bottom', function(e) {
            $(this).parent().css('position', 'static');
        })
        .on('sticky_kit:unbottom', function(e) {
            $(this).parent().css('position', 'relative');
        });
    };
    activeStickyKit();

    /**
     * Detaches sticky behavior from all elements with the "sticky-column" class.
     *
     * This function triggers the "sticky_kit:detach" event on the target elements,
     * effectively removing any sticky functionality applied via the sticky kit library.
     */
    function detachStickyKit() {
        $('.sticky-column').trigger("sticky_kit:detach");
    };

    //  stop sticky kit
    //  based on your window width

    var screen = 1200;

    var windowHeight, windowWidth;
    windowWidth = $(window).width();
    if ((windowWidth < screen)) {
        detachStickyKit();
    } else {
        activeStickyKit();
    }

    // windowSize
    /**
     * Updates the global window dimension variables.
     *
     * This function assigns the current viewport height and width to the global variables `windowHeight` and `windowWidth`.
     * It uses the native `window.innerHeight` and `window.innerWidth` if available, otherwise it falls back to jQuery's methods.
     */
    function windowSize() {
        windowHeight = window.innerHeight ? window.innerHeight : $(window).height();
        windowWidth = window.innerWidth ? window.innerWidth : $(window).width();
    }
    windowSize();

    /**
     * Returns a debounced version of a function that delays its execution until after a specified wait time.
     *
     * The debounced function postpones invoking the given function until after the specified wait
     * period has elapsed since its last invocation. If the immediate flag is set to true, the function
     * is executed immediately on the first call, then suppressed until the wait period completes.
     *
     * @param {Function} func - The function to debounce.
     * @param {number} wait - The delay in milliseconds.
     * @param {boolean} immediate - If true, execute the function immediately on the first call.
     * @returns {Function} A debounced version of the input function.
     */
    function debounce(func, wait, immediate) {
        var timeout;
        return function() {
            var context = this, args = arguments;
            var later = function() {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            var callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    };

    $(window).resize(debounce(function(){
        windowSize();
        $(document.body).trigger("sticky_kit:recalc");
        if (windowWidth < screen) {
            detachStickyKit();
        } else {
            activeStickyKit();
        }
    }, 250));


    /**
     * Animates progress bars based on scroll position.
     *
     * This function utilizes ScrollMagic to monitor each '.progress' element. When such an element
     * enters the viewport, it triggers an animation that updates the width of all contained '.progress-bar'
     * elements to reflect the percentage specified in their 'aria-valuenow' attribute over a scroll duration
     * of 300 pixels. It also sets the z-index of the progress bars to ensure proper layering.
     */
    
	function progressBar() {
	    $('.progress').each(function() {
		    var ctrl = new ScrollMagic.Controller();
		    new ScrollMagic.Scene({
                triggerElement: '.progress',
	            triggerHook: 'onEnter',
	            duration: 300
            })
            .addTo(ctrl)
		    .on("enter", function (e) {
			    var progressBar = $('.progress-bar');
                progressBar.each(function(indx){
                    $(this).css({'width': $(this).attr('aria-valuenow') + '%', 'z-index': '2'});
                });
		    });
        });
    }
	
    /**
     * Updates the scroll indicator based on the current scroll position.
     *
     * Registers an event listener on the window's scroll event to calculate the percentage of the
     * document scrolled. The computed percentage is applied as the width of the element with the class
     * `.scroll-line`, visually indicating the user's scroll progress.
     */
  
    function scrollIndicator() {
        $(window).on('scroll', function() {
            var wintop = $(window).scrollTop(), docheight = 
            $(document).height(), winheight = $(window).height();
 	        var scrolled = (wintop/(docheight-winheight))*100;
  	        $('.scroll-line').css('width', (scrolled + '%'));
        });
    }
	
	scrollIndicator(); //Init
	
	
    /**
     * Initializes the "back to top" functionality.
     *
     * On page load, the back-to-top button (selected via the "back-to-top" class) is hidden.
     * The function listens for window scroll events and fades in the button when the scroll position
     * exceeds the viewport height, fading it out otherwise. Clicking the button prevents the default
     * action and smoothly scrolls the page to the top.
     */
	
    function scrollToTop() {
        var $backToTop = $('.back-to-top'),
            $showBackTotop = $(window).height();
			
        $backToTop.hide();


        $(window).scroll( function() {
            var windowScrollTop = $(window).scrollTop();
            if( windowScrollTop > $showBackTotop ) {
                $backToTop.fadeIn('slow');
            } else {
                $backToTop.fadeOut('slow');
            }
        });
        
		$backToTop.on('click', function (e) {
            e.preventDefault();
            $(' body, html ').animate( {scrollTop : 0}, 'slow' );
        });
    }
	
	scrollToTop(); //Init


    /*-----------------------------------------------------------------
      Style background image
    -------------------------------------------------------------------*/	
  
    $('.js-image').each(function(){
        var dataImage = $(this).attr('data-image');
        $(this).css('background-image', 'url(' + dataImage + ')');
    });
    
	
    /*-----------------------------------------------------------------
      Autoresize textarea
    -------------------------------------------------------------------*/	

    $('textarea').each(function(){
        autosize(this);
    });


    /*-----------------------------------------------------------------
      Tooltip
    -------------------------------------------------------------------*/
	
    $(function () {
        $('[data-toggle="tooltip"]').tooltip()
    });


    /*-----------------------------------------------------------------
      Switch categories & Filter mobile
    -------------------------------------------------------------------*/	
  
    $('.select').on('click','.placeholder',function(){
      var parent = $(this).closest('.select');
      if ( ! parent.hasClass('is-open')){
          parent.addClass('is-open');
          $('.select.is-open').not(parent).removeClass('is-open');
      }else{
          parent.removeClass('is-open');
      }
    }).on('click','ul>li',function(){
        var parent = $(this).closest('.select');
        parent.removeClass('is-open').find('.placeholder').text( $(this).text() );
        parent.find('input[type=hidden]').attr('value', $(this).attr('data-value') );
	
	    $('.filter__item').removeClass('active');
	    $(this).addClass('active');
	    var selector = $(this).attr('data-filter');
		
	    $('.js-filter-container').isotope({
	        filter: selector
	    });
	    return false;	
    });


    /*-----------------------------------------------------------------
      Masonry
    -------------------------------------------------------------------*/	
	
    // Portfolio
    var $portfolioMasonry = $('.js-masonry').isotope({
        itemSelector: '.gallery-grid__item',
	    layoutMode: 'fitRows',
        percentPosition: true,
	    transitionDuration: '0.5s',
        hiddenStyle: {
            opacity: 0,
            transform: 'scale(0.001)'
        },
        visibleStyle: {
            opacity: 1,
            transform: 'scale(1)'
        },
        fitRows: {
            gutter: '.gutter-sizer'
        },	
        masonry: {
	        columnWidth: '.gallery-grid__item',
            gutter: '.gutter-sizer',
            isAnimated: true
        }
    });
  
    $portfolioMasonry.imagesLoaded().progress( function() {
        $portfolioMasonry.isotope ({
	        columnWidth: '.gallery-grid__item',
            gutter: '.gutter-sizer',
            isAnimated: true,
	        layoutMode: 'fitRows',
            fitRows: {
                gutter: '.gutter-sizer'
            }
	    });
    });	

	
    /*-----------------------------------------------------------------
      niceScroll
    -------------------------------------------------------------------*/		

    $('textarea').niceScroll({
		horizrailenabled:false
	});


    /*-----------------------------------------------------------------
      emoji add in textarea
    -------------------------------------------------------------------*/
	
    $(function() {
        $('.emoji-wrap img').on('click', function(){
            var emoji = $(this).attr('title');
            $('#commentForm').val($('#commentForm').val()+" "+emoji+" ");
        });
    });


    /*-----------------------------------------------------------------
	  mediumZoom
    -------------------------------------------------------------------*/
  
    mediumZoom('[data-zoom]', {
        margin: 30
    });

	
    /*-----------------------------------------------------------------
      Lazyload
    -------------------------------------------------------------------*/

    lazySizes.init();

	
    /*-----------------------------------------------------------------
      Polyfill object-fit
    -------------------------------------------------------------------*/	
	
    var $someImages = $('img.cover');
    objectFitImages($someImages);
	

    /*-----------------------------------------------------------------
      Contacts form
    -------------------------------------------------------------------*/

    $("#contact-form").validator().on("submit", function (event) {
        if (event.isDefaultPrevented()) {
            formError();
            submitMSG(false, "Please fill in the form...");
        } else {
            event.preventDefault();
            submitForm();
        }
    });

    /**
     * Submits the contact form using an AJAX POST request.
     *
     * This function collects the user's name, email, and message from the form inputs, sends them to the server endpoint "assets/php/form-contact.php", and processes the server response by invoking success or error handling callbacks.
     */
    function submitForm(){
        var name = $("#nameContact").val(),
            email = $("#emailContact").val(),
            message = $("#messageContact").val();
			
        var url = "assets/php/form-contact.php";
		
        $.ajax({
            type: "POST",
            url: url,
            data: "name=" + name + "&email=" + email + "&message=" + message,
            success : function(text){
                if (text == "success"){
                    formSuccess();
                } else {
                    formError();
                    submitMSG(false,text);
                }
            }
        });
    }

    /**
     * Handles a successful contact form submission.
     *
     * Resets the contact form and displays a success message confirming that the message has been sent.
     */
    function formSuccess(){
        $("#contact-form")[0].reset();
        submitMSG(true, "Thanks! Your message has been sent.");
    }
  
    /**
     * Applies a shake animation to the contact form to indicate an error.
     *
     * This function removes all existing classes from the contact form, then adds
     * animation classes to trigger a shake effect. Once the animation ends, it clears
     * the added classes.
     */
    function formError(){
        $("#contactForm").removeClass().addClass('shake animated').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
            $(this).removeClass();
        });
    }  
  
    /**
     * Updates the contact validator element with a validation message.
     *
     * Sets the CSS class of the "#validator-contact" element to "validation-success"
     * if the submission is valid or "validation-danger" if not, and updates the element's text
     * with the provided message.
     *
     * @param {boolean} valid - True if the form submission is valid, false otherwise.
     * @param {string} msg - The message to display.
     */
    function submitMSG(valid, msg){
		var msgClasses;
        if(valid){
            msgClasses = "validation-success";
        } else {
           msgClasses = "validation-danger";
        }
        $("#validator-contact").removeClass().addClass(msgClasses).text(msg);
    }
});