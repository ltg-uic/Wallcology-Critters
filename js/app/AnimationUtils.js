/*
    Animation Utilities

    Includes:
        Loaders: Maya Models, Blender Models, OBJ & MTL, etc

*/


function addTube() {

    var value = document.getElementById('dropdown').value;

    var segments = parseInt(document.getElementById('segments').value);
    closed2 = document.getElementById('closed').checked;

    var radiusSegments = parseInt(document.getElementById('radiusSegments').value);

    console.log('adding tube', value, closed2, radiusSegments);
    if (tubeMesh) parent.remove(tubeMesh);

    extrudePath = splines[value];

    tube = new THREE.TubeGeometry(extrudePath, segments, 2, radiusSegments, closed2);

    addGeometry(tube, 0xff00ff);
    setScale();

}

function setScale() {

    scale = parseInt( document.getElementById('scale').value );
    tubeMesh.scale.set( scale, scale, scale );

}


function addGeometry( geometry, color ) {

    // 3d shape

    tubeMesh = THREE.SceneUtils.createMultiMaterialObject( geometry, [
        new THREE.MeshLambertMaterial({
            color: color
        }),
        new THREE.MeshBasicMaterial({
            color: 0x000000,
            opacity: 0.3,
            wireframe: true,
            transparent: true
    })]);

    parent.add( tubeMesh );

}
