/**
 * Script to copy GOV.UK Frontend assets (fonts, images, js) to the public directory.
 *
 * This script is run automatically after `npm install` via the postinstall hook.
 * It ensures that GDS Transport fonts and images are available for the application.
 */

import { existsSync, mkdirSync, readdirSync, copyFileSync } from "fs";
import { join } from "path";

const nodeModulesDir = join(process.cwd(), "node_modules");

// Assets (Fonts, Images)
const sourceAssetsDir = join(
  nodeModulesDir,
  "govuk-frontend",
  "dist",
  "govuk",
  "assets",
);
const targetAssetsDir = join(process.cwd(), "public", "assets");

// JS
const sourceJs = join(
  nodeModulesDir,
  "govuk-frontend",
  "dist",
  "govuk",
  "govuk-frontend.min.js",
);
const targetJsDir = join(process.cwd(), "public", "javascripts");
const targetJs = join(targetJsDir, "govuk-frontend.min.js");

/**
 * Recursively copies a directory from source to target.
 * @param {string} src - Source directory path
 * @param {string} dest - Destination directory path
 */
function copyDir(src, dest) {
  // Create destination directory if it doesn't exist
  if (!existsSync(dest)) {
    mkdirSync(dest, { recursive: true });
  }

  const entries = readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = join(src, entry.name);
    const destPath = join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      copyFileSync(srcPath, destPath);
    }
  }
}

// Main execution
try {
  // Copy Assets
  if (existsSync(sourceAssetsDir)) {
    console.log("📦 Copying GOV.UK Frontend assets...");
    copyDir(sourceAssetsDir, targetAssetsDir);
    console.log("✅ Assets copied to ", targetAssetsDir);
  } else {
    console.warn("⚠️  Assets dir not found: ", sourceAssetsDir);
  }

  // Copy JS
  if (existsSync(sourceJs)) {
    console.log("📦 Copying GOV.UK Frontend JS...");
    if (!existsSync(targetJsDir)) {
      mkdirSync(targetJsDir, { recursive: true });
    }
    copyFileSync(sourceJs, targetJs);
    console.log("✅ JS copied to ", targetJs);
  } else {
    console.warn("⚠️  JS file not found: ", sourceJs);
  }

} catch (error) {
  console.error("❌ Error copying assets: ", error.message);
  process.exit(1);
}
