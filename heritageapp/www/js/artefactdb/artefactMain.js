var artefact_list = null;
var artefact_position = 1;
var eras = ["3300","2800","2300","1800"];
function Artefact()
{
	//constructor
	this.id;
	this.name;
	this.era;
	this.type;
	this.material;
	this.info;
	this.use;
	this.lat;
	this.lon;
}
function createArtList()
{
	console.log("ARTEFACT LIST" + artefact_list);
	if(artefact_list == null)
	{
		console.log("LIST is empty");
		var client = new WindowsAzure.MobileServiceClient(
		"https://heritagemalta.azure-mobile.net/",
		"aoCAcmyiogRmCISDWtfEDYzuHsQjGx40"
		);
		
		var artefactTable = client.getTable('artefact_table');
		var query = artefactTable.where({
		}).read().done(function (results) {
			
			console.log(JSON.stringify(results));
			artefact_list = results;
			//populatePage();
			fillGallery();
		}, function (err) {
			alert("Error: " + err);
		}); 
	}
	else
	{
		console.log("NOT LIST is empty");
		//populatePage();
		fillGallery();
	}
		
}
function fillGallery()
{
	var onclickLink = "location.href='#/profile'";
	var id = 0;
	var imgSource = "img/artifact_1.png";
	var div_gallery = $(document.createElement('div'),{
					'class':'gallery'
					});
	
	for(var i = 0 ; i < artefact_list.length;i++)
	{
		$(" <img id = "+i+" class = 'artefact_item' src="+imgSource+" width='150' onclick="+onclickLink+" />").appendTo(div_gallery);

	}
	div_gallery.appendTo(".white-container");
}
//methods for profile page
function populatePage()
{
	$("#artefact_name").text(artefact_list[artefact_position].name);
	$("<div class='arrow'></div>").appendTo("#era-" + artefact_list[artefact_position].era);
	//check if var is empty string or null
	if(artefact_list[artefact_position].type == ""|| !artefact_list[artefact_position].type)
	{
		$("#type_col").hide();
	}
	if(artefact_list[artefact_position].mat == "" || !artefact_list[artefact_position].mat)
	{
		$("#material_col").hide();
	}
	if(artefact_list[artefact_position].use == "" || !artefact_list[artefact_position].use )
	{
		$("#use_col").hide();
	}
	$("#artefact_type").text(artefact_list[artefact_position].type);
	$("#artefact_material").text(artefact_list[artefact_position].mat);
	$("#artefact_use").text(artefact_list[artefact_position].use);
	$("#artefact_info").text(artefact_list[artefact_position].info);
}


function getImages()
{
	var client = new WindowsAzure.MobileServiceClient(
		"https://heritagemalta.azure-mobile.net/",
		"aoCAcmyiogRmCISDWtfEDYzuHsQjGx40"
		);
		
	var resTable = client.getTable('resources');
	var query = resTable.where({
		artefact_id:artefact_list[artefact_position].id
	}).read().done(function (results) {
		console.log(JSON.stringify(results));
		setArtefactImages(results);
	}, function (err) {
		alert("Error: " + err);
	}); 
}
function setArtefactImages(image_list)
{
	for(var i = 0 ; i < image_list.length;i++)
	{
		if(image_list[i].resource_type === "image")
		{
		//add objects separately to dom
			$("<div><img src="+image_list[i].url+" alt='img'></div>").appendTo(".swipe-wrap");
		}
	}
	
	window.mySwipe = Swipe(document.getElementById('slider'), {
			  startSlide: 0,
			  speed: 800,
			  auto: 3000,
			  continuous: true,
			  disableScroll: false,
			  stopPropagation: false,
			  callback: function(index, elem) {},
			  transitionEnd: function(index, elem) {}
			});
}

function editArtefactPost(position)
{
	artefact_position = position;
}

function googleMaps()
{
	/*var latlong = new google.maps.LatLng(artefact_list[artefact_position].lat,artefact_list[artefact_position].lon);
	var mapOptions = {
		center:latlong,
		zoom:16,
		mapTypeId: google.maps.MapTypeId.ROADMAP
	};
	console.log("here");
	$("#geolocation").show();
	$("#profile-image-landscape").hide();
	
	var map = new google.maps.Map($("#geolocation"),mapOptions);
	console.log("here2");*/
}





