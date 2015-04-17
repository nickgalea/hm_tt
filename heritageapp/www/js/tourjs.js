var tour_list;
var tourDict = [{}];
var current_tour_point = 1;
var current_child_num;
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
			console.log("DICTIONARY " + tourDict["1"][1].panel_type);
			console.log("DICTIONARY2 " + tourDict["2"][1].panel_type);
			console.log("DICTIONARY3 " + tourDict["3"][1].panel_type);
			fillData_Tour();
			
		}, function (err) {
			alert("Error: " + err + " Check your internet connection.");
		}); 
	}
	else
	{
		fillData_Tour();
	}		
}

function fillData_Tour()
{	
	var object = tourDict[current_tour_point][0];
	$("#panel_name").html(object.title);
	$("#panel_binfo").html(object.text_eng);
	getImages_Tour();
}
function getImages_Tour()
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
		setTourImages(results);
	}, function (err) {
		alert("Error: " + err);
	}); 
}
function setTourImages(image_list)
{
	for(var i = 0 ; i < image_list.length;i++)
	{
		if(image_list[i].resource_type === "image")
		{
			//add objects separately to dom
			$("#tour_image").html("<div class='artefact_image'><img width='150' height='150' src="+image_list[i].url+" alt='img'></div>");
		}
	}
}
function createHandlers()
{
	$(".back").click(function(){
		current_tour_point = current_tour_point-1;
		if(current_tour_point == 0)
		{
			current_tour_point = 1;
		}
		fillData_Tour();
	});
	$(".next").click(function(){
		current_tour_point = current_tour_point+1;
		if(current_tour_point == Object.keys(tourDict).length)
		{
			current_tour_point = current_tour_point-1;
		}
		fillData_Tour();
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
	$("#tour_title").text(point_list.title);
	$("#tour_addpaneldes").text(point_list.text_eng);
	for(var i = 0 ; i < child_titles.length;i++)
	{
		if(current_tour[i+2].quest_type === "artefact")
		{
			$("#tour-questions").append('<li id = "'+i+'" class = "child_title" onclick = "location.href=\'#/profile\'">'+child_titles[i]+'</li>');
		}
		else
		{
			$("#tour-questions").append('<li id = "'+i+'" class = "child_title" onclick = "location.href=\'#/tour_pinfo\'">'+child_titles[i]+'</li>');
		}
	}
}
function list_handler()
{
	$(".child_title").click(function(){
		var id = $(this).attr('id');
		var position = id + 2; 
	});
}

function fillData_Child()
{	
	var object = tourDict[current_tour_point][0];
	$("#panel_name").html(object.title);
	$("#panel_binfo").html(object.text_eng);
	getImages_Tour();
}

