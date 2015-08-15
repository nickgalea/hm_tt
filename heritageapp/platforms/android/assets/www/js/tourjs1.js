var tour_list;
var image_list;
var tourDict = [{}];
var current_tour_point = 1;
var current_child_num;
var startTime = 0;
var sphere_to_load;

function checkaudiovis()
{
	if(!prem_product)
	{
		$("#audio_button").hide();
	}
}

function getTourList()
{
	if(tour_list == null)
	{
		var client = new WindowsAzure.MobileServiceClient(
		"https://heritagemalta.azure-mobile.net/",
		"aoCAcmyiogRmCISDWtfEDYzuHsQjGx40"
		);
		
		var artefactTable = client.getTable('tour_points');

		if(prem_product)
			var query = artefactTable.where({language:lang_index});
		else
			var query = artefactTable.where({language:lang_index, paid:false});

		query = query.read().done(function (results) {
			tour_list = results;
			console.log(tour_list);
			var panel_array;
			for(var i = 0 ; i < tour_list.length;i++)
			{
				//console.log(tour_list[i].title+tour_list[i].panel_type+tour_list[i].lat+tour_list[i].lon+tour_list[i].panel_numb+tour_list[i].quest_type);
				panel_array = tourDict[tour_list[i].panel_numb];
				if(panel_array == null )
				{
					var arr = [];
					arr.push(tour_list[i]);
					tourDict[tour_list[i].panel_numb] = arr;
				}
				else
				{
					if(tour_list[i].panel_type === "parent")
						tourDict[tour_list[i].panel_numb].unshift(tour_list[i]);
					else if(tour_list[i].panel_type === "list")
					{
						var first_el = tourDict[tour_list[i].panel_numb][0];
						if(first_el.panel_type === "parent")
						{
							if(tourDict[tour_list[i].panel_numb][1] == null)
							{
								tourDict[tour_list[i].panel_numb].push(tour_list[i]);
							}
							else
							{
								var temp = tourDict[tour_list[i].panel_numb][1];
								tourDict[tour_list[i].panel_numb][1] = tour_list[i];
								tourDict[tour_list[i].panel_numb].push(temp);
							}
						}
						else
						{
							tourDict[tour_list[i].panel_numb].unshift(tour_list[i]);
						}
					}
					else
						tourDict[tour_list[i].panel_numb].push(tour_list[i]);
						
				}
			}
			
			getAllTourImages();
			getAudio(setTourAudio2);
		}, function (err) {
			if(!(typeof localStorage.tourDict === 'undefined'))
    			tourDict = JSON.parse(localStorage.tourDict);

			if(tourDict == null)
				alert("Error: " + err + " Check your internet connection.");
			else
			{
				//alert("List Loaded from Cache, length is " + tourDict.length);
				console.log(tourDict.length);
				console.log(tourDict);
				image_list = tourDict[current_tour_point][0].resources;
				fillData_Tour();
			}
		}); 
	}
	else
	{
		image_list = tourDict[current_tour_point][0].resources;
		fillData_Tour();
	}		
}
function fillData_Child()
{	
	var object = tourDict[current_tour_point][current_child_num];
	$("#panel_name").html(object.title);
	if(image_list)
	replace_imagetags_child();	
	$("#panel_binfo").html(object.info);
	setTourAudio2();
	bindvideofullsreen();
	//getImages_Tour();
}

function bindvideofullsreen()
{
	$(".tour_vid").bind('webkitfullscreenchange mozfullscreenchange fullscreenchange', function(e) {
    var state = document.fullScreen || document.mozFullScreen || document.webkitIsFullScreen;
    var event = state ? 'FullscreenOn' : 'FullscreenOff';

    console.log(state);

    if(state)
    {
    	console.log(event);
    	screen.unlockOrientation();
    }	
    else
    {
    	console.log(event);
    	screen.lockOrientation('portrait');
    }
});
}

