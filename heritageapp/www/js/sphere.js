var sphere_image_list;
var runanimation = true;
var image_index360 = 0;
var camera = null; 
var scene = null; 
var renderer = null;
var geometry = null; 
var material = null; 
var mesh = null;
var target = new THREE.Vector3();
var lon = 90, lat = 0;
var phi = 0, theta = 0;
var touchX, touchY;

function init_sphere()
{
		console.log("sphere_image_list" + sphere_image_list);
			if(sphere_image_list == null){
					console.log("LIST is empty");
					var client = new WindowsAzure.MobileServiceClient("https://heritagemalta.azure-mobile.net/","aoCAcmyiogRmCISDWtfEDYzuHsQjGx40");
		
					var AzureTable = client.getTable('sphere');
					var query = AzureTable.where({}).read().done(function (results) {
						console.log("RESULT OBTAINED");
						sphere_image_list = results;
						console.log("url " + sphere_image_list[0].part_top);
						runanimation = true;
						init();
						animate();

						}, function (err) {
						alert("Error: " + err + " Check your internet connection.");
					}); 
			}
			else
			{
				console.log("url " + sphere_image_list[0].part_top);
				runanimation = true;
				init();
				animate();
			}
		};
			
function init() 
{
		console.log("init");

				camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 1000 );

				scene = new THREE.Scene();

				var sides = [
					{
						url: sphere_image_list[image_index360].part_right,
						position: [ -512, 0, 0 ],
						rotation: [ 0, Math.PI / 2, 0 ]
					},
					{
						url: sphere_image_list[image_index360].part_left,
						position: [ 512, 0, 0 ],
						rotation: [ 0, -Math.PI / 2, 0 ]
					},
					{
						url: sphere_image_list[image_index360].part_top,
						position: [ 0,  512, 0 ],
						rotation: [ Math.PI / 2, 0, Math.PI ]
					},
					{
						url: sphere_image_list[image_index360].part_bottom,
						position: [ 0, -512, 0 ],
						rotation: [ - Math.PI / 2, 0, Math.PI ]
					},
					{
						url: sphere_image_list[image_index360].part_front,
						position: [ 0, 0,  512 ],
						rotation: [ 0, Math.PI, 0 ]
					},
					{
						url: sphere_image_list[image_index360].part_back,
						position: [ 0, 0, -512 ],
						rotation: [ 0, 0, 0 ]
					}
				];

				for ( var i = 0; i < sides.length; i ++ ) {
					var side = sides[ i ];

					var element = document.createElement('img');
					element.setAttribute("class", "sphereimage");
					element.width = 1026; // 2 pixels extra to close the gap.
					element.src = side.url;
					//console.log(element.src);

					var object = new THREE.CSS3DObject( element );
					object.position.fromArray( side.position );
					object.rotation.fromArray( side.rotation );
					scene.add( object );
				}

				renderer = new THREE.CSS3DRenderer();
				renderer.setSize( window.innerWidth, window.innerHeight );
				document.body.appendChild( renderer.domElement );
				var de = document.getElementsByClassName("domelement")[0];

				document.addEventListener( 'touchstart', onDocumentTouchStart, false );
				document.addEventListener( 'touchmove', onDocumentTouchMove, false );

				window.addEventListener( 'resize', onWindowResize, false );

				document.getElementById("caption").innerHTML = sphere_image_list[image_index360].caption;

			}

			function onWindowResize() {

				camera.aspect = window.innerWidth / window.innerHeight;
				camera.updateProjectionMatrix();

				renderer.setSize( window.innerWidth, window.innerHeight );

			}

			function onDocumentTouchStart( event ) {

				var touched_element = event.target;

    			//console.log(event.target.className);

    			if(touched_element.className == "sphereimage")
    			{
    				//console.log("touchstart");

    				event.preventDefault();
					
					var touch = event.touches[ 0 ];

					touchX = touch.screenX;
					touchY = touch.screenY;	
    			}		
			}

			function onDocumentTouchMove( event ) {
				var touched_element = event.target;

    			//console.log(touched_element.className);

    			if(touched_element.className == "sphereimage")
    			{
    				//console.log("touchmove");

					event.preventDefault();

					var touch = event.touches[ 0 ];

					lon -= ( touch.screenX - touchX ) * 0.1;
					lat += ( touch.screenY - touchY ) * 0.1;

					touchX = touch.screenX;
					touchY = touch.screenY;
				}

			}

			function animate() {
				//console.log("animate");
				if(runanimation)
				{
					//console.log("animate");
					requestAnimationFrame( animate );

					lon +=  0.1;
					lat = Math.max( - 85, Math.min( 85, lat ) );
					phi = THREE.Math.degToRad( 90 - lat );
					theta = THREE.Math.degToRad( lon );

					target.x = Math.sin( phi ) * Math.cos( theta );
					target.y = Math.cos( phi );
					target.z = Math.sin( phi ) * Math.sin( theta );

					camera.lookAt( target );

					renderer.render( scene, camera );
				}
				else{
					//console.log("stop animate");
					cancelAnimationFrame(animate);
				}

			}

			function nextSphereImage() {
				if((image_index360+1) != sphere_image_list.length)
				{
					image_index360 = image_index360+1;
					var de = document.getElementsByClassName("domelement")[0];
   					console.log(de);
    				if(de != null)
      					{
        					de.parentNode.removeChild(de);
      					}
					init();
					document.getElementById("caption").innerHTML = sphere_image_list[image_index360].caption;
					if((image_index360+1) == sphere_image_list.length)
					{
						document.getElementById("gal_next").style.opacity = "0.5";
					}
					document.getElementById("gal_back").style.opacity = "1";

				}	
			}

			function previousSphereImage() {
				if((image_index360) != 0)
				{
  					image_index360 = image_index360-1;
					var de = document.getElementsByClassName("domelement")[0];
   					console.log(de);
    				if(de != null)
      					{
        					de.parentNode.removeChild(de);
      					}
					init();
					document.getElementById("caption").innerHTML = sphere_image_list[image_index360].caption;
					if((image_index360) == 0)
					{
						document.getElementById("gal_back").style.opacity = "0.5";
					}
					document.getElementById("gal_next").style.opacity = "1";
				}
			}