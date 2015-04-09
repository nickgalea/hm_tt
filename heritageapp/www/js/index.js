var lang_index;

function showlangmenu()
{
    document.getElementById("language").style.display="block"; 
}

function closefullcontainer()
{
    $(".full-container").hide();
}

function setLanguage(langNo) {

    switch(langNo) {
    case 0:
        lang_index = langNo;
        translate();
        document.getElementById("language").style.display="none";
        document.getElementById("language-opt").innerHTML = "Language \u2014 English";
        break;
    case 1:
        lang_index = langNo;
        translate();
        document.getElementById("language").style.display="none";
        document.getElementById("language-opt").innerHTML = "Lingwa \u2014 Maltija";
        break;
    case 2:
        lang_index = langNo;
        translate();
        document.getElementById("language").style.display="none";
        document.getElementById("language-opt").innerHTML = "Lingua \u2014 Italiano";  
        break;
    default:
        break;
    }
}

function checkLanguage() {
      navigator.globalization.getPreferredLanguage(
        function (language) 
        	{
        		if((language.value === "en-GB")||(language.value==="en-US"))
        		{
        			lang_index = 0;
                    document.getElementById("language-opt").innerHTML = "Language \u2014 " + "English";
        		} 
                else if(language.value === "it-IT")
        		{
        			lang_index = 2;
                    document.getElementById("language-opt").innerHTML = "Lingua \u2014 " + "Italiano";
        		}
        	if(lang_index!=0)
        	{
        		translate();
        	}},
        function () {alert('Error getting language\n');}	
      );
}

function getLangDict() {
	var vistxt_events = ["Events and News", "Avvenimenti u Ahbarijiet", "Eventi e Novità"];
	var vistxt_tickets = ["Book and Buy Tickets", "Ixtri l-Biljetti", "Compra Biglietti"];
    var vistxt_contact = ["Contact Us", "Ikkuntatjana", "Contattaci"];
    var vistxt_itinerary = ["Itenerary", "Itenerarju", "Itenerario"];
    var vistxt_menutitle = ["Tarxien Temples", "Tempji Ta' Hal-Tarxien", "Templi di Tarxien"];

	var LangDict = [{}];

	LangDict["vistxt_events"] = vistxt_events;
	LangDict["vistxt_tickets"] = vistxt_tickets;
    LangDict["vistxt_contact"] = vistxt_contact;
    LangDict["vistxt_itinerary"] = vistxt_itinerary;
    LangDict["vistxt_menutitle"] = vistxt_menutitle;

	return LangDict;
}

function getScreenWidth()
{
    window.screen.availWidth;
    console.log(window.screen.availWidth);

    return getScreenWidth();
}

function translate(){
	var LangDict = getLangDict();

	var allelements = document.getElementsByTagName("*");

	for (var i=0, max=allelements.length; i < max; i++) {
		var element = allelements[i];
		if (element.id.indexOf("vistxt")>-1)
		{
			var arr = LangDict[element.id];
			element.innerHTML = arr[lang_index];
		}
    
    }
}

var app=angular.module('single-page-app',['ngRoute','snap']);


app.config(function($routeProvider){

      $routeProvider
          .when('/',{
                templateUrl: 'home.html'
          })
          .when('/history_home',{
                templateUrl: 'history_home.html'
          })
          .when('/3dmodel', {
                templateUrl: '3dmodel.html'
          })
		  .when('/profile', {
                templateUrl: 'profile.html'
          })
          .when('/tour', {
                templateUrl: 'tour_panel_options.html'
          })
          .when('/tour_jurgen', {
                templateUrl: 'tourtest.html'
          })
		  .when('/map', {
                templateUrl: 'artefact_map.html'
          });


});


app.controller('cfgController',function($scope){

      $scope.message="Hello world";

});


