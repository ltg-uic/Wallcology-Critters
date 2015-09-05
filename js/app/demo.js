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
    objmtlLoader = initOBJMTLLoader(),
    jsonLoader = initJSONLoader();

var GroundCritters, RoofCritters,
    WestWallCritters, EastWallCritters, NorthWallCritters

var currentTime,
    duration = 5000;

var animations = [];
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

    objmtlLoader("js/assets/Dino/dino", "js/assets/textures/dino_texture.png")
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

    initAnimations();

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

    var now = Date.now();
    var deltat = now - currentTime;
    currentTime = now;
    var fract = deltat / duration;
    var angle = Math.PI * 2 * fract;

    CritterGroups.rotation.y += angle
    THREE.AnimationHandler.update( Clock.getDelta() );  //Clock.getDelta()
    // prevTime = time;

    // for (var i = 0; i < morphAnimations.length; i++) {
    //     console.log(i, morphAnimations[i]);
    //     morphAnimations[0].update( time - prevTime );
        // morphAnimations[1].update( time - prevTime );
    // };
    CritterGroups.children.forEach(function(mesh){
        mesh.rotation.y += angle;
    })
    renderer.render(scene, camera);
};

