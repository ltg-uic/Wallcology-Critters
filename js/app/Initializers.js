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
        camera.position.set(-0, 20, -10);
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
        controls.target.set(0, 0, 0);
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

function initTube() {
    var extrudePath = new THREE.Curves.VivianiCurve(70)

    tube = new THREE.TubeGeometry(extrudePath, segments, 2, radiusSegments, closed);

    tubeMesh = THREE.SceneUtils.createMultiMaterialObject( tube,
            [
                new THREE.MeshBasicMaterial({
                    map: THREE.ImageUtils.loadTexture("js/assets/textures/disturb.jpg"),
                    opacity: 1,
                    transparent: false
                }),
                new THREE.MeshBasicMaterial({
                    color: 0xffffff,
                    opacity: 0.3,
                    wireframe: true,
                    transparent: true
                })
            ]
        );

    tubeMesh.scale.set(scale, scale, scale);
    // tubeMesh.position.set(0, -40, 0);
    tubeMesh.name = "pathCurve";
    camera.lookAt(tubeMesh.position);
    // controls.target.set(tubeMesh.position);
    scene.add(tubeMesh)



}


function initJSONLoader() {
    var loader = new THREE.JSONLoader();    //OBJMTLLoader();
    var count = 0;

    var x, y,
        animation,
        gridx = 5, gridz = 5,
        sepx = 10, sepz = 10;

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

            mesh = new THREE.SkinnedMesh( geometry, material, false );
            // mesh.position.x = -( gridx - 1 ) * sepx * 0.5 + x * sepx + Math.random() * 0.5 * sepx;
            // mesh.position.z = - ( gridz - 1 ) * sepz * 0.5 + z * sepz + Math.random() * 0.5 * sepz;
            // // console.log(mesh.position.x, mesh.position.z);
            if (name === "chewie") mesh.rotation.x += 1
            // mesh.position.y = -50;
            mesh.name = name + CritterGroups.children.length.toString();
            mesh.scale.set( 0.5, 0.5, 0.5 );

            CritterGroups.add( mesh );
            animation = new THREE.Animation( mesh, mesh.geometry.animations[ 0 ]);
            animation.play()
            $('strong')[0].textContent = "Critter Count is: " + CritterGroups.children.length.toString()




        });

    }
}


