import { createServer } from "node:http";
import { readFileSync } from "node:fs";
import sharp from "sharp";

const favicon = readFileSync("./favicon-32x32.png");

const limits = {
  minWidth: 50,
  minHeight: 50,
  maxWidth: 5000,
  maxHeight: 5000,
};

function chechLimits(width, height, limits) {
  if (isNaN(width) || isNaN(height)) {
    throw new Error("Dimensions must be numbers.");
  }

  const check =
    width >= limits.minWidth &&
    width <= limits.maxWidth &&
    height >= limits.minHeight &&
    height <= limits.maxHeight;

  console.log(check);
  if (!check) {
    throw new Error(
      `Error: Dimensions out of range. Allowed ${limits.minWidth}-${limits.maxWidth} || ${limits.minHeight}-${limits.maxHeight}`,
    );
  }
}

const server = createServer(async (req, res) => {
  try {
    console.log(req.url);

    if (req.url === "/favicon.ico") {
      res.writeHead(200, { "Content-Type": "image/png" });
      res.end(favicon);
      return;
    }
    const parts = req.url.split("/");

    if (parts[1] === "image" && parts[2] && parts[3]) {
      const width = parseInt(parts[2]);
      const height = parseInt(parts[3]);

      chechLimits(width, height, limits);

      const inputImage = readFileSync("./photo.jpg");

      const editedImage = await sharp(inputImage)
        .resize(width, height)
        .toBuffer();

      res.writeHead(200, { "Content-Type": "image/jpeg, charset= utf-8" });
      res.end(editedImage);
    } else {
      res.writeHead(200, { "Content-Type": "text/plain; charset=utf-8" });
      res.end("Use the format: http://127.0.0.1:3000/image/width/height");
    }
  } catch (err) {
    console.log(err);
    res.writeHead(404);
    res.end(
      `Image not found or processing error. Error: Dimensions out of range. Allowed ${limits.minWidth}-${limits.maxWidth} || ${limits.minHeight}-${limits.maxHeight}`,
    );
  }
});

server.listen(3000, "127.0.0.1", () => {
  console.log("Listening on 127.0.0.1:3000");
});
