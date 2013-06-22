$(document).ready(function(){
	$.getJSON('http://www.daleyjem.com/apps/tvlistings/svc/get_listings.php', function(data){
		var showtime = data.showtime;
		var listings = data.listings;
		var listingCount = Object.keys(listings).length;
		var output = '';
		
		$('.showtime h2').html(showtime);
		
		for (var listingIndex = 0; listingIndex < listingCount; listingIndex++)
		{
			var listing = listings[listingIndex];
			if (!listing.subtitle) listing.subtitle = '';
			output += '<tr class="show-listing ' + listing.networktype + '" data-ep="' + listing.ep + '">';
			output += '	<td valign="middle">' + listing.networkchannel + '<br /><strong>' + listing.networktitle + '</strong></td>';
			output += '	<td valign="middle"><strong>' + listing.showtitle + '</strong><br /><em>' + listing.subtitle + '</em></td>';
			output += '</tr>';
			output += '<tr class="synopsis"><td colspan="2"></td></tr>';
		}
		
		$('table.listings').html(output);
		
		initListings();
	});
});

// Attach click actions to listings and refresh button
function initListings()
{
	$('.show-listing').on('click', function(){
		$details = $(this).next('.synopsis').find('td');
		if ($details.hasClass('active')){
			$details.removeClass('active');
			return;
		}
		if ($details.hasClass('has-info')){
			$details.addClass('active');
			return;
		}
		var ep = $(this).data('ep');
		$.getJSON('http://www.daleyjem.com/apps/tvlistings/svc/get_listing_details.php?ep=' + ep, function(data){
			var $img, 
				$p = $('<p>');
				
			if (data.imgurl.length > 0){
				$img = $('<img>');
				$img.attr('src', data.imgurl);
				$p.append($img);
			}
			
			if (data.synopsis != null){
				$p.append('<span>' + data.synopsis + '<span');
			}
			else{
				$p.append('<em>No info</em>');
			}
			
			$details.append($p).addClass('active has-info');
		});
	});
	
	$('#btn-refresh').on('click', function(){
		window.location.reload();
	});
}