/*******************************************************************/
/*                 Declare Global Vars and objects                 */
var scene;
var container, renderer;
var camera, controls, Clock;
var geometry, material, cube;
var mouse = new THREE.Vector2();
var morphAnimations = [];
var CritterGroups;

var textLoader = initTextureLoader(),
    objmtlLoader = initOBJMTLLoader(),
    jsonLoader = initJSONLoader(false),
    jsonMorphLoader = initJSONLoader(true);

var GroundCritters, RoofCritters,
    WestWallCritters, EastWallCritters, NorthWallCritters

var prevTime;

/*=================================================================*/
/*                   Begin Function Definitions                    */

function Start() {
    onCreate();
    onFrame();
};

function onCreate() {

    prevTime = Date.now();
    initScene();
    initRenderer();
    initContainer();

    initCamera();
    initListeners();

    initEnvMap();
    // objmtlLoader( "js/assets/Dino/dino_3", "js/assets/textures/dino_texture.png" );

    jsonLoader("js/assets/Jumpy/jumpy-Beauty.js", "js/assets/textures/dino_texture.png"); //
    jsonLoader("js/assets/Jumpy/jumpy_TEST1.js", "js/assets/textures/dino_texture.png"); //

    // jsonMorphLoader("js/assets/3rd/cow.js");
    // initJSONCritter();
}


function onFrame() {
    requestAnimationFrame( onFrame );
    render();
}

function render() {
    controls.update();

    // var time = Date.now();
    THREE.AnimationHandler.update( Clock.getDelta() );
    // prevTime = time;
//
    // for (var i = 0; i < morphAnimations.length; i++) {
    //     console.log(i, morphAnimations[i]);
    //     morphAnimations[0].update( time - prevTime );
        // morphAnimations[1].update( time - prevTime );
    // };
    // CritterGroups.children.forEach(function(mesh){

    //     mesh.rotation.y += 0.1;
    // })
    renderer.render(scene, camera);
};

