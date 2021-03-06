var artefact_list = null;
var artefact_position = -1;
var periods = ["3300","2800","2300","1800"];
var modelUrl;
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
function getDataAndFillGallery()
{
  createArtList(fillGallery);
}

//callerPage is a string var to determine which other page called this method
//callback is a method which is called when the asynchronous call has finished and result is obtained from azure
function createArtList(callback)
{
	//console.log("ARTEFACT LIST" + artefact_list);
	if(artefact_list == null)
	{
		//console.log("LIST is empty");
		var client = new WindowsAzure.MobileServiceClient(
		"https://heritagemalta.azure-mobile.net/",
		"aoCAcmyiogRmCISDWtfEDYzuHsQjGx40"
		);
		
		var artefactTable = client.getTable('artefact_table');

		if(prem_product)
			var query = artefactTable.where({language:lang_index});
		else
			var query = artefactTable.where({language:lang_index, paid:false});

		query = query.read().done(function (results) {
			//console.log("RESULT OBTAINED");
			artefact_list = results;
			console.log(artefact_list.length);
			generatethumbnails();
			//fillGallery();
			//get all resources
			getAllArtefactRes();
			//console.log("!!!!!!!!!!!!!!!!CAlling CALLBACK!!");
			callback();
		}, function (err) {
			
			if(!(typeof localStorage.artefact_list === 'undefined'))
    			artefact_list = JSON.parse(localStorage.artefact_list);

			if(artefact_list == null)
				alert("Error: " + err + " Check your internet connection.");
			else
			{
				//alert("List Loaded from Cache, length is " + artefact_list.length);
				//console.log(artefact_list.length);
				//console.log(artefact_list);
				//fillGallery();
				callback();
			}
		}); 
		
			
	}
	else
	{
		//fillGallery();
		callback();
	}
		
}

function generatethumbnails()
{
	for(var i = 0 ; i < artefact_list.length;i++)
		{
			if(!artefact_list[i].thumbnail)
			{
				//if it is null, one is chosen to be default
				//console.log("it is null");
				artefact_list[i].thumbnail = "https://hmresources.blob.core.windows.net/thumb/"+"tool_ddd99751d8a3f7b6.jpg";
			}
			else
			{
				artefact_list[i].thumbnail = "https://hmresources.blob.core.windows.net/thumb/"+artefact_list[i].thumbnail;
				//console.log("Thumbnail :" +artefact_list[i].thumbnail );
			}
		}
}

function fillGallery()
{
	
	//console.log("FINISHED Creating artefact");
	var id = 0;
	var imgSource = "img/artifact_1.png";
	var div_gallery = $(document.createElement('div'),{
					'class':'gallery'
					});
	//if no artefact has been selected : ie position still -1
	for(var i = 0 ; i < artefact_list.length;i++)
	{
		var div_row = createArtefactRow(i);
		div_gallery.append(div_row);
		//$(" <img id = "+i+" class = 'artefact_item' src="+artefact_list[i].thumbnail+" width='150' onclick=\"stack.push('#/history_home');location.href='#/profile';\" />").appendTo(div_gallery);
	}
	div_gallery.appendTo(".white-container");
	$("#loading").remove();
}

function createArtefactRow(position)
{
	var div_row; 
	//alternate rows between class artifact_dg and artifact_lg
	if(position % 2 == 0)
	{
		div_row = document.createElement('div');
		div_row.className = "artifact_dg";
		div_row.id = position;
	}
	else
	{
		div_row = document.createElement('div');
		div_row.className = "artifact_lg";
		div_row.id = position;
	}
	//create image div
	var div_img = document.createElement('div');
	div_img.className = "artimg";
	//create info div
	var div_info = document.createElement('div');
	div_info.className = "artinfo";
	//add image to image div
	$(" <img id = "+position+" src=\""+artefact_list[position].thumbnail+"\"/>").appendTo(div_img);
	//add info to div
	if(artefact_list[position].name.length > 12)
	{
		//div_row.className += ' smallerfont'
		$(" <h1>"+ artefact_list[position].name.substring(0,10)+".." +"</h1>").appendTo(div_info);
	}
	else
		$(" <h1>"+ artefact_list[position].name +"</h1>").appendTo(div_info);
	//)
	/*if(artefact_list[position].period.length > 6)
	{
		//div_row.className += ' smallerfontper'
		$(" <p><i>"+ artefact_list[position].period.substring(0,5)+".." +"</i></p>").appendTo(div_info);
	}
	else
		$(" <p><i>"+ artefact_list[position].period +"</i></p>").appendTo(div_info);
	*/
	//attach divs to parent div
	$(div_row).append(div_img);
	$(div_row).append(div_info);
	div_row.onclick = function () {
		stack.push('#/history_home');
		location.href='#/profile';
	};
	//return parent div
	return div_row;
}
//methods for profile page
function populatePage()
{
	$("#artefact_name").text(artefact_list[artefact_position].name);
	if(artefact_list[artefact_position].period.indexOf("Ggantija") > -1)
	{
		$("<div class='arrow'></div>").appendTo("#Ggantija");
	}
	else if(artefact_list[artefact_position].period.indexOf("Saflieni") > -1)
	{
		$("<div class='arrow'></div>").appendTo("#Saflieni");
	}
	else if(artefact_list[artefact_position].period.indexOf("3150") > -1)
	{
		$("<div class='arrow'></div>").appendTo("#Tarxien");
	}
	else if(artefact_list[artefact_position].period.indexOf("Cemetry") > -1)
	{
		$("<div class='arrow'></div>").appendTo("#Cemetry");
	}
	
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

	if(artefact_list[artefact_position].video == "" || !artefact_list[artefact_position].video || artefact_list[artefact_position].video == null )
	{
		$("#view_video").remove();
	}

	
	//set the resources
	setArtefactImages();
}
/*
function getImages()
{
	var client = new WindowsAzure.MobileServiceClient(
		"https://heritagemalta.azure-mobile.net/",
		"aoCAcmyiogRmCISDWtfEDYzuHsQjGx40"
		);
		
	var resTable = client.getTable('resources');
	var query = resTable.where({
		artefact_id:artefact_list[artefact_position].reference
	}).read().done(function (results) {
		console.log(JSON.stringify(results));
		setArtefactImages(results);
	}, function (err) {
		alert("Error: " + err);
	}); 
}
*/
function refreshimage(imgno, url)
{
	$("#artimag"+imgno).remove();
	//$("#artimag"+imgno).attr("src", null);
	//$("#artimag"+imgno).attr("src", url);
	//console.log("refreshimage " + imgno); 
	/*$("<div class='artefact_image'><img id=\"artimag"+imgno+"\" onerror=\"refreshimage("+imgno+",'"+url+"');\" src="+url+" alt='img'></div>").appendTo(".swipe-wrap");
	window.mySwipe.setup();
	onerror=\"refreshimage("+i+",'"+image_list[i].url+"');\"*/
}