function fillData_Tour()
{	
	//alert("Fill Data Tour");
	var object = tourDict[current_tour_point][0];
	$("#panel_name").html(current_tour_point + "<span class=\"title_pipe\"> | </span>" + object.title);
	if(image_list)
	replace_imagetags();

		// Entering fullscreen mode

	$("#panel_binfo").html(object.info);
	bindvideofullsreen();

	setTourAudio2();

	if(tourDict[current_tour_point].length == 1)
	{
		//alert(tourDict[current_tour_point][0].title + "no children");
		$("#t_learn").hide();
	}
	else
	{
		//alert(tourDict[current_tour_point][0].title + "yes children " + tourDict[current_tour_point].length);
		$("#t_learn").show();
	}
}
//make a single request to get all resources which are used in the tour
function getAllTourImages()
{
	var client = new WindowsAzure.MobileServiceClient(
		"https://heritagemalta.azure-mobile.net/",
		"aoCAcmyiogRmCISDWtfEDYzuHsQjGx40"
		);
		
	var resTable = client.getTable('resources');
	//when artefact_id is null, tour_id is not null
	var query = resTable.where({
		artefact_id:null
	}).read().done(function (results) {
		addResourcesToDict(results);
		image_list = tourDict[current_tour_point][0].resources;
		localStorage.tourDict = JSON.stringify(tourDict);
		fillData_Tour();
	}, function (err) {
		alert("Error: " + err);
	}); 
}
//add resources to respective tour points 
function addResourcesToDict(results)
{
	//loop dict
	for(var i = 1; i < tourDict.length;i++)
	{
		console.log("ADD RESOURCE Children Length " + tourDict[i].length);
		for(var j = 0; j < tourDict[i].length;j++)
		{
			//create a list 
			tourDict[i][j].resources = [];
			for(var k = 0; k < results.length; k++)
			{
				if(tourDict[i][j].id == results[k].tour_id)
				{
					//add sound url to object
					if(results[k].resource_type != "audio")
					{
						tourDict[i][j].resources.push(results[k]);
						console.log("Found match " + results[k].resource_type + "  "  + results[k].url);
					}
					//console.log("TOUR SOUND " + tourDict[i][0].sound);
				}
			}
		}
	}
}

function setTourImages(image_list)
{

	for(var i = 0 ; i < image_list.length;i++)
	{
		if(image_list[i].resource_type === "image")
		{
			//add objects separately to dom
			$("#tour_image").html("<div class='tour-media'><img width='150' height='150' src="+image_list[i].url+" alt='img'></div>");
		}
	}
}
function createHandlers()
{
	$(".back_t").click(function(){
		current_tour_point = current_tour_point-1;
		if(current_tour_point == 0)
		{
			current_tour_point = 1;
		}
		current_child_num = 0;
		fillData_Tour();
		navigationArrows();
		startTime = 0;
	});
	$(".next_t").click(function(){
		current_tour_point = current_tour_point+1;
		if(current_tour_point == Object.keys(tourDict).length)
		{
			current_tour_point = current_tour_point-1;
		}
		current_child_num = 0;
		fillData_Tour();
		navigationArrows();
		startTime = 0;
	});
}
function fill_list_data()
{
	var current_tour = tourDict[current_tour_point];
	var point_list = 1;//list is always at position 1
	var child_titles = [];
	for(var i = 1 ; i < current_tour.length;i++)
	{
		if(current_tour[i].panel_type === "child")
		{
			child_titles.push(current_tour[i].title);
		}
	}
	$("#tour_title").text(current_tour[point_list].title);
	$("#tour_addpaneldes").text(current_tour[point_list].info);
	for(var i = 0 ; i < child_titles.length;i++)
	{
		if(current_tour[i+2].quest_type === "artefact")
		{
			$("#tour-questions").append('<li id = "'+i+'" class = "child_title_artefact">'+child_titles[i]+'</li>');
		}
		else if(current_tour[i+2].quest_type === "sphere")
		{
			$("#tour-questions").append('<li id = "'+i+'" class = "child_title_sphere">'+child_titles[i]+'</li>');
		}
		else
		{
			$("#tour-questions").append('<li id = "'+i+'" class = "child_title">'+child_titles[i]+'</li>');
		}
	}

	list_handler();
}
function list_handler()
{
	$(".child_title").click(function(){
		stack.push("#/tour_options")
		var id = $(this).attr('id');
		//console.log("id" + id);
		current_child_num = parseInt(id) + 2; 
		location.href='#/tour_pinfo';
	});

	$(".child_title_artefact").click(function(){
		stack.push("#/tour_options")
		var id = $(this).attr('id');
		//console.log("id" + id);
		current_child_num = parseInt(id) + 2; 
		//set_artefactPos(current_child_num);// & load artefact profile page
		getSelectedArtefact(current_child_num);
	});

	$(".child_title_sphere").click(function(){
		stack.push("#/tour_options")
		var id = $(this).attr('id');
		//console.log("id" + id);
		current_child_num = parseInt(id) + 2; 
		//set_artefactPos(current_child_num);
		var obj = tourDict[current_tour_point][current_child_num];
		sphere_to_load = obj.reference;
		//console.log(sphere_to_load); 
		location.href='#/sphereimage_tour';
	});
}

