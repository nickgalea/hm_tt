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

function createArtList()
{
	var art = new Artefact();

	art.id = 1;
	art.name = "Half Statue1";
	art.era = "1800";
	art.type = "Statue";
	art.material = "Ston";
	art.info = "This is a statue of a God";
	art.use = "";
	art.lat = "0.5";
	art.lon = "0.5";
	var artefact_list = new Array(art);
	art = new Artefact();
	art.id = 2;
	art.name = "Bull Design";
	art.era = "2800";
	art.type = "Engraving";
	art.material = "Stone";
	art.info = "Engraving of a bull animal";
	art.use = "Decoration";
	art.lat = "0.5";
	art.lon = "0.5";
	artefact_list[artefact_list.length] = art;
	return artefact_list;
}
