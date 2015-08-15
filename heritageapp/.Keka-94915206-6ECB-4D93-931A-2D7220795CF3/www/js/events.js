var events_list;

var month = new Array();
month[0] = "January";
month[1] = "February";
month[2] = "March";
month[3] = "April";
month[4] = "May";
month[5] = "June";
month[6] = "July";
month[7] = "August";
month[8] = "September";
month[9] = "October";
month[10] = "November";
month[11] = "December";

selected_events_index = 0;

function addtocalendar()
{
	//console.log(events_list[selected_events_index].startdate.getYear() + " " + events_list[selected_events_index].startdate.getMonth() + " " + events_list[selected_events_index].startdate.getDate());
	var startDate = new Date(events_list[selected_events_index].startdate.getFullYear(),events_list[selected_events_index].startdate.getMonth(),events_list[selected_events_index].startdate.getDate(),0,0,0,0,0); // beware: month 0 = january, 11 = december
    var endDate = new Date(events_list[selected_events_index].enddate.getFullYear(),events_list[selected_events_index].enddate.getMonth(),events_list[selected_events_index].enddate.getDate(),24,0,0,0,0); // beware: month 0 = january, 11 = december
    var title = events_list[selected_events_index].title;
    var eventLocation = events_list[selected_events_index].location;
    var notes = events_list[selected_events_index].info;
    var success = function(message) {  };
    var error = function(message) {  };

    window.plugins.calendar.createEventInteractively(title,eventLocation,notes,startDate,endDate,success,error);
}

function init_events_list()
{
		if(events_list == null){
					console.log("events LIST is empty");
					var client = new WindowsAzure.MobileServiceClient("https://heritagemalta.azure-mobile.net/","aoCAcmyiogRmCISDWtfEDYzuHsQjGx40");
					var AzureTable = client.getTable('events');
					var query = AzureTable.where({}).read().done(function (results) {
						console.log("RESULT OBTAINED");
						events_list = results;
						console.log("url " + events_list[0].image1);
						populate_events();     
						}, function (err) {
						alert("Error: " + err + " Check your internet connection.");
						}); 
}
	else
			{
				populate_events();
			}
};

function populate_events()
{
	$("#loading1").hide();
	$("#loading2").hide();

	for ( var i = 0; i < events_list.length; i ++ ) {

		start_date = events_list[i].startdate.getDate()+" "+month[events_list[i].startdate.getMonth()];
		end_date = events_list[i].enddate.getDate()+" "+month[events_list[i].enddate.getMonth()];
		
		var now = new Date();

		var todays_events = 0;

		if((events_list[i].enddate >= now)&&(events_list[i].startdate <= now))
		{
			todays_events = 1;
			console.log(todays_events);
			console.log("event happenning today");
			$("<li onclick=\"selected_events_index="+i+"; stack.push('#/events'); location.href='#/profile-event';\"<h2>"+events_list[i].title+"</h2><p class=\"location\">"+events_list[i].location+"</p><p class=\"dates\">"+start_date+" &ndash; "+end_date+"</p></li>").appendTo("#todays_events_ul");
		
		}

		if (events_list[i].enddate >= now) {
			console.log("present");
			$("<div class=\"box\" style=\"background: url("+events_list[i].image1 +") no-repeat;background-size:cover;\" onclick=\"selected_events_index="+i+"; stack.push('#/events'); location.href='#/profile-event'\"><div class=\"text\"><h1>"+events_list[i].title+"</h1><p>"+events_list[i].location+"<br /><i>"+start_date+" &ndash; "+end_date+"</i></p></div></div>").appendTo("#upcoming-event-list-tiles");
		}
		else
		{
			console.log("past");
			$("<div class=\"box\" style=\"background: url("+events_list[i].image1 +") no-repeat;background-size:cover;\" onclick=\"selected_events_index="+i+"; stack.push('#/events'); location.href='#/profile-event'\"><div class=\"text\"><h1>"+events_list[i].title+"</h1><p>"+events_list[i].location+"<br /><i>"+start_date+" &ndash; "+end_date+"</i></p></div></div>").appendTo("#past-event-list-tiles");	
		}
	}

	if (todays_events == 0)
		{
			console.log(todays_events);
			$("#today-events-list").hide();
			console.log("hide it " + todays_events);
		}
};

function populate_event_profile(event_index)
{

	start_date = events_list[event_index].startdate.getDate()+" "+month[events_list[event_index].startdate.getMonth()];
	end_date = events_list[event_index].enddate.getDate()+" "+month[events_list[event_index].enddate.getMonth()];

	console.log(events_list[event_index].info);

	$("<h1>"+events_list[event_index].title+"</h1>").appendTo('#profile-title');
	$("<p class=\"focus\">"+events_list[event_index].location+"</p>").insertAfter('#event_location');
	$("<p class=\"focus\">"+start_date+" &ndash; "+end_date+"</p>").insertAfter('#event_time');
	$("<p class=\"focus\">"+events_list[event_index].price+"</p>").insertAfter('#event_price');
	$("<p class=\"focus\">"+events_list[event_index].openinghours+"</p>").insertAfter('#event_hours');
	$("<p class=\"content\">"+events_list[event_index].info+"</p>").appendTo('#profile-description');

	$("<div><img src='"+events_list[event_index].image1+"' alt=\"img\"></div>").appendTo('#event_slider');

	console.log(events_list[event_index].image2);

	if(events_list[event_index].image2!=null)
	{
		$("<div><img src='"+events_list[event_index].image2+"' alt=\"img\"></div>").appendTo('#event_slider');
	}
	if(events_list[event_index].image3!=null)
	{
		$("<div><img src='"+events_list[event_index].image3+"' alt=\"img\"></div>").appendTo('#event_slider');
	}

	var now = new Date();

	if (events_list[event_index].enddate < now) {
			//console.log("present");
			//$("#share-button").hide();
			$("#bottom-red-message").hide();
	}

	
}