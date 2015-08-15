var store_init_count = 0;
var load_from_cache_count = 0;
var premium_alerted = 0;

var prem_product = true;

var lang_index;
var from_page;

var stack = new Array();

document.addEventListener("online", whenOnline, false);
document.addEventListener("offline", whenOffline, false);

document.addEventListener("backbutton", onBackKeyDown, false);

function onBackKeyDown() {

   screen.lockOrientation('portrait');
   //window.cancelAnimationFrame(animate);
   runanimation = false;

   var de = document.getElementsByClassName("domelement")[0];
   //console.log(de);
    if(de != null)
      {
        de.parentNode.removeChild(de);
      }

	image_index360 = 0;
    console.log("back");
    if(stack.length==0)
    {
      navigator.app.exitApp(); 
    }
    else
    {
      location.href=stack.pop();
    }

    if(lang_index!=0)
    translate();

    hidePadlocks();
}

function whenOnline()
{
  console.log("i am online");

  if(store_init_count == 0)
    initializeStore();   
}

function whenOffline()
{
  console.log("i am offline");

  if(load_from_cache_count == 0)
    loadPremFromCache();
}

function loadPremFromCache()
{

  load_from_cache_count = 1;

  if(!(typeof localStorage.ispremium === 'undefined'))
    prem_product = localStorage.ispremium;
  
  console.log("prem pro after cache load "+ prem_product);
  hidePadlocks();
}

function initializeStore() {

    store_init_count = 1;
    store.verbosity = store.DEBUG;

    store.register({
        id:    'tarxien.prod.test2',
        //id: 'tarxientemples.premiumcontent',
        alias: 'premium',
        type:   store.NON_CONSUMABLE
    });

    store.refresh();

    store.error(function(error) {
        console.log('ERROR ' + error.code + ': ' + error.message);
        loadPremFromCache();
        notifyPremiumOwnership();
        //store.off();
    });

    

    store.when("premium").updated(function (p){

        console.log("is it owned now?" + p.owned);
        console.log("can i purchase?" + p.canPurchase);

        if(p.loaded && p.valid && p.state === store.APPROVED){
            console.log("ok finsih will start");
          p.finish();
        }

    });

    store.when("premium").finished(function (p){
        console.log("when finished");
        console.log("is it owned now?" + p.owned);
        console.log("can i purchase?" + p.canPurchase);
        console.log("state " + p.state);
        //store.refresh();
    });

    store.when("premium").owned(function (p){
        console.log("when owned");
        console.log("is it owned now?" + p.owned);
        console.log("can i purchase?" + p.canPurchase);
        if(!prem_product)
        {
          prem_product = true;
          localStorage.ispremium = prem_product;
          console.log("prem prod wihhi" + prem_product);
          hidePadlocks();
          tour_list = null;
          artefact_list == null;
       }
    });

    store.ready(function() {
            console.log("\\o/ STORE READY \\o/");
            //store.off();

     });
        
}

function notifyPremiumOwnership()
{
  if(premium_alerted == 0)
  {
    navigator.notification.alert(
          'You have Premium Access',  // message
          null,         // callback
          'Thank You',            // title
          'Ok'                  // buttonName
    );
    premium_alerted = 1;
  }
}

function checkLocked(link_from, link_to)
{
  if(prem_product)
  {
      stack.push(link_from); 
      location.href=link_to;
  }
  else
  {
      navigator.notification.confirm
      (
        'Unlock Premium Version Now for only 0.99 euros!', 
        onPremiumBuyConfirm,            
        'Unlock Premium Version Now',           
        ['No','Yes']         
      );
  }

}

function onPremiumBuyConfirm(buttonIndex) {
        if(buttonIndex == 2)
            {
                    store.order("premium");
            }
}

function hidePadlocks(){
  console.log("hidepadlocks called");
  if(prem_product)
  {
    notifyPremiumOwnership();
    $( ".locked_padlock" ).remove();
    $(".basic_word").remove();
  }
}

function showlangmenu()
{
    document.getElementById("language").style.display="block"; 
}

