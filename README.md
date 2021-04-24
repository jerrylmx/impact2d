## About The Project

This is a light wight 2d physics engine for web development. Gives reasonable physics simulation for 2d convex geometries.

[Demo](https://collide2d.web.app)

### Download

npm i impact2d

### Usage

Very simple to use and configure.

Copy library code main.js from ./dist folder

```js
 const {Engine, Shapes} = Impact2d
 const {Circle, RegPoly} = Shapes;
 
 // Create a world 2000 pixels * 2000 pixels
 let world = new Engine({scale: 2000, delta: 0.02});
 world.setGravity = 1;
 
 // Circle
 let body1 = new Circle({
  id: 'body1',
  x: 100,
  y: 100,
  r: 30,
  m: 100
 });
 
 // Regular polygon with 6 faces
 let body2 = new RegPoly({
  id: 'body2',
  x: 400,
  y: 100,
  r: 30,
  sides: 6,
  m: 50
 });
 world.addEntity(body1);
 world.addEntity(body2);
 
 // Run the simulation
 const tick = () => {
   world.tick();
   requestAnimationFrame(tick)
 }
 requestAnimationFrame(tick)
```

### Highlighes

- Maintained a Quadtree for storing spacial data for efficient search and thus good performance.
- Built-in renders for fast drawing on the canvas.


### Details & Observations
https://jerrylmx.github.io/jliu/views/impact.html
