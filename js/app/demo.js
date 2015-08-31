/*******************************************************************/
/*                 Declare Global Vars and objects                 */
var scene;
var container, renderer;
var camera, controls, Clock;
var geometry, material, cube;
var mouse = new THREE.Vector2();
var CritterGroups;

var animation;
var textLoader = initTextureLoader(),
    objmtlLoader = initOBJMTLLoader(),
    jsonLoader = initJSONLoader();

var GroundCritters, RoofCritters,
    WestWallCritters, EastWallCritters, NorthWallCritters

/*=================================================================*/
/*                   Begin Function Definitions                    */

function Start() {
    onCreate();
    onFrame();
};

function onCreate() {

    initScene();
    initRenderer();
    initContainer();

    initCamera();
    initListeners();

    initEnvMap();
    objmtlLoader(
        "js/assets/Dino/dino_3",
        "js/assets/textures/dino_texture.png"
    );

    jsonLoader("js/assets/Jumpy/jumpy_TEST.js", "js/assets/textures/dino_texture.png"); //
    // jsonLoader('js/assets/3rd/elk_life.js');
    // initJSONCritter();
}


function onFrame() {
    requestAnimationFrame( onFrame );
    render();
}

function render() {
    controls.update();

    THREE.AnimationHandler.update( Clock.getDelta() );

    CritterGroups.children.forEach(function(mesh){

        mesh.rotation.y += 0.1;
    })
    renderer.render(scene, camera);
};

