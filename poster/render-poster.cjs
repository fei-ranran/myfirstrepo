const fs = require("node:fs");
const path = require("node:path");
const { pathToFileURL } = require("node:url");
const { createRequire } = require("node:module");

function requireRuntimePackage(packageName) {
  try {
    return require(packageName);
  } catch (firstError) {
    const runtimeModules = process.env.CODEX_RUNTIME_NODE_MODULES
      || "C:\\Users\\66940\\.cache\\codex-runtimes\\codex-primary-runtime\\dependencies\\node\\node_modules";
    const pnpmRoot = path.join(runtimeModules, ".pnpm");
    const packageDirs = fs.existsSync(pnpmRoot)
      ? fs.readdirSync(pnpmRoot).filter((name) => name === packageName || name.startsWith(`${packageName}@`))
      : [];

    for (const dir of packageDirs) {
      const packageRoot = path.join(pnpmRoot, dir, "node_modules", packageName);
      const packageJson = path.join(packageRoot, "package.json");
      if (!fs.existsSync(packageJson)) continue;
      try {
        return createRequire(packageJson)(packageName);
      } catch {
        continue;
      }
    }

    throw firstError;
  }
}

const { chromium } = requireRuntimePackage("playwright");
const sharp = requireRuntimePackage("sharp");

const root = path.resolve(__dirname, "..");
const posterDir = path.join(root, "poster");
const htmlPath = path.join(posterDir, "poster.html");
const pngPath = path.join(posterDir, "shimiaoji-poster-a3-300dpi.png");
const jpgPath = path.join(posterDir, "shimiaoji-poster-a3-300dpi.jpg");
const edgePath = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";

async function render() {
  const launchOptions = fs.existsSync(edgePath)
    ? { headless: true, executablePath: edgePath }
    : { headless: true };

  const browser = await chromium.launch(launchOptions);
  const page = await browser.newPage({
    viewport: { width: 3508, height: 4961 },
    deviceScaleFactor: 1,
  });

  await page.goto(pathToFileURL(htmlPath).href, { waitUntil: "networkidle" });
  await page.screenshot({ path: pngPath, fullPage: false });
  await browser.close();

  let selectedQuality = 84;
  let selectedSize = Infinity;

  for (const quality of [84, 82, 80, 78, 76, 74, 72, 70, 68, 66, 64, 62, 60]) {
    await sharp(pngPath)
      .flatten({ background: "#f8f0e4" })
      .jpeg({ quality, mozjpeg: true })
      .withMetadata({ density: 300 })
      .toFile(jpgPath);

    selectedSize = fs.statSync(jpgPath).size;
    selectedQuality = quality;
    if (selectedSize <= 5 * 1024 * 1024) break;
  }

  const meta = await sharp(jpgPath).metadata();
  console.log(JSON.stringify({
    jpg: jpgPath,
    png: pngPath,
    width: meta.width,
    height: meta.height,
    density: meta.density,
    quality: selectedQuality,
    bytes: selectedSize,
    mb: +(selectedSize / 1024 / 1024).toFixed(2),
  }, null, 2));
}

render().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
