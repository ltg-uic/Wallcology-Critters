function initScene() {
    console.log("initScene()");
    scene = new THREE.Scene();
    {
        CritterGroups = new THREE.Object3D();
        Clock = new THREE.Clock( true );
    }

    scene.add(CritterGroups);

}

function initRenderer() {
    console.log("initRenderer()");
    renderer = new THREE.WebGLRenderer({ antialias: true });
    {
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setClearColor(rgbToHex(255,255,255), 1);
        renderer.gammaInput = true;
        renderer.gammaOutput = true;
    }

}


function initContainer() {
    console.log("initContainer()");

    container = document.getElementById('Wallcology');
    container.appendChild(renderer.domElement);
}


function initCamera() {
    console.log("initCamera()");
    camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );
    {
        // **** position the camera near the first halo; ***
        // var pos = sphereGroup.children[0].position;
        // var pos = curTarget.object.position;
        // console.log("\t", pos)
            // var pos = pointCloud.position;
        // light.position.set(pos.x, pos.y + 0.1, pos.z - (pos.z * 0.5));
        camera.position.set(0, -4, 5);
        controls = new THREE.TrackballControls(camera, renderer.domElement); {
            controls.rotateSpeed = 4.0;
            controls.zoomSpeed = 1.5;
            controls.panSpeed = 1.0;

            controls.noZoom = false;
            controls.noPan = false;

            controls.staticMoving = false;
            controls.dynamicDampingFactor = 0.3;

            controls.keys = [65, 83, 68];
            controls.enabled = true;
        }
        camera.lookAt(CritterGroups.position);
        controls.target.set(0, -5, -5);
        controls.update();
        // updateLightPosition();
    }

}
// Textures
function initEnvMap() {

    var urls = [ "js/assets/textures/WallPanel_00.png", "js/assets/textures/WallPanel_00.png",
                 "js/assets/textures/WallPanel_01.png", "js/assets/textures/WallPanel_01.png",
                 "js/assets/textures/WallPanel_02.png", "js/assets/textures/WallPanel_02.png" ];

    textureCube = THREE.ImageUtils.loadTextureCube( urls );
    textureCube.format = THREE.RGBFormat;

    // Materials

    var cubeShader = THREE.ShaderLib[ "cube" ];
    var cubeMaterial = new THREE.ShaderMaterial( {
        fragmentShader: cubeShader.fragmentShader,
        vertexShader: cubeShader.vertexShader,
        uniforms: cubeShader.uniforms,
        depthWrite: false,
        side: THREE.BackSide
    } );

    cubeMaterial.uniforms[ "tCube" ].value = textureCube;

    // Skybox

    cubeMesh = new THREE.Mesh( new THREE.BoxGeometry( 10, 10, 10 ), cubeMaterial );
    scene.add( cubeMesh );
}


function initTextureLoader() {
    // texture
    var manager = new THREE.LoadingManager();
    manager.onProgress = function ( item, loaded, total ) {
        console.log( item, loaded, total );
    };

    var loader = new THREE.ImageLoader( manager );

    return function (URL) {
        console.log(URL)

        var texture = new THREE.Texture();
        loader.load( URL, function ( image ) {

            texture.image = image;
            texture.needsUpdate = true;

        } );
        return texture;
    }
}

function initJSONLoader(isMorph) {
    var loader = new THREE.JSONLoader();    //OBJMTLLoader();
    var animation;
    // 'js/assets/3rd/elk_life.js'
    console.log("isMorph?", isMorph);
    var name;
    if (!isMorph)
        return function( URL, textURL ) {
            name = URL.split("\\")
            name = name[name.length-1];
            loader.load(URL, function (geometry, materials) {
                console.log("Animation Critter", URL, geometry, materials);
                materials.forEach(function(mat){
                    console.log("\t",mat);
                    mat.map = textLoader(textURL)
                    mat.skinning = true;
                    mat.emissive.setRGB(Math.random(),Math.random(),Math.random())
                })
                mesh = new THREE.SkinnedMesh( geometry, new THREE.MeshFaceMaterial(materials) );
                mesh.scale.set( 0.5, 0.5, 0.5 );
                mesh.position.set(
                    getRandPos(-5,6),
                    -5,
                    getRandPos(-2,3)
                );
                CritterGroups.add( mesh );
                console.log(mesh)
                var animation = new THREE.Animation( mesh, mesh.geometry.animations[ 0 ], THREE.AnimationHandler.CATMULLROM);
                animation.play();
            });
        }
    else
        return function( URL, textURL) {
            loader.load(URL, function( geometry ) {
                console.log("Morph Critter", URL, geometry);
                mesh = new THREE.Mesh( geometry, new THREE.MeshLambertMaterial( { color: 0x606060, morphTargets: true } ) );
                mesh.scale.set( 0.01, 0.01, 0.01 );
                mesh.position.set(
                    getRandPos(-5,6),
                    -5,
                    getRandPos(-2,3)
                );
                CritterGroups.add( mesh );
                morphAnimations.push(new THREE.MorphAnimation( mesh ));
                morphAnimations[morphAnimations.length -1].play();
                // anime.play();
            });
        };
}


function initOBJMTLLoader() {

    var loader = new THREE.OBJMTLLoader();

    return function ( assetURL, textureURL ) {

        loader.load(
            // OBJ resource URL
            assetURL+'.obj',
            // MTL resource URL
            assetURL+'.mtl',
            // Function when both resources are loaded
            function ( critter ) {
                console.log(critter);
                critter.children.forEach(function(mesh) {
                    console.log("\t",mesh);
                    mesh.material = new THREE.MeshBasicMaterial({
                        map: textLoader(textureURL), // "js/assets/textures/dino_texture.png"
                        // color: 'rgb(255, 255, 0)',
                        // blending: THREE.AdditiveBlending,
                        // specular: colorKey(halo.time),
                        // shininess: 40,
                        // shading: THREE.SmoothShading,
                        // vertexColors: THREE.VertexColors,
                        // transparent: true,
                        // side: THREE.BackSide,  // Seems to be slowing things down a lot
                        opacity: 0.1
                    });

                });
                critter.scale.set(0.1,0.1,0.1);
                critter.position.set(
                    getRandPos(-5,6),
                    -5,
                    getRandPos(-2,3));
                critter.updateMatrix();
                CritterGroups.add(critter);
                // CritterGroups.getObjectByName(bug.name).add(object);
            },
            // Function called when downloads progress
            function ( xhr ) {
                // console.log( (xhr.loaded / xhr.total * 100) + '% loaded' );
            },
            // Function called when downloads error
            function ( xhr ) {
                console.log( 'An error happened' );
            }
        )
    }
}



function initListeners() {
    console.log("initListeners()")
    window.addEventListener('resize', onReshape, false);
    window.addEventListener('mousemove', onMouseMove, false);
    // window.addEventListener('click', onMouseClick, true);
    // window.addEventListener('dblclick', onMouseDoubleClick, true);
    window.addEventListener('keypress', onKeyPress, false);
}
