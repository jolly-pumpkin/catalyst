const require_chunk = require("./chunk-4N-2k_uM.js");
const require_platform = require("./platform-BwsN4pjh.js");
let node_path = require("node:path");
let node_fs = require("node:fs");
let node_os = require("node:os");
//#region src/input.ts
async function loadConfig() {
	const configDir = (0, node_path.join)((0, node_os.homedir)(), ".catalyst");
	const configPath = (0, node_path.join)(configDir, "config.json");
	if (!await require_platform.fileExists(configPath)) {
		(0, node_fs.mkdirSync)(configDir, { recursive: true });
		const defaults = {
			docsFolder: (0, node_path.join)(configDir, "docs"),
			ollamaModel: "gemma4",
			ollamaUrl: "http://localhost:11434",
			indexIntervalHours: 6
		};
		await require_platform.writeFileText(configPath, JSON.stringify(defaults, null, 2));
		return defaults;
	}
	return JSON.parse(await require_platform.readFileText(configPath));
}
async function readResumeFile(filePath) {
	const cleaned = filePath.trim().replace(/^["']|["']$/g, "");
	const resolved = cleaned.startsWith("~") ? (0, node_path.join)((0, node_os.homedir)(), cleaned.slice(1)) : cleaned;
	if (!await require_platform.fileExists(resolved)) throw new Error(`File not found: ${resolved}`);
	const ext = (0, node_path.extname)(resolved).toLowerCase();
	if (ext === ".txt" || ext === ".md") return await require_platform.readFileText(resolved);
	if (ext === ".pdf") {
		const pdfParse = (await import("pdf-parse")).default;
		return (await pdfParse(await require_platform.readFileBuffer(resolved))).text;
	}
	if (ext === ".docx") {
		const mammoth = await Promise.resolve().then(() => /* @__PURE__ */ require_chunk.__toESM(require("./lib-BIZmFFr_.js").default));
		const buffer = await require_platform.readFileBuffer(resolved);
		return (await mammoth.extractRawText({ buffer })).value;
	}
	throw new Error(`Unsupported file format: ${ext}. Supported: .txt, .md, .pdf, .docx`);
}
function listDocsFolder(folder) {
	try {
		return (0, node_fs.readdirSync)(folder).filter((f) => [
			".txt",
			".md",
			".pdf",
			".docx"
		].includes((0, node_path.extname)(f).toLowerCase())).map((f) => ({
			name: f,
			path: (0, node_path.join)(folder, f)
		}));
	} catch {
		return [];
	}
}
//#endregion
Object.defineProperty(exports, "listDocsFolder", {
	enumerable: true,
	get: function() {
		return listDocsFolder;
	}
});
Object.defineProperty(exports, "loadConfig", {
	enumerable: true,
	get: function() {
		return loadConfig;
	}
});
Object.defineProperty(exports, "readResumeFile", {
	enumerable: true,
	get: function() {
		return readResumeFile;
	}
});
