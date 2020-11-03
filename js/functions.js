/*-----------------------NAVEGAÇÃO, ANCHORS E SLIDES-------------------------*/

//--------------MENU--------------------
//Toggle mobile menu / click outside

const initMenuMobile = () => {
	let menudown = false;

	$('#iconMobMenu').click( event => {
	    if(menudown == false){
	        $('.menu-mobile').slideDown(500);
	        menudown = true;
	    }else{
	        $('.menu-mobile').slideUp(500)
	        menudown = false;
	    }
	    event.stopPropagation();
	});

	$('body, html').click(() => {
	    if(menudown == true){
	        $('.menu-mobile').slideUp(500);
	        menudown = false;
	    }
	})
}//End initMenuMobile


//-----------horizontal navigation - SLIDER----------
const prepSlides = desktopOrMobile => {
	
	let slideSingle = $('.slide-single');
	const slide = $('.box-slides');
	const numOfSlides = slideSingle.length;
	const slideSpeed = 600; //default: 400
	const arrowLeft = $('#navprev');
	const arrowRight = $('#navnext');

	//Preset height, width, nav bullets and hidden slides
	const sliderWidth = 'calc(100% * '+numOfSlides+')';
	slide.css({'width':sliderWidth});

	//hide parents' overflow
	slide.parent(0).css({'overflow-x':'hidden'});

	const slidesCounter = slideSingle.length - 1;

	let i = 0;
	
	//Navigation Preventing double clicking glitch
	const delay = slideSpeed * 1.1;
	let clicked = true;

	arrowLeft.on('click', () => {
		while(clicked == true){
			clickSlide_L();
			clicked = false;
			setTimeout( () => {
				clicked = true;
			},delay);
		}
	});

	arrowRight.on('click', () => {
		while(clicked == true){
			clickSlide_R();
			clicked = false;
			setTimeout( () => {
				clicked = true;
			},delay);
		}
	});


	//Scroll to anchor - horizontal
	const linksMenu = desktopOrMobile;
	let actualSection = 0;
	
	linksMenu.on('click',function(event){ //ES6- no Arrows functions- "this" issue.
		let clickedLink = $(this);
		let nextSection =  linksMenu.index(clickedLink);
		let repeat = Math.abs(nextSection - actualSection);

		if (actualSection < nextSection) {
			for (j = 0; j < repeat; j++) {
				clickSlide_R();
			}
		} 
		else if (actualSection > nextSection) {
			for (k = 0; k < repeat; k++) {
				clickSlide_L();
			}
		}
		event.preventDefault();
	});
	

	//Mobile swipe
	$( () => {
		let x1;
		let x2;

		slide
		.on('mousedown touchstart', e => { 
			if (navigator.maxTouchPoints != 0 && e.changedTouches != undefined/*Prevents undefined var*/) {
				x1 = e.changedTouches[0].pageX;
			}
			else x1 = e.pageX;
		})
		
        .on('mouseup touchend', e => {
			if (navigator.maxTouchPoints != 0 && e.changedTouches != undefined/*Prevents undefined var*/) {
				x2 = e.changedTouches[0].pageX;
			}
			else x2 = e.pageX;

            if (x1 < x2 && (x2 - x1) >= 30) {
				while (clicked == true) {
					clickSlide_L();
					clicked = false;
					setTimeout(() => {
						clicked = true;
					}, delay);
				}
            }else if (x1 > x2 && (x1 - x2 >= 30)) {
				while (clicked == true) {
					clickSlide_R();
					clicked = false;
					setTimeout(() => {
						clicked = true;
					}, delay);
				}
			}else{return false;}
        })
	})


	//Main functions
	function clickSlide_R(){
		if(i < slidesCounter){
			slide.animate({left: "-=100%"},slideSpeed,);
			i++;
			actualSection = i;
			return actualSection;
		}
	}//End clickslide_R


	function clickSlide_L(){
		if(i > 0){
			slide.animate({left: "+=100%"},slideSpeed,);
			i--;
			actualSection = i;
			return actualSection;
		}
	}//End clickslide_L
}//End prepSlides


//---Simulate hover on touch screen---
const loadHoverOnTouch = () => {
	//Hover on side-arrows
	const hoverArrowOn = arrow => arrow.css({'opacity':'1','transform':'scale(1.2)'});

	const hoverArrowOff = arrow => {
		setTimeout( () => {
			arrow.css({'opacity':'0.3','transform':'scale(1.0)'});
		},500)
	}

	$('.setas').on('touchstart', function() { hoverArrowOn($(this)); })//ES6 Arrows functions- "this" issue.

	$('.setas').on('touchend', function() { hoverArrowOff($(this)); })

	//Hover on menu-mobile links
	const hoverMenuPawOn = link => link.children('i').css({'visibility':'visible'});

	const hoverMenuPawOff = link => {
		setTimeout( () => {
			link.children('i').css({'visibility':'hidden'});
		},500)
	}

	$('.menu-mobile a').on('touchstart', function() { hoverMenuPawOn($(this)); })//ES6 Arrows functions- "this" issue.

	$('.menu-mobile a').on('touchend', function() { hoverMenuPawOff($(this)); })

}

//---- Gallery zoom and close on touch screen----
const galleryOpenClose = () => {
	let openedImg;
	
	const zoomSelected = clickedImg => {
		clickedImg.css({'border-color':'rgb(22, 51, 114)'});
		$('.galeria-zoom').show(300);
		return clickedImg;
	}
	
	const closeSelected = closingImg => {
		$('.galeria-zoom').hide(300);
		closingImg.css({'border-color':'rgba(0, 0, 0, 0)'});
	}
	
	$('.galeria-single img').on('click touchstart', function() { openedImg = zoomSelected($(this)); })
	
	$('.galeria-zoom span').on( 'click touchstart', () => closeSelected(openedImg) )
}


//----- CALLING FUNCTIONS ------
$(() => {
	const linksDesktop = $('.menu-desktop a');
	const linksMobile = $('.menu-mobile a');
	if($(window).width() < 840) {
		prepSlides(linksMobile);
		initMenuMobile();
	} else prepSlides(linksDesktop);
	
	if (navigator.maxTouchPoints != 0) { loadHoverOnTouch() }

	galleryOpenClose();
})
