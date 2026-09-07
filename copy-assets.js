import { cpSync } from "node:fs";

// Preserve the existing public asset URLs, including CV and social preview images.
cpSync("src/assets", "dist/assets", { recursive: true });
