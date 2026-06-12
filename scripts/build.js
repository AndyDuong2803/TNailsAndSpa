const fs = require("fs");
const path = require("path");

const projectRoot = path.resolve(__dirname, "..");
const srcDir = path.join(projectRoot, "src");
const partialsDir = path.join(srcDir, "partials");
const distDir = path.join(projectRoot, "dist");
const noJekyllPath = path.join(projectRoot, ".nojekyll");
const templatePath = path.join(srcDir, "index.template.html");
const originalIndexPath = path.join(projectRoot, "index.html");
const staticRootFiles = ["robots.txt", "sitemap.xml"];

const partialFiles = {
  HEAD: "head.html",
  HEADER: "header.html",
  HERO: "hero.html",
  SPECIALTIES: "specialties.html",
  SERVICES: "services.html",
  CONTACT: "contact.html",
  FOOTER: "footer.html",
  POPUP: "popup.html",
  SCRIPTS: "scripts.html",
};

const templateContent = `<!doctype html>
<html lang="en">
  <head>
{{HEAD}}
  </head>
  <body>
{{HEADER}}{{HERO}}{{SPECIALTIES}}{{SERVICES}}{{CONTACT}}{{FOOTER}}{{POPUP}}{{SCRIPTS}}
  </body>
</html>
`;

function normalizeNewlines(value) {
  return value.replace(/\r\n/g, "\n");
}

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function readText(filePath) {
  return normalizeNewlines(fs.readFileSync(filePath, "utf8"));
}

function writeText(filePath, contents) {
  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, contents, "utf8");
}

function extractBetween(source, startNeedle, endNeedle) {
  const startIndex = source.indexOf(startNeedle);
  if (startIndex === -1) {
    throw new Error(`Could not find start marker: ${startNeedle}`);
  }

  const contentStart = startIndex + startNeedle.length;
  const endIndex = source.indexOf(endNeedle, contentStart);
  if (endIndex === -1) {
    throw new Error(`Could not find end marker: ${endNeedle}`);
  }

  return source.slice(contentStart, endIndex);
}

function copyDirectory(sourceDir, targetDir) {
  ensureDir(targetDir);

  for (const entry of fs.readdirSync(sourceDir, { withFileTypes: true })) {
    const sourcePath = path.join(sourceDir, entry.name);
    const targetPath = path.join(targetDir, entry.name);

    if (entry.isDirectory()) {
      copyDirectory(sourcePath, targetPath);
      continue;
    }

    fs.copyFileSync(sourcePath, targetPath);
  }
}

function copyLegacyAssetCompatibilityFiles(targetRootDir) {
  const legacyDir = path.join(targetRootDir, "template08", "images", "demo08");
  const imageDir = path.join(projectRoot, "assets", "images");

  const legacyAssets = [
    ["prev-b2adf10543.png", "prev.png"],
    ["next-b0ccfb0e4a.png", "next.png"],
    ["close-50ee6ac410.png", "close.png"],
    ["loading-f748d12c0b.gif", "loading.gif"],
    ["top-left-bg-319611a4d3.jpg", "top-left-bg.jpg"],
  ];

  ensureDir(legacyDir);

  for (const [sourceName, targetName] of legacyAssets) {
    const sourcePath = path.join(imageDir, sourceName);
    const targetPath = path.join(legacyDir, targetName);

    if (!fs.existsSync(sourcePath)) {
      throw new Error(`Missing compatibility asset: ${sourcePath}`);
    }

    fs.copyFileSync(sourcePath, targetPath);
  }
}

