const fs = require("fs");
const PNG = require("pngjs").PNG;
const yaml = require("js-yaml");

let result = [];
function hexToRgba(hex) {
  // Remove the hash (#) if present
  hex = hex.replace(/^#/, "");

  // Parse the hex values
  var bigint = parseInt(hex, 16);

  // Extract the RGBA components
  var r = (bigint >> 24) & 255;
  var g = (bigint >> 16) & 255;
  var b = (bigint >> 8) & 255;
  var a = (bigint & 255)*255; // Convert alpha to the range [0, 1]

  return { r: r, g: g, b: b, a: a };
}
// Read pixel data from the file
let storedData = JSON.parse(JSON.stringify(yaml.load(fs.readFileSync(process.argv[2]))));
function unravelData(data) {
  let rgbaData = data.d;
  for (let i = 0; i < rgbaData.length; i++){
    if (rgbaData[i].c > 1) {
      for (let x = 0; x < rgbaData[i].c; x++){
        result.push(rgbaData[i])
      }
    }
    else {
      result.push(rgbaData[i])
    }
  }
  data.d = result;
  return data
}
storedData = unravelData(storedData)
// Create a new PNG instance
const newPng = new PNG({
  width: storedData.w,
  height: storedData.h,
});

// Set pixel data
for (let y = 0; y < newPng.height; y++) {
  for (let x = 0; x < newPng.width; x++) {
    const idx = (newPng.width * y + x) << 2;
    const rgba = hexToRgba(storedData.d[y * newPng.width + x].h);
    newPng.data[idx] = rgba.r;
    newPng.data[idx + 1] = rgba.g;
    newPng.data[idx + 2] = rgba.b;
    newPng.data[idx + 3] = rgba.a;
  }
}

// Save the new PNG file
fs.writeFileSync(`${process.argv[2]}.png`, PNG.sync.write(newPng));
