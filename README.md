# canvas-sequence
Small library that plays image sequences on scroll.

Written in ES6, compiled with Babeljs for browser support. Compatible AMD, CommonJS and plain JS.

# Install
```
npm install
gulp
```

Use `gulp` to automatically recompile when you make changes.

Alternatively, you can use `gulp compile` to recompile only when needed.

# How to use

## Parameters

CanvasSequence accepts 6 parameters, the last one is optional.
- **canvasId** (String) : id of the canvas tag you want to use 
- **sequencePath** (String) : the path to your image sequence (ex. './img/sequence/').
If your images names are prefixed (ex. img_000.jpg) you must include the prefix in the path.
- **sequenceStart** (Int) : the number of the first frame (ex. if your first frame is img_00056.jpg then sequenceStart = 56)
- **sequenceEnd** (Int) : the number of the last frame
- **fileType** (String) : the file extension you want to use (ex. 'jpg')
- **loadCallback** (function) : a callback to be notified when all images are loaded and ready to use

## Init

```javascript
  var sequence = new CanvasSequence('canvas', 'img/sequence_00', 98, 180, '.jpg', function() {
    console.log("Assets are loaded !")
  });
```
