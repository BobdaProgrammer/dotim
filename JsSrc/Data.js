const fs = require("fs");
const yaml = require("js-yaml");
const PNG = require("pngjs").PNG;

function rgbaToHex(r, g, b, a) {
  function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
  }

  var hex =
    "#" +
    componentToHex(r) +
    componentToHex(g) +
    componentToHex(b) +
    componentToHex(Math.round(a / 255));
  return { h: hex.toUpperCase() }; // Return an object with a "hex" property
}
let multiple = false;
let count = 1;
// Read PNG file
const pngData = fs.readFileSync(process.argv[2]);
const png = PNG.sync.read(pngData);
let result = []
// Store pixel data in a file (e.g., JSON format)
const pixelData = [];
for (let y = 0; y < png.height; y++) {
  for (let x = 0; x < png.width; x++) {
    const idx = (png.width * y + x) << 2;
    const rgba = {
      r: png.data[idx],
      g: png.data[idx + 1],
      b: png.data[idx + 2],
      a: png.data[idx + 3],
      };
    pixelData.push(rgbaToHex(rgba.r,rgba.g,rgba.b,rgba.a));
  }
}

function IsNextSame() {
  for (let i = 0; i <= pixelData.length - 1; i++){
          if (
            JSON.stringify(pixelData[i]) ==
            JSON.stringify(pixelData[i + 1])
          ) {
            multiple = true;
            count += 1;
          } else if (multiple) {
            let next = pixelData[i];
            next["c"] = count;
            result.push(next);
            multiple = false;
            count = 1; 
          } else {
            let next = pixelData[i];
            next["c"] = 1;
            result.push(next);
            multiple = false;
            count = 1
          }
  }
}
IsNextSame();
console.log(process.argv[3]);
fs.writeFileSync(
  `${process.argv[3].split(".")[0]}.dotim`,yaml.dump(
    { w: png.width, h: png.height, d: result }
  )
  
);
