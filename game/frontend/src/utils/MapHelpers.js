export default {
    SetCollisions : function(scene, staticObjects, dynamicObjects){
        staticObjects.forEach(obj => {
            scene.physics.add.existing(obj,true)
        })
        dynamicObjects.forEach(obj => {
            scene.physics.add.existing(obj)
        })
        scene.physics.add.collider([...staticObjects, ...dynamicObjects])
    } 
}