function showcontactmenu()
{
    document.getElementById("contact-us").style.display="block"; 
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
            console.log(language.value);
        		if((language.value === "en-GB")||(language.value==="en-US")||(language.value==="en-MT"))
        		{
        			lang_index = 0;
              //document.getElementById("language-opt").innerHTML = "Language \u2014 " + "English";
        		} 
                else if((language.value === "it-IT")||(language.value === "it-MT"))
        		{
        			lang_index = 2;
              //document.getElementById("language-opt").innerHTML = "Lingua \u2014 " + "Italiano";
        		}
        	if(lang_index!=0)
        	{
        		translate();
        	}},
        function () {alert('Error getting language\n');}	
      );
}

function getLangDict() {
  //side menu
	var vistxt_events = ["Events and News", "Avvenimenti u Ahbarijiet", "Eventi e Novità"];
	var vistxt_tickets = ["Book and Buy Tickets", "Ixtri l-Biljetti", "Compra Biglietti"];
  var vistxt_contact = ["Contact Us", "Ikkuntatjana", "Contattaci"];
  var vistxt_itinerary = ["Itenerary", "Itenerarju", "Itenerario"];
  var vistxt_menutitle = ["Tarxien Temples", "Tempji Ta' Hal-Tarxien", "Templi di Tarxien"];
  var vistxt_langchoice = ["Language \u2014 " + "English", "Lingwa \u2014 " + "Malti", "Lingua \u2014 " + "Italiano"];
  //var vistxt_langchoice = ["Language \u2014 " + "English", "Lingwa \u2014 " + "Malti", "Lingua \u2014 " + "Italiano"];

  //home.html
  var vistxt_maintitle = ["Tarxien Temples", "Tempji Ta' Hal-Tarxien", "Templi di Tarxien"];
  var vistxt_artifacts = ["History and<br> Artifacts", "Storja u<br>Oggetti Storici", "Storia e<br>Oggetti Storici"];

	var LangDict = [{}];

	LangDict["vistxt_events"] = vistxt_events;
	LangDict["vistxt_tickets"] = vistxt_tickets;
  LangDict["vistxt_contact"] = vistxt_contact;
  LangDict["vistxt_itinerary"] = vistxt_itinerary;
  LangDict["vistxt_menutitle"] = vistxt_menutitle;
  LangDict["vistxt_langchoice"] = vistxt_langchoice;

  LangDict["vistxt_maintitle"] = vistxt_maintitle;
  LangDict["vistxt_artifacts"] = vistxt_artifacts;

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

    //cater for change in language when list has been loaded
    artefact_list = null;
    artefact_position = -1;

    //same but for tour
    tour_list = null;
    image_list = null;
    tourDict = [{}];
    current_tour_point = 1;
    current_child_num;
    startTime = 0;

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
                templateUrl: 'tour_start.html'
          })
          .when('/tour_binfo', {
                templateUrl: 'tour_panel_binfo.html'
          })
		      .when('/tour_options', {
                templateUrl: 'tour_panel_options.html'
          })
		      .when('/tour_pinfo', {
                templateUrl: 'tour_panel_pinfo.html'
          })
		      .when('/map', {
                templateUrl: 'artefact_map.html'
          })
			  .when('/game_start', {
                templateUrl: 'game_start.html'
          })
			  .when('/scratch', {
                templateUrl: 'excavator.html'
          })
			  .when('/history_intro', {
                templateUrl: 'history_intro.html'
          })
			  .when('/sphereimage', {
                templateUrl: 'sphereimage.html'
          })
			 .when('/aerialgal', {
                templateUrl: 'aerialgal.html'
          })
			  .when('/gallery_start', {
                templateUrl: 'gallery-start.html'
          })
			  .when('/explorer_clues', {
                templateUrl: 'explorer_clues.html'
          })
        .when('/events', {
                templateUrl: 'events.html'
        })
        .when('/profile-event', {
                templateUrl: 'profile-event.html'
        })
        .when('/event_map', {
                templateUrl: 'event_map.html'
        })
        .when('/sphereimage_tour', {
                templateUrl: 'sphereimage_tour.html'
        })
        .when('/audioguide', {
                templateUrl: 'audioguide.html'
        })
		.when('/timeline', {
                templateUrl: 'timeline.html'
        })
    .when('/artvid', {
                templateUrl: 'artvid.html'
        });


});


app.controller('cfgController',function($scope){

      $scope.message="Hello world";

});


