/**
 * Show/Hide onscroll search box
 */
(function(document, window, index) {
	'use strict';

	// Header
	var elementHeader = document.querySelector('.scrollBox');
	if (elementHeader) {
		var elHeight = 0,
			elTop = 0,
			dHeight = 0,
			wHeight = 0,
			wScrollCurrent = 0,
			wScrollBefore = 0,
			wScrollDiff = 0;

		window.addEventListener('scroll', function() {
			elHeight = elementHeader.offsetHeight;
			dHeight = document.body.offsetHeight;
			wHeight = window.innerHeight;
			wScrollCurrent = window.pageYOffset;
			wScrollDiff = wScrollBefore - wScrollCurrent;
			elTop = parseInt(window.getComputedStyle(elementHeader).getPropertyValue('top')) + wScrollDiff;

			if (wScrollCurrent <= 0)
				elementHeader.style.top = '0px';
			else if (wScrollDiff > 0)
				elementHeader.style.top = (elTop > 0 ? 0 : elTop) + 'px';
			else if (wScrollDiff < 0) {
				if (wScrollCurrent + wHeight >= dHeight - elHeight)
					elementHeader.style.top = ((elTop = wScrollCurrent + wHeight - dHeight) < 0 ? elTop : 0) + 'px';
				else
					elementHeader.style.top = (Math.abs(elTop) > elHeight ? -elHeight : elTop) + 'px';
			}

			wScrollBefore = wScrollCurrent;
		});
	}

	// Bottom
	var elementBottom = document.querySelector('.scrollBoxBottom');
	if (elementBottom) {
		var elHeightBottom = 0,
			elTopBottom = 0,
			dHeightBottom = 0,
			wHeightBottom = 0,
			wScrollCurrentBottom = 0,
			wScrollBeforeBottom = 0,
			wScrollDiffBottom = 0;

		window.addEventListener('scroll', function() {
			elHeightBottom = elementBottom.offsetHeight;
			dHeightBottom = document.body.offsetHeight;
			wHeightBottom = window.innerHeight;
			wScrollCurrentBottom = window.pageYOffset;
			wScrollDiffBottom = wScrollBeforeBottom - wScrollCurrentBottom;
			elTopBottom = parseInt(window.getComputedStyle(elementBottom).getPropertyValue('bottom')) + wScrollDiffBottom;

			if (wScrollCurrentBottom <= 0)
				elementBottom.style.bottom = '0px';
			else if (wScrollDiffBottom > 0)
				elementBottom.style.bottom = (elTopBottom > 0 ? 0 : elTopBottom) + 'px';
			else if (wScrollDiffBottom < 0) {
				if (wScrollCurrentBottom + wHeightBottom >= dHeightBottom - elHeightBottom)
					elementBottom.style.bottom = ((elTopBottom = wScrollCurrentBottom + wHeightBottom - dHeightBottom) < 0 ? elTopBottom : 0) + 'px';
				else
					elementBottom.style.bottom = (Math.abs(elTopBottom) > elHeightBottom ? -elHeightBottom : elTopBottom) + 'px';
			}

			wScrollBeforeBottom = wScrollCurrentBottom;
		});
	}

}(document, window, 0));