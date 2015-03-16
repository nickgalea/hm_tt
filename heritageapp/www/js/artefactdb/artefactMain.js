var artefact_list = null;
var artefact_position = 1;
var eras = ["3300","2800","2300","1800"];
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

function populatePage()
{
	$("#artefact_name").text(artefact_list[artefact_position].name);
	$("<div class='arrow'></div>").appendTo("#era-" + artefact_list[artefact_position].era);
	if(artefact_list[artefact_position].type == "")
	{
		$("#type_col").hide();
	}
	if(artefact_list[artefact_position].mat == "")
	{
		$("#material_col").hide();
	}
	if(artefact_list[artefact_position].use == "")
	{
		$("#use_col").hide();
	}
	
	$("#artefact_type").text(artefact_list[artefact_position].type);
	$("#artefact_material").text(artefact_list[artefact_position].mat);
	$("#artefact_use").text(artefact_list[artefact_position].use);
	
	$("#artefact_info").text(artefact_list[artefact_position].info);
}

function createArtList()
{
	console.log("ARTEFACT LIST" + artefact_list);
	if(artefact_list == null)
	{
		console.log("LIST is empty");
		var client = new WindowsAzure.MobileServiceClient(
		"https://heritagemalta.azure-mobile.net/",
		"aoCAcmyiogRmCISDWtfEDYzuHsQjGx40"
		);
		
		var artefactTable = client.getTable('artefact_table');
		var query = artefactTable.where({
		}).read().done(function (results) {
			
			console.log(JSON.stringify(results));
			artefact_list = results;
			//populatePage();
			fillGallery();
		}, function (err) {
			alert("Error: " + err);
		}); 
	}
	else
	{
		console.log("NOT LIST is empty");
		//populatePage();
		fillGallery();
	}
		
}

function fillGallery()
{
	var onclickLink = "location.href='#/profile'";
	var id = 0;
	var imgSource = "img/artifact_1.png";
	for(var i = 0 ; i < artefact_list.length;i++)
	{
		$(" <img id = "+i+" class = 'xxx' src="+imgSource+" width='150' />").appendTo(".gallery");
	}
	attachGalleryHandler();
}

function editArtefactPost(position)
{
	artefact_position = position;
}

function attachGalleryHandler()
{
	$(".xxx").on("click",function(){
		artefact_position = $(this).attr("id");
		$(this).location.href = "#/profile";
		console.log("LOCATION HREF " + $(this).location.href);
	});
}

