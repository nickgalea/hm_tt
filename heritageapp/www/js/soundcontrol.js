function click_audiobutton_options()
{
	$("#audio").bind('ended', function(){
    // done playing
    document.getElementById("audio_button").style.background = "url(img/icons/audio.png) no-repeat";
	document.getElementById("audio_button").style.backgroundSize="25px";
	});

	var audioplayer = document.getElementsByTagName("audio")[0];

	if(audioplayer.paused)
		{
			audioplayer.play();
			document.getElementById("audio_button").style.background = "url(img/icons/pause.png) no-repeat";
			document.getElementById("audio_button").style.backgroundSize="25px";
		}
	else
		{
			document.getElementById("audio_button").style.background = "url(img/icons/play.png) no-repeat";
			document.getElementById("audio_button").style.backgroundSize="25px";
			audioplayer.pause();
		}
}
function click_audiobutton()
{
	$("#audio").bind('ended', function(){
    // done playing
    document.getElementById("audio_button").style.background = "url(img/icons/audio_red.png) no-repeat";
	document.getElementById("audio_button").style.backgroundSize="25px";
	});

	var audioplayer = document.getElementsByTagName("audio")[0];

	if(audioplayer.paused)
		{
			audioplayer.play();
			document.getElementById("audio_button").style.background = "url(img/icons/pause_red.png) no-repeat";
			document.getElementById("audio_button").style.backgroundSize="25px";
		}
	else
		{
			document.getElementById("audio_button").style.background = "url(img/icons/play_red.png) no-repeat";
			document.getElementById("audio_button").style.backgroundSize="25px";
			audioplayer.pause();
		}
}
function checkplayer_options()
{
	var audioplayer = document.getElementsByTagName("audio")[0];
	if(!audioplayer.paused)
	{
		document.getElementById("audio_button").style.background = "url(img/icons/pause.png) no-repeat";
		document.getElementById("audio_button").style.backgroundSize="25px";
	}
	
}
function checkplayer()
{
	var audioplayer = document.getElementsByTagName("audio")[0];
	var currentTime = document.getElementsByTagName("audio")[0].currentTime;
	console.log("CURRENT TIME " + currentTime);
	if(currentTime == 0)
	{
		//do nothing
	}
	else if(!audioplayer.paused)
	{
		document.getElementById("audio_button").style.background = "url(img/icons/pause_red.png) no-repeat";
		document.getElementById("audio_button").style.backgroundSize="25px";
	}
	else if(audioplayer.paused)
	{
		document.getElementById("audio_button").style.background = "url(img/icons/play_red.png) no-repeat";
		document.getElementById("audio_button").style.backgroundSize="25px";
	}
}
function changeAudio(audio_url)
{
	var current_audio = $("#audio").attr("src");
	/*snippet to check whether current audio is the same as the one obtained from the web*/
	var n = current_audio.indexOf(".mp3");
	var indices = [];
	//get / till .mp3, then the text between the last '/' and the .mp3 is the file name 
	for(var i=0; i<n;i++) 
	{
		if (current_audio[i] === "/") indices.push(i + 1);
	}
	var ind_length = indices.length;
	var file_name = current_audio.substring(indices[ind_length-1], n);
	var file_name2 = audio_url.substring(indices[ind_length-1], n);
	if(file_name === file_name2)
	{
	}
	else
	{
		$("#audio").attr("src", audio_url);
		document.getElementById("audio_button").style.background = "url(img/icons/audio_red.png) no-repeat";
		document.getElementById("audio_button").style.backgroundSize="25px";
	}
}

