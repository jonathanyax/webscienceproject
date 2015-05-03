$(function() {
	$( '#ri-grid' ).gridrotator( {
		rows		: 3,
		columns		: 12,
		animType	: 'fadeInOut',
		animSpeed	: 500,
		interval	: 2000,
		step		: 1,
		preventClick: false,

	} );
	$( '.point-grid' ).gridrotator( {
		rows		: 5,
		columns		: 3,
		animType	: 'fadeInOut',
		animSpeed	: 500,
		interval	: 3000,
		step		: 1,
		preventClick: false,
		w240		: {
			rows	: 1,
			columns	: 5
		},
		w400		: {
			rows	: 1,
			columns	: 5
		},
		w550		: {
			rows	: 1,
			columns	: 5
		},
		w750		: {
			rows	: 5,
			columns	: 2
		},
		w1000		: {
			rows	: 5,
			columns	: 2
		}
	} );
	
});

$(document).ready(function() {

	// show add point modal
	$('.addpoint a').click(function(e) {
		e.preventDefault();
		var popup = $('.addpoint_modal');
		if (popup.css('display') == 'none') {
			popup.fadeIn(500);
		} else {
			popup.fadeOut(500);
		}
	});

	// hide add point modal if click anywhere else on page
	$(document).mouseup(function(e) {
		var popup = $('.addpoint_modal');
		if (!$('.addpoint a').is(e.target) && !popup.is(e.target) && popup.has(e.target).length == 0) {
			popup.fadeOut(500);
		}
	});

	// make first region active if none specified
	var isActiveRegion = false;
	$('#regions_nav .city').each(function() {
		if ($(this).hasClass('active')) {
			isActiveRegion = true;
		}
	});
	if (isActiveRegion == false) {
		$('#regions_nav .city').first().addClass('active');
		var showFirstRegion = $('#regions_nav .city').first().children('a').data('show-region');
		$('#' + showFirstRegion).show();
	}

	// show cities corresponding to regions on regions page
	$('#regions_nav .city').each(function(index, el) {
		if ($(this).hasClass('active')) {
			var showRegion = $(this).children('a').data('show-region');
			$('#' + showRegion).show();
		}
	});
	$('#regions_nav a').on('click', function() {
		var hideRegion = $('#regions_nav .city.active').children('a').data('show-region');
		$('#' + hideRegion).hide();
		$('#regions_nav .city.active').removeClass('active');
		$(this).parent('.city').addClass('active');
		var showRegion = $(this).data('show-region');
		$('#' + showRegion).show();
	});

	// magic line under regions nav items on regions page
	if ($('#regions_nav').length) {
		var $el, leftPos, newWidth,
				$mainNav = $('#regions_nav');

		$mainNav.append('<li id="magic_line" class="three columns"></li>');

		var $magicLine = $('#magic_line');
		$magicLine
			.width($('#regions_nav .active').width())
			.css('left', $('#regions_nav .active a').position().left)
			.data('origLeft', $magicLine.position().left)
			.data('origWidth', $magicLine.width());

		$(window).resize(function() {
			$magicLine
				.width($('#regions_nav .active').width())
				.css('left', $('#regions_nav .active a').position().left)
				.data('origLeft', $magicLine.position().left)
				.data('origWidth', $magicLine.width());
		});

		$('#regions_nav li a').hover(function() {
			$el = $(this);
			leftPos = $el.position().left;
			newWidth = $el.parent().width();
			$magicLine.stop().animate({
				left: leftPos,
				width: newWidth
			});
		}, function() {
			$magicLine.stop().animate({
				left: $magicLine.data('origLeft'),
				width: $magicLine.data('origWidth')
			});
		});

		$('#regions_nav li a').click(function() {
			$el = $(this);
			leftPos = $el.position().left;
			newWidth = $el.parent().width();
			$magicLine.stop().animate({
				left: leftPos,
				width: newWidth
			});
		}, function() {
			$magicLine
				.data('origLeft', leftPos)
				.data('origWidth', newWidth);
		});
	}
	
	$("div.point_social ul li a.share").click(function() {
		$("section#urlcopy input").toggle();
	});

});