import * as THREE from "three";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";

// Details are attached to one CC0 tractor/trailer mesh, never spliced from another vehicle.
// Coordinates follow the source model: +Z is the front of the tractor, +Y is up.
export function detailTractomula(root) {
  const paint = new THREE.MeshPhysicalMaterial({ color: 0x075f9b, metalness: .36, roughness: .29, clearcoat: .58, clearcoatRoughness: .16 });
  const bright = new THREE.MeshStandardMaterial({ color: 0xe8ecef, metalness: .22, roughness: .45 });
  const rubber = new THREE.MeshStandardMaterial({ color: 0x17202a, roughness: .86 });
  const dark = new THREE.MeshStandardMaterial({ color: 0x20313c, metalness: .18, roughness: .53 });
  const steel = new THREE.MeshStandardMaterial({ color: 0x7d8b98, metalness: .78, roughness: .31 });
  const chrome = new THREE.MeshStandardMaterial({ color: 0xd5dce3, metalness: .91, roughness: .17 });
  const amber = new THREE.MeshStandardMaterial({ color: 0xe99b28, roughness: .26, emissive: 0x5a2700, emissiveIntensity: .14 });
  const red = new THREE.MeshStandardMaterial({ color: 0xae292b, roughness: .27, emissive: 0x330500, emissiveIntensity: .14 });
  const white = new THREE.MeshStandardMaterial({ color: 0xf6f8f7, roughness: .24, emissive: 0x202a2c, emissiveIntensity: .13 });
  const detail = new THREE.Group();
  detail.name = "Detalles de tractomula";
  root.add(detail);
  const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);

  root.traverse(node => {
    if (!node.isMesh) return;
    if (node.name === "Tractor_sleeper_cab" || node.name === "Windshield" || node.name.startsWith("Cab_window")) node.visible = false;
    else if (node.name === "Box_trailer" || node.name.startsWith("Rear_door")) node.material = bright;
    else if (node.name.startsWith("Tractor_wheel_tire") || node.name.startsWith("Trailer_wheel_tire")) node.material = rubber;
    else if (node.name.startsWith("Headlamp")) node.material = white;
    else if (node.name.startsWith("Amber_side_marker")) node.material = amber;
    else if (node.name.startsWith("Rear_lamp")) node.material = red;
    else if (node.name.startsWith("Grille_horizontal") || node.name.startsWith("Mirror")) node.material = chrome;
    else if (node.name === "Front_grille") node.material = dark;
  });

  const box = (name, pos, size, material, radius = 0) => {
    const geometry = radius ? new RoundedBoxGeometry(size[0], size[1], size[2], 3, radius) : cubeGeometry;
    const mesh = new THREE.Mesh(geometry, material);
    mesh.name = name;
    mesh.position.set(...pos);
    if (!radius) mesh.scale.set(...size);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    detail.add(mesh);
    return mesh;
  };
  const rod = (name, start, end, radius, material, sides = 8) => {
    const a = new THREE.Vector3(...start), b = new THREE.Vector3(...end);
    const mesh = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, a.distanceTo(b), sides), material);
    mesh.name = name;
    mesh.position.copy(a).add(b).multiplyScalar(.5);
    mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), b.sub(a).normalize());
    mesh.castShadow = true;
    detail.add(mesh);
    return mesh;
  };

  // Author a continuous cab shell instead of decorating the source's cuboid cab.
  // Each rounded X/Z section varies in width and nose depth: curved shoulders,
  // raked windshield and a roof that narrows towards the top.
  const sections = [
    [.62, 1.10, 7.43, 4.99, .16],
    [1.08, 1.23, 7.55, 4.96, .17],
    [1.82, 1.25, 7.59, 4.95, .18],
    [2.14, 1.23, 7.58, 4.95, .19],
    [2.98, 1.11, 7.38, 4.99, .19],
    [3.23, 1.05, 7.24, 5.05, .19],
  ];
  const sectionPoints = ([y, width, front, back, radius]) => {
    const corners = [
      [width - radius, front - radius, 0],
      [-width + radius, front - radius, Math.PI / 2],
      [-width + radius, back + radius, Math.PI],
      [width - radius, back + radius, Math.PI * 1.5],
    ];
    return corners.flatMap(([cx, cz, start]) => Array.from({ length: 5 }, (_, i) => {
      const angle = start + i * Math.PI / 8;
      return [cx + Math.cos(angle) * radius, y, cz + Math.sin(angle) * radius];
    }));
  };
  const rings = sections.map(sectionPoints);
  const positions = rings.flat(2);
  const indices = [];
  const ringLength = rings[0].length;
  for (let level = 0; level < rings.length - 1; level++) for (let i = 0; i < ringLength; i++) {
    const next = (i + 1) % ringLength;
    const a = level * ringLength + i, b = level * ringLength + next;
    const c = (level + 1) * ringLength + i, d = (level + 1) * ringLength + next;
    indices.push(a, c, b, b, c, d);
  }
  const roofCenter = positions.length / 3;
  positions.push(0, 3.23, 6.14);
  const roofRing = (rings.length - 1) * ringLength;
  for (let i = 0; i < ringLength; i++) indices.push(roofCenter, roofRing + (i + 1) % ringLength, roofRing + i);
  const shellGeometry = new THREE.BufferGeometry();
  shellGeometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  shellGeometry.setIndex(indices);
  shellGeometry.computeVertexNormals();
  const shell = new THREE.Mesh(shellGeometry, paint);
  shell.name = "Cabina · carrocería continua";
  shell.castShadow = shell.receiveShadow = true;
  detail.add(shell);

  const paneMaterial = new THREE.MeshPhysicalMaterial({ color: 0x16394c, metalness: .18, roughness: .12, clearcoat: 1, clearcoatRoughness: .07, side: THREE.DoubleSide });
  const pane = (name, corners) => {
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.Float32BufferAttribute(corners.flat(), 3));
    geometry.setIndex([0, 1, 2, 0, 2, 3]);
    geometry.computeVertexNormals();
    const mesh = new THREE.Mesh(geometry, paneMaterial);
    mesh.name = name;
    detail.add(mesh);
  };
  for (const side of [-1, 1]) {
    pane("Cabina · parabrisas", [
      [side * .025, 2.20, 7.586], [side * 1.045, 2.20, 7.586],
      [side * .95, 2.94, 7.410], [side * .025, 2.94, 7.410],
    ]);
    pane("Cabina · cristal lateral", [
      [side * 1.237, 2.26, 6.16], [side * 1.237, 2.26, 7.23],
      [side * 1.142, 2.91, 7.08], [side * 1.142, 2.91, 6.24],
    ]);
  }
  // Sloped roof fairing lifts towards the trailer rather than sitting as a slab.
  const fairingGeometry = new THREE.BufferGeometry();
  const fairingProfile = [
    [7.03, 3.235, .98], [6.62, 3.25, 1.00], [6.22, 3.34, 1.03],
    [5.75, 3.47, 1.08], [5.17, 3.55, 1.09],
  ];
  const fairingVertices = fairingProfile.flatMap(([z, y, w]) => [-w, y, z, w, y, z, -w, 3.22, z, w, 3.22, z]);
  const fairingIndices = [];
  for (let i = 0; i < fairingProfile.length - 1; i++) {
    const a = i * 4, b = a + 4;
    fairingIndices.push(a, a + 1, b, a + 1, b + 1, b);
    fairingIndices.push(a, b, a + 2, b, b + 2, a + 2);
    fairingIndices.push(a + 1, a + 3, b + 1, b + 1, a + 3, b + 3);
  }
  fairingGeometry.setAttribute("position", new THREE.Float32BufferAttribute(fairingVertices, 3));
  fairingGeometry.setIndex(fairingIndices);
  fairingGeometry.computeVertexNormals();
  const fairing = new THREE.Mesh(fairingGeometry, paint);
  fairing.name = "Cabina · deflector aerodinámico";
  fairing.castShadow = true;
  detail.add(fairing);
  box("Cabina · borde de visera", [0, 3.22, 7.20], [2.10, .035, .12], dark, .012);
  box("Cabina · máscara frontal", [0, 1.80, 7.615], [2.20, .24, .055], paint, .025);
  box("Cabina · rejilla inferior", [0, 1.015, 7.70], [1.78, .18, .08], dark, .018);
  for (let x of [-1, 1]) {
    box("Cabina · carenado lateral", [x * 1.235, 1.06, 5.72], [.055, .63, 1.33], paint, .018);
    rod("Cabina · división de puerta", [x * 1.251, 1.20, 6.04], [x * 1.251, 2.20, 6.04], .007, dark);
    box("Cabina · manija", [x * 1.263, 1.89, 6.03], [.032, .046, .18], chrome, .009);
    box("Cabina · escalón antideslizante", [x * 1.252, .76, 6.45], [.24, .055, .66], dark, .012);
    box("Cabina · guarnición inferior", [x * 1.272, 1.29, 6.42], [.023, .06, 1.75], chrome, .01);
    box("Cabina · intermitente lateral", [x * 1.292, 1.62, 7.18], [.026, .09, .17], amber, .012);
    rod("Cabina · marco lateral parabrisas", [x * 1.06, 2.18, 7.60], [x * .97, 2.96, 7.41], .021, rubber);
    rod("Cabina · brazo limpiaparabrisas", [x * .12, 2.20, 7.61], [x * .88, 2.33, 7.59], .012, dark);
    rod("Cabina · pluma limpiaparabrisas", [x * .47, 2.33, 7.59], [x * 1.00, 2.40, 7.57], .017, rubber);
    box("Cabina · faro diurno", [x * .94, 1.23, 7.681], [.28, .035, .032], white, .012);
    box("Cabina · faro auxiliar", [x * .95, .84, 7.77], [.25, .095, .045], white, .016);
    box("Cabina · deflector trasero", [x * 1.26, 2.66, 5.19], [.085, .66, .35], paint, .02);
    box("Chasis · caja de herramientas", [x * 1.025, .87, 1.14], [.36, .54, 1.33], steel, .055);
    box("Chasis · tapa caja", [x * 1.225, .88, 1.14], [.03, .41, 1.04], dark, .01);
    box("Chasis · protección depósito", [x * 1.27, .73, 4.30], [.06, .39, 1.11], chrome, .018);
    for (let j = 0; j < 4; j++) box("Chasis · banda depósito", [x * 1.29, .73, 3.86 + j * .29], [.024, .43, .026], dark);
    rod("Cabina · antena", [x * 1.06, 3.19, 6.14], [x * 1.08, 3.56, 6.03], .009, dark);
  }
  rod("Cabina · división parabrisas", [0, 2.20, 7.60], [0, 2.94, 7.42], .018, rubber);
  rod("Cabina · borde superior parabrisas", [-.96, 2.95, 7.42], [.96, 2.95, 7.42], .017, rubber);
  rod("Cabina · borde inferior parabrisas", [-1.05, 2.19, 7.60], [1.05, 2.19, 7.60], .017, rubber);
  box("Cabina · franja paragolpes", [0, .89, 7.762], [2.40, .043, .032], chrome, .014);
  box("Cabina · placa neutra", [0, .76, 7.763], [.42, .10, .022], dark, .008);

  // Tractor frame: axle equipment, fifth-wheel coupling, electrical and air lines.
  for (let x of [-.62, .62]) {
    box("Chasis · larguero", [x, .92, 3.40], [.18, .23, 3.30], dark, .025);
    box("Chasis · faldón", [x * 1.79, 1.10, 3.15], [.10, .32, 1.28], paint, .025);
    rod("Chasis · soporte deflector", [x, 1.14, 2.53], [x * 1.4, 1.01, 1.64], .027, steel);
  }
  for (let z of [2.23, 3.22, 4.22]) box("Chasis · travesaño", [0, .91, z], [1.42, .16, .11], steel, .01);
  box("Quinta rueda · placa", [0, 1.095, 2.60], [1.18, .08, 1.04], dark, .07);
  const coil = (offset, material) => {
    const points = [];
    for (let i = 0; i <= 70; i++) {
      const t = i / 70, a = t * Math.PI * 9;
      points.push(new THREE.Vector3(offset + Math.cos(a) * .10, 1.56 + Math.sin(a) * .10, 4.75 - t * .78));
    }
    const mesh = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points), 120, .015, 5, false), material);
    mesh.name = "Acople · línea flexible";
    detail.add(mesh);
  };
  coil(-.14, dark);
  coil(.13, red);

  // Trailer remains a single white refrigerated-style box: fine ribs, edges, doors and underrun protection.
  box("Semirremolque · perfil superior", [0, 3.985, -2.18], [2.53, .035, 13.61], bright, .008);
  for (let x of [-1, 1]) {
    box("Semirremolque · borde longitudinal", [x * 1.267, 3.82, -2.18], [.058, .10, 13.62], steel, .012);
    box("Semirremolque · zócalo", [x * 1.271, 1.39, -2.18], [.042, .13, 13.55], steel, .009);
    box("Semirremolque · protección lateral", [x * 1.21, .94, -2.43], [.12, .11, 8.80], dark, .018);
    box("Semirremolque · línea azul", [x * 1.275, 2.00, -2.18], [.013, .10, 13.47], paint);
    for (let z = -8.65; z < 4.45; z += .57) {
      box("Semirremolque · nervio vertical", [x * 1.273, 2.62, z], [.018, 2.52, .025], bright, .006);
    }
    for (let z = -8.50; z <= 3.90; z += 2.05) {
      box("Semirremolque · baliza lateral", [x * 1.292, 1.50, z], [.03, .08, .18], amber, .009);
      box("Semirremolque · reflector lateral", [x * 1.291, .95, z], [.025, .06, .22], white, .008);
    }
    box("Semirremolque · defensa trasera", [x * .89, .66, -9.07], [.19, .16, .12], dark, .015);
  }
  for (let x of [-1, 1]) {
    box("Puerta trasera · bisagra superior", [x * 1.10, 3.31, -9.043], [.17, .10, .06], steel, .008);
    box("Puerta trasera · bisagra media", [x * 1.10, 2.65, -9.043], [.17, .10, .06], steel, .008);
    box("Puerta trasera · bisagra inferior", [x * 1.10, 1.86, -9.043], [.17, .10, .06], steel, .008);
    rod("Puerta trasera · barra de cierre", [x * .58, 1.42, -9.055], [x * .58, 3.76, -9.055], .027, chrome);
    box("Puerta trasera · manija", [x * .58, 2.27, -9.09], [.31, .10, .06], chrome, .018);
    box("Puerta trasera · luz inferior", [x * 1.07, 1.20, -9.074], [.18, .12, .04], red, .01);
  }
  box("Puerta trasera · sello central", [0, 2.56, -9.045], [.046, 2.61, .022], rubber);
  box("Puerta trasera · protección baja", [0, .71, -9.09], [2.36, .13, .15], chrome, .014);

  // Inset hardware on all six axles, intentionally subtle at overview scale.
  const wheelStations = [7.10, 3.40, 2.15, -5.80, -7.00, -8.20];
  const boltGeom = new THREE.CylinderGeometry(.023, .023, .016, 8);
  boltGeom.rotateZ(Math.PI / 2);
  const bolts = new THREE.InstancedMesh(boltGeom, steel, wheelStations.length * 2 * 8);
  bolts.name = "Ruedas · pernos";
  const temp = new THREE.Object3D();
  let boltIndex = 0;
  for (const z of wheelStations) for (const side of [-1, 1]) {
    const x = side * (z < 0 ? 1.294 : 1.284);
    for (let i = 0; i < 8; i++) {
      const a = i * Math.PI / 4;
      temp.position.set(x, .51 + Math.sin(a) * .175, z + Math.cos(a) * .175);
      temp.rotation.z = side < 0 ? 0 : Math.PI;
      temp.updateMatrix();
      bolts.setMatrixAt(boltIndex++, temp.matrix);
    }
    rod("Ruedas · válvula", [x, .51, z + .25], [x + side * .03, .59, z + .29], .008, dark);
  }
  bolts.instanceMatrix.needsUpdate = true;
  detail.add(bolts);
  return root;
}
