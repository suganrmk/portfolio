(function($) {
	"use strict";
	//workflow circles deal last li 
	$('#workflow-circles').find('li:last span').remove();
	// Global Variables/Selectors (Common to all)
	var $masonryGrid = $("#masonry-grids"),
		$featuredPost = $(".featured-post"),
		$pageContents = $(".page-contents"),
		supportTransitions = Modernizr.csstransitions;

	/** Masonry Grids Config **/
	function masonryConfig() {
		var $item = $("> li.grid-item", $masonryGrid);

		function masonryInit() {
			$masonryGrid.masonry({
				itemSelector: "li.grid-item"
			});
		}
		// Centering Full Layout Vertically
		function centeringLayout() {
			var wH = $("html").outerHeight(),
				contH = $masonryGrid.outerHeight();

			$masonryGrid.css("margin-top", Math.abs(wH/2 - contH/2));
		}
		// Re-order Layout
		function reArrange() {
			function compare(a, b) {
				return ($(a).data("cell") > $(b).data("cell")) ? 1 : -1;
			}
			$item.sort(compare).prependTo($masonryGrid.selector);
		}

		// Init Events & functions
		masonryInit();	// First Time Initialization
		$(window).on("load resize", function(e) {
			var width = $(this).width()
			reArrange();	// call reArrange Function (on every resize)
			// Custom Arrangement -- change acc. to your needs
			if(width <= 480) {
				$("[data-cell=1]").after($("[data-cell=3]"));
				$("[data-cell=8]").after($("[data-cell=5]"));
			}
			else if(width <= 1200) {
				if(width <= 991) {
					$("[data-cell=5]").after($("[data-cell=8]"));
				}
				$("[data-cell=4]").after($("[data-cell=7]"));
				$("[data-cell=6]").after($("[data-cell=5]"));
			}

			$masonryGrid.masonry("destroy");	// destroy previous initialization
			masonryInit();	// Reinitialize
			centeringLayout();	// Center the Layout Vertically
		});

	}


	/** Own Carousel Config **/
	function owlCarouselConfig() {
		var owl = $("#owl-carousel"),
			owlOpts = {
				slideSpeed: 200,
				paginationSpeed: 200,
				rewindSpeed: 800,
				singleItem: true,
				autoPlay: true,
				pagination: false, // disable default pagination
				responsive: true
			};

		owl.owlCarousel(owlOpts);
		// Custom Pagination Init
		var $pagination = $featuredPost.find(".featured-pagination"),
			$next = $pagination.find(".next"),
			$back = $pagination.find(".back");

		$next.click(function() {
			owl.trigger("owl.next");
		});
		$back.click(function() {
			owl.trigger("owl.prev");
		});


		// For Resume Timeline
		var timeline = $("#timeline-carousel"),
			timelineOpts = {
				slideSpeed: 200,
				paginationSpeed: 200,
				rewindSpeed: 800,
				// singleItem: true,
				items : 3,
				itemsDesktop: [1170, 3],
				itemsMobile: [480, 1],
				autoPlay: true,
				pagination: true, // disable default pagination
				// responsive: true
			};
		timeline.owlCarousel(timelineOpts);
		
	}

	/** Isotop Config - For portfolio page **/
	var curIsotopeFilter = '*';
	var curIsotopePage = '';
	function isotopeConfig() {
		var $container = $("#filter-port"),
			$filter = $("#filter-nav"),
			$pages=$('#portfolio_iso_pages');
		$(window).on("load resize", function() {
			$container.isotope({
				itemSelector: ".item",
				animationEngine: "best-available",
				transformsEnabled: true,
				resizesContainer: true,
				resizable: true,
				easing: "linear",
				layoutMode:'fitRows'
			});
			$filter.find("a").on("click touchstart", function(e) {
				var $t = $(this),
					selector = $t.data("filter");
				// Don't proceed if already selected
				if($t.hasClass("filter-current"))
					return false;
				curIsotopeFilter = selector;
				pagesClear();
				pagesBuild();
				$filter.find(".filter-current").removeClass("filter-current");
				$t.parent().addClass("filter-current");
				$container.isotope({filter: getIsotopeFilter()});
				return false;
			});
			$pages.on('click', 'li a', function(){
				var selector = jQuery(this).attr('data-filter');
				curIsotopePage = selector;
				$('#portfolio_iso_pages_current').html(selector.substr(selector.lastIndexOf('_')+1));
				$container.isotope({ filter: getIsotopeFilter() });
				$(this).parents('#portfolio_iso_pages').find('a').removeClass('current');
				$(this).addClass('current');
				return false;
			});
			pagesBuild();
			$container.isotope({ filter: getIsotopeFilter() });
		})

		function getIsotopeFilter() {
			var flt = curIsotopeFilter!='*' ? curIsotopeFilter : '';
			flt += curIsotopePage!='' ? ((flt!='' ? '' : '') + curIsotopePage) : '';
			flt=='' ? '*' : '';
			return flt;
		}
		function pagesBuild() {
			var selector = '#filter-port '+(curIsotopeFilter!='*' ? curIsotopeFilter : '.item');
			var items = $(selector);
			var total = items.length;
			$("#portfolio_iso_pages").hide();
			var ppp = $('#portfolio-nums').data('nums')||8; //get portfolio nums per page
			if (total > ppp) {
				var pagesList = '';
				var pagesTotal = Math.ceil(total/ppp);
				for (var i=1; i<=pagesTotal; i++)
					pagesList += '<li><a href="#" data-filter=".page_' + i + '"' + (i==1 ? ' class="current"' : '') + '>' + i + '</a></li>';
				items.each(function(idx, obj) {
					var pg = Math.floor(idx/ppp)+1;
					$(obj).attr('data-page', pg).addClass('page_'+pg);
				});
				$("#portfolio_iso_pages").show();
				$("#portfolio_iso_pages").html(pagesList);
				$("#portfolio_iso_pages_current").html("1");
				curIsotopePage = '.page_1';
			}
		}
		function pagesClear() {
			$('#filter-port .item').each(function (idx, obj) {
				var pg = $(obj).attr('data-page');
				if (pg > 0) {
					$(obj).attr('data-page', '').removeClass('page_'+pg);
				}
			});
			$("#portfolio_iso_pages").hide();
			curIsotopePage = '';
		}
	}

	/** Popup - For portfolio page **/
	function magnificPopupConfig() {
				// For Images
		$(".image-popup").magnificPopup({
			type: "image",
			titleSrc: "title",
			key: "image-key",
			verticalFit: true,
			mainClass: "image-popup-style",	// This same class is used for video popup
			tError: '<a href="%url%">The image</a> could not be loaded.',
			gallery: {
				enabled: false
			},
			callbacks: {
				open: function() {
					this.content.addClass("fadeInLeft");
					// console.log(this.st);
				},
				close: function() {
					this.content.removeClass("fadeInLeft");
				}
			}
		});

		// For Videos
		$(".video-popup").magnificPopup({
			type: "iframe",
			titleSrc: "title",
			key: "video-key",
			mainClass: "video-popup-style",
			tError: '<a href="%url%">The Video</a> could not be loaded.',
			gallery: {
				enabled: true
			},
			fixedContentPos: false,
			callbacks: {
				open: function() {
					this.content
					.addClass("fadeInLeft")
					.append("<div class='mfp-bottom-bar'>" + 
						"<div class='mfp-title'>" + this.st.el.attr("title") + "</div></div>");
				},
				close: function() {
					this.content.removeClass("fadeInLeft");
				}
			}
		});
	}


	/** Contact Form validation **/
	function contactValidateConfig() {
		var $form = $("#contact-form"),
		successMsg = "<span class='elegant-eleganticons-44 form-success'>Your message has been sent!</span>",
		errorMsg = "<span class='elegant-eleganticons-45 form-error'>Oops! something went wrong with the server.</span>",
		response;
		$form.validate({	
			rules: {
				"cform-name": {
					required: true,
					minlength: 2
				},
				"cform-email": "required",
				"cform-message": {
					required: true,
					minlength: 5
				}
			},
			errorClass: "invalid-error",
			errorElement: "span",
			
		});

		$form.submit(function(e) {
			if($form.valid()) {
				$.ajax({
					url: $form.attr("action"),
					type: "POST",
					data: $form.serialize(),
					success: function(data) {
						console.log(data.status);
						if(data.status==1){
							response = successMsg;
						}else{
							response = errorMsg;
						}
					},
					error: function() {
							response = errorMsg;
					},
					complete: function() {
						$(".form-success, .form-error").remove();
						$form.find("#cform-submit").parent().after($(response).fadeIn(500, function() {
							//$form[0].reset();
						}));
					},
					dataType: 'json'
				});
			}
			e.preventDefault();	// Prevent default form submit
		});
	}


	/** Parallax Config **/
	function parallaxEffect() {
		$pageContents.on("scroll", function(e) {
			var offset = $(this).scrollTop(),
				by = 8;	// edit this
			$(".parallax").each(function() {
				$(this).css("background-position", "center " + (-offset/by) + "px");
			});
			e.stopPropagation();
		});
	}


	/** Flip Menu Initialization **/
	function flipMenuInit() {
		// Initialize FlipMenu Plugin
		var fm = $(".flip-menu");
		fm.flipMenu({
			onAnimStart: function(t, b) {	// arguments -- placeholderEl, targetEl
				b.removeAttr("style data-cell");
			},
			onContentLoad: function(el) {
				setTimeout(function() {
					$pageContents.scrollTop( $(el.attr("href"))[0].offsetTop - 43.5 );
				}, 20);
				
			}
		});
	}

	/** Internal Menu Script **/
	function internalMenu() {
		var $innerNav = $(".inner-nav");


		$(".flip-menu > li a").on("click touchstart", function(e) {
			$innerNav.addClass("show-inner-nav");
		});

		// Remove menu on click
		$(".inner-nav .close-btn").on("click touchstart", function(e) {
			$innerNav.removeClass("show-inner-nav");
			// hide also menu-content
			$(".menu-content").removeClass("show-menu");
		});
	
		// Show menu on click
		$innerNav.find(".menu-btn").on("click touchstart", function(e) {
			if(e.target == this) {
				$(".menu-content").toggleClass("show-menu");
			}
			e.stopPropagation();
		});

		// Stick the menu 
		$pageContents.on("scroll", function() {
			// $innerNav.css("top", this.scrollTop + "px");
			// document.querySelector(".inner-nav").style.cssText = "top: " + this.scrollTop + "px";
		});
	   
    	
	


		// Initialize SmoothScroll Plugin
		$innerNav.find("a").smoothScroll({
			scrollElement: $pageContents,
			direction: "top",
			offset: -43,
			preventDefault: true
		});
		
	}	

	/** Initialization of all Functions Here **/
	function init() {
		masonryConfig();
		owlCarouselConfig();
		isotopeConfig();
		magnificPopupConfig() 
		contactValidateConfig()
		parallaxEffect();
		internalMenu();
		flipMenuInit()
	};
	init();




})(jQuery);