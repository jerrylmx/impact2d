const {Engine, Shapes, Util, ForceField} = Impact2d;
const {Circle, Polygon, Rect, Hexagon, RegPoly} = Shapes;

const app = new PIXI.Application({
  width: 1000, height: 700, transparent: true, antialias: true,
});
document.getElementById('scene-container').appendChild(app.view)

let container = new PIXI.Container()
app.stage.addChild(container);

function makeParticleGraphic(e) {
  let randomColor = '0x'+Math.floor(Math.random()*16777215).toString(16);
  let graphic = new PIXI.Graphics()
  if (e.type === 'C') {
    e.static? graphic.lineStyle(e.color || randomColor, 1):graphic.beginFill(e.color || randomColor, 1);
    graphic.drawCircle(0, 0, e.r);
  } else {
    let pixiPts = e.vertices.map(pt => new PIXI.Point(pt.x, pt.y));
    e.static? graphic.lineStyle(2, e.color || randomColor, 1):graphic.beginFill(e.color || randomColor, 1);
    graphic.drawPolygon(pixiPts);
  }
  graphic.endFill();
  graphic.lineStyle(1, 0xFFFFFF, 1);
  graphic.moveTo(0, -3);
  graphic.lineTo(0, 3);
  graphic.moveTo(-3, 0);
  graphic.lineTo(3, 0);
  return graphic;
}

let sprites = {};
let onAdd = function(e) {
  let graphic = makeParticleGraphic(e);
  sprites[e.id] = graphic;
  container.addChild(graphic);
}
let onRemove = function(e) {
  container.removeChild(sprites[e.id]);
  delete sprites[e.id];
}
let postTick = function(e) {
  if (sprites[e.id]) {
    sprites[e.id].x = e.x;
    sprites[e.id].y = e.y;
    sprites[e.id].rotation = e.orientation;
  }
}


let e = new Engine({
  ctx: null,
  scale: 2000,
  delta: 0.2,
  onAdd: onAdd,
  onRemove: onRemove,
  postTick: postTick
});
let current = "1";
let interval = null;
let paused = false;
let ontoggle = () => {}
let mousePos = {x: 0, y: 0};
let intervals = [];
let showRender = true;


document.addEventListener("keydown", function(event) {
  if (event.which === 32) {
    event.preventDefault();
    ontoggle();
  }
})

$('#tick').on('click', () => {
  e.tick();
});

$('#refresh').on('click', () => {
  loadScene(current);
});

$('#pause').on('click', () => {
  paused = !paused;
});

$('#bomb').on('click', () => {
  let field1 = new ForceField({
    id: 'bomb',
    x: 500,
    y: 300,
    fn: function(e) {
      const G =  0.00066;
      const M = 10000000;
      const dist = Util.distSq(this, e);
      let forceMag = G * M * e.m/dist;
      let forceDir = Util.normalize(Util.vSub(this, e));
      e.v.x -= forceDir.x*forceMag/e.m;
      e.v.y -= forceDir.y*forceMag/e.m;
    }
  });
  e.addForceField(field1);
  setTimeout(() => {
    e.removeForceField('bomb');
  }, 400)
});

$('#add').on('click', () => {
  let sides = Math.floor(Math.random() * 9);
  let x = Math.random() * 800 + 100;
  let y = Math.random() * 400 + 100;
  let geom;
  let randomColor = '0x'+Math.floor(Math.random()*16777215).toString(16);
  if (sides < 3) {
    geom = new Circle({
      id: Math.random() * 10000,
      x: x,
      y: y,
      r: 15,
      m: 10,
      v: {x:0,y:0},
      color: randomColor
    })
  } else {
    geom = new RegPoly({
      id: Math.random() * 10000,
      x: x,
      y: y,
      r: 15,
      sides: sides,
      m: 10,
      v: {x:0,y:0},
      color: randomColor
    });
  }
  e.addEntity(geom);
});


$('#demo').on('input', function() {
  clearInterval(interval);
  loadScene(this.value);
  current = this.value;
});

$('#gravity').on('input', function() {
  e.setGravity(Number(this.value));
  $('#g').html(e.g >= 0? '+'+e.g.toFixed(2) : e.g.toFixed(2));
});