function getIndicesOf(searchStr, str) {
    var startIndex = 0, searchStrLen = searchStr.length;
    var index, indices = [];
    while ((index = str.indexOf(searchStr, startIndex)) > -1) {
        indices.push(index);
        startIndex = index + searchStrLen;
    }
    return indices.length;
}

function replace_imagetags()
{
	var obj = tourDict[current_tour_point][0];
	var description = obj.info;
	var total_images = getIndicesOf("<<", description);
	image_list = tourDict[current_tour_point][0].resources;
	console.log(total_images);
	for(var i = 0; i<total_images; i++)
	{
		var next_occ = description.indexOf("<<")
		var key = description.substring(next_occ+2, next_occ+38);
		
		for(var j = 0; j<image_list.length; j++)
		{
			if(image_list[j].id === key)
			{
				var imgurl = image_list[j].url;
				var img_type = image_list[j].resource_type;
			}

		}
		if(img_type === "image")
		{
			console.log("image " + imgurl);
			description = description.replace("<<"+key+">>", "<div class=\"media tour-media\"><img width='100%' height='200' src="+imgurl+" alt='img'></div>");
		}
		else if(img_type === "video")
		{
			console.log("video " + imgurl);
			console.log(description);
			description = description.replace("<<"+key+">>", "<div class=\"media tour-media tour-video\"><video class=\"tour_vid\" width='100%' poster=\"img/heritage_logo.png\" controls><source src="+imgurl+" type=\"video/mp4\" /> </video></div>");
		}
		console.log(key);
	}
	obj.info = description;
}



function replace_imagetags_child()
{
	var obj = tourDict[current_tour_point][current_child_num];
	var description = obj.info;
	//console.log(description);
	var total_images = getIndicesOf("<<", description);
	console.log(total_images);
	image_list = tourDict[current_tour_point][current_child_num].resources;
	for(var i = 0; i<total_images; i++)
	{
		var next_occ = description.indexOf("<<");
		var key = description.substring(next_occ+2, next_occ+38);
		for(var j = 0; j<image_list.length; j++)
		{
			if(image_list[j].id === key)
			{
				var imgurl = image_list[j].url;
				var img_type = image_list[j].resource_type;
			}

		}
		if(img_type === "image")
		{
			description = description.replace("<<"+key+">>", "<div class=\"media\"><img width='100%' height='200' src="+imgurl+" alt='img'></div>");
			console.log("image yes in h");
		}
		else if(img_type === "video")
		{
			description = description.replace("<<"+key+">>", "<div class=\"media\"><video class=\"tour_vid\" width='100%' poster=\"img/heritage_logo.png\" controls><source src="+imgurl+" type=\"video/mp4\" /> </video></div>");
		}
	}

	obj.info = description;
}

$('.tour-video').bind('webkitfullscreenchange mozfullscreenchange fullscreenchange', function(e) {
    var state = document.fullScreen || document.mozFullScreen || document.webkitIsFullScreen;
    var event = state ? 'FullscreenOn' : 'FullscreenOff';

    // Now do something interesting
    console.log('Event: ' + event);    
});


function getArtefactFromTour()
{
	if(artefact_list == null)
	{
		createArtList(doNothing);
	}
}
function doNothing()
{
//do not remove, method used as void callback
}

function getSelectedArtefact(current_child_num)
{
	var obj = tourDict[current_tour_point][current_child_num];
	
	for(var i = 0; i<artefact_list.length; i++)
	{
		if(artefact_list[i].reference === obj.info)
		{
			artefact_position = i;
			break;
		}
	}

	console.log()
	location.href='#/profile';
}

function set_artefactPos(current_child_num)
{
	var obj = tourDict[current_tour_point][current_child_num];
	var title = obj.info;

	if(artefact_list == null)
	{
		console.log("LIST is empty");
		var client = new WindowsAzure.MobileServiceClient(
		"https://heritagemalta.azure-mobile.net/",
		"aoCAcmyiogRmCISDWtfEDYzuHsQjGx40"
		);
		
		var artefactTable = client.getTable('artefact_table');
		var query = artefactTable.where({
			language:lang_index
		}).read().done(function (results) {
			artefact_list = results;	
		for(var i = 0; i<artefact_list.length; i++)
		{
			if(artefact_list[i].info === title)
			{
				artefact_position = i;
				break;
			}
		}

		location.href='#/profile';

		}, function (err) {
			alert("Error: " + err + " Check your internet connection.");
		}); 
	}
	else
	{
		for(var i = 0; i<artefact_list.length; i++)
		{
			if(artefact_list[i].name === title)
			{
				artefact_position = i;
				break;
			}
		}

		location.href='#/profile';
	}

}

