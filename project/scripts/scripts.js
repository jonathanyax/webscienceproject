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
  $('#regions_nav .city').each(function(index, el) {
    if ($(this).hasClass('active')) {
      var showRegion = $(this).children('a').data('show-region');
      $('#' + showRegion).show();
    }
  });

  $('#regions_nav a').on('click', function() {
    var hideRegion = $('#regions_nav .city.active').children('a').data('show-region');
    console.log($('#regions_nav .city.active'));
    $('#' + hideRegion).hide();
    $('#regions_nav .city.active').removeClass('active');
    $(this).parent('.city').addClass('active');
    var showRegion = $(this).data('show-region');
    $('#' + showRegion).show();
  });
});