$(function() {
	$( '#ri-grid' ).gridrotator( {
		rows		: 3,
		columns		: 15,
		animType	: 'fadeInOut',
		animSpeed	: 500,
		interval	: 2000,
		step		: 1,
		preventClick: false
	} );

});

$(document).ready(function() {
  $('#regions_nav .city').each(function(index, el) {
    if ($(this).children('a').hasClass('active')) {
      var showRegion = $(this).children('a').data('show-region');
      $('#' + showRegion).show();
    }
  });

  $('#regions_nav a').on('click', function() {
    var hideRegion = $('#regions_nav a.active').data('show-region');
    $('#' + hideRegion).hide();
    $('#regions_nav a.active').removeClass('active');
    $(this).addClass('active');
    var showRegion = $(this).data('show-region');
    $('#' + showRegion).show();
  });
});