$('#delta').on('input', function() {
  e.delta = Number(this.value);
  $('#d').html(e.delta);
});

$('#debug').on('change', function() {
  e.debug = $(this).is(":checked");
});
$('#render').on('change', function() {
  showRender = $(this).is(":checked");
});

$('#refresh').on('click', function() {
  clearInterval(interval);
  loadScene(current);
});

// Walls
e.addEntity(new Rect({restitution: 0.9, eternal: true, static: true, id: 'bot', x: 500, y: 585, w: 999, h: 30, m: 100000, v: {x:0,y:0}}));
e.addEntity(new Rect({eternal: true, static: true, id: 'top', x: 500, y: 15, w: 999, h: 30, m: 100000, v: {x:0,y:0}}));
e.addEntity(new Rect({eternal: true, static: true, id: 'left', x: 15, y: 300, w: 30, h: 599, m: 100000, v: {x:0,y:0}}));
e.addEntity(new Rect({eternal: true, static: true, id: 'right', x: 985, y: 300, w: 30, h: 599, m: 100000, v: {x:0,y:0}}));



let request;
let fps = 'FPS:0';
let checks = 'Workload:0';
let t0 = performance.now();
const performAnimation = () => {
  if (!paused) {
    let stats = e.tick();
    checks = `Workload:${stats.workload}`;
  }
  request = requestAnimationFrame(performAnimation)
  const t1 = performance.now();
  fps = `FPS:${(1000/(t1 - t0)).toFixed(0)}`;
  t0 = t1;
}

$('#fps').html(fps);
$('#checks').html(checks);
setInterval(() => {
  $('#fps').html(fps);
  $('#checks').html(checks);
  $('#count').html('Bodies: ' + Object.keys(e.entities).length);
}, 1000);
loadScene("1");

function fillScene(gap, size=20) {
  e.setGravity(2);
  e.delta = 0.02;
  // let bar = e.addEntity(new Rect({
  //   id: 'bar',
  //   static: true,
  //   w: 200,
  //   h: 15,
  //   m: 10,
  //   x: 500,
  //   y: 300,
  //   omega: 1
  // }));
  let field1 = new ForceField({
    id: 'bomb',
    x: 500,
    y: 300,
    fn: function(e) {
      const G =  0.00066;
      const M = 50000000;
      const dist = Util.distSq(this, e);
      // if (dist < 1600) return;
      let forceMag = G * M * e.m/dist;
      let forceDir = Util.normalize(Util.vSub(this, e));
      e.v.x -= forceDir.x*forceMag/e.m;
      e.v.y -= forceDir.y*forceMag/e.m;
    }
  });
  let field2 = new ForceField({
    id: 'hole',
    x: 500,
    y: 300,
    fn: function(e) {
      const G =  0.00066;
      const M = 100000000;
      const dist = Util.distSq(this, e);
      if (dist < 1600) return;
      let forceMag = G * M * e.m/dist;
      let forceDir = Util.normalize(Util.vSub(this, e));
      e.v.x += forceDir.x*forceMag/e.m;
      e.v.y += forceDir.y*forceMag/e.m;
    }
  })
  // let reverse = false;
  // intervals.push(setInterval(() => {
  //   reverse? e.addForceField(field1):e.addForceField(field2);
  //   reverse = !reverse;
  //   setTimeout(() => {
  //     e.removeAllForceFields();
  //   })
  // }, 500))
  for (let i = 40; i < 950; i += gap) {
    for (let j = 40; j < 550; j += gap) {
      let rand = Math.random();
      let randomColor = '0x'+Math.floor(Math.random()*16777215).toString(16);
      if (rand < 0.6) {
        e.addEntity(new Circle({x: i, y: j, id: i+'-t'+j, r: size, m: 3, color: randomColor}));
      } else {
        e.addEntity(new RegPoly({
          id: i+'-'+j,
          x: i,
          y: j,
          r: size,
          sides: rand < 0.8? 4:5,
          m: 3,
          color: randomColor
        }));
      }
    }
  }
}

