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
    jsonMorphLoader("js/assets/3rd/elk_life.js");
    // jsonMorphLoader("js/assets/3rd/cow.js");
    jsonMorphLoader('js/assets/3rd/fish_life.js');
    // initJSONCritter();
}


function onFrame() {
    requestAnimationFrame( onFrame );
    render();
}

function render() {
    controls.update();

    THREE.AnimationHandler.update( Clock.getDelta() );

    // for (var i = 0; i < morphAnimations.length; i++) {
        var time = Date.now();
        // console.log(i, morphAnimations[i]);
        morphAnimations[0].update( time - prevTime );
        morphAnimations[1].update( time - prevTime );
        prevTime = time;
    // };
    // CritterGroups.children.forEach(function(mesh){

    //     mesh.rotation.y += 0.1;
    // })
    renderer.render(scene, camera);
};

