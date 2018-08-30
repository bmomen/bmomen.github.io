var streetViewOverlay = StreetViewOverlay();
var desiredXSize = 8.0;
var desiredYSize = 27.0;
var desiredZSize = 20.0;
var objectPositionX = 52.1848453;
var objectPositionY = -1.8332255;
var worldpositionX = 52.1844279;
var worldpositionY = -1.8335453;
var rotationX = 0;
var rotationY = 0;
var rotationZ = 0;

// Translates degrees to meters. It is just a hack, not a proper projection.
// originLat and originLon should be the "center" of our area of interest or
// close to it
function hackMapProjection(lat, lon, originLat, originLon) {
    var lonCorrection = 1.5;
    var rMajor = 6378137.0;

    function lonToX(lon) {
        return rMajor * (lon * Math.PI / 180);
    }

    function latToY(lat) {
        if (lat === 0) {
            return 0;
        } else {
            return rMajor * Math.log(Math.tan(Math.PI / 4 + (lat * Math.PI / 180) / 2));
        }
    }

    var x = lonToX(lon - originLon) / lonCorrection;
    var y = latToY(lat - originLat);
    return { 'x': x, 'y': y };
}

function freezeChange() {
    if (isFreezeChecked()) {
        streetViewOverlay.freezeView = true;
        // streetViewOverlay.switchFreeze(true);
        document.getElementById("controls").style.display = 'none';
        document.getElementById("dragPad").style.display = 'block';
    }
    else {
        streetViewOverlay.freezeView = false;
        //streetViewOverlay.switchFreeze(false);
        document.getElementById("controls").style.display = 'block';
        document.getElementById("dragPad").style.display = 'none';
    }
}


function latLon2ThreeMeters(lat, lon, worldOrigin) {
    var xy = hackMapProjection(lat, lon, worldOrigin[0], worldOrigin[1]);
    return { 'x': xy.x, 'y': 0, 'z': -xy.y };
}


function loadObject(object) {
    object.receiveShadow = true;

    var bbox = new THREE.Box3().setFromObject(object);

    var xsize = bbox.max.x - bbox.min.x;
    var ysize = bbox.max.y - bbox.min.y;
    var zsize = bbox.max.z - bbox.min.z;

    object.scale.set(desiredXSize / xsize, desiredYSize / ysize, desiredZSize / zsize);
    object.position.set(meshPos.x, meshPos.y, meshPos.z);
    object.rotation.set(rotationX, rotationY, rotationZ);
    // For shadows (given the right ligths, and that renderer enables them)
    object.castShadow = true;
    streetViewOverlay.load({ streetView: true, objects3D: true, webGL: true }, object, worldpositionX, worldpositionY, worldOrigin);
}

function reloadObject(object) {
    object.receiveShadow = true;

    var bbox = new THREE.Box3().setFromObject(object);

    var xsize = bbox.max.x - bbox.min.x;
    var ysize = bbox.max.y - bbox.min.y;
    var zsize = bbox.max.z - bbox.min.z;

    // For shadows (given the right ligths, and that renderer enables them)
    object.castShadow = true;

    streetViewOverlay.reloadObject(meshPos.x, meshPos.y, meshPos.z, rotationX, rotationY, rotationZ, desiredXSize / xsize, desiredYSize / ysize, desiredZSize / zsize);
}

function changeWorldPosition() {
    worldOrigin = [objectPositionX, objectPositionY];
    streetViewOverlay.changeWorldPosition(worldpositionX, worldpositionY);
}

//var objectPosition = [objectPositionX, objectPositionY];
var worldOrigin = [objectPositionX, objectPositionY];
var meshPos = { 'x': 0, 'y': -2, 'z': 0 }; // We take the position of the 3d object as the center of the world, so its position will be 0,-2,0

function load() {
    var loader = new THREE.TDSLoader();
    loader.setPath('model3d/');
    loader.load('model3d/bench.3ds', loadObject);
}

function reload() {
    var loader = new THREE.TDSLoader();
    loader.setPath('model3d/');
    loader.load('model3d/bench.3ds', reloadObject);
}

function isInstantChecked() {
    var isInstantUpdate = document.getElementById("instantUpdate").checked;
    if (isInstantUpdate)
        return true;
    else
        return false;
}

function isFreezeChecked() {
    var isFreeze = document.getElementById("freezeView").checked;
    if (isFreeze)
        return true;
    else
        return false;
        
}


var xSlider = document.getElementById("xSizeSlider");
var xSizeVal = document.getElementById("xSizeVal");
var ySlider = document.getElementById("ySizeSlider");
var ySizeVal = document.getElementById("ySizeVal");
var zSlider = document.getElementById("zSizeSlider");
var zSizeVal = document.getElementById("zSizeVal");
var worldX = document.getElementById("worldPosX");
var worldY = document.getElementById("worldPosY");
var objX = document.getElementById("objPosX");
var objY = document.getElementById("objPosY");
var xRotationSlider = document.getElementById("xRotationSlider");
var xRotationVal = document.getElementById("xRotationVal");
var yRotationSlider = document.getElementById("yRotationSlider");
var yRotationVal = document.getElementById("yRotationVal");
var zRotationSlider = document.getElementById("zRotationSlider");
var zRotationVal = document.getElementById("zRotationVal");

worldX.value = worldpositionX;
worldY.value = worldpositionY;

objX.value = objectPositionX;
objY.value = objectPositionY;

xSizeVal.innerHTML = desiredXSize;
ySizeVal.innerHTML = desiredYSize;
zSizeVal.innerHTML = desiredZSize;
xRotationVal.innerText = rotationX;
yRotationVal.innerText = rotationY;
zRotationVal.innerText = rotationZ;

worldX.oninput = function () {
    worldpositionX = worldX.value;
}

worldY.oninput = function () {
    worldpositionY = worldY.value;
}

objX.oninput = function () {
    objectPositionX = objX.value;
}

objY.oninput = function () {
    objectPositionY = objY.value;
}

xSlider.oninput = function () {
    desiredXSize = xSlider.value;
    xSizeVal.innerHTML = desiredXSize;
    if (isInstantChecked())
        reload();
}

ySlider.oninput = function () {
    desiredYSize = ySlider.value;
    ySizeVal.innerHTML = desiredYSize;
    if (isInstantChecked())
        reload();
}

zSlider.oninput = function () {
    desiredZSize = zSlider.value;
    zSizeVal.innerHTML = desiredZSize;
    if (isInstantChecked())
        reload();
}

xRotationSlider.oninput = function () {
    rotationX = xRotationSlider.value;
    xRotationVal.innerHTML = rotationX;
    if (isInstantChecked())
        reload();
}

yRotationSlider.oninput = function () {
    rotationY = yRotationSlider.value;
    yRotationVal.innerHTML = rotationY;
    if (isInstantChecked())
        reload();
}

zRotationSlider.oninput = function () {
    rotationZ = zRotationSlider.value;
    zRotationVal.innerHTML = rotationZ;
    if (isInstantChecked())
        reload();
}
load();

