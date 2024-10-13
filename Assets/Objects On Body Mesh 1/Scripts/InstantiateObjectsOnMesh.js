// InstantiateObjectsOnMesh.js
// Version: 0.1.0
// Event: On Awake
// Description: Instantiate Objects along pinned mesh with pre-defined points

//@input SceneObject instanceObject
//@input SceneObject instanceParent
//@ui {"widget":"separator"}
//@input SceneObject frontMeshes
//@input SceneObject backMeshes
//@input SceneObject innerMeshes
//@input bool mirrorPoints = true
//@input bool addBackPoints = false
//@input bool addInlinePoints = true

var uvPositions = [];
var trackingComponent;

function initialize() {
    trackingComponent = script.instanceParent.getComponent("Component.ObjectTracking3D");
    checkTracking();
    GetPositionFromReferences();
    instantiateMesh();
    script.createEvent("UpdateEvent").bind(onUpdate);
}

initialize();

function onUpdate() {
    checkTracking();
}


function checkTracking() {
    if (trackingComponent) {
        script.instanceObject.enabled = trackingComponent.isTracking();
    }
}

function addPinUVFromChildren(obj) {
    for (var i=0;i<obj.getChildrenCount();i++) {
        var child = obj.getChild(i);
        if (child.getComponent("Component.PinToMeshComponent")) {
            uvPositions.push(child.getComponent("Component.PinToMeshComponent").pinUV);
        }   
    }
}

function GetPositionFromReferences() {
    
    //add front points
    addPinUVFromChildren(script.frontMeshes);
    
    //add inner points (inbetween legs and hands)
    if (script.addInlinePoints) {
        addPinUVFromChildren(script.innerMeshes);
    }
    
    //add back points
    if (script.showBack) {
        addPinUVFromChildren(script.backMeshes);
    }
    
    if (script.mirrorPoints) {
        //generate other half of points
        var oppositeuvPositions = [];
        for (var i=0;i<uvPositions.length;i++) {
            var oppositePinnedUV = new vec2((1 - uvPositions[i].x), uvPositions[i].y);
            oppositeuvPositions.push(oppositePinnedUV);
        }
        uvPositions = uvPositions.concat(oppositeuvPositions);
    }
}

function instantiateMesh() {
    for (var i=0;i < uvPositions.length; i ++) {
        var newmesh = script.instanceParent.copyWholeHierarchy(script.instanceObject);
        newmesh.getComponent("Component.PinToMeshComponent").pinUV = uvPositions[i];
        newmesh.enabled = true;
    }
}