function setArtefactImages()
{
	image_list = artefact_list[artefact_position].resources;
	modelUrl=null;
	
	for(var i = 0 ; i < image_list.length;i++)
	{
		console.log("URL artefact outside HERE:" + image_list[i].url);
		if(image_list[i].resource_type === "image")
		{

		//add objects separately to dom
			console.log("URL artefact image HERE:" + image_list[i].url);
			
			$("<div class='artefact_image'><img id=\"artimag"+i+"\"  src="+image_list[i].url+" alt='img'></div>").appendTo(".swipe-wrap");
			
		}
		else if(image_list[i].resource_type === "3d")
		{
			modelUrl = image_list[i].url;
			//createModel();
		}
	
	}

	if(!modelUrl)
	{
		//console.log("remove");
		$("#view_3d").remove();	
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

function setImageSize()
{
	var window_height = $(window).height();
    var window_width = $(window).width();
	var max_height = window_height*0.75;
	var min_height = window_height*0.5;
	$(".swipe-wrap").css({"max-height": max_height});
}
/*
function fullScreenImage(img_source)
{
	alert(img_source);
	//$("<div data-role='page' data-dialog='true' id='pagetwo'><img src="+img_source+" alt='img'></div>").appendTo("#profile-description");

}
*/
function createModel()
{
    $('#cv').attr("width", screen.width);
    $('#cv').attr("height", screen.height);
	
	var viewer = new JSC3D.Viewer(document.getElementById('cv'));
	viewer.setParameter('SceneUrl', modelUrl);
	viewer.setParameter('BackgroundColor1', '#FFFFFF');
	viewer.setParameter('BackgroundColor2', '#FFFFFF');
	viewer.setParameter('RenderMode',       'texture');
	viewer.setParameter('ProgressBar', 'on');
	viewer.setParameter('Renderer', 'webgl');
	viewer.init();
	viewer.update();
}


//make a single request to get all resources which are used in the artefacts
function getAllArtefactRes()
{
	var client = new WindowsAzure.MobileServiceClient(
		"https://heritagemalta.azure-mobile.net/",
		"aoCAcmyiogRmCISDWtfEDYzuHsQjGx40"
		);
		
	var resTable = client.getTable('resources');
	//when artefact_id is null, tour_id is not null

	var query = resTable.where({
		tour_id:null
	});
	query = query.take(1000).read().done(function (results) {
		//console.log("Result obtained");
		//console.log(results.length);
		addResourcesToArtefacts(results);
		//console.log("Finished adding to res");
		localStorage.artefact_list = JSON.stringify(artefact_list);
		//console.log("Finished adding to cache");
	}, function (err) {
		alert("Error: " + err);
	}); 
}
//add resources to respective tour points 
function addResourcesToArtefacts(results)
{
	
	//loop dict
	for(var i = 0; i < artefact_list.length;i++)
	{
		//create a list  
		artefact_list[i].resources = [];
		for(var k = 0; k < results.length; k++)
		{
			if(artefact_list[i].reference == results[k].artefact_id)
			{
				artefact_list[i].resources.push(results[k]);
				//console.log("Found match " + results[k].resource_type + "  "  + results[k].url + " id: " + results[k].id);
			}
		}	
	}
}




