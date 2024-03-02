import { resolve } from "path";
import { writeFile } from "fs/promises";

import { build } from "esbuild";

const result = await build({
	entryPoints: ["src/index.ts"],
	platform: "node",
	target: `node${process.versions.node}`,
	bundle: true,
	treeShaking: true,
	minify: true,
	sourcemap: true,
	mainFields: ["module", "main"],
	format: "cjs",
	outExtension: { ".js": ".cjs" },
	allowOverwrite: true,
	// cspell:disable-next-line -- `outdir` is a typo in esbuild
	outdir: resolve(process.cwd(), "dist"),
	logLevel: "info",
	metafile: !!process.env.ANALYZE,
});

if (process.env.ANALYZE) {
	await writeFile("esbuild-meta.json", JSON.stringify(result.metafile));
	console.log(
		"\nMetafile written to esbuild-meta.json\nOpen https://esbuild.github.io/analyze/ to analyze the bundle",
	);
}
