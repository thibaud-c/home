import { execFileSync } from "node:child_process";
import { cpSync, existsSync, mkdtempSync, readdirSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const dist = resolve(root, "dist");
const git = (args, cwd = root) =>
  execFileSync("git", args, { cwd, encoding: "utf8" }).trim();
if (
  !existsSync(join(dist, "index.html")) ||
  !existsSync(join(dist, ".nojekyll"))
) {
  throw new Error(
    "Missing production build. Run pnpm deploy from the source checkout.",
  );
}
const remote = git(["remote", "get-url", "origin"]);
const authorName = git(["config", "user.name"]);
const authorEmail = git(["config", "user.email"]);
const existing = git(["ls-remote", "--heads", remote, "refs/heads/build"]);
const checkout = mkdtempSync(join(tmpdir(), "portfolio-build-"));
try {
  git(["init", "--initial-branch=build", checkout]);
  git(["remote", "add", "origin", remote], checkout);
  if (existing) {
    git(["fetch", "--depth=1", "origin", "build"], checkout);
    git(["checkout", "-B", "build", "FETCH_HEAD"], checkout);
  }
  // This temporary checkout contains only the generated publishing branch.
  for (const name of readdirSync(checkout)) {
    if (name !== ".git")
      rmSync(join(checkout, name), { recursive: true, force: true });
  }
  cpSync(dist, checkout, { recursive: true });
  git(["add", "--all"], checkout);
  if (git(["diff", "--cached", "--name-only"], checkout)) {
    git(
      [
        "-c",
        `user.name=${authorName}`,
        "-c",
        `user.email=${authorEmail}`,
        "commit",
        "-m",
        `Publish site from ${git(["rev-parse", "--short", "HEAD"])}`,
      ],
      checkout,
    );
    // A normal push preserves history and rejects concurrent changes; never force-push.
    git(["push", "origin", "HEAD:refs/heads/build"], checkout);
    console.log(
      "Published production files to build. GitHub Pages will deploy build / (root).",
    );
  } else {
    console.log("The build branch already contains this site.");
  }
} finally {
  rmSync(checkout, { recursive: true, force: true });
}
