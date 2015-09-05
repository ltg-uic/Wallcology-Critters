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
    renderer = new THREE.WebGLRenderer({
        antialias: true,
        preserveDrawingBuffer: true   // required to support .toDataURL()
    });

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

    stats = new Stats();
    stats.setMode( 0 ); // 0: fps, 1: ms, 2: mb

    // align top-left
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.left = '0px';
    stats.domElement.style.top = '0px';

    container.appendChild( stats.domElement );
}


function initListeners() {
    console.log("initListeners()")
    window.addEventListener('resize', onReshape, false);
    window.addEventListener('mousemove', onMouseMove, false);
    // window.addEventListener('click', onMouseClick, true);
    // window.addEventListener('dblclick', onMouseDoubleClick, true);
    window.addEventListener('keypress', onKeyPress, false);
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
        camera.position.set(-0, -30, -40);
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
        camera.lookAt(new THREE.Vector3(0, -50, 0));
        controls.target.set(0, -50, 0);
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

    cubeMesh = new THREE.Mesh( new THREE.BoxGeometry( 100, 100, 100 ), cubeMaterial );
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

function initAnimations() {
    for (var i = 0; i < animations.length; i++) {
        animations[i].offset = 0.05 * Math.random();
        animations[i].play()
    };
}


function initJSONLoader() {
    var loader = new THREE.JSONLoader();    //OBJMTLLoader();
    var count = 0;

    var x, y,
        animation,
        gridx = 10, gridz = 10,
        sepx = 2, sepz = 3;

    return function( name, URL, textURL ) {
        loader.load(URL, function (geometry, materials) {
            console.log("SkinnedCritter", name, URL, materials.length, geometry.animations.length);
            for (var i = 0; i < materials.length; i++) {
                console.log(name, i, textURL[i])
                materials[i] = new THREE.MeshBasicMaterial({
                    map: THREE.ImageUtils.loadTexture(textURL[i]), // "js/assets/textures/dino_texture.png"
                    // specular: 'rgb(255, 255, 255)',
                    opacity: 1,
                    skinning: true,
                    transparent: true
                    // morphTargets: true,
                    // needsUpdate: true
                });
            };

            var material = new THREE.MeshFaceMaterial(materials);

            for (var x = 0; x < gridx; x++) {
                for (var z = 0; z < gridz; z++) {
                    mesh = new THREE.SkinnedMesh( geometry, material, false );
                    mesh.position.x = -( gridx - 1 ) * sepx * 0.5 + x * sepx + Math.random() * 0.5 * sepx;
                    mesh.position.z = - ( gridz - 1 ) * sepz * 0.5 + z * sepz + Math.random() * 0.5 * sepz;
                    // console.log(mesh.position.x, mesh.position.z);
                    if (name === "chewie") mesh.rotation.x += 1.3
                    mesh.position.y = -50;
                    mesh.name = name + x.toString() + z.toString();
                    mesh.scale.set( 0.5, 0.5, 0.5 );

                    CritterGroups.add( mesh );
                    animation = new THREE.Animation( mesh, mesh.geometry.animations[ 0 ]);
                    animation.play()
                    console.log("bug count is", CritterGroups.children.length);
                };
            };



        });

    }
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
                        vertexColors: THREE.VertexColors,
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


