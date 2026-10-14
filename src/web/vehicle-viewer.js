import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";

const models = {
  TRUCK: { url: "assets/camion-rigido.glb", label: "Camión rígido" },
  TRACTOR_TRUCK: { url: "assets/tractomula-detallada.glb", label: "Tractomula" },
};

function disposeModel(root) {
  root.traverse(node => {
    node.geometry?.dispose();
    const materials = Array.isArray(node.material) ? node.material : [node.material];
    materials.filter(Boolean).forEach(material => {
      for (const value of Object.values(material)) if (value?.isTexture) value.dispose();
      material.dispose();
    });
  });
}

function mount(stage, options = {}) {
  if (!stage) return;
  const scope = options.scope || document;
  const pending = stage.querySelector("[data-vehicle-pending]") || document.getElementById("vehiclePending");
  const fallback = stage.querySelector("[data-vehicle-fallback]") || document.getElementById("vehicleFallback");
  const heading = scope.querySelector("#vehicle-model-title");
  const focusButton = scope.querySelector('[data-view-action="focus"]');
  const buttons = [...scope.querySelectorAll("[data-vehicle-type]")].filter(button => button.tagName === "BUTTON");
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "default" });
  } catch {
    if (pending) pending.hidden = true;
    if (fallback) fallback.hidden = false;
    return { select: () => {} };
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.12;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.domElement.setAttribute("aria-hidden", "true");
  stage.prepend(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(34, 1, .1, 120);
  const environment = new THREE.PMREMGenerator(renderer);
  scene.environment = environment.fromScene(new RoomEnvironment(), .04).texture;
  scene.add(new THREE.HemisphereLight(0xffffff, 0x99aab8, 1.35));
  const key = new THREE.DirectionalLight(0xffffff, 2.1);
  key.position.set(5, 11, 7);
  key.castShadow = true;
  key.shadow.mapSize.set(2048, 2048);
  key.shadow.camera.left = key.shadow.camera.bottom = -14;
  key.shadow.camera.right = key.shadow.camera.top = 14;
  key.shadow.bias = -.00012;
  scene.add(key);
  const fill = new THREE.DirectionalLight(0xcfe5ff, .85);
  fill.position.set(-7, 4, -5);
  scene.add(fill);
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(200, 200), new THREE.ShadowMaterial({ color: 0x142e43, opacity: .18 }));
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = -.025;
  floor.receiveShadow = true;
  scene.add(floor);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enablePan = false;
  controls.minPolarAngle = .18;
  controls.maxPolarAngle = Math.PI * .48;
  let initial = new THREE.Vector3(8, 5, 8), focusMode = "whole";
  let current = null, activeType = "TRUCK", requestId = 0, selectionId = 0, visible = true, disposed = false;
  const loader = new GLTFLoader();
  function fitModel() {
    if (!current) return;
    const bounds = focusMode === "cab" && activeType === "TRACTOR_TRUCK"
      ? new THREE.Box3(new THREE.Vector3(-1.75, .1, 4.7), new THREE.Vector3(1.75, 3.6, 7.9)).translate(current.position)
      : new THREE.Box3().setFromObject(current);
    const size = bounds.getSize(new THREE.Vector3());
    const center = bounds.getCenter(new THREE.Vector3());
    controls.target.set(center.x, bounds.min.y + size.y * .47, center.z);
    const direction = new THREE.Vector3(activeType === "TRUCK" ? -.64 : .64, .33, .69).normalize();
    const corners = [];
    for (const x of [bounds.min.x, bounds.max.x]) for (const y of [bounds.min.y, bounds.max.y]) for (const z of [bounds.min.z, bounds.max.z]) corners.push(new THREE.Vector3(x, y, z));
    let near = Math.max(2, size.length() * .35), far = Math.max(30, size.length() * 4);
    for (let i = 0; i < 20; i++) {
      const distance = (near + far) / 2;
      camera.position.copy(controls.target).addScaledVector(direction, distance);
      camera.lookAt(controls.target);
      camera.updateMatrixWorld();
      const fits = corners.every(point => {
        const projected = point.clone().project(camera);
        return Math.abs(projected.x) < .84 && Math.abs(projected.y) < .84 && projected.z > -1 && projected.z < 1;
      });
      if (fits) far = distance; else near = distance;
    }
    controls.minDistance = Math.max(3.5, size.length() * .3);
    controls.maxDistance = Math.max(35, far * 2.5);
    initial = controls.target.clone().addScaledVector(direction, far);
    camera.position.copy(initial);
    controls.update();
    requestRender();
  }
  const requestRender = () => {
    if (requestId || !visible || disposed) return;
    requestId = requestAnimationFrame(() => {
      requestId = 0;
      renderer.render(scene, camera);
    });
  };
  controls.addEventListener("change", requestRender);
  const resize = () => {
    const width = stage.clientWidth, height = stage.clientHeight;
    if (!width || !height) return;
    renderer.setSize(width, height, false);
    const oldAspect = camera.aspect;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    if (Math.abs(oldAspect - camera.aspect) > .08) fitModel();
    requestRender();
  };
  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(stage);
  const intersectionObserver = new IntersectionObserver(entries => {
    visible = entries[0]?.isIntersecting ?? true;
    if (visible) requestRender();
  }, { threshold: .01 });
  intersectionObserver.observe(stage);

  async function select(type) {
    const model = models[type];
    if (!model) return;
    const ticket = ++selectionId;
    if (pending) { pending.hidden = false; pending.textContent = `Cargando ${model.label.toLowerCase()}…`; }
    if (fallback) fallback.hidden = true;
    if (heading) heading.textContent = model.label;
    stage.setAttribute("aria-label", `Modelo tridimensional genérico de ${model.label.toLowerCase()}, visible desde distintos ángulos`);
    buttons.forEach(button => {
      const selected = button.dataset.vehicleType === type;
      button.classList.toggle("is-active", selected);
      button.setAttribute("aria-pressed", String(selected));
    });
    try {
      const gltf = await loader.loadAsync(model.url);
      if (disposed || ticket !== selectionId) { disposeModel(gltf.scene); return; }
      if (current) { scene.remove(current); disposeModel(current); }
      current = gltf.scene;
      current.traverse(node => {
        if (node.isMesh) { node.castShadow = true; node.receiveShadow = true; }
      });
      const bounds = new THREE.Box3().setFromObject(current);
      const size = bounds.getSize(new THREE.Vector3());
      const center = bounds.getCenter(new THREE.Vector3());
      current.position.set(-center.x, -bounds.min.y, -center.z);
      scene.add(current);
      activeType = type;
      focusMode = "whole";
      if (focusButton) {
        focusButton.hidden = type !== "TRACTOR_TRUCK";
        focusButton.parentElement.classList.toggle("has-focus", type === "TRACTOR_TRUCK");
        focusButton.textContent = "Ver cabina";
      }
      fitModel();
      if (pending) pending.hidden = true;
      requestRender();
    } catch (error) {
      if (ticket !== selectionId || disposed) return;
      console.error("No se pudo cargar el modelo 3D", error);
      if (pending) pending.hidden = true;
      if (fallback) fallback.hidden = false;
    }
  }
  function clear() {
    ++selectionId;
    if (current) { scene.remove(current); disposeModel(current); current = null; }
    if (pending) { pending.hidden = false; pending.textContent = "Selecciona un vehículo para ver su tipo en 3D."; }
    if (fallback) fallback.hidden = true;
    stage.setAttribute("aria-label", "Selecciona un vehículo para ver su tipo en 3D");
    requestRender();
  }
  buttons.forEach(button => button.addEventListener("click", () => select(button.dataset.vehicleType)));
  scope.querySelectorAll("[data-view-action]").forEach(button => button.addEventListener("click", () => {
    const action = button.dataset.viewAction;
    if (action === "focus") {
      focusMode = focusMode === "whole" ? "cab" : "whole";
      focusButton.textContent = focusMode === "cab" ? "Ver conjunto" : "Ver cabina";
      fitModel();
      return;
    }
    if (action === "reset") camera.position.copy(initial);
    else if (action === "zoom-in" || action === "zoom-out") {
      const offset = camera.position.clone().sub(controls.target);
      const distance = THREE.MathUtils.clamp(offset.length() * (action === "zoom-in" ? .81 : 1.23), controls.minDistance, controls.maxDistance);
      camera.position.copy(controls.target).add(offset.setLength(distance));
    } else {
      const offset = camera.position.clone().sub(controls.target);
      offset.applyAxisAngle(new THREE.Vector3(0, 1, 0), action === "left" ? -.32 : .32);
      camera.position.copy(controls.target).add(offset);
    }
    controls.update();
    requestRender();
  }));
  renderer.domElement.addEventListener("webglcontextlost", event => {
    event.preventDefault();
    if (pending) pending.hidden = true;
    if (fallback) fallback.hidden = false;
  });
  if (options.initialType !== null) select(options.initialType || "TRUCK");
  resize();
  window.addEventListener("pagehide", () => {
    disposed = true;
    cancelAnimationFrame(requestId);
    intersectionObserver.disconnect();
    resizeObserver.disconnect();
    controls.dispose();
    if (current) disposeModel(current);
    floor.geometry.dispose();
    floor.material.dispose();
    scene.environment.dispose();
    environment.dispose();
    renderer.dispose();
  }, { once: true });
  return { select, clear };
}

export { mount };
