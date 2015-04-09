function click_audiobutton()
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

function checkplayer()
{
	var audioplayer = document.getElementsByTagName("audio")[0];
	if(!audioplayer.paused)
	{
		document.getElementById("audio_button").style.background = "url(img/icons/pause.png) no-repeat";
		document.getElementById("audio_button").style.backgroundSize="25px";
	}

}

