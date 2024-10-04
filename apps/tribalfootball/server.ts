import { Hono } from "hono";
import { stream } from "hono/streaming";
import { lookup } from "mrmime";
import manifest from "./dist/manifest.json";

const app = new Hono();
app.get("ping", (c) => c.text("pong"));

app.get("*", async (c) => {
	const url = c.req.path;
	if (url.includes(".")) {
		console.warn(`${url} is not valid router path`);
		c.redirect("/");
	}

	c.header("content-type", "text/html");

	return stream(c, async (stream) => {
		stream.onAbort(() => console.log("Aborted!"));
		const templateHtml = await Bun.file("./index.html").text();

		const [templateStart = "", templateEnd = ""] = templateHtml.split(
			"<!--app-html-DO-NOT-REMOVE-OR-CHANGE-->",
		);
		const [headStart = "", headEnd = ""] = templateStart.split(
			"<!--app-head-DO-NOT-REMOVE-OR-CHANGE-->",
		);

		await stream.write(headStart);
		await stream.write(
			`<script defer src="/dist/${manifest["main.js"]}"></script>`,
		);
		await stream.write(
			`<link rel="stylesheet" crossorigin href="/dist/${manifest["main.css"]}" />`,
		);
		await stream.write(headEnd);
		await stream.write("<div>SSR Stream in here...</div>");
		await stream.write(templateEnd);
	});
});

const COMPRESSION = {
	".br": "br",
	".gz": "gzip",
};

// compressing these files will actually make them larger
const FILE_FORMATS_EXCLUDED_FROM_COMPRESSION = /\.(gif|png|webp|avif|jpe?g)$/i;

function respondWithCompressedAsset(
	encoding: keyof typeof COMPRESSION,
	path: string,
) {
	return new Response(Bun.file(path + encoding), {
		headers: {
			"Content-Encoding": COMPRESSION[encoding],
			"Content-Type": lookup(path) || "",
			Vary: "Accept-Encoding",
		},
	});
}

async function handleStaticAssets(req: Request, path: string) {
	const pathToAsset = `.${path}`;
	const acceptEncodingHeader = req.headers.get("Accept-Encoding") || "";

	const excludeFromCompression =
		FILE_FORMATS_EXCLUDED_FROM_COMPRESSION.test(path);

	const file = Bun.file(pathToAsset);
	if (!(await file.exists()))
		return new Response("Asset not found!", { status: 404 });

	if (excludeFromCompression) return new Response(file);

	switch (true) {
		// browser supports brotli, serve brotli file
		case /(br|brotli)/i.test(acceptEncodingHeader):
			return respondWithCompressedAsset(".br", pathToAsset);

		// browser supports gzip, serve gzip file
		case acceptEncodingHeader.includes("gzip"):
			return respondWithCompressedAsset(".gz", pathToAsset);

		default:
			return new Response(file);
	}
}

Bun.serve({
	fetch: (...args) => {
		const [req] = args;
		const path = new URL(req.url).pathname;

		if (path.startsWith("/dist/")) {
			return handleStaticAssets(req, path);
		}

		return app.fetch(...args);
	},
});
