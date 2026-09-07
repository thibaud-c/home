import assert from "node:assert/strict";
import { test } from "node:test";
import { readFileSync } from "node:fs";
import { surfaceAt } from "../src/globe.js";

test("globe projection clips, locates the poles, and wraps longitude", () => {
  assert.equal(surfaceAt(1, 1), null);
  assert.deepEqual(surfaceAt(0, 0), {
    depth: 1,
    latitude: -0,
    longitude: 0,
    u: 0.5,
    v: 0.5,
  });
  assert.equal(surfaceAt(0, -1).v, 0);
  assert.equal(surfaceAt(0, 1).v, 1);
  for (const rotation of [-100, -Math.PI, 0, Math.PI, 100]) {
    const point = surfaceAt(0.4, -0.3, rotation);
    assert.ok(point.u >= 0 && point.u < 1);
    assert.ok(
      Math.abs(point.u - surfaceAt(0.4, -0.3, rotation + 2 * Math.PI).u) <
        1e-12,
    );
  }
});

test("supervision status and latest publication match the supplied sources", () => {
  const data = (name) =>
    JSON.parse(
      readFileSync(
        new URL(`../src/assets/perso_data/${name}.json`, import.meta.url),
      ),
    );
  const theses = Object.values(data("supervision"))
    .filter(Array.isArray)
    .flat();
  const publications = data("publications").items;
  assert.equal(publications[0].doi, "10.5194/agile-giss-7-45-2026");
  assert.equal(
    new Set(publications.map((pub) => pub.title)).size,
    publications.length,
  );
});

// Exercise real Git locally: publish twice, remove stale output, preserve source.
test("branch publishing is repeatable and preserves build history and source", async () => {
  const { execFileSync } = await import("node:child_process");
  const { mkdtempSync, mkdirSync, cpSync, writeFileSync, rmSync } =
    await import("node:fs");
  const { tmpdir } = await import("node:os");
  const { join } = await import("node:path");
  const temp = mkdtempSync(join(tmpdir(), "portfolio-deploy-test-"));
  const run = (cmd, args, cwd = temp) =>
    execFileSync(cmd, args, {
      cwd,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
    }).trim();
  try {
    const remote = join(temp, "remote.git"),
      source = join(temp, "source");
    run("git", ["init", "--bare", remote]);
    run("git", ["init", "--initial-branch=main", source]);
    const git = (args) => run("git", args, source);
    git(["config", "user.name", "Deployment test"]);
    git(["config", "user.email", "test@example.invalid"]);
    git(["remote", "add", "origin", remote]);
    mkdirSync(join(source, "scripts"));
    mkdirSync(join(source, "dist"));
    cpSync(
      new URL("./deploy.mjs", import.meta.url),
      join(source, "scripts/deploy.mjs"),
    );
    writeFileSync(join(source, "source.txt"), "source stays untouched");
    git(["add", "."]);
    git(["commit", "-m", "Source"]);
    const head = git(["rev-parse", "HEAD"]);
    writeFileSync(join(source, "dist/index.html"), "<h1>First build</h1>");
    writeFileSync(join(source, "dist/.nojekyll"), "");
    writeFileSync(join(source, "dist/old.js"), "old");
    const deploy = () => run(process.execPath, ["scripts/deploy.mjs"], source);
    deploy();
    const first = run("git", ["--git-dir", remote, "rev-parse", "build"]);
    rmSync(join(source, "dist/old.js"));
    writeFileSync(join(source, "dist/index.html"), "<h1>Second build</h1>");
    deploy();
    assert.equal(
      run("git", ["--git-dir", remote, "rev-parse", "build^"]),
      first,
    );
    assert.equal(
      run("git", ["--git-dir", remote, "show", "build:index.html"]),
      "<h1>Second build</h1>",
    );
    assert.equal(
      run("git", ["--git-dir", remote, "ls-tree", "--name-only", "build"]),
      ".nojekyll\nindex.html",
    );
    assert.match(deploy(), /already contains/);
    assert.equal(git(["rev-parse", "HEAD"]), head);
    assert.equal(git(["branch", "--show-current"]), "main");
    assert.equal(
      readFileSync(join(source, "source.txt"), "utf8"),
      "source stays untouched",
    );
  } finally {
    rmSync(temp, { recursive: true, force: true });
  }
});
