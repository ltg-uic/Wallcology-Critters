
function onReshape() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );

}


function onMouseMove( event ) {

    // calculate mouse position in normalized device coordinates
    // (-1 to +1) for both components
    event.preventDefault();
    mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

}


function onKeyPress( event ) {

    console.log("Key is",event.keyCode);
    switch (event.keyCode) {
        case 48:
            // objmtlLoader(
            //     "js/assets/Dino/dino_3",
            //     "js/assets/textures/dino_texture.png"
            // );
            jsonLoader("js/assets/Jumpy/jumpy-Beauty.js", "js/assets/textures/dino_texture.png");
            break;
        case 49:
            camera.position.set(camera.position.x, camera.position.y, camera.position.z-0.3);
            // controls.update();
            // updateLightPosition();
            console.log(camera.position)
            break;
        case 50:
            camera.position.set(camera.position.x, camera.position.y, camera.position.z+0.3);
            // controls.update();
            // updateLightPosition();
            console.log(camera.position);
            break;
        case 51:
            camera.position.set(camera.position.x, camera.position.y+0.3, camera.position.z);
            // controls.update();
            // updateLightPosition();
            console.log(camera.position);
            break;
        case 52:
            camera.position.set(camera.position.x, camera.position.y-0.3, camera.position.z);
            // controls.update();
            // updateLightPosition();
            console.log(camera.position);
            break;
        case 112:
            dataUrl = renderer.domElement.toDataURL("image/png");
            console.log(dataUrl);
            break;

    }

}

