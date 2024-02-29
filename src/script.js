import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'

/**
 * Base
 */
// Debug
const gui = new GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()

const doorColorTexture = textureLoader.load('./textures/door/color.jpg')
const doorAlphaTexture = textureLoader.load('./textures/door/alpha.jpg')
const doorAmbientOcclusiontexture = textureLoader.load('./textures/door/ambientOcclusion.jpg')
const doorHeightTexture = textureLoader.load('./textures/door/height.jpg')
const doorNormalTexture = textureLoader.load('./textures/door/normal.jpg')


const brickColorTexture = textureLoader.load('./textures/bricks/color.jpg')
const brickNormalTexture = textureLoader.load('./textures/bricks/normal.jpg')
brickColorTexture.colorSpace = THREE.SRGBColorSpace


const grassColorTexture = textureLoader.load('./textures/grass/color.jpg')
const grassAmbientOcclusionTexture = textureLoader.load('./textures/grass/ambientOcclusion.jpg')
const grassNormalTexture = textureLoader.load('./textures/grass/normal.jpg')
grassColorTexture.colorSpace = THREE.SRGBColorSpace

grassColorTexture.repeat.set(8,8)
grassColorTexture.wrapS = THREE.RepeatWrapping
grassColorTexture.wrapT = THREE.RepeatWrapping

grassAmbientOcclusionTexture.repeat.set(8,8)
grassAmbientOcclusionTexture.wrapS = THREE.RepeatWrapping
grassAmbientOcclusionTexture.wrapT = THREE.RepeatWrapping


grassNormalTexture.repeat.set(8,8)
grassNormalTexture.wrapS = THREE.RepeatWrapping
grassNormalTexture.wrapT = THREE.RepeatWrapping

/**
 * House
 */
//group
const house = new THREE.Group()
scene.add(house)

//walls
const walls = new THREE.Mesh(
    new THREE.BoxGeometry(4,2.5,4),
    new THREE.MeshStandardMaterial({
        map: brickColorTexture,
        normalMap: brickNormalTexture
    })
)
walls.position.y = 1.25
house.add(walls)

//roof
const roof = new THREE.Mesh(
    new THREE.ConeGeometry(3.5,1,4),
    new THREE.MeshStandardMaterial({color:'#b35f45'})
)
roof.position.y=3
roof.rotation.y=Math.PI*0.25
house.add(roof)


//door
const door = new THREE.Mesh(
    new THREE.PlaneGeometry(2,2),
    new THREE.MeshStandardMaterial({
        map: doorColorTexture,
        transparent: true,
        alphaMap: doorAlphaTexture,
        aoMap: doorAmbientOcclusiontexture,
        height: doorHeightTexture,
        normalMap: doorNormalTexture
    })
)
door.position.z = 2.01
door.position.y = 1
house.add(door)


//bushes
const bushGeometry = new THREE.SphereGeometry(1,16,16)
const bushMaterial = new THREE.MeshStandardMaterial({color:'#ffff00'})

const bush1 = new THREE.Mesh(bushGeometry,bushMaterial)
bush1.scale.set(0.5,0.5,0.5)
bush1.position.set(0.8,0.2,2.2)
house.add(bush1)


const bush2 = new THREE.Mesh(bushGeometry,bushMaterial)
bush2.scale.set(0.25,0.25,0.25)
bush2.position.set(1.4,0.1,2.1)
house.add(bush2)

const bush3 = new THREE.Mesh(bushGeometry,bushMaterial)
bush3.scale.set(0.4,0.4,0.4)
bush3.position.set(-0.8,0.1,2.2)
house.add(bush3)

const bush4 = new THREE.Mesh(bushGeometry,bushMaterial)
bush4.scale.set(0.15,0.15,0.15)
bush4.position.set(-1,0.05,2.6)
house.add(bush4)



//graves
const graves = new THREE.Group()
scene.add(graves)

const graveGeometry = new THREE.BoxGeometry(0.6,0.8,0.2)
const graveMaterial = new THREE.MeshStandardMaterial({color: '#888'})

for(let i=0;i<50;i++){
    const angle = Math.random()*Math.PI*2
    const radius =3.5+ Math.random()*6
const x =Math.sin(angle) * radius
const z = Math.cos(angle) * radius

    const grave = new THREE.Mesh(graveGeometry,graveMaterial)
    grave.position.set(x,0.4,z)
    grave.rotation.y = (Math.random()-0.5)*0.4
    grave.rotation.z = (Math.random()-0.5)*0.1
    grave.castShadow = true
    graves.add(grave)
}


// Floor
const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(20, 20),
    new THREE.MeshStandardMaterial({ 
    map: grassColorTexture,
    normalMap: grassNormalTexture,
    aoMap : grassAmbientOcclusionTexture,
    
})
)
floor.rotation.x = - Math.PI * 0.5
floor.position.y = 0
scene.add(floor)

/**
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight('#b9d5ff', 0.1)
gui.add(ambientLight, 'intensity').min(0).max(1).step(0.001)
scene.add(ambientLight)

// Directional light
const moonLight = new THREE.DirectionalLight('#b9d5ff', 0.2)
moonLight.position.set(4, 5, 5)
gui.add(moonLight, 'intensity').min(0).max(1).step(0.001)
gui.add(moonLight.position, 'x').min(- 5).max(5).step(0.001)
gui.add(moonLight.position, 'y').min(- 5).max(5).step(0.001)
gui.add(moonLight.position, 'z').min(- 5).max(5).step(0.001)
scene.add(moonLight)

//Door light
const doorLight = new THREE.PointLight('#ff7d46',1,7)
doorLight.position.set(0,2.2,2.7)
house.add(doorLight)



const fog = new THREE.Fog('#262837',2,18)
scene.fog = fog


const ghost1 = new THREE.PointLight('#00ffff',5,3)
scene.add(ghost1)





/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setClearColor('#262837')
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 4
camera.position.y = 2
camera.position.z = 5
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))


// shadow
renderer.shadowMap.enabled = true
moonLight.castShadow = true
doorLight.castShadow = true
ghost1.castShadow = true

walls.castShadow = true
bush1.castShadow = true
bush2.castShadow = true
bush3.castShadow = true
bush4.castShadow = true
floor.receiveShadow = true

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

//ghost animate
const gohst1Angle = elapsedTime

ghost1.position.x = Math.cos(gohst1Angle)*4
ghost1.position.y = Math.sin(gohst1Angle*3)
ghost1.position.z = Math.sin(gohst1Angle)*4

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()