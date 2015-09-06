/*******************************************************************/
/*                 Declare Global Vars and objects                 */
var scene;
var stats, container, renderer;
var camera, controls, Clock;
var geometry, material, cube;
var mouse = new THREE.Vector2();
var morphAnimations = [];
var CritterGroups;

var textLoader = initTextureLoader(),
    jsonLoader = initJSONLoader();

var GroundCritters, RoofCritters,
    WestWallCritters, EastWallCritters, NorthWallCritters


// For our path generation stuffs
var binormal = new THREE.Vector3();
    normal = new THREE.Vector3();

var tube, tubeMesh,
    segments = 100,
    closed = true,
    radiusSegments = 3,
    scale = 0.1;

var currentTime,
    duration = 5000;

/*=================================================================*/
/*                   Begin Function Definitions                    */

function Start() {
    onCreate();
    onFrame();
};

function onCreate() {

    currentTime = Date.now();
    initScene();
    initRenderer();
    initContainer();

    initCamera();
    initListeners();

    initEnvMap();

    initTube();

    jsonLoader(
        "jumpy",
        "js/assets/Jumpy/jumpy_TEST1.js",
        [   "js/assets/textures/grungy-twirl.jpg",
            "js/assets/textures/grungy-twirl.jpg",
            "js/assets/textures/grungy-twirl.jpg",
            "js/assets/textures/grungy-twirl.jpg",
            "js/assets/textures/orange-twirl.jpg"
        ]
    );
    jsonLoader(
        "chewie",
        "js/assets/chewie/chewie_0.js",
        [   "js/assets/textures/Dino_TallyShapeBump.png",
            "js/assets/textures/orange-twirl.jpg"
        ]
    ); //

    // jsonMorphLoader("js/assets/3rd/cow.js");
    // initJSONCritter();
}


function onFrame() {
    requestAnimationFrame( onFrame );
    stats.begin();
    render();
    stats.end();
}

function render() {
    controls.update();


    // We move on a offset on its binormal

    var now = Date.now();
    var offset = 0.0;
    var looptime = 0;
    CritterGroups.children.forEach(function(mesh, i){
        if(mesh.name.includes("jumpy")) {
            offset = 0.1 + scale;
            looptime = (((i+1)*10)) * 500;
        } else {
            offset = 0.4 + scale;
            looptime = (((i+1)*5)) * 1000;
        }



        var t = ( now % looptime ) / looptime
        var pos = tube.parameters.path.getPointAt( t );
            pos.multiplyScalar( scale );

        // interpolation
        var segments = tube.tangents.length;
        var pickt = t * segments;
        var pick = Math.floor( pickt );
        var pickNext = ( pick + 1 ) % segments;

        binormal.subVectors( tube.binormals[ pickNext ], tube.binormals[ pick ] );
        binormal.multiplyScalar( pickt - pick ).add( tube.binormals[ pick ] );

        var dir = tube.parameters.path.getTangentAt( (i % 2 === 0)? t: -t*Math.random() );

        normal.copy( binormal ).cross( dir );
        pos.add( normal.clone().multiplyScalar( offset ) );
        // console.log("pos", pos, "norm", normal, "dir", dir, "off", offset);
        mesh.position.copy( pos );
        var lookAt = tube.parameters.path.getPointAt( ( t + 30 / tube.parameters.path.getLength() ) % 1 ).multiplyScalar( scale );
        lookAt.copy( pos ).add( dir );
        mesh.matrix.lookAt(mesh.position, lookAt, normal);
        mesh.rotation.setFromRotationMatrix( mesh.matrix, mesh.rotation.order );
    })

    // CritterGroups.rotation.y += angle
    THREE.AnimationHandler.update( Clock.getDelta() );  //Clock.getDelta()
    // prevTime = time;

    // for (var i = 0; i < morphAnimations.length; i++) {
    //     console.log(i, morphAnimations[i]);
    //     morphAnimations[0].update( time - prevTime );
        // morphAnimations[1].update( time - prevTime );
    // };

    renderer.render(scene, camera);
};

