const require_chunk = require("./chunk-4N-2k_uM.js");
let better_sqlite3 = require("better-sqlite3");
better_sqlite3 = require_chunk.__toESM(better_sqlite3);
let node_fs_promises = require("node:fs/promises");
//#region src/platform.ts
var platform_exports = /* @__PURE__ */ require_chunk.__exportAll({
	Database: () => better_sqlite3.default,
	fileExists: () => fileExists,
	openDatabase: () => openDatabase,
	readFileBuffer: () => readFileBuffer,
	readFileText: () => readFileText,
	writeFileText: () => writeFileText
});
function openDatabase(path) {
	return new better_sqlite3.default(path);
}
async function readFileText(path) {
	return (0, node_fs_promises.readFile)(path, "utf-8");
}
async function readFileBuffer(path) {
	return (0, node_fs_promises.readFile)(path);
}
async function writeFileText(path, content) {
	await (0, node_fs_promises.writeFile)(path, content, "utf-8");
}
async function fileExists(path) {
	try {
		await (0, node_fs_promises.access)(path);
		return true;
	} catch {
		return false;
	}
}
//#endregion
Object.defineProperty(exports, "fileExists", {
	enumerable: true,
	get: function() {
		return fileExists;
	}
});
Object.defineProperty(exports, "openDatabase", {
	enumerable: true,
	get: function() {
		return openDatabase;
	}
});
Object.defineProperty(exports, "platform_exports", {
	enumerable: true,
	get: function() {
		return platform_exports;
	}
});
Object.defineProperty(exports, "readFileBuffer", {
	enumerable: true,
	get: function() {
		return readFileBuffer;
	}
});
Object.defineProperty(exports, "readFileText", {
	enumerable: true,
	get: function() {
		return readFileText;
	}
});
Object.defineProperty(exports, "writeFileText", {
	enumerable: true,
	get: function() {
		return writeFileText;
	}
});