function getDistanceFromLatLon(lat1,lon1,lat2,lon2) {
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2-lat1);  // deg2rad below
    var dLon = deg2rad(lon2-lon1); 
    var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
    ; 
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  var d = R * c; // Distance in km
  return d*1000 //return distance in m;
}

function deg2rad(deg) {
  return deg * (Math.PI/180)
}


    var watchID = null;

    // device APIs are available
    //
    function attachGpsHandler() {
        // Throw an error if no update is received every 30 seconds
        var options = { timeout: 30000, enableHighAccuracy: true};
        watchID = navigator.geolocation.watchPosition(onGpsSuccess, onGpsError, options);
    }

    // onSuccess Geolocation
    //
    function onGpsSuccess(position) {
    	//alert(position.coords.latitude);
        var distance = getDistanceFromLatLon(position.coords.latitude, position.coords.longitude, tourDict[current_tour_point+1][0].lat, tourDict[current_tour_point+1][0].lon);
        console.log('Latitude: '  + position.coords.latitude      +
                 	'Longitude: ' + position.coords.longitude    +
                    'Distance: ' + distance );
        if(distance <=5)
        {
            //alert("You are less than 5 metres from " + tourDict[current_tour_point+1][0].title);
            if(stack[stack.length-1] === '#/tour')
            {
            	$( ".next_t" ).trigger( "click" );

			}
			else
			{
				var endTime = new Date();
				var timeDiff = endTime - startTime;
				if(timeDiff > 30000 || startTime == 0)
				{
					console.log(timeDiff);
					startTime = endTime;
            		showConfirm();
            	}
        	}
    	}
	}

        // onError Callback receives a PositionError object
        //
        function onGpsError(error) {
            console.log("No GPS found after 30 seconds");
        }

    function onConfirm(buttonIndex) {
    	if(buttonIndex == 2)
    		{
    			if(stack[stack.length-1] === '#/tour_binfo')
            	{
            		stack.pop();
            	}
            	else if(stack[stack.length-1] === '#/tour_options')
            	{
            		stack.pop();
            		stack.pop();
            	}
            	location.href='#/tour_binfo';
    		}
	}

// Show a custom confirmation dialog
//
function showConfirm() {
    navigator.notification.confirm(
        'Move to the next panel?', // message
         onConfirm,            // callback to invoke with index of button pressed
        'Tarxien Temples Tour',           // title
        ['No','Yes']         // buttonLabels
    );
}


function navigationArrows()
{
	console.log("Dictionary length " + Object.keys(tourDict).length );
	if(current_tour_point == 1)
	{
		$(".back_t").css('opacity', '0.5'); 
	}
	else if(current_tour_point == Object.keys(tourDict).length-1)
	{
		$(".next_t").css('opacity', '0.5'); 
	}
	else
	{
		$(".next_t").css('opacity', ''); 
		$(".back_t").css('opacity', ''); 
	}
	
}
/*
function setTourVid(image_list)
{
	for(var i = 0 ; i < image_list.length;i++)
	{
		console.log("RESOURCE FOUND " + i );
		if(image_list[i].resource_type === "video")
		{
			console.log("FOUND VIDEO " + image_list[i].url);
			//add objects separately to dom
			//$("#tour_image").html("<video id=\"video\" width='300' height='300' src="+image_list[i].url+" />");
			$("#tour_image").html("<div class=\"media\"><video class=\"tour_vid\" width='100%' poster=\"img/heritage_logo.png\" controls><source src="+image_list[i].url+" type=\"video/mp4\" /> </video></div>");
		}
	}
}*/

function setTourAudio2()
{
	//edited this method to support audio in child panels and various languages
	var sound_url = "";
	if(current_child_num != null)
	{
		console.log("CURRENT HCILD NUM "+ current_child_num);
		console.log("in not null");
		sound_url = tourDict[current_tour_point][current_child_num].sound;
	}
	else
	{
		sound_url = tourDict[current_tour_point][0].sound;
	}
		
	console.log("in setting audio" + sound_url);
	if(sound_url == "")
		console.log("AUDIO IS EMPTY STRING");
	if(!sound_url)
		console.log("AUDIO IS NULL");
	if(sound_url && sound_url != "")
	{
		console.log("GOING TO CHANGE SOUND");
		changeAudio(sound_url);
	}
	
	/*for(var i = 0 ; i < image_list.length;i++)
	{
		if(image_list[i].resource_type === "audio")
		{
			changeAudio(image_list[i].url);
		}
	}*/
}


