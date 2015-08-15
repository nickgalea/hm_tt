//get list of tour and set in dictionary
var resourcesDownloaded = false;
function getTourList1()
{
	console.log("IN GET LIST");
	if(tour_list == null)
	{
		var client = new WindowsAzure.MobileServiceClient(
		"https://heritagemalta.azure-mobile.net/",
		"aoCAcmyiogRmCISDWtfEDYzuHsQjGx40"
		);
		
		var artefactTable = client.getTable('tour_points');
		var query = artefactTable.where({
		language:lang_index
		}).read().done(function (results) {
			tour_list = results;
			var panel_array;
			console.log("IN GET LIST2");
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
			get_all_audio();
			console.log("REQUEST MADE ");
		}, function (err) {
			alert("Error: Check your internet connection.");
		}); 
	}
	else
	{
		console.log("REQUEST NOT MADE ");
		resourcesDownloaded = true;
		get_all_audio();
	}		
}

//display titles and audios on screen
function get_all_audio()
{	
	console.log("Tour Dict len " + tourDict.length);
	var children = false;
	for(var i = 1; i < tourDict.length;i++)
	{
		var top_parent_div = $("<div id= \""+i+"\"class=\"question_time\"></div>");
		var parent_div = $("<div class = \"intro_question\"></div>");
		$(top_parent_div).append(parent_div);
		$(parent_div).append("<div id = \"audio_button\" class=\"audio_red row_audio\" style=\"margin-right:0; margin-left:0;\" onclick=\"\"></div>");
		$(parent_div).append("<h2 id = \"0\" class=\"sound_tour\">"+(i) + " "+ tourDict[i][0].title +"</h2>");
		

		$("#par_text1").append(top_parent_div);
		var child_div = $("<div class=\" children \"></div>");
		$(top_parent_div).append(child_div);
		
		for(var j = 1; j < tourDict[i].length;j++)
		{
			if(tourDict[i][j].panel_type == "child" && tourDict[i][j].quest_type == "info")
			{
				children = true;
				$(child_div).append("<div id=\"audio_button\" class=\"audio_red row_audio\" style=\"\" onclick=\"\"></div>");
				$(child_div).append("<p id = \""+j+" \"class=\" sound_tour child_audio\">"+  tourDict[i][j].title +"</p>");
			}
		}
		if(children == true)
		{
			$(parent_div).append("<p id=\"expander\" class=\"expander_class\" style=\"font-size:2em; font-weight:300;\">+</p>");
		}
		
		children = false;
	}
	$("#loading").remove();
	handler();
	if(!resourcesDownloaded)
	{
		getAudio(doNothing);
		getAllTourImagesFromAudio();
	}
}
//get audio files from table
function getAudio(callback)
{
	var client = new WindowsAzure.MobileServiceClient(
		"https://heritagemalta.azure-mobile.net/",
		"aoCAcmyiogRmCISDWtfEDYzuHsQjGx40"
		);
		//console.log("ID " + tour_point.id);
	var resTable = client.getTable('resources');
	//get all audios
	var query = resTable.where({
			resource_type:"audio",
			language:lang_index
		}).read().done(function (results) {
			console.log("GOT AUDIO res length " + results.length);
			if(results.length != 0)
			{
				addAudioDict(results);
			}
			callback();
	}, function (err) {
		alert("Error: " + err);
	}); 
	
}
//add sound url to object
function addAudioDict(results)
{
	for(var i = 1; i < tourDict.length;i++)
	{
		for(var j = 0; j < tourDict[i].length;j++)
		{
			tourDict[i][j].sound = "";
			for(var k = 0; k < results.length; k++)
			{
				if(tourDict[i][j].reference == results[k].tour_id)
				{
					console.log("MATHCH!!!!!!!!!!!!! " +results[k].url + " id " + results[k].tour_id);
					//add sound url to object
					tourDict[i][j].sound = results[k].url;
					console.log("SOUND IN DICT-------------------------------"+i + " " + j + " " + tourDict[i][j].title);
					//console.log("TOUR SOUND " + tourDict[i][0].sound);
				}
			}
		}
		
	}
}

function setTourAudio(audio_link)
{
	if(audio_link!= "")
	{
		//console.log("Assigning Audio to Tag!! " + audio_link);
		changeAudio(audio_link);
	}
	
}
function stopAudio()
{
	console.log("IN STOP AUDIO");
	var audioplayer = document.getElementsByTagName("audio")[0];
	if(!audioplayer.paused)
	{
		audioplayer.pause();
	}
}
function getAllTourImagesFromAudio()
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
	}, function (err) {
		alert("Error: " + err);
	}); 
}