function bounceScene() {
  e.setGravity(5);
  e.delta = 0.02;
  e.addEntity(new Circle({x: 300, y: 100, id: 4, r: 20, m: 300, restitution: 0.2, v:{x:0,y:0}, color: "0xd95d39"}));
  e.addEntity(new Circle({x: 400, y: 100, id: 5, r: 20, m: 300, restitution: 0.4, v:{x:0,y:0}, color: "0xdc6d4c"}));
  e.addEntity(new Circle({x: 500, y: 100, id: 6, r: 20, m: 300, restitution: 0.6, v:{x:0,y:0}, color: "0xe07d60"}));
  e.addEntity(new Circle({x: 600, y: 100, id: 7, r: 20, m: 300, restitution: 0.8, v:{x:0,y:0}, color: "0xe48d74"}));
  e.addEntity(new Circle({x: 700, y: 100, id: 8, r: 20, m: 300, restitution: 0.9, v:{x:0,y:0}, color: "0xe89d88"}));
}

function decisionScene() {
  e.setGravity(6);
  e.delta = 0.02;
  let row = 0;
  e.addEntity(new Circle({x: 485, y: 100, id: Math.random(), r: 20, m: 300, restitution: 1, staticFriction: 0, dynamicFriction: 0}));
  for (let i = 120; i <= 560; i+=80) {
    let off = row%2 * 40;
    for (let j = 200; j <= 800; j+=80) {
      e.addEntity(new Circle({static: true, x: j+off, y: i, id: Math.random(), r: 15, m: 300, restitution: 0.8}));
    }
    row++;
  }
}

function poolScene() {
  e.setGravity(0);
  e.delta = 0.02;
  let whiteBall = new Circle({x: 300, y: 300, id: Math.random(), r: 20, m: 3, restitution: 1, v:{x:0,y:0}, color: "0xebe7e7"});
  e.addEntity(whiteBall);
  e.addEntity(new Circle({x: 600, y: 300, id: Math.random(), r: 20, m: 3, restitution: 1, v:{x:0,y:0}, color: "0xf2d43d"}));
  e.addEntity(new Circle({x: 635, y: 320, id: Math.random(), r: 20, m: 3, restitution: 1, v:{x:0,y:0}, color: "0x9370db"}));
  e.addEntity(new Circle({x: 635, y: 280, id: Math.random(), r: 20, m: 3, restitution: 1, v:{x:0,y:0}, color: "0xe63a56"}));
  e.addEntity(new Circle({x: 670, y: 340, id: Math.random(), r: 20, m: 3, restitution: 1, v:{x:0,y:0}, color: "0x46697e"}));
  e.addEntity(new Circle({x: 670, y: 300, id: Math.random(), r: 20, m: 3, restitution: 1, v:{x:0,y:0}, color: "0xd95d39"}));
  e.addEntity(new Circle({x: 670, y: 260, id: Math.random(), r: 20, m: 3, restitution: 1, v:{x:0,y:0}, color: "0x3a5fcd"}));
  e.addEntity(new Circle({x: 705, y: 320, id: Math.random(), r: 20, m: 3, restitution: 1, v:{x:0,y:0}, color: "0xeac8c8"}));
  e.addEntity(new Circle({x: 705, y: 280, id: Math.random(), r: 20, m: 3, restitution: 1, v:{x:0,y:0}, color: "0x65070c"}));
  e.addEntity(new Circle({x: 740, y: 300, id: Math.random(), r: 20, m: 3, restitution: 1, v:{x:0,y:0}, color: "0x5aa57d"}));

  ontoggle = () => {
    let f = Util.vSub(mousePos, {x: whiteBall.x, y: whiteBall.y});
    f = Util.vMul(Util.normalize(f), 1000);
    e.applyForce(whiteBall, f);
  }
}

function bubbleScene() {
  let count = 0;
  clearInterval(interval);
  e.setGravity(-5);
  e.delta = 0.02;
  interval = setInterval(() => {
    let pt = {x: 50, y: 0};
    let world = Util.toWorldPosition(pt, count, 200, 300);
    let w = new Circle({ttl: 300, ...world, id: count, r: 10, m: 3, v:{x:0,y:0}})
    e.addEntity(w);
    e.applyForce(w, {x: 1000, y: 0});
    count++;
  }, 300);
}

