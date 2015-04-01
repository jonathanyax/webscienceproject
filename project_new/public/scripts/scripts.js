$(function() {
	$( '#ri-grid' ).gridrotator( {
		rows		: 3,
		columns		: 12,
		animType	: 'fadeInOut',
		animSpeed	: 500,
		interval	: 2000,
		step		: 1,
		preventClick: false,
		w320		: {
			rows	: 2,
			columns	: 2
		},
		w480		: {
			rows	: 2,
			columns	: 4
		},
		w768		: {
			rows	: 3,
			columns	: 5
		},
		w1024		: {
			rows	: 3,
			columns	: 9
		}
	} );
	$( '.point-grid' ).gridrotator( {
		rows		: 2,
		columns		: 2,
		animType	: 'fadeInOut',
		animSpeed	: 500,
		interval	: 3000,
		step		: 1,
		preventClick: false,
		w240		: {
			rows	: 3,
			columns	: 2
		},
		w320		: {
			rows	: 4,
			columns	: 2
		},
		w480		: {
			rows	: 4,
			columns	: 3
		},
		w768		: {
			rows	: 4,
			columns	: 3
		},
		w1024		: {
			rows	: 4,
			columns	: 3
		}
	} );
	
});

$(document).ready(function() {

	// highlight main navigation
	// var url = (window.location.href).split("/").pop();
	// $('nav ul#functions a[href="/' + url + '"]').addClass('current');

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
	


});