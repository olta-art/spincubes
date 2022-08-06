import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"
import GUI from "lil-gui"

import { FogGUI, getSearchParams, queryfetcher } from "./helper.js"
import { getProject } from "./query.js"

const SUBGRAPH_URL = "https://api.thegraph.com/subgraphs/name/olta-art/mumbai-v1"
const FALLBACK_PROJECT_ID = "0xae4361fe3939347cbe6dce49f88c7d485ed6df30"

const { address, project, edition } = getSearchParams("address", "project", "edition")
const id = project ?? address ?? FALLBACK_PROJECT_ID
const query = getProject(id)

// Use mock data when running locally.
if (self.location.href.includes("localhost") && project === null && address === null) {
  import("./data.js").then(({ project }) => {
    start({ project })
  })
} else {
  queryfetcher(SUBGRAPH_URL, query)
    .then(start)
    .catch((e) => {
      console.log(e)
    })
}

function start(data = {}) {
  const now = Date.now()
  const auction = data?.project?.dutchAuctionDrops?.at(0) ?? {}
  const {
    numberOfPriceDrops = 0,
    duration = 0,
    startTimestamp = now
  } = auction

  const drops = Array
    .from({ length: numberOfPriceDrops + 1 }, (_, i) => {
      return Number(startTimestamp) + ((duration / numberOfPriceDrops) * i)
    })
    .map(t => t * 1000)

  const editionPurchase = edition && auction?.previousPurchases?.find(p => p?.edition?.number === edition)
  const remaining = editionPurchase
    ? drops?.filter(t => (editionPurchase?.createdAtTimestamp * 1000) - t < 0)
    : drops?.filter(t => t >= now)

  // NOTE: Uncomment at will to manually adjust `remaining` size
  // in testing what controls you end up with.
  // remaining.length = 4
  // remaining.length = 3
  // remaining.length = 2
  // remaining.length = 1

  const canvas = document.querySelector("canvas")
  const renderer = new THREE.WebGLRenderer({ antialias: true, canvas })

  renderer.setClearColor("#e5e5e5")
  renderer.setSize(window.innerWidth, window.innerHeight)

  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)

  camera.position.z = 15

  const controls = new OrbitControls(camera, renderer.domElement)

  // An animation loop is required when either damping or auto-rotation are enabled.
  controls.enableDamping = true
  controls.dampingFactor = 0.05
  controls.screenSpacePanning = false
  controls.minDistance = 0.5
  controls.maxDistance = 10
  controls.maxPolarAngle = Math.PI / 1.5

  const gui = new GUI()

  const near = 0.1
  const far = 38
  const color = "#373737"

  const scene = new THREE.Scene()

  scene.fog = new THREE.Fog(color, near, far)
  scene.background = new THREE.Color(color)

  const fogGUI = new FogGUI(scene.fog, scene.background)
  const controllers = []
  const controllerfinder = (p = "") => controllers.find(c => c.property === p)

  const auctionless = project?.dutchAuctionDrops?.length === 0 || auction?.status !== "Active"

  if (auctionless || remaining?.length > 2) {
    gui.add(fogGUI, "near", near, far).listen()
  }

  if (auctionless || remaining?.length > 1) {
    gui.add(fogGUI, "far", near, far).listen()
  }

  if (auctionless || remaining?.length >= 0) {
    gui.addColor(fogGUI, "color")
  }

  // Add 200 cubes.
  const geometry = new THREE.BoxGeometry(5, 5, 5)

  for (let i = 0; i < 200; i += 1) {
    const material = new THREE.MeshLambertMaterial({ color: Math.random() * 0xffffff })
    const object = new THREE.Mesh(geometry, material)

    object.position.x = Math.random() * 40 - 20
    object.position.y = Math.random() * 40 - 20
    object.position.z = Math.random() * 40 - 20

    object.rotation.x = Math.random() * 2 * Math.PI
    object.rotation.y = Math.random() * 2 * Math.PI
    object.rotation.z = Math.random() * 2 * Math.PI

    object.scale.x = Math.random() + 0.1
    object.scale.y = Math.random() + 0.1
    object.scale.z = Math.random() + 0.1

    scene.add(object)
  }

  const light = new THREE.DirectionalLight(0xffffff, 1)

  light.position.set(1, 1, 5).normalize()
  scene.add(light)

  const raycaster = new THREE.Raycaster()
  const mouse = new THREE.Vector2()

  self.addEventListener("mousemove", function onmousemove(e) {
    e.preventDefault()

    mouse.x = (e.clientX / self.innerWidth) * 2 - 1
    mouse.y = -1 * (e.clientY / self.innerHeight) * 2 + 1

    raycaster.setFromCamera(mouse, camera)

    const intersects = raycaster.intersectObjects(scene.children, true)

    for (let i = 0; i < intersects.length; i += 1) {
      this.tl = new TimelineMax()
      this.tl.to(intersects[i].object.rotation, 0.5, { y: 3.15, ease: Expo.easeOut })
    }
  })

  self.addEventListener("resize", () => {
    renderer.setSize(window.innerWidth, window.innerHeight)

    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
  })

  // Start animation loop.
  self.requestAnimationFrame(function animate() {
    // Update OrbitControls.
    controls.update()
    renderer.render(scene, camera)

    self.requestAnimationFrame(animate)
  })
}