function fallScene() {
  e.setGravity(1);
  e.delta = 0.2;
  for (let i = 3; i <= 10; i++) {
    e.addEntity(new Rect({restitution:0.5, id: Math.random(), x: 80*i, y: 520, w: 10, h: 150, m: 10, v: {x:0,y:0}}));
  }
  let last = new Rect({id: Math.random(), x: 840, y: 520, w: 10, h: 150, m: 10, v: {x:0,y:0}});
  e.addEntity(last);
  last.orientation = -0.3;
}

function stackScene() {
  e.setGravity(6);
  e.delta = 0.02;
  let common = {
    staticFriction: 0.1,
    dynamicFriction: 0.1,
    restitution: 0.1,
    m: 10
  }
  let ball = new Circle({restitution: 0.99, id: 'me', r: 30, m: 100, v:{x:0,y:0}, x: 800, y: 400});
  e.addEntity(ball);
  ontoggle = () => {
    e.applyForce(ball, {x: -50000, y: 0});
  };

  let blocks = [
    new Rect({v: {x:0,y:0}, id: Math.random(), x: 240, y: 495, w: 39, h: 39, ...common}),
    new Rect({v: {x:0,y:0}, id: Math.random(), x: 280, y: 495, w: 39, h: 39, ...common}),
    new Rect({v: {x:0,y:0}, id: Math.random(), x: 320, y: 495, w: 39, h: 39, ...common}),
    new Rect({v: {x:0,y:0} ,id: Math.random(), x: 360, y: 495, w: 39, h: 39, ...common}),
    new Rect({v: {x:0,y:0} ,id: Math.random(), x: 400, y: 495, w: 39, h: 39, ...common}),
    new Rect({v: {x:0,y:0}, id: Math.random(), x: 260, y: 455, w: 39, h: 39, ...common}),
    new Rect({v: {x:0,y:0} ,id: Math.random(), x: 300, y: 455, w: 39, h: 39, ...common}),
    new Rect({v: {x:0,y:0} ,id: Math.random(), x: 340, y: 455, w: 39, h: 39, ...common}),
    new Rect({v: {x:0,y:0} ,id: Math.random(), x: 380, y: 455, w: 39, h: 39, ...common}),
    new Rect({v: {x:0,y:0} ,id: Math.random(), x: 280, y: 415, w: 39, h: 39, ...common}),
    new Rect({v: {x:0,y:0} ,id: Math.random(), x: 320, y: 415, w: 39, h: 39, ...common}),
    new Rect({v: {x:0,y:0} ,id: Math.random(), x: 360, y: 415, w: 39, h: 39, ...common}),
    new Rect({v: {x:0,y:0}, id: Math.random(), x: 300, y: 375, w: 38, h: 38, ...common}),
    new Rect({v: {x:0,y:0}, id: Math.random(), x: 340, y: 375, w: 38, h: 38, ...common}),
    new Rect({v: {x:0,y:0}, id: Math.random(), x: 320, y: 335, w: 38, h: 38, ...common})
  ];
  blocks.forEach((b) => {
    b.y += 55;
    e.addEntity(b);
    // Sleep.sleep(b);
  });
}

function bottleScene() {
  e.setGravity(4);
  e.delta = 0.02;
  let vertices1 = [
    {x:-20,y:0},
    {x:-10,y:-30},
    {x:10,y:-30},
    {x:20,y:0},
    {x:20,y:100},
    {x:-20,y:100}
  ];
  vertices1 = vertices1.map((v) => {return {x: v.x*2/3+250, y: v.y*2/3+295};});
  let bottle1 = new Polygon({
    restitution:0.5,
    id: 'b1',
    vertices: vertices1,
    m: 10,
    v: {x:0,y:0},
    color: '0x3ae6ca'}
  );
  e.addEntity(new Rect({static: true, id: 'table1', x: 200, y: 470, w: 10, h: 200, m: 100000, v: {x:0,y:0}}));
  e.addEntity(new Rect({static: true, id: 'table2', x: 400, y: 470, w: 10, h: 200, m: 100000, v: {x:0,y:0}}));
  e.addEntity(new Rect({static: true, id: 'table3', x: 300, y: 365, w: 300, h: 10, m: 100000, v: {x:0,y:0}}));
  e.addEntity(bottle1);

  ontoggle = () => {
    e.applyForceAtPoint(bottle1, {x: 0, y: -3000}, {x: 30, y: -50});
    started = true;
  }
}

