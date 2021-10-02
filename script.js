var canvas = document.getElementById("canvas");
var width, height;

var viewAngle = 50,
  aspect = width / height,
  near = 0.01,
  far = 999;

var renderer = new THREE.WebGLRenderer({
  antialias: false ,
  alpha: true
});

var camera = new THREE.PerspectiveCamera(viewAngle, aspect, near, far);

var scene = new THREE.Scene();

var material = new THREE.MeshBasicMaterial({
  color: 0x000000 ,
  side: THREE.FrontSide,
  transparent: false,
  opacity: 1,
});

var sideLength, a, b, c, d, e, f, g, h, cords, lineWidth;

sideLength = 50;
lineWidth = 2;

a = 0.0;
b = 1.0;
c = 2.0;
d = (1.0 + Math.sqrt(5.0)) / 2.0;
e = 3.0 * d;
f = 1.0 + 2.0 * d;
g = 2.0 + d;
h = 2.0 * d;

a *= sideLength;
b *= sideLength;
c *= sideLength;
d *= sideLength;
e *= sideLength;
f *= sideLength;
g *= sideLength;
h *= sideLength;

var cords = [
  [+a, +b, +e],
  [+a, +b, -e],
  [+a, -b, +e],
  [+a, -b, -e],

  [+b, +e, +a],
  [+b, -e, +a],
  [-b, +e, +a],
  [-b, -e, +a],

  [+e, +a, +b],
  [-e, +a, +b],
  [+e, +a, -b],
  [-e, +a, -b],

  [+c, +f, +d],
  [+c, +f, -d],
  [+c, -f, +d],
  [-c, +f, +d],
  [+c, -f, -d],
  [-c, +f, -d],
  [-c, -f, +d],
  [-c, -f, -d],

  [+f, +d, +c],
  [+f, -d, +c],
  [-f, +d, +c],
  [+f, +d, -c],
  [-f, -d, +c],
  [+f, -d, -c],
  [-f, +d, -c],
  [-f, -d, -c],
  [+d, +c, +f],
  [-d, +c, +f],
  [+d, +c, -f],
  [+d, -c, +f],
  [-d, +c, -f],
  [-d, -c, +f],
  [+d, -c, -f],
  [-d, -c, -f],

  [+b, +g, +h],
  [+b, +g, -h],
  [+b, -g, +h],
  [-b, +g, +h],
  [+b, -g, -h],
  [-b, +g, -h],
  [-b, -g, +h],
  [-b, -g, -h],

  [+g, +h, +b],
  [+g, -h, +b],
  [-g, +h, +b],
  [+g, +h, -b],
  [-g, -h, +b],
  [+g, -h, -b],
  [-g, +h, -b],
  [-g, -h, -b],

  [+h, +b, +g],
  [-h, +b, +g],
  [+h, +b, -g],
  [+h, -b, +g],
  [-h, +b, -g],
  [-h, -b, +g],
  [+h, -b, -g],
  [-h, -b, -g]
];

var football = new THREE.Object3D();
var footballEdge;

var p0 = new THREE.Vector3(0, 0, 0);
var radius = new THREE.Vector3(
  cords[0][0],
  cords[0][1],
  cords[0][2]
).distanceTo(p0);

footballEdge = new THREE.Object3D();
footballEdge.position.z = radius / 7;

footballEdge.add(
  new THREE.Mesh(
    new THREE.TorusBufferGeometry(radius, lineWidth, 8, 128),
    material
  )
);

for (var i = 0; i < cords.length; ++i) {
  for (var j = 0; j < cords.length; ++j) {
    if (i === j) continue;

    var p1, p2, p3, distance, mid;
    
    p1 = new THREE.Vector3(cords[i][0], cords[i][1], cords[i][2]),
    p2 = new THREE.Vector3(cords[j][0], cords[j][1], cords[j][2]);

    distance = p1.distanceTo(p2);

    if (Math.round(distance) > c) continue;

    mid = new THREE.Vector3(
      (cords[i][0] + cords[j][0]) / 2,
      (cords[i][1] + cords[j][1]) / 2,
      (cords[i][2] + cords[j][2]) / 2
    );

    var scale = p1.distanceTo(p0) / mid.distanceTo(p0);
    p3 = new THREE.Vector3(
      mid.x * scale * scale,
      mid.y * scale * scale,
      mid.z * scale * scale
    );

    var curve = new THREE.QuadraticBezierCurve3(p1, p3, p2);

    var tubeGeom = new THREE.TubeGeometry(curve, 8, lineWidth, 4, false);

    football.add(new THREE.Mesh(tubeGeom, material));
  }
}

var facesCords = [
  [0, 28, 36, 39, 29],
  [1, 32, 41, 37, 30],
  [2, 33, 42, 38, 31],
  [3, 34, 40, 43, 35],
  [4, 12, 44, 47, 13],
  [5, 16, 49, 45, 14],
  [6, 17, 50, 46, 15],
  [7, 18, 48, 51, 19],
  [8, 20, 52, 55, 21],
  [9, 24, 57, 53, 22],
  [10, 25, 58, 54, 23],
  [11, 26, 56, 59, 27],

];

var indicesOfFaces = [];

for (var i = 0; i < facesCords.length; ++i) {
  var faceCord = facesCords[i];
  for (var j = 0; j < faceCord.length - 2; ++j) {
    indicesOfFaces.push(faceCord[0]);
    indicesOfFaces.push(faceCord[j + 1]);
    indicesOfFaces.push(faceCord[j + 2]);
  }
}

var facesGeom = new THREE.PolyhedronBufferGeometry(
  _.flattenDeep(cords),
  indicesOfFaces,
  radius,
  2
);

football.add(new THREE.Mesh(facesGeom, material));

scene.add(footballEdge);
scene.add(football);


function update() {
  football.rotation.x += 1 / 50;
  football.rotation.y += 1 / 100;
  //football.rotation.z += 1 / 50;
}

//football.makeScale(new THREE.Matrix4(facesCords));

function scale(){

  football.scale.x += 1 / 50;
  football.scale.y += 1 / 100;
}

function resize() {
  width = canvas.clientWidth;
  height = canvas.clientHeight;
  renderer.setSize(width, height);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
}

function render() {
  requestAnimationFrame(render);
  renderer.render(scene, camera);
  
  update();
  //scale();
}

function init() {
  scene.fog = new THREE.Fog(0x79a852, 800, 1300);

  camera.position.z = 1000;
  renderer.setClearColor(0xFFFFFF, 0.0);
  renderer.autoClear = true;
  renderer.setPixelRatio(window.devicePixelRatio ? window.devicePixelRatio : 2);
  canvas.append(renderer.domElement);
  
  window.addEventListener("resize", _.debounce(resize, 50));
  render();
  resize();
}

window.addEventListener("load", init);