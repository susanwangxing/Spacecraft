var SystemSettings = SystemSettings || {};

SystemSettings.standardMaterial = new THREE.ShaderMaterial( {

    uniforms: {
        texture:  { type: 't',  value: new THREE.ImageUtils.loadTexture( 'images/general-bullet.png' ) },
    },

    attributes: {
        velocity: { type: 'v3', value: new THREE.Vector3() },
        color:    { type: 'v4', value: new THREE.Vector3( 0.0, 0.0, 1.0, 1.0 ) },
        lifetime: { type: 'f', value: 1.0 },
        size:     { type: 'f', value: 1.0 },
    },

    vertexShader:   document.getElementById( 'vertexShader' ).textContent,
    fragmentShader: document.getElementById( 'fragmentShader' ).textContent,

    blending:    Gui.values.blendTypes,
    transparent: Gui.values.transparent,
    depthTest:   Gui.values.depthTest,

} );

//var myMesh;
var xSpeed = 2.0;
var ySpeed = 2.0;
SystemSettings.mySystem = {

    // Particle Material
    particleMaterial :  SystemSettings.standardMaterial,

    // Initializer
    initializerFunction : MyInitializer,
    initializerSettings : {
        position: new THREE.Vector3 ( 0.0, 0.0, 0.0),
        velocity: new THREE.Vector3 ( 0.0, 0.0, -100.0),
        color:    new THREE.Vector4 ( 0.9, 0.7, 0.1, 1.0 ),
        lifetime: 8,
        size:     50.0,
        aLifetime: 50
    },

    // Updater
    updaterFunction : MyUpdater,
    updaterSettings : {
         externalForces : {
            gravity :     new THREE.Vector3( 0.0, 0.0, 0.0),
        },
    },

    // Scene
    maxParticles:  100000,
    particlesFreq: 1000,
    createScene : function () {
        // bottom plane
        var plane_geo = new THREE.PlaneBufferGeometry( 2667, 1500, 1, 1 );
        var texture = new THREE.ImageUtils.loadTexture( 'images/space2.jpg' );
        var material = new THREE.MeshBasicMaterial( { map: texture } );
        var plane = new THREE.Mesh( plane_geo, material );
        plane.rotation.x = -3.14;
        plane.rotation.y = 3.14;
        plane.rotation.z = 3.14;
        Scene.addObject( plane );
        plane.position.set(0.0, 0.0, -1200.0);
    },

    mtlFile : "objects/SpaceShip.mtl",
    materialLoadFunction : function ( materials ) {
        var objName = "objects/SpaceShip.obj"
        materials.preload();
        var objLoader = new THREE.OBJLoader();
        objLoader.setMaterials( materials );
        objLoader.load(objName, function ( mesh ) {
            SystemSettings._myMesh = mesh;
            mesh.scale.set( 10.0, 10.0, 10.0 );
            mesh.rotation.x = -3.14;
            mesh.rotation.z = 3.14;
            mesh.position.set(0.0, 0.0, 10.0);
            Scene.addObject( mesh );
            ParticleEngine.addMesh( mesh );
        });
    },

    // will now spawn asteroids.
    asteroids : true,
    maxAsteroids: 500,
    asteroidFrequency: 50

};

// add keyboard control: WASD or arrows
window.addEventListener("keydown", onDocumentKeyDown, false);
function onDocumentKeyDown(event) {
    var keyCode = event.which;
    if (keyCode == 87 || keyCode == 38) { // up
        SystemSettings._myMesh.position.y += ySpeed;
    } else if (keyCode == 83 || keyCode == 40) { // down
        SystemSettings._myMesh.position.y -= ySpeed;
    } else if (keyCode == 65 || keyCode == 37) {  // left
        SystemSettings._myMesh.position.x -= xSpeed;
    } else if (keyCode == 68 || keyCode == 39) { //right
        SystemSettings._myMesh.position.x += xSpeed;
    } else if (keyCode == 13) {
        SystemSettings._myMesh.position.set(0, 0, 0);
    }
};