function hillScene() {
  e.setGravity(4);
  e.delta = 0.02;

  let w1 = new Rect({static: true, restitution:0.5, id: Math.random(), x: 800, y: 300, w: 100, h: 20, m: 10, v: {x:0,y:0}});
  let w2 = new Rect({static: true, restitution:0.5, id: Math.random(), x: 750, y: 250, w: 20, h: 100, m: 10, v: {x:0,y:0}});
  let w3 = new Rect({static: true, restitution:0.5, id: Math.random(), x: 850, y: 250, w: 20, h: 100, m: 10, v: {x:0,y:0}});

  let w4 = new Rect({static: true, restitution:0.5, id: Math.random(), x: 700, y: 500, w: 100, h: 20, m: 10, v: {x:0,y:0}});
  let w5 = new Rect({static: true, restitution:0.5, id: Math.random(), x: 650, y: 450, w: 20, h: 100, m: 10, v: {x:0,y:0}});
  let w6 = new Rect({static: true, restitution:0.5, id: Math.random(), x: 750, y: 450, w: 20, h: 100, m: 10, v: {x:0,y:0}});
  e.addEntity(w1);
  e.addEntity(w2);
  e.addEntity(w3);
  e.addEntity(w4);
  e.addEntity(w5);
  e.addEntity(w6);
  ontoggle = () => {
    let bullet = new Circle({restitution:0.5, id: Math.random(), x: 100, y: 450, r: 20, m: 10, v: {x:0,y:0}});
    e.addEntity(bullet);
    let f = Util.vSub(mousePos, {x: bullet.x, y: bullet.y});
    f = Util.vMul(Util.normalize(f), 5000);
    e.applyForce(bullet, f);
  }
}

function blackholeScene() {
  let field1 = new ForceField({
    id: 'hole',
    x: 500,
    y: 300,
    fn: function(e) {
      // const G =  0.000000000066;
      const G =  0.00066;
      const M = 100000000;
      const dist = Util.distSq(this, e);
      if (dist < 1600) return;
      let forceMag = G * M * e.m/dist;
      let forceDir = Util.normalize(Util.vSub(this, e));
      e.v.x += forceDir.x*forceMag/e.m;
      e.v.y += forceDir.y*forceMag/e.m;
    }
  })
  e.addForceField(field1);
  e.setGravity(0);
  e.delta = 0.02;
  e.addEntity(new Circle({
    id: 'hole',
    x: 500,
    y: 300,
    r: 30,
    m: 100000000,
    v: {x:0,y:0},
    static: true,
    color: '#000000'
  }))
  let spawnBody = function(x, y) {
    let randomColor = '0x'+Math.floor(Math.random()*16777215).toString(16);
    let id = Math.random() * 100000;
    let sides = Math.ceil(Math.random()*10);
    let poly;
    if (sides < 3) {
      poly = new Circle({
        id: id,
        x: x,
        y: y,
        r: 12,
        m: 100,
        v: {x:0,y:0},
        color: randomColor
      })
    } else {
      poly = new RegPoly({
        id: id,
        x: x,
        y: y,
        r: 12,
        sides: sides,
        m: 100,
        v: {x:0,y:0},
        color: randomColor
      });
    }
    return poly;
  }
  let count = 0;
  let interval = setInterval(() => {
    if (count >= 15) clearInterval(interval);
    let obj = spawnBody(600, 150);
    e.addEntity(obj);
    e.applyForce(obj, {x: -10000, y: 200});
    count++;
  }, 1000);

  ontoggle = () => {
    let obj = spawnBody(800, 150);
    e.addEntity(obj);
    e.applyForce(obj, {x: 0, y: 8000});
  }

  intervals.push(interval);
}