function bootstrapSourceFromOriginal() {
  if (!fs.existsSync(originalIndexPath)) {
    throw new Error(`Original index.html not found at ${originalIndexPath}`);
  }

  const source = readText(originalIndexPath);
  const head = extractBetween(source, "  <head>\n", "\n  </head>");
  const body = extractBetween(source, "  <body>\n", "\n  </body>");

  const markers = {
    hero: '    <!-- ***** Main Banner Area Start ***** -->',
    specialties:
      '    <!-- ***** Menu Area Starts ***** -->\n    <section class="section" id="specialties">',
    services:
      '    <!-- ***** Menu Area Starts ***** -->\n    <section class="section" id="services">',
    contact: "    <!-- ***** Appointment Us Area Starts ***** -->",
    footer: "    <!-- ***** Footer Start ***** -->",
    popup: "    <!--Popup -->",
    scripts: "    <!-- jQuery -->",
  };

  const positions = Object.fromEntries(
    Object.entries(markers).map(([key, marker]) => {
      const index = body.indexOf(marker);
      if (index === -1) {
        throw new Error(`Could not find body marker for ${key}`);
      }

      return [key, index];
    }),
  );

  const chunks = {
    head,
    header: body.slice(0, positions.hero),
    hero: body.slice(positions.hero, positions.specialties),
    specialties: body.slice(positions.specialties, positions.services),
    services: body.slice(positions.services, positions.contact),
    contact: body.slice(positions.contact, positions.footer),
    footer: body.slice(positions.footer, positions.popup),
    popup: body.slice(positions.popup, positions.scripts),
    scripts: body.slice(positions.scripts),
  };

  writeText(templatePath, templateContent);
  writeText(path.join(partialsDir, "head.html"), chunks.head);
  writeText(path.join(partialsDir, "header.html"), chunks.header);
  writeText(path.join(partialsDir, "hero.html"), chunks.hero);
  writeText(path.join(partialsDir, "specialties.html"), chunks.specialties);
  writeText(path.join(partialsDir, "services.html"), chunks.services);
  writeText(path.join(partialsDir, "contact.html"), chunks.contact);
  writeText(path.join(partialsDir, "footer.html"), chunks.footer);
  writeText(path.join(partialsDir, "popup.html"), chunks.popup);
  writeText(path.join(partialsDir, "scripts.html"), chunks.scripts);
}

function build() {
  if (!fs.existsSync(templatePath)) {
    throw new Error(
      `Missing template: ${templatePath}. Run "node scripts/build.js --bootstrap-source" once to create the editable source files.`,
    );
  }

  let output = readText(templatePath);

  for (const [placeholder, fileName] of Object.entries(partialFiles)) {
    const partialPath = path.join(partialsDir, fileName);
    if (!fs.existsSync(partialPath)) {
      throw new Error(`Missing partial: ${partialPath}`);
    }

    const partialContent = readText(partialPath);
    output = output.replace(`{{${placeholder}}}`, partialContent);
  }

  const unresolved = output.match(/{{[A-Z]+}}/g);
  if (unresolved) {
    throw new Error(
      `Unresolved placeholders in template: ${unresolved.join(", ")}`,
    );
  }

  fs.rmSync(distDir, { recursive: true, force: true });
  ensureDir(distDir);

  const assetsSourceDir = path.join(projectRoot, "assets");
  const assetsTargetDir = path.join(distDir, "assets");
  if (fs.existsSync(assetsSourceDir)) {
    copyDirectory(assetsSourceDir, assetsTargetDir);
  }

  copyLegacyAssetCompatibilityFiles(distDir);
  for (const fileName of staticRootFiles) {
    const sourcePath = path.join(projectRoot, fileName);
    if (fs.existsSync(sourcePath)) {
      fs.copyFileSync(sourcePath, path.join(distDir, fileName));
    }
  }

  writeText(path.join(distDir, "index.html"), output);
  copyLegacyAssetCompatibilityFiles(projectRoot);
  writeText(path.join(projectRoot, "index.html"), output);
  writeText(noJekyllPath, "");

  console.log("Built dist/index.html and root index.html");
}

function main() {
  if (process.argv.includes("--bootstrap-source")) {
    bootstrapSourceFromOriginal();
    console.log("Bootstrapped src/ from the original index.html");
  }

  build();
}

main();
