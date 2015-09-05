
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

            break;
        case 57:
            jsonLoader(
                "chewie",
                "js/assets/chewie/chewie_0.js",
                [   "js/assets/textures/Dino_TallyShapeBump.png",
                    "js/assets/textures/orange-twirl.jpg"
                ]
            ); //

            break;
        case 56:
            objmtlLoader("js/assets/Dino/dino", "js/assets/textures/disturb.jpg")
            break;
    }

}