function loadScene(id) {
  ontoggle = () => {};
  e.removeAll();
  intervals.forEach(i => clearInterval(i));
  switch (id) {
    case "1":
      fillScene(160);
      break;
    case "2":
      fillScene(120);
      break;
    case "3":
      fillScene(80);
      break;
    case "a1":
      fillScene(45);
      e.setGravity(0);
      break;
    case "a2":
      fillScene(40, 17);
      e.setGravity(0);
      break;
    case "a3":
      fillScene(35, 15);
      e.setGravity(0);
      break;
    case "a4":
      fillScene(30, 12);
      e.setGravity(0);
      break;
    case "a5":
      fillScene(25, 10);
      e.setGravity(0);
      break;
    case "a6":
      fillScene(19, 8);
      e.setGravity(0);
      break;
    case "a7":
      fillScene(13, 5);
      e.setGravity(0);
      break;
    case "6":
      bottleScene();
      break;
    case "7":
      bounceScene();
      break;
    case "8":
      blackholeScene();
      break;
    case "9":
      poolScene();
      break;
    case "10":
      bubbleScene();
    case "11":
      stackScene();
      break;
    default:
      break;
  }
  $("#gravity").val(e.g);
  $('#g').html(e.g >= 0? '+'+e.g.toFixed(2) : e.g.toFixed(2));
  $("#delta").val(e.delta);
  $('#d').html(e.delta);
}

requestAnimationFrame(performAnimation);

// Futuristic select
/*
Reference: http://jsfiddle.net/BB3JK/47/
*/
var x, i, j, l, ll, selElmnt, a, b, c;
/*look for any elements with the class "custom-select":*/
x = document.getElementsByClassName("custom-select");
l = x.length;
for (i = 0; i < l; i++) {
  selElmnt = x[i].getElementsByTagName("select")[0];
  ll = selElmnt.length;
  /*for each element, create a new DIV that will act as the selected item:*/
  a = document.createElement("DIV");
  a.setAttribute("class", "select-selected");
  a.innerHTML = selElmnt.options[selElmnt.selectedIndex].innerHTML;
  x[i].appendChild(a);
  /*for each element, create a new DIV that will contain the option list:*/
  b = document.createElement("DIV");
  b.setAttribute("class", "select-items select-hide");
  for (j = 1; j < ll; j++) {
    /*for each option in the original select element,
    create a new DIV that will act as an option item:*/
    c = document.createElement("DIV");
    c.innerHTML = selElmnt.options[j].innerHTML;
    c.addEventListener("click", function(e) {
        /*when an item is clicked, update the original select box,
        and the selected item:*/
        var y, i, k, s, h, sl, yl;
        s = this.parentNode.parentNode.getElementsByTagName("select")[0];
        sl = s.length;
        h = this.parentNode.previousSibling;
        for (i = 0; i < sl; i++) {
          if (s.options[i].innerHTML == this.innerHTML) {
            s.selectedIndex = i;
            h.innerHTML = this.innerHTML;
            y = this.parentNode.getElementsByClassName("same-as-selected");
            yl = y.length;
            for (k = 0; k < yl; k++) {
              y[k].removeAttribute("class");
            }
            this.setAttribute("class", "same-as-selected");
            clearInterval(interval);
            loadScene(s.options[i].value);
            current = s.options[i].value;
            break;
          }
        }
        h.click();
    });
    b.appendChild(c);
  }
  x[i].appendChild(b);
  a.addEventListener("click", function(e) {
      /*when the select box is clicked, close any other select boxes,
      and open/close the current select box:*/
      e.stopPropagation();
      closeAllSelect(this);
      this.nextSibling.classList.toggle("select-hide");
      this.classList.toggle("select-arrow-active");
    });
}
function closeAllSelect(elmnt) {
  /*a function that will close all select boxes in the document,
  except the current select box:*/
  var x, y, i, xl, yl, arrNo = [];
  x = document.getElementsByClassName("select-items");
  y = document.getElementsByClassName("select-selected");
  xl = x.length;
  yl = y.length;
  for (i = 0; i < yl; i++) {
    if (elmnt == y[i]) {
      arrNo.push(i)
    } else {
      y[i].classList.remove("select-arrow-active");
    }
  }
  for (i = 0; i < xl; i++) {
    if (arrNo.indexOf(i)) {
      x[i].classList.add("select-hide");
    }
  }
}
/*if the user clicks anywhere outside the select box,
then close all select boxes:*/
document.addEventListener("click", closeAllSelect);


