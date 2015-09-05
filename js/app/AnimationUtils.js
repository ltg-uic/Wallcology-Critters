/*
    Animation Utilities

    Includes:
        Loaders: Maya Models, Blender Models, OBJ & MTL, etc

*/


function initAnimationLoader(loadType) {
    var loader;
    var count = 0;
    var callback;
    switch(loadType) {
        case 0:
            loader = new THREE.JSONLoader();
            callback = function( name, URL, textURL ) {
                loader.load(URL, function (geometry, materials) {
                    console.log("Animation Critter", name, URL, geometry, materials);
                    for (var i = 0; i < materials.length; i++) {
                        materials[i] = new THREE.MeshLambertMaterial({
                            map: THREE.ImageUtils.loadTexture(textURL), // "js/assets/textures/dino_texture.png"
                            specular: 'rgb(255, 255, 255)',
                            opacity: 0.1,
                            skinning: true,
                            morphTargets: true,
                            needsUpdate: true
                        });
                    };
                    console.log("materials", materials);
                    mesh = new THREE.SkinnedMesh( geometry, new THREE.MeshFaceMaterial(materials) ,true );
                    mesh.name = name;
                    mesh.scale.set( 0.5, 0.5, 0.5 );
                    mesh.position.set(getRandPos(-5,6), -5, getRandPos(-2,3));
                    CritterGroups.add( mesh );
                    var animation = new THREE.Animation( mesh, mesh.geometry.animations[ 0 ], THREE.AnimationHandler.CATMULLROM);
                    console.log(name, mesh, animation)
                    animation.play();
                    count++;
                    console.log("bug count is", count);
                });
            }
            break
        case 1:
            loader = new THREE.OBJMTLLoader();
            callback = function ( assetURL, textURL ) {
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
                                map: THREE.ImageUtils.loadTexture(textURL), // "js/assets/textures/dino_texture.png"
                                specular: 'rgb(255, 255, 255)',
                                opacity: 0.1,
                                skinning: true,
                                morphTargets: true,
                                needsUpdate: true
                            });

                        });
                        critter.scale.set(0.1,0.1,0.1);
                        critter.position.set(getRandPos(-5,6), -5, getRandPos(-2,3));
                        critter.updateMatrix();
                        CritterGroups.add(critter);
                    },
                    // Function called when downloads progress
                    function ( xhr ) { console.log( (xhr.loaded / xhr.total * 100) + '% loaded' ); },
                    // Function called when downloads error
                    function ( xhr ) { console.log( 'An error happened' ); }
                )
            }
            break;
    }
    return callback;
}


