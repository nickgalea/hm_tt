var aerial_image_list;

function init_aerial_gal()
{
		console.log("aerial_image_list" + aerial_image_list);
			if(aerial_image_list == null){
					console.log("LIST is empty");
					var client = new WindowsAzure.MobileServiceClient("https://heritagemalta.azure-mobile.net/","aoCAcmyiogRmCISDWtfEDYzuHsQjGx40");
		
					var AzureTable = client.getTable('aerial_gal');
					var query = AzureTable.where({}).read().done(function (results) {
						console.log("RESULT OBTAINED");
						aerial_image_list = results;
						console.log("url " + aerial_image_list[0].url);
						add_swiper_images();
						var mySwiper = new Swiper ('.swiper-container', {
    						// Optional parameters
    						direction: 'horizontal',
    						loop: true,
    						pagination: '.swiper-pagination',    
    						scrollbar: '.swiper-scrollbar',
    						lazyLoadingInPrevNext: true
  							});        
						}, function (err) {
						alert("Error: " + err + " Check your internet connection.");
					}); 
			}
			else
			{
				console.log("url " + aerial_image_list[0].url);
				add_swiper_images();
						var mySwiper = new Swiper ('.swiper-container', {
    						// Optional parameters
    						direction: 'horizontal',
    						loop: true,
    						pagination: '.swiper-pagination',    
    						scrollbar: '.swiper-scrollbar',
    						lazyLoadingInPrevNext: true
  							}); 
			}
};

function add_swiper_images()
{
	var cont = document.getElementById('swiper_images');
	for ( var i = 0; i < aerial_image_list.length; i ++ ) {
		$("<div class=\"swiper-slide\"><img height=\"100%\" width=\"100%\" src=\""+aerial_image_list[i].url+"\"></div>").appendTo(".swiper-wrapper");
		
	}
}