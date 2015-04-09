var tour_list;
var tourDict = [{}];
var current_tour_point = 1;
function getTourList()
{
	if(tour_list == null)
	{
		var client = new WindowsAzure.MobileServiceClient(
		"https://heritagemalta.azure-mobile.net/",
		"aoCAcmyiogRmCISDWtfEDYzuHsQjGx40"
		);
		
		var artefactTable = client.getTable('tour_points');
		var query = artefactTable.where({
		}).read().done(function (results) {
			tour_list = results;
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
					tourDict[tour_list[i].panel_numb].push(tour_list[i]);
				}
			}
			console.log("DICTIONARY " + tourDict["1"]);
			console.log("DICTIONARY2 " + tourDict["2"]);
			fillData();
			
		}, function (err) {
			alert("Error: " + err + " Check your internet connection.");
		}); 
	}
	else
	{
		fillData();
	}		
}

function fillData()
{	
	var object = tourDict[current_tour_point][0];
	$("#testdiv").html("<p>" + object.title + "</p>");
	getImages();
}
function getImages()
{
	var client = new WindowsAzure.MobileServiceClient(
		"https://heritagemalta.azure-mobile.net/",
		"aoCAcmyiogRmCISDWtfEDYzuHsQjGx40"
		);
		
	var resTable = client.getTable('resources');
	console.log("TOUR ID "  + tourDict[current_tour_point][0].id);
	var query = resTable.where({
		tour_id:tourDict[current_tour_point][0].id
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
			$("<div class='artefact_image'><img width='150' height='150' src="+image_list[i].url+" alt='img'></div>").appendTo("#testdiv");
		}
	}
}
function createHandlers()
{
	$("#back").click(function(){
		current_tour_point = current_tour_point-1;
		if(current_tour_point == 0)
		{
			current_tour_point = 1;
		}
		fillData();
	});
	$("#next").click(function(){
		current_tour_point = current_tour_point+1;
		if(current_tour_point == Object.keys(tourDict).length)
		{
			current_tour_point = current_tour_point-1;
		}
		fillData();
	});
}

