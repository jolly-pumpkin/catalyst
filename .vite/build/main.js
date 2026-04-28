Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const require_chunk = require("./chunk-4N-2k_uM.js");
const require_platform = require("./platform-BwsN4pjh.js");
const require_input = require("./input-BOHOQPga.js");
let electron = require("electron");
let node_path = require("node:path");
let node_fs = require("node:fs");
let node_os = require("node:os");
let node_http = require("node:http");
node_http = require_chunk.__toESM(node_http);
let node_crypto = require("node:crypto");
//#region node_modules/dotenv/lib/main.js
var require_main = /* @__PURE__ */ require_chunk.__commonJSMin(((exports, module) => {
	var fs = require("fs");
	var path = require("path");
	var os = require("os");
	var crypto$1 = require("crypto");
	var TIPS = [
		"◈ encrypted .env [www.dotenvx.com]",
		"◈ secrets for agents [www.dotenvx.com]",
		"⌁ auth for agents [www.vestauth.com]",
		"⌘ custom filepath { path: '/custom/path/.env' }",
		"⌘ enable debugging { debug: true }",
		"⌘ override existing { override: true }",
		"⌘ suppress logs { quiet: true }",
		"⌘ multiple files { path: ['.env.local', '.env'] }"
	];
	function _getRandomTip() {
		return TIPS[Math.floor(Math.random() * TIPS.length)];
	}
	function parseBoolean(value) {
		if (typeof value === "string") return ![
			"false",
			"0",
			"no",
			"off",
			""
		].includes(value.toLowerCase());
		return Boolean(value);
	}
	function supportsAnsi() {
		return process.stdout.isTTY;
	}
	function dim(text) {
		return supportsAnsi() ? `\x1b[2m${text}\x1b[0m` : text;
	}
	var LINE = /(?:^|^)\s*(?:export\s+)?([\w.-]+)(?:\s*=\s*?|:\s+?)(\s*'(?:\\'|[^'])*'|\s*"(?:\\"|[^"])*"|\s*`(?:\\`|[^`])*`|[^#\r\n]+)?\s*(?:#.*)?(?:$|$)/gm;
	function parse(src) {
		const obj = {};
		let lines = src.toString();
		lines = lines.replace(/\r\n?/gm, "\n");
		let match;
		while ((match = LINE.exec(lines)) != null) {
			const key = match[1];
			let value = match[2] || "";
			value = value.trim();
			const maybeQuote = value[0];
			value = value.replace(/^(['"`])([\s\S]*)\1$/gm, "$2");
			if (maybeQuote === "\"") {
				value = value.replace(/\\n/g, "\n");
				value = value.replace(/\\r/g, "\r");
			}
			obj[key] = value;
		}
		return obj;
	}
	function _parseVault(options) {
		options = options || {};
		const vaultPath = _vaultPath(options);
		options.path = vaultPath;
		const result = DotenvModule.configDotenv(options);
		if (!result.parsed) {
			const err = /* @__PURE__ */ new Error(`MISSING_DATA: Cannot parse ${vaultPath} for an unknown reason`);
			err.code = "MISSING_DATA";
			throw err;
		}
		const keys = _dotenvKey(options).split(",");
		const length = keys.length;
		let decrypted;
		for (let i = 0; i < length; i++) try {
			const attrs = _instructions(result, keys[i].trim());
			decrypted = DotenvModule.decrypt(attrs.ciphertext, attrs.key);
			break;
		} catch (error) {
			if (i + 1 >= length) throw error;
		}
		return DotenvModule.parse(decrypted);
	}
	function _warn(message) {
		console.error(`⚠ ${message}`);
	}
	function _debug(message) {
		console.log(`┆ ${message}`);
	}
	function _log(message) {
		console.log(`◇ ${message}`);
	}
	function _dotenvKey(options) {
		if (options && options.DOTENV_KEY && options.DOTENV_KEY.length > 0) return options.DOTENV_KEY;
		if (process.env.DOTENV_KEY && process.env.DOTENV_KEY.length > 0) return process.env.DOTENV_KEY;
		return "";
	}
	function _instructions(result, dotenvKey) {
		let uri;
		try {
			uri = new URL(dotenvKey);
		} catch (error) {
			if (error.code === "ERR_INVALID_URL") {
				const err = /* @__PURE__ */ new Error("INVALID_DOTENV_KEY: Wrong format. Must be in valid uri format like dotenv://:key_1234@dotenvx.com/vault/.env.vault?environment=development");
				err.code = "INVALID_DOTENV_KEY";
				throw err;
			}
			throw error;
		}
		const key = uri.password;
		if (!key) {
			const err = /* @__PURE__ */ new Error("INVALID_DOTENV_KEY: Missing key part");
			err.code = "INVALID_DOTENV_KEY";
			throw err;
		}
		const environment = uri.searchParams.get("environment");
		if (!environment) {
			const err = /* @__PURE__ */ new Error("INVALID_DOTENV_KEY: Missing environment part");
			err.code = "INVALID_DOTENV_KEY";
			throw err;
		}
		const environmentKey = `DOTENV_VAULT_${environment.toUpperCase()}`;
		const ciphertext = result.parsed[environmentKey];
		if (!ciphertext) {
			const err = /* @__PURE__ */ new Error(`NOT_FOUND_DOTENV_ENVIRONMENT: Cannot locate environment ${environmentKey} in your .env.vault file.`);
			err.code = "NOT_FOUND_DOTENV_ENVIRONMENT";
			throw err;
		}
		return {
			ciphertext,
			key
		};
	}
	function _vaultPath(options) {
		let possibleVaultPath = null;
		if (options && options.path && options.path.length > 0) if (Array.isArray(options.path)) {
			for (const filepath of options.path) if (fs.existsSync(filepath)) possibleVaultPath = filepath.endsWith(".vault") ? filepath : `${filepath}.vault`;
		} else possibleVaultPath = options.path.endsWith(".vault") ? options.path : `${options.path}.vault`;
		else possibleVaultPath = path.resolve(process.cwd(), ".env.vault");
		if (fs.existsSync(possibleVaultPath)) return possibleVaultPath;
		return null;
	}
	function _resolveHome(envPath) {
		return envPath[0] === "~" ? path.join(os.homedir(), envPath.slice(1)) : envPath;
	}
	function _configVault(options) {
		const debug = parseBoolean(process.env.DOTENV_CONFIG_DEBUG || options && options.debug);
		const quiet = parseBoolean(process.env.DOTENV_CONFIG_QUIET || options && options.quiet);
		if (debug || !quiet) _log("loading env from encrypted .env.vault");
		const parsed = DotenvModule._parseVault(options);
		let processEnv = process.env;
		if (options && options.processEnv != null) processEnv = options.processEnv;
		DotenvModule.populate(processEnv, parsed, options);
		return { parsed };
	}
	function configDotenv(options) {
		const dotenvPath = path.resolve(process.cwd(), ".env");
		let encoding = "utf8";
		let processEnv = process.env;
		if (options && options.processEnv != null) processEnv = options.processEnv;
		let debug = parseBoolean(processEnv.DOTENV_CONFIG_DEBUG || options && options.debug);
		let quiet = parseBoolean(processEnv.DOTENV_CONFIG_QUIET || options && options.quiet);
		if (options && options.encoding) encoding = options.encoding;
		else if (debug) _debug("no encoding is specified (UTF-8 is used by default)");
		let optionPaths = [dotenvPath];
		if (options && options.path) if (!Array.isArray(options.path)) optionPaths = [_resolveHome(options.path)];
		else {
			optionPaths = [];
			for (const filepath of options.path) optionPaths.push(_resolveHome(filepath));
		}
		let lastError;
		const parsedAll = {};
		for (const path of optionPaths) try {
			const parsed = DotenvModule.parse(fs.readFileSync(path, { encoding }));
			DotenvModule.populate(parsedAll, parsed, options);
		} catch (e) {
			if (debug) _debug(`failed to load ${path} ${e.message}`);
			lastError = e;
		}
		const populated = DotenvModule.populate(processEnv, parsedAll, options);
		debug = parseBoolean(processEnv.DOTENV_CONFIG_DEBUG || debug);
		quiet = parseBoolean(processEnv.DOTENV_CONFIG_QUIET || quiet);
		if (debug || !quiet) {
			const keysCount = Object.keys(populated).length;
			const shortPaths = [];
			for (const filePath of optionPaths) try {
				const relative = path.relative(process.cwd(), filePath);
				shortPaths.push(relative);
			} catch (e) {
				if (debug) _debug(`failed to load ${filePath} ${e.message}`);
				lastError = e;
			}
			_log(`injected env (${keysCount}) from ${shortPaths.join(",")} ${dim(`// tip: ${_getRandomTip()}`)}`);
		}
		if (lastError) return {
			parsed: parsedAll,
			error: lastError
		};
		else return { parsed: parsedAll };
	}
	function config(options) {
		if (_dotenvKey(options).length === 0) return DotenvModule.configDotenv(options);
		const vaultPath = _vaultPath(options);
		if (!vaultPath) {
			_warn(`you set DOTENV_KEY but you are missing a .env.vault file at ${vaultPath}`);
			return DotenvModule.configDotenv(options);
		}
		return DotenvModule._configVault(options);
	}
	function decrypt(encrypted, keyStr) {
		const key = Buffer.from(keyStr.slice(-64), "hex");
		let ciphertext = Buffer.from(encrypted, "base64");
		const nonce = ciphertext.subarray(0, 12);
		const authTag = ciphertext.subarray(-16);
		ciphertext = ciphertext.subarray(12, -16);
		try {
			const aesgcm = crypto$1.createDecipheriv("aes-256-gcm", key, nonce);
			aesgcm.setAuthTag(authTag);
			return `${aesgcm.update(ciphertext)}${aesgcm.final()}`;
		} catch (error) {
			const isRange = error instanceof RangeError;
			const invalidKeyLength = error.message === "Invalid key length";
			const decryptionFailed = error.message === "Unsupported state or unable to authenticate data";
			if (isRange || invalidKeyLength) {
				const err = /* @__PURE__ */ new Error("INVALID_DOTENV_KEY: It must be 64 characters long (or more)");
				err.code = "INVALID_DOTENV_KEY";
				throw err;
			} else if (decryptionFailed) {
				const err = /* @__PURE__ */ new Error("DECRYPTION_FAILED: Please check your DOTENV_KEY");
				err.code = "DECRYPTION_FAILED";
				throw err;
			} else throw error;
		}
	}
	function populate(processEnv, parsed, options = {}) {
		const debug = Boolean(options && options.debug);
		const override = Boolean(options && options.override);
		const populated = {};
		if (typeof parsed !== "object") {
			const err = /* @__PURE__ */ new Error("OBJECT_REQUIRED: Please check the processEnv argument being passed to populate");
			err.code = "OBJECT_REQUIRED";
			throw err;
		}
		for (const key of Object.keys(parsed)) if (Object.prototype.hasOwnProperty.call(processEnv, key)) {
			if (override === true) {
				processEnv[key] = parsed[key];
				populated[key] = parsed[key];
			}
			if (debug) if (override === true) _debug(`"${key}" is already defined and WAS overwritten`);
			else _debug(`"${key}" is already defined and was NOT overwritten`);
		} else {
			processEnv[key] = parsed[key];
			populated[key] = parsed[key];
		}
		return populated;
	}
	var DotenvModule = {
		configDotenv,
		_configVault,
		_parseVault,
		config,
		decrypt,
		parse,
		populate
	};
	module.exports.configDotenv = DotenvModule.configDotenv;
	module.exports._configVault = DotenvModule._configVault;
	module.exports._parseVault = DotenvModule._parseVault;
	module.exports.config = DotenvModule.config;
	module.exports.decrypt = DotenvModule.decrypt;
	module.exports.parse = DotenvModule.parse;
	module.exports.populate = DotenvModule.populate;
	module.exports = DotenvModule;
}));
//#endregion
//#region node_modules/dotenv/lib/env-options.js
var require_env_options = /* @__PURE__ */ require_chunk.__commonJSMin(((exports, module) => {
	var options = {};
	if (process.env.DOTENV_CONFIG_ENCODING != null) options.encoding = process.env.DOTENV_CONFIG_ENCODING;
	if (process.env.DOTENV_CONFIG_PATH != null) options.path = process.env.DOTENV_CONFIG_PATH;
	if (process.env.DOTENV_CONFIG_QUIET != null) options.quiet = process.env.DOTENV_CONFIG_QUIET;
	if (process.env.DOTENV_CONFIG_DEBUG != null) options.debug = process.env.DOTENV_CONFIG_DEBUG;
	if (process.env.DOTENV_CONFIG_OVERRIDE != null) options.override = process.env.DOTENV_CONFIG_OVERRIDE;
	if (process.env.DOTENV_CONFIG_DOTENV_KEY != null) options.DOTENV_KEY = process.env.DOTENV_CONFIG_DOTENV_KEY;
	module.exports = options;
}));
//#endregion
//#region node_modules/dotenv/lib/cli-options.js
var require_cli_options = /* @__PURE__ */ require_chunk.__commonJSMin(((exports, module) => {
	var re = /^dotenv_config_(encoding|path|quiet|debug|override|DOTENV_KEY)=(.+)$/;
	module.exports = function optionMatcher(args) {
		const options = args.reduce(function(acc, cur) {
			const matches = cur.match(re);
			if (matches) acc[matches[1]] = matches[2];
			return acc;
		}, {});
		if (!("quiet" in options)) options.quiet = "true";
		return options;
	};
}));
//#endregion
//#region node_modules/dotenv/config.js
(function() {
	require_main().config(Object.assign({}, require_env_options(), require_cli_options()(process.argv)));
})();
//#endregion
//#region ../rhodium/packages/core/dist/errors.js
var RhodiumError = class extends Error {
	static CODE = "RHODIUM_ERROR";
	code;
	pluginKey;
	timestamp;
	constructor(message, code, pluginKey) {
		super(message);
		this.name = this.constructor.name;
		this.code = code;
		this.pluginKey = pluginKey;
		this.timestamp = Date.now();
		Object.setPrototypeOf(this, new.target.prototype);
	}
};
var CapabilityNotFoundError = class CapabilityNotFoundError extends RhodiumError {
	static CODE = "CAPABILITY_NOT_FOUND";
	constructor(capability, neededBy, version, available) {
		const availableList = available.length > 0 ? available.map((c) => `    • ${c}`).join("\n") : "    (none)";
		const message = [
			`No provider for required capability '${capability}'`,
			"",
			`  Needed by: ${neededBy} (v${version})`,
			`  Declared as: required (not optional)`,
			"",
			`  Available capabilities in this broker:`,
			availableList,
			"",
			`  Did you forget to register a plugin that provides '${capability}'?`,
			`  If this dependency is not required, mark it as optional:`,
			`    needs: [{ capability: '${capability}', optional: true }]`
		].join("\n");
		super(message, CapabilityNotFoundError.CODE, neededBy);
	}
};
var CircularDependencyError = class CircularDependencyError extends RhodiumError {
	static CODE = "CIRCULAR_DEPENDENCY";
	/**
	* The detected cycle path, in order, as plugin keys.
	* Exposed so callers (e.g. the broker's register() rewrap path) can
	* reconstruct the error without regex-parsing the message body.
	*/
	cycle;
	constructor(cycle) {
		const message = [
			"Circular dependency detected",
			"",
			cycle.map((plugin, i) => {
				const next = cycle[(i + 1) % cycle.length];
				const isLast = i === cycle.length - 1;
				return [`  ${plugin}`, `    → depends on ${next}${isLast ? "    ← cycle closes here" : ""}`].join("\n");
			}).join("\n"),
			"",
			`Plugins in cycle: ${cycle.join(", ")}`
		].join("\n");
		super(message, CircularDependencyError.CODE);
		this.cycle = [...cycle];
	}
};
var ActivationTimeoutError = class ActivationTimeoutError extends RhodiumError {
	static CODE = "ACTIVATION_TIMEOUT";
	constructor(pluginKey, timeoutMs) {
		super(`Plugin '${pluginKey}' activation timed out after ${timeoutMs}ms`, ActivationTimeoutError.CODE, pluginKey);
	}
};
var ActivationError = class ActivationError extends RhodiumError {
	static CODE = "ACTIVATION_FAILED";
	cause;
	constructor(pluginKey, cause) {
		super(`Plugin '${pluginKey}' activation failed: ${cause.message}`, ActivationError.CODE, pluginKey);
		this.cause = cause;
	}
};
var CapabilityViolationError = class CapabilityViolationError extends RhodiumError {
	static CODE = "CAPABILITY_VIOLATION";
	constructor(pluginKey, capability, violations) {
		const sections = [];
		const missingMethods = violations.filter((v) => v.kind === "missing-method");
		if (missingMethods.length > 0) sections.push("  Missing methods:\n" + missingMethods.map((v) => `    • ${v.field}`).join("\n"));
		const missingProps = violations.filter((v) => v.kind === "missing-property");
		if (missingProps.length > 0) sections.push("  Missing properties:\n" + missingProps.map((v) => `    • ${v.field}`).join("\n"));
		const wrongArity = violations.filter((v) => v.kind === "wrong-arity");
		if (wrongArity.length > 0) sections.push("  Wrong arity:\n" + wrongArity.map((v) => `    • ${v.field}: expected ${v.expected} parameters, got ${v.actual}`).join("\n"));
		const wrongTypes = violations.filter((v) => v.kind === "wrong-type");
		if (wrongTypes.length > 0) sections.push("  Wrong types:\n" + wrongTypes.map((v) => `    • ${v.field}: expected ${v.expected}, got ${v.actual}`).join("\n"));
		const message = [
			`Plugin '${pluginKey}' does not satisfy '${capability}' contract`,
			"",
			...sections,
			"",
			`  Provided by: ${pluginKey}`,
			`  Contract: ${capability}`
		].join("\n");
		super(message, CapabilityViolationError.CODE, pluginKey);
	}
};
var UndeclaredCapabilityError = class UndeclaredCapabilityError extends RhodiumError {
	static CODE = "UNDECLARED_CAPABILITY";
	constructor(pluginKey, capability) {
		super(`Plugin '${pluginKey}' called provide('${capability}') but '${capability}' is not declared in manifest.provides`, UndeclaredCapabilityError.CODE, pluginKey);
	}
};
var DuplicatePluginError = class DuplicatePluginError extends RhodiumError {
	static CODE = "DUPLICATE_PLUGIN";
	constructor(pluginKey) {
		super(`Plugin '${pluginKey}' is already registered`, DuplicatePluginError.CODE, pluginKey);
	}
};
//#endregion
//#region ../rhodium/packages/core/dist/registry.js
var PluginRegistry = class {
	#plugins = /* @__PURE__ */ new Map();
	#states = /* @__PURE__ */ new Map();
	#emit;
	constructor(emit) {
		this.#emit = emit;
	}
	register(plugin) {
		if (this.#plugins.has(plugin.key)) throw new DuplicatePluginError(plugin.key);
		this.#plugins.set(plugin.key, plugin);
		this.#states.set(plugin.key, "registered");
		this.#emit({
			timestamp: Date.now(),
			event: "plugin:registered",
			pluginKey: plugin.key
		});
	}
	getPlugin(pluginKey) {
		return this.#plugins.get(pluginKey);
	}
	getState(pluginKey) {
		return this.#states.get(pluginKey);
	}
	setState(pluginKey, state) {
		if (!this.#plugins.has(pluginKey)) return;
		this.#states.set(pluginKey, state);
	}
	getPluginStates() {
		return new Map(this.#states);
	}
	getAllPlugins() {
		return Array.from(this.#plugins.values());
	}
	async unregister(pluginKey) {
		const plugin = this.#plugins.get(pluginKey);
		if (!plugin) return;
		const state = this.#states.get(pluginKey);
		if (state === "active" || state === "resolving") try {
			await plugin.deactivate?.();
		} catch {}
		this.#plugins.delete(pluginKey);
		this.#states.delete(pluginKey);
		this.#emit({
			timestamp: Date.now(),
			event: "plugin:unregistered",
			pluginKey
		});
	}
};
//#endregion
//#region ../rhodium/packages/core/dist/events.js
function createEventBus() {
	const handlers = /* @__PURE__ */ new Map();
	return {
		on(event, handler) {
			if (!handlers.has(event)) handlers.set(event, /* @__PURE__ */ new Set());
			handlers.get(event).add(handler);
			return () => {
				handlers.get(event).delete(handler);
			};
		},
		emit(event, payload) {
			const eventHandlers = handlers.get(event);
			if (eventHandlers) for (const handler of eventHandlers) try {
				handler(payload);
			} catch (err) {
				console.warn("[rhodium] Event handler error:", err);
			}
			if (event !== "*") {
				const wildcardHandlers = handlers.get("*");
				if (wildcardHandlers) for (const handler of wildcardHandlers) try {
					handler(payload);
				} catch (err) {
					console.warn("[rhodium] Event handler error:", err);
				}
			}
		}
	};
}
//#endregion
//#region ../rhodium/packages/capabilities/dist/validate.js
function isObject(value) {
	return value !== null && typeof value === "object";
}
function createCapabilityValidator() {
	return { validate(contract, implementation) {
		const { schema } = contract;
		if (schema === void 0) return [];
		const violations = [];
		const impl = isObject(implementation) ? implementation : {};
		for (const [methodName, expectedArity] of Object.entries(schema.methods ?? {})) {
			const value = impl[methodName];
			if (typeof value !== "function") violations.push({
				kind: "missing-method",
				field: methodName,
				expected: "function",
				actual: value === void 0 ? "undefined" : typeof value
			});
			else if (value.length !== expectedArity) violations.push({
				kind: "wrong-arity",
				field: methodName,
				expected: String(expectedArity),
				actual: String(value.length)
			});
		}
		for (const propName of schema.properties ?? []) if (impl[propName] === void 0) violations.push({
			kind: "missing-property",
			field: propName,
			expected: "defined",
			actual: "undefined"
		});
		return violations;
	} };
}
//#endregion
//#region ../rhodium/packages/core/dist/lifecycle.js
function createLifecycleManager(opts) {
	const { registry, graph, resolver, eventBus, onUnhandledError } = opts;
	const timeoutMs = opts.timeoutMs ?? 3e4;
	const implementations = /* @__PURE__ */ new Map();
	const commandHandlers = /* @__PURE__ */ new Map();
	const commandHandlersByPlugin = /* @__PURE__ */ new Map();
	const activeCapabilitiesByPlugin = /* @__PURE__ */ new Map();
	const lastTransitionTimes = /* @__PURE__ */ new Map();
	const pluginErrors = /* @__PURE__ */ new Map();
	let registrationIndex = 0;
	let lastActivationOrder = [];
	const pluginSubscriptions = /* @__PURE__ */ new Map();
	function emitEvent(event, pluginKey, extra) {
		eventBus.emit(event, {
			timestamp: Date.now(),
			event,
			pluginKey,
			capability: extra?.capability,
			detail: extra?.detail
		});
	}
	function listAvailableCapabilities() {
		const set = /* @__PURE__ */ new Set();
		for (const key of implementations.keys()) {
			const idx = key.indexOf(":");
			if (idx >= 0) set.add(key.slice(idx + 1));
		}
		return [...set].sort();
	}
	function resolveImpl(capability, neededBy, neededByVersion) {
		const entry = resolver.resolve({
			capability,
			optional: true
		}, neededBy, neededByVersion);
		if (!entry) throw new CapabilityNotFoundError(capability, neededBy, neededByVersion, listAvailableCapabilities());
		const impl = implementations.get(`${entry.pluginKey}:${capability}`);
		if (impl === void 0) throw new Error(`No implementation found for capability '${capability}' from provider '${entry.pluginKey}'`);
		return impl;
	}
	function resolveAllImpl(capability, neededBy, neededByVersion) {
		return resolver.resolveMany({
			capability,
			multiple: true,
			optional: true
		}, neededBy, neededByVersion).map((e) => implementations.get(`${e.pluginKey}:${capability}`)).filter((v) => v !== void 0);
	}
	function resolveOptionalImpl(capability, neededBy, neededByVersion) {
		const entry = resolver.resolve({
			capability,
			optional: true
		}, neededBy, neededByVersion);
		if (!entry) return void 0;
		return implementations.get(`${entry.pluginKey}:${capability}`) ?? void 0;
	}
	function createPluginContext(pluginKey, plugin) {
		return {
			pluginKey,
			log: createPluginLogger(pluginKey),
			resolve(capability) {
				return resolveImpl(capability, pluginKey, plugin.version);
			},
			resolveAll(capability) {
				return resolveAllImpl(capability, pluginKey, plugin.version);
			},
			resolveOptional(capability) {
				return resolveOptionalImpl(capability, pluginKey, plugin.version);
			},
			provide(capability, implementation) {
				const decl = plugin.manifest.provides.find((p) => p.capability === capability);
				if (!decl) throw new UndeclaredCapabilityError(pluginKey, capability);
				if (decl.contract) {
					const violations = createCapabilityValidator().validate(decl.contract, implementation);
					if (violations.length > 0) throw new CapabilityViolationError(pluginKey, capability, violations);
				}
				const providerDecl = {
					capability,
					priority: decl.priority ?? 0,
					variant: decl.variant ?? void 0
				};
				resolver.registerProvider(pluginKey, providerDecl, registrationIndex++);
				implementations.set(`${pluginKey}:${capability}`, implementation);
				let caps = activeCapabilitiesByPlugin.get(pluginKey);
				if (!caps) {
					caps = /* @__PURE__ */ new Set();
					activeCapabilitiesByPlugin.set(pluginKey, caps);
				}
				caps.add(capability);
				emitEvent("capability:provided", pluginKey, { capability });
			},
			registerCommand(commandName, handler) {
				commandHandlers.set(commandName, handler);
				let owned = commandHandlersByPlugin.get(pluginKey);
				if (!owned) {
					owned = /* @__PURE__ */ new Set();
					commandHandlersByPlugin.set(pluginKey, owned);
				}
				owned.add(commandName);
			},
			reportError(error, severity) {
				emitEvent("plugin:error", pluginKey, { detail: {
					error,
					severity: severity ?? "error"
				} });
			},
			emit(event, payload) {
				eventBus.emit(event, {
					timestamp: Date.now(),
					event,
					pluginKey,
					detail: payload
				});
			},
			on(event, handler) {
				const unsub = eventBus.on(event, handler);
				let subs = pluginSubscriptions.get(pluginKey);
				if (!subs) {
					subs = [];
					pluginSubscriptions.set(pluginKey, subs);
				}
				subs.push(unsub);
				return unsub;
			}
		};
	}
	function createPluginLogger(pluginKey) {
		const prefix = `[${pluginKey}]`;
		return {
			debug: (message, data) => console.debug(prefix, message, data ?? ""),
			info: (message, data) => console.info(prefix, message, data ?? ""),
			warn: (message, data) => console.warn(prefix, message, data ?? ""),
			error: (message, error, data) => console.error(prefix, message, ...error ? [error] : [], ...data ? [data] : [])
		};
	}
	function computeWaves(order) {
		const waveOf = /* @__PURE__ */ new Map();
		for (const pluginKey of order) {
			const checks = graph.checkDependencies(pluginKey);
			let myWave = 0;
			for (const check of checks) {
				if (check.availableProviders.length === 0) continue;
				const providerWaves = check.availableProviders.filter((p) => waveOf.has(p)).map((p) => waveOf.get(p));
				if (providerWaves.length > 0) myWave = Math.max(myWave, Math.min(...providerWaves) + 1);
			}
			waveOf.set(pluginKey, myWave);
		}
		const waves = [];
		for (const pluginKey of order) {
			const w = waveOf.get(pluginKey);
			if (!waves[w]) waves[w] = [];
			waves[w].push(pluginKey);
		}
		return waves;
	}
	function shouldSkip(pluginKey, failedSet) {
		const plugin = registry.getPlugin(pluginKey);
		if (!plugin) return true;
		for (const dep of plugin.manifest.needs) {
			if (dep.optional) continue;
			const check = graph.checkDependencies(pluginKey).find((c) => c.capability === dep.capability);
			if (!check || check.availableProviders.length === 0) return true;
			if (check.availableProviders.every((p) => failedSet.has(p))) return true;
		}
		return false;
	}
	function getUnmetDependencies(pluginKey, failedSet) {
		const plugin = registry.getPlugin(pluginKey);
		if (!plugin) return [];
		const unmet = [];
		for (const dep of plugin.manifest.needs) {
			if (dep.optional) continue;
			const check = graph.checkDependencies(pluginKey).find((c) => c.capability === dep.capability);
			if (!check || check.availableProviders.length === 0) unmet.push(dep.capability);
			else if (check.availableProviders.every((p) => failedSet.has(p))) unmet.push(dep.capability);
		}
		return unmet;
	}
	async function activateSingle(pluginKey, activated, failed, failedSet) {
		const plugin = registry.getPlugin(pluginKey);
		if (!plugin) return;
		registry.setState(pluginKey, "resolving");
		lastTransitionTimes.set(pluginKey, Date.now());
		emitEvent("plugin:activating", pluginKey);
		const start = Date.now();
		const ctx = createPluginContext(pluginKey, plugin);
		try {
			if (plugin.activate) {
				let timerId;
				try {
					await Promise.race([Promise.resolve().then(() => plugin.activate(ctx)), new Promise((_, reject) => {
						timerId = setTimeout(() => reject(new ActivationTimeoutError(pluginKey, timeoutMs)), timeoutMs);
					})]);
				} finally {
					if (timerId) clearTimeout(timerId);
				}
			}
			registry.setState(pluginKey, "active");
			lastTransitionTimes.set(pluginKey, Date.now());
			pluginErrors.delete(pluginKey);
			emitEvent("plugin:activated", pluginKey, { detail: { durationMs: Date.now() - start } });
			activated.push(pluginKey);
			for (const dep of plugin.manifest.needs) if (resolver.resolve({
				capability: dep.capability,
				optional: true,
				variant: dep.variant
			}, pluginKey, plugin.version)) emitEvent("dependency:resolved", pluginKey, { capability: dep.capability });
		} catch (err) {
			const error = err instanceof Error ? err : new Error(String(err));
			const wrappedError = error instanceof ActivationTimeoutError || error instanceof ActivationError || error instanceof CapabilityNotFoundError || error instanceof UndeclaredCapabilityError || error instanceof CapabilityViolationError ? error : new ActivationError(pluginKey, error);
			registry.setState(pluginKey, "failed");
			lastTransitionTimes.set(pluginKey, Date.now());
			pluginErrors.set(pluginKey, wrappedError);
			failedSet.add(pluginKey);
			failed.push({
				pluginKey,
				error: wrappedError
			});
			emitEvent("plugin:error", pluginKey, { detail: { error: wrappedError } });
			onUnhandledError?.(wrappedError);
			throw wrappedError;
		}
	}
	/** Build a rich PluginState for a given plugin. */
	function buildPluginState(pluginKey) {
		const plugin = registry.getPlugin(pluginKey);
		const status = registry.getState(pluginKey);
		if (!plugin || !status) return void 0;
		const caps = activeCapabilitiesByPlugin.get(pluginKey);
		const cmds = commandHandlersByPlugin.get(pluginKey);
		const deps = plugin.manifest.needs.map((dep) => {
			const entry = resolver.resolve({
				capability: dep.capability,
				optional: true,
				variant: dep.variant
			}, pluginKey, plugin.version);
			return {
				capability: dep.capability,
				optional: dep.optional ?? false,
				resolved: entry !== void 0,
				providerKey: entry?.pluginKey
			};
		});
		return {
			key: pluginKey,
			version: plugin.version,
			status,
			activeCapabilities: caps ? [...caps] : [],
			registeredCommands: cmds ? [...cmds] : [],
			dependencies: deps,
			lastTransition: lastTransitionTimes.get(pluginKey) ?? Date.now(),
			error: pluginErrors.get(pluginKey)
		};
	}
	return {
		async activate() {
			const start = Date.now();
			const activated = [];
			const failed = [];
			const pending = [];
			const failedSet = /* @__PURE__ */ new Set();
			const order = graph.getActivationOrder();
			lastActivationOrder = order;
			const waves = computeWaves(order);
			for (const wave of waves) {
				const toActivate = wave.filter((key) => !shouldSkip(key, failedSet));
				const skipped = wave.filter((key) => shouldSkip(key, failedSet));
				for (const pluginKey of skipped) pending.push({
					pluginKey,
					unmetDependencies: getUnmetDependencies(pluginKey, failedSet)
				});
				const results = await Promise.allSettled(toActivate.map((key) => activateSingle(key, activated, failed, failedSet)));
				for (let i = 0; i < results.length; i++) {
					const result = results[i];
					const pluginKey = toActivate[i];
					if (result && result.status === "rejected" && pluginKey) failedSet.add(pluginKey);
				}
			}
			const durationMs = Date.now() - start;
			emitEvent("broker:activated", void 0, { detail: {
				pluginCount: activated.length,
				durationMs
			} });
			return {
				activated,
				failed,
				pending,
				durationMs
			};
		},
		async deactivate() {
			const activeKeys = [...lastActivationOrder].reverse().filter((k) => registry.getState(k) === "active");
			let count = 0;
			for (const pluginKey of activeKeys) {
				const plugin = registry.getPlugin(pluginKey);
				emitEvent("plugin:deactivating", pluginKey);
				try {
					await plugin?.deactivate?.();
				} catch (err) {
					onUnhandledError?.(err instanceof Error ? err : new Error(String(err)));
				}
				registry.setState(pluginKey, "inactive");
				lastTransitionTimes.set(pluginKey, Date.now());
				resolver.unregisterPlugin(pluginKey);
				const subs = pluginSubscriptions.get(pluginKey);
				if (subs) {
					for (const unsub of subs) unsub();
					pluginSubscriptions.delete(pluginKey);
				}
				const caps = activeCapabilitiesByPlugin.get(pluginKey);
				if (caps) {
					for (const capability of caps) {
						implementations.delete(`${pluginKey}:${capability}`);
						emitEvent("capability:removed", pluginKey, { capability });
					}
					activeCapabilitiesByPlugin.delete(pluginKey);
				}
				const ownedCommands = commandHandlersByPlugin.get(pluginKey);
				if (ownedCommands) {
					for (const cmd of ownedCommands) commandHandlers.delete(cmd);
					commandHandlersByPlugin.delete(pluginKey);
				}
				emitEvent("plugin:deactivated", pluginKey);
				count++;
			}
			emitEvent("broker:deactivated", void 0, { detail: { pluginCount: count } });
		},
		async activatePlugin(pluginKey) {
			const start = Date.now();
			const plugin = registry.getPlugin(pluginKey);
			if (!plugin) throw new Error(`Plugin '${pluginKey}' not registered`);
			if (registry.getState(pluginKey) === "active") return {
				activated: [pluginKey],
				failed: [],
				pending: [],
				durationMs: 0
			};
			const provides = plugin.manifest.provides.map((p) => p.capability);
			const needs = plugin.manifest.needs.map((d) => d.capability);
			graph.addPlugin(pluginKey, provides, needs);
			try {
				for (const dep of plugin.manifest.needs) {
					if (dep.optional) continue;
					resolver.resolve(dep, pluginKey, plugin.version);
				}
			} catch (err) {
				registry.setState(pluginKey, "failed");
				lastTransitionTimes.set(pluginKey, Date.now());
				throw err;
			}
			const activated = [];
			const failed = [];
			await activateSingle(pluginKey, activated, failed, /* @__PURE__ */ new Set());
			if (!lastActivationOrder.includes(pluginKey)) lastActivationOrder.push(pluginKey);
			return {
				activated,
				failed,
				pending: [],
				durationMs: Date.now() - start
			};
		},
		purgePlugin(pluginKey) {
			const caps = activeCapabilitiesByPlugin.get(pluginKey);
			if (caps) {
				for (const capability of caps) {
					implementations.delete(`${pluginKey}:${capability}`);
					emitEvent("capability:removed", pluginKey, { capability });
				}
				activeCapabilitiesByPlugin.delete(pluginKey);
			}
			for (const key of Array.from(implementations.keys())) if (key.startsWith(`${pluginKey}:`)) implementations.delete(key);
			const ownedCommands = commandHandlersByPlugin.get(pluginKey);
			if (ownedCommands) {
				for (const cmd of ownedCommands) commandHandlers.delete(cmd);
				commandHandlersByPlugin.delete(pluginKey);
			}
			const subs = pluginSubscriptions.get(pluginKey);
			if (subs) {
				for (const unsub of subs) unsub();
				pluginSubscriptions.delete(pluginKey);
			}
			lastTransitionTimes.delete(pluginKey);
			pluginErrors.delete(pluginKey);
		},
		getPluginStates() {
			const result = /* @__PURE__ */ new Map();
			for (const plugin of registry.getAllPlugins()) {
				const state = buildPluginState(plugin.key);
				if (state) result.set(plugin.key, state);
			}
			return result;
		},
		resolve: resolveImpl,
		resolveAll: resolveAllImpl,
		resolveOptional: resolveOptionalImpl
	};
}
//#endregion
//#region ../rhodium/packages/core/dist/graph/cycle-detect.js
/**
* Pure cycle detection using DFS with 3-color marking.
* Returns the first cycle found as an ordered array of node keys,
* or null if the graph is acyclic.
*/
function findCycle(adjacency) {
	const white = new Set(adjacency.keys());
	const gray = /* @__PURE__ */ new Set();
	const black = /* @__PURE__ */ new Set();
	const stack = [];
	function dfs(node) {
		white.delete(node);
		gray.add(node);
		stack.push(node);
		const neighbors = adjacency.get(node) ?? /* @__PURE__ */ new Set();
		for (const neighbor of neighbors) {
			if (black.has(neighbor)) continue;
			if (gray.has(neighbor)) {
				const cycleStart = stack.indexOf(neighbor);
				return stack.slice(cycleStart);
			}
			const result = dfs(neighbor);
			if (result !== null) return result;
		}
		stack.pop();
		gray.delete(node);
		black.add(node);
		return null;
	}
	while (white.size > 0) {
		const node = white.values().next().value;
		const result = dfs(node);
		if (result !== null) return result;
	}
	return null;
}
//#endregion
//#region ../rhodium/packages/core/dist/graph/dag.js
/**
* Factory function that creates a dependency graph.
* Manages plugins, their capabilities, and tracks activation order.
*/
function createDependencyGraph() {
	const pluginProvides = /* @__PURE__ */ new Map();
	const pluginNeeds = /* @__PURE__ */ new Map();
	const capabilityProviders = /* @__PURE__ */ new Map();
	const registrationOrder = /* @__PURE__ */ new Map();
	let nextRegistrationIndex = 0;
	/**
	* Build adjacency list from current state.
	* Edge A→B means "A depends on B".
	*
	* INVARIANT: Every plugin must be in pluginProvides (enforced by addPlugin atomicity).
	* This ensures all registered plugins appear as nodes in the adjacency list.
	*/
	function buildAdjacency() {
		const adjacency = /* @__PURE__ */ new Map();
		for (const pluginKey of pluginProvides.keys()) adjacency.set(pluginKey, /* @__PURE__ */ new Set());
		for (const [pluginKey, needs] of pluginNeeds) {
			const neighbors = adjacency.get(pluginKey);
			for (const capability of needs) {
				const providers = capabilityProviders.get(capability) ?? /* @__PURE__ */ new Set();
				for (const provider of providers) neighbors.add(provider);
			}
		}
		return adjacency;
	}
	/**
	* Rollback mutations if cycle is detected.
	*/
	function rollbackPlugin(pluginKey, provides, needs) {
		pluginProvides.delete(pluginKey);
		pluginNeeds.delete(pluginKey);
		registrationOrder.delete(pluginKey);
		for (const capability of provides) {
			const providers = capabilityProviders.get(capability);
			if (providers) {
				providers.delete(pluginKey);
				if (providers.size === 0) capabilityProviders.delete(capability);
			}
		}
	}
	return {
		addPlugin(pluginKey, provides, needs) {
			if (pluginProvides.has(pluginKey)) return;
			registrationOrder.set(pluginKey, nextRegistrationIndex++);
			pluginProvides.set(pluginKey, new Set(provides));
			for (const capability of provides) {
				if (!capabilityProviders.has(capability)) capabilityProviders.set(capability, /* @__PURE__ */ new Set());
				capabilityProviders.get(capability).add(pluginKey);
			}
			pluginNeeds.set(pluginKey, new Set(needs));
			const cycle = findCycle(buildAdjacency());
			if (cycle !== null) {
				rollbackPlugin(pluginKey, provides, needs);
				throw new CircularDependencyError(cycle);
			}
		},
		removePlugin(pluginKey) {
			if (!pluginProvides.has(pluginKey)) return;
			const provides = pluginProvides.get(pluginKey);
			for (const capability of provides) {
				const providers = capabilityProviders.get(capability);
				providers.delete(pluginKey);
				if (providers.size === 0) capabilityProviders.delete(capability);
			}
			pluginProvides.delete(pluginKey);
			pluginNeeds.delete(pluginKey);
			registrationOrder.delete(pluginKey);
		},
		getActivationOrder() {
			const adjacency = buildAdjacency();
			const reverseAdj = /* @__PURE__ */ new Map();
			const inDegree = /* @__PURE__ */ new Map();
			for (const pluginKey of pluginProvides.keys()) {
				reverseAdj.set(pluginKey, /* @__PURE__ */ new Set());
				inDegree.set(pluginKey, 0);
			}
			for (const [pluginKey, neighbors] of adjacency) for (const neighbor of neighbors) reverseAdj.get(neighbor).add(pluginKey);
			for (const [node, neighbors] of reverseAdj) for (const neighbor of neighbors) inDegree.set(neighbor, (inDegree.get(neighbor) ?? 0) + 1);
			const byRegistration = (a, b) => (registrationOrder.get(a) ?? 0) - (registrationOrder.get(b) ?? 0);
			const queue = [...[...inDegree.entries()].filter(([, degree]) => degree === 0).map(([key]) => key).sort(byRegistration)];
			const result = [];
			while (queue.length > 0) {
				const node = queue.shift();
				result.push(node);
				const newlyReady = [];
				const neighbors = reverseAdj.get(node);
				for (const neighbor of neighbors) {
					inDegree.set(neighbor, (inDegree.get(neighbor) ?? 0) - 1);
					if (inDegree.get(neighbor) === 0) newlyReady.push(neighbor);
				}
				newlyReady.sort(byRegistration);
				queue.push(...newlyReady);
			}
			return result;
		},
		canActivate(pluginKey) {
			const needs = pluginNeeds.get(pluginKey);
			if (!needs || needs.size === 0) return true;
			for (const capability of needs) {
				const providers = capabilityProviders.get(capability);
				if (!providers || providers.size === 0) return false;
			}
			return true;
		},
		getDependents(pluginKey) {
			const adjacency = buildAdjacency();
			const reverseAdj = /* @__PURE__ */ new Map();
			for (const key of pluginProvides.keys()) reverseAdj.set(key, /* @__PURE__ */ new Set());
			for (const [plugin, neighbors] of adjacency) for (const neighbor of neighbors) reverseAdj.get(neighbor).add(plugin);
			const visited = new Set([pluginKey]);
			const queue = [pluginKey];
			while (queue.length > 0) {
				const node = queue.shift();
				const dependents = reverseAdj.get(node) ?? /* @__PURE__ */ new Set();
				for (const dependent of dependents) if (!visited.has(dependent)) {
					visited.add(dependent);
					queue.push(dependent);
				}
			}
			visited.delete(pluginKey);
			return Array.from(visited).sort();
		},
		checkDependencies(pluginKey) {
			const needs = pluginNeeds.get(pluginKey) ?? /* @__PURE__ */ new Set();
			const result = [];
			for (const capability of needs) {
				const providers = capabilityProviders.get(capability);
				const availableProviders = Array.from(providers ?? []);
				result.push({
					pluginKey,
					capability,
					satisfied: availableProviders.length > 0,
					availableProviders
				});
			}
			return result;
		}
	};
}
//#endregion
//#region ../rhodium/packages/core/dist/graph/resolver.js
function createCapabilityResolver() {
	const providers = /* @__PURE__ */ new Map();
	function getFiltered(capability, variant) {
		const all = providers.get(capability) ?? [];
		return variant === void 0 ? all : all.filter((p) => p.variant === variant);
	}
	function sortByPriorityThenRecency(entries) {
		return [...entries].sort((a, b) => {
			if (b.priority !== a.priority) return b.priority - a.priority;
			return b.registrationIndex - a.registrationIndex;
		});
	}
	return {
		registerProvider(pluginKey, declaration, registrationIndex) {
			const { capability, priority = 0, variant } = declaration;
			const entry = {
				pluginKey,
				capability,
				priority,
				variant,
				registrationIndex
			};
			const list = providers.get(capability) ?? [];
			list.push(entry);
			providers.set(capability, list);
		},
		unregisterPlugin(pluginKey) {
			for (const [cap, list] of providers) {
				const filtered = list.filter((p) => p.pluginKey !== pluginKey);
				if (filtered.length === 0) providers.delete(cap);
				else providers.set(cap, filtered);
			}
		},
		resolve(dep, neededBy, neededByVersion) {
			const candidates = getFiltered(dep.capability, dep.variant);
			if (candidates.length === 0) {
				if (dep.optional) return void 0;
				const available = [...providers.keys()];
				throw new CapabilityNotFoundError(dep.capability, neededBy, neededByVersion, available);
			}
			return sortByPriorityThenRecency(candidates)[0];
		},
		resolveMany(dep, neededBy, neededByVersion) {
			const candidates = getFiltered(dep.capability, dep.variant);
			if (candidates.length === 0) {
				if (dep.optional) return [];
				const available = [...providers.keys()];
				throw new CapabilityNotFoundError(dep.capability, neededBy, neededByVersion, available);
			}
			return sortByPriorityThenRecency(candidates);
		}
	};
}
//#endregion
//#region ../rhodium/packages/core/dist/broker.js
/**
* All broker events the log subscribes to.
*/
var BROKER_EVENTS = [
	"plugin:registered",
	"plugin:unregistered",
	"plugin:activating",
	"plugin:activated",
	"plugin:deactivating",
	"plugin:deactivated",
	"plugin:error",
	"capability:provided",
	"capability:removed",
	"dependency:resolved",
	"dependency:unresolved",
	"broker:activated",
	"broker:deactivated"
];
var BROKER_NEEDED_BY = "<broker>";
var BROKER_VERSION = "0.0.0";
/**
* Compose every subsystem into a single `Broker` instance. All mutable state
* lives inside this closure — no module-level singletons, so multiple brokers
* in the same process are fully independent (ADR-008).
*/
function createBroker(config = {}) {
	const activationTimeoutMs = config.activationTimeoutMs ?? 3e4;
	const debug = config.debug ?? false;
	const eventBus = createEventBus();
	const registry = new PluginRegistry((payload) => eventBus.emit(payload.event, payload));
	const graph = createDependencyGraph();
	const resolver = createCapabilityResolver();
	const lifecycle = createLifecycleManager({
		registry,
		graph,
		resolver,
		eventBus,
		timeoutMs: activationTimeoutMs,
		...config.onUnhandledError !== void 0 ? { onUnhandledError: config.onUnhandledError } : {}
	});
	const logEntries = [];
	for (const ev of BROKER_EVENTS) eventBus.on(ev, (payload) => {
		const p = payload;
		const entry = {
			timestamp: p?.timestamp ?? Date.now(),
			event: ev,
			pluginKey: p?.pluginKey,
			message: `${ev}${p?.pluginKey ? ` [${p.pluginKey}]` : ""}`,
			data: p ? { ...p } : void 0
		};
		logEntries.push(entry);
		if (debug) console.debug("[broker]", ev, payload);
	});
	return {
		register(plugin) {
			registry.register(plugin);
			const provides = plugin.manifest.provides.map((p) => p.capability);
			const needs = plugin.manifest.needs.map((d) => d.capability);
			try {
				graph.addPlugin(plugin.key, provides, needs);
			} catch (err) {
				registry.unregister(plugin.key);
				if (err && typeof err === "object" && err.code === "CIRCULAR_DEPENDENCY") {
					const foreign = err;
					throw new CircularDependencyError(Array.isArray(foreign.cycle) && foreign.cycle.length > 0 ? [...foreign.cycle] : [plugin.key]);
				}
				throw err;
			}
		},
		async unregister(pluginKey) {
			if (registry.getState(pluginKey) === void 0) return;
			const plugin = registry.getPlugin(pluginKey);
			if (plugin) {
				const dependents = graph.getDependents(pluginKey);
				const providedCaps = plugin.manifest.provides.map((p) => p.capability);
				for (const depKey of dependents) {
					const dep = registry.getPlugin(depKey);
					if (!dep) continue;
					for (const cap of providedCaps) {
						if (dep.onDependencyRemoved) try {
							dep.onDependencyRemoved(cap, pluginKey);
						} catch (err) {
							config.onUnhandledError?.(err instanceof Error ? err : new Error(String(err)));
						}
						if (dep.manifest.needs.some((n) => n.capability === cap)) eventBus.emit("dependency:unresolved", {
							timestamp: Date.now(),
							event: "dependency:unresolved",
							pluginKey: depKey,
							capability: cap
						});
					}
				}
			}
			await registry.unregister(pluginKey);
			graph.removePlugin(pluginKey);
			resolver.unregisterPlugin(pluginKey);
			lifecycle.purgePlugin(pluginKey);
		},
		async activate() {
			return lifecycle.activate();
		},
		deactivate() {
			return lifecycle.deactivate();
		},
		activatePlugin(pluginKey) {
			return lifecycle.activatePlugin(pluginKey);
		},
		resolve(capability) {
			return lifecycle.resolve(capability, BROKER_NEEDED_BY, BROKER_VERSION);
		},
		resolveAll(capability) {
			return lifecycle.resolveAll(capability, BROKER_NEEDED_BY, BROKER_VERSION);
		},
		resolveOptional(capability) {
			return lifecycle.resolveOptional(capability, BROKER_NEEDED_BY, BROKER_VERSION);
		},
		getManifests() {
			const result = /* @__PURE__ */ new Map();
			for (const plugin of registry.getAllPlugins()) result.set(plugin.key, plugin.manifest);
			return result;
		},
		getManifest(pluginKey) {
			return registry.getPlugin(pluginKey)?.manifest;
		},
		getPluginStates() {
			return lifecycle.getPluginStates();
		},
		on(event, handler) {
			return eventBus.on(event, handler);
		},
		getLog() {
			const entries = [...logEntries];
			return {
				entries,
				filter(event) {
					return entries.filter((e) => e.event === event);
				},
				forPlugin(pluginKey) {
					return entries.filter((e) => e.pluginKey === pluginKey);
				},
				pendingDependencies: (() => {
					const pending = [];
					for (const plugin of registry.getAllPlugins()) {
						if (registry.getState(plugin.key) === "active") continue;
						for (const dep of plugin.manifest.needs) if (!resolver.resolve({
							capability: dep.capability,
							optional: true,
							variant: dep.variant
						}, plugin.key, plugin.version)) pending.push({
							pluginKey: plugin.key,
							capability: dep.capability,
							optional: dep.optional ?? false
						});
					}
					return pending;
				})()
			};
		}
	};
}
//#endregion
//#region ../rhodium/packages/pipeline-runner/dist/validate.js
function validateStageData(stageId, phase, schema, data) {
	if (!schema) return { ok: true };
	const errors = schema.validate(data);
	if (errors.length === 0) return { ok: true };
	return {
		ok: false,
		stageId,
		phase,
		errors
	};
}
//#endregion
//#region ../rhodium/packages/pipeline-runner/dist/events.js
var PIPELINE_EVENTS = {
	STARTED: "pipeline:started",
	ITERATION_STARTED: "pipeline:iteration-started",
	COMPLETE: "pipeline:complete",
	FAILED: "pipeline:failed",
	HALTED_ITERATION_LIMIT: "pipeline:halted-iteration-limit"
};
var STAGE_EVENTS = {
	STARTED: "stage:started",
	COMPLETE: "stage:complete",
	SKIPPED: "stage:skipped",
	DEGRADED: "stage:degraded"
};
var PROVIDER_EVENTS = {
	SELECTED: "provider:selected",
	COMPLETE: "provider:complete",
	FAILED: "provider:failed",
	FANOUT_STARTED: "providers:fanout-started",
	FANOUT_COMPLETE: "providers:fanout-complete"
};
//#endregion
//#region ../rhodium/packages/pipeline-runner/dist/reducers.js
/** Collects all provider outputs into an array (preserving input order). */
function concatReducer(results) {
	return results.map((r) => r.output);
}
/**
* Collects all provider outputs and flattens one level.
* Array outputs are spread into the result; non-array outputs pass through as-is.
* Use this when providers return arrays that should be merged into a single list.
* If providers may return non-arrays, use `concatReducer` instead.
*/
function flatConcatReducer(results) {
	return results.map((r) => r.output).flat(1);
}
/** Returns the output of the highest-priority provider. */
function priorityPickReducer(results) {
	if (results.length === 0) return void 0;
	let best = results[0];
	for (let i = 1; i < results.length; i++) if (results[i].priority > best.priority) best = results[i];
	return best.output;
}
//#endregion
//#region ../rhodium/packages/pipeline-runner/dist/stage.js
async function executeSingleStage(stage, ctx, input, resolve, emit) {
	const start = performance.now();
	emit(STAGE_EVENTS.STARTED, {
		runId: ctx.runId,
		stageId: stage.id,
		capability: stage.capability,
		policy: "single"
	});
	const inputCheck = validateStageData(stage.id, "input", stage.inputSchema, input);
	if (!inputCheck.ok) throw new Error(`Stage "${stage.id}" input validation failed: ${inputCheck.errors.join("; ")}`);
	let provider;
	try {
		provider = resolve(stage.capability);
	} catch (err) {
		if (stage.errorPolicy === "skip") {
			emit(STAGE_EVENTS.SKIPPED, {
				runId: ctx.runId,
				stageId: stage.id,
				reason: `Provider not found for "${stage.capability}"`
			});
			return;
		}
		if (stage.errorPolicy === "fall-through") {
			ctx.stageOutputs.set(stage.id, null);
			emit(STAGE_EVENTS.DEGRADED, {
				runId: ctx.runId,
				stageId: stage.id,
				reason: `Provider not found for "${stage.capability}"`
			});
			return;
		}
		throw err;
	}
	if (typeof provider !== "function") throw new Error(`Stage "${stage.id}": resolved capability "${stage.capability}" is not a function`);
	emit(PROVIDER_EVENTS.SELECTED, {
		runId: ctx.runId,
		stageId: stage.id,
		providerId: stage.capability,
		priority: 0
	});
	let output;
	const providerStart = performance.now();
	try {
		output = await provider(input, { iteration: ctx.iteration });
	} catch (err) {
		if (stage.errorPolicy === "skip") {
			emit(STAGE_EVENTS.SKIPPED, {
				runId: ctx.runId,
				stageId: stage.id,
				reason: `Provider execution failed for "${stage.capability}"`
			});
			return;
		}
		if (stage.errorPolicy === "fall-through") {
			ctx.stageOutputs.set(stage.id, null);
			emit(STAGE_EVENTS.DEGRADED, {
				runId: ctx.runId,
				stageId: stage.id,
				reason: `Provider execution failed for "${stage.capability}"`
			});
			return;
		}
		throw err;
	}
	emit(PROVIDER_EVENTS.COMPLETE, {
		runId: ctx.runId,
		stageId: stage.id,
		providerId: stage.capability,
		durationMs: Math.round(performance.now() - providerStart)
	});
	const outputCheck = validateStageData(stage.id, "output", stage.outputSchema, output);
	if (!outputCheck.ok) throw new Error(`Stage "${stage.id}" output validation failed: ${outputCheck.errors.join("; ")}`);
	ctx.stageOutputs.set(stage.id, output);
	emit(STAGE_EVENTS.COMPLETE, {
		runId: ctx.runId,
		stageId: stage.id,
		durationMs: Math.round(performance.now() - start)
	});
}
async function executeFanoutStage(stage, ctx, input, resolveAll, emit) {
	const start = performance.now();
	emit(STAGE_EVENTS.STARTED, {
		runId: ctx.runId,
		stageId: stage.id,
		capability: stage.capability,
		policy: "fanout"
	});
	const inputCheck = validateStageData(stage.id, "input", stage.inputSchema, input);
	if (!inputCheck.ok) throw new Error(`Stage "${stage.id}" input validation failed: ${inputCheck.errors.join("; ")}`);
	const providers = resolveAll(stage.capability);
	if (providers.length === 0) {
		emit(PROVIDER_EVENTS.FANOUT_STARTED, {
			runId: ctx.runId,
			stageId: stage.id,
			providerCount: 0
		});
		emit(PROVIDER_EVENTS.FANOUT_COMPLETE, {
			runId: ctx.runId,
			stageId: stage.id,
			successCount: 0,
			failureCount: 0
		});
		if (stage.errorPolicy === "skip") {
			emit(STAGE_EVENTS.SKIPPED, {
				runId: ctx.runId,
				stageId: stage.id,
				reason: `No providers registered for "${stage.capability}"`
			});
			return;
		}
		if (stage.errorPolicy === "fall-through") {
			ctx.stageOutputs.set(stage.id, null);
			emit(STAGE_EVENTS.DEGRADED, {
				runId: ctx.runId,
				stageId: stage.id,
				reason: `No providers registered for "${stage.capability}"`
			});
			return;
		}
		throw new Error(`Stage "${stage.id}": no providers registered for "${stage.capability}"`);
	}
	emit(PROVIDER_EVENTS.FANOUT_STARTED, {
		runId: ctx.runId,
		stageId: stage.id,
		providerCount: providers.length
	});
	const settled = await Promise.allSettled(providers.map(async (p) => {
		emit(PROVIDER_EVENTS.SELECTED, {
			runId: ctx.runId,
			stageId: stage.id,
			providerId: p.id,
			priority: p.priority
		});
		const providerStart = performance.now();
		try {
			const result = await p.impl(input, { iteration: ctx.iteration });
			emit(PROVIDER_EVENTS.COMPLETE, {
				runId: ctx.runId,
				stageId: stage.id,
				providerId: p.id,
				durationMs: Math.round(performance.now() - providerStart)
			});
			return {
				providerId: p.id,
				priority: p.priority,
				output: result
			};
		} catch (err) {
			return Promise.reject({
				providerId: p.id,
				error: err
			});
		}
	}));
	const successes = [];
	let failureCount = 0;
	for (const result of settled) if (result.status === "fulfilled") successes.push(result.value);
	else {
		failureCount++;
		const reason = result.reason;
		emit(PROVIDER_EVENTS.FAILED, {
			runId: ctx.runId,
			stageId: stage.id,
			providerId: reason.providerId ?? "unknown",
			error: String(reason.error ?? result.reason)
		});
	}
	emit(PROVIDER_EVENTS.FANOUT_COMPLETE, {
		runId: ctx.runId,
		stageId: stage.id,
		successCount: successes.length,
		failureCount
	});
	if (successes.length === 0) {
		if (stage.errorPolicy === "fall-through") {
			ctx.stageOutputs.set(stage.id, null);
			emit(STAGE_EVENTS.DEGRADED, {
				runId: ctx.runId,
				stageId: stage.id,
				reason: `All ${failureCount} providers failed for "${stage.capability}"`
			});
			return;
		}
		if (stage.errorPolicy === "skip") {
			emit(STAGE_EVENTS.SKIPPED, {
				runId: ctx.runId,
				stageId: stage.id,
				reason: `All providers failed for "${stage.capability}"`
			});
			return;
		}
		throw new Error(`Stage "${stage.id}": all providers failed for "${stage.capability}"`);
	}
	let reduced;
	if (!stage.reducer || stage.reducer.kind === "concat") reduced = concatReducer(successes);
	else if (stage.reducer.kind === "flat-concat") reduced = flatConcatReducer(successes);
	else if (stage.reducer.kind === "priority-pick") reduced = priorityPickReducer(successes);
	else throw new Error(`Stage "${stage.id}": custom reducers are not yet supported in this version`);
	const outputCheck = validateStageData(stage.id, "output", stage.outputSchema, reduced);
	if (!outputCheck.ok) throw new Error(`Stage "${stage.id}" output validation failed: ${outputCheck.errors.join("; ")}`);
	ctx.stageOutputs.set(stage.id, reduced);
	emit(STAGE_EVENTS.COMPLETE, {
		runId: ctx.runId,
		stageId: stage.id,
		durationMs: Math.round(performance.now() - start)
	});
}
//#endregion
//#region ../rhodium/packages/pipeline-runner/dist/runner.js
/**
* Compose stage input from inputFrom references or fall back to initial input.
*
* stageOutputs accumulates across iterations — a skipped stage leaves its
* previous iteration's value in the map. Downstream stages that reference a
* skipped stage via inputFrom will receive that stale value (or undefined on
* the first iteration). This is intentional: callers can detect a skipped
* upstream by checking for undefined in the composed input.
*/
function composeInput(stage, knownStageIds, ctx, initialInput) {
	const hasInputFrom = stage.inputFrom && stage.inputFrom.length > 0;
	const hasOptional = stage.inputFromOptional && stage.inputFromOptional.length > 0;
	if (!hasInputFrom && !hasOptional) return initialInput;
	const composed = {};
	if (stage.inputFrom) for (const sourceId of stage.inputFrom) {
		if (!knownStageIds.has(sourceId)) throw new Error(`Stage "${stage.id}" references unknown inputFrom stage "${sourceId}"`);
		composed[sourceId] = ctx.stageOutputs.get(sourceId);
	}
	if (stage.inputFromOptional) for (const sourceId of stage.inputFromOptional) {
		if (!knownStageIds.has(sourceId)) throw new Error(`Stage "${stage.id}" references unknown inputFromOptional stage "${sourceId}"`);
		const val = ctx.stageOutputs.get(sourceId);
		if (val !== void 0) composed[sourceId] = val;
	}
	return composed;
}
async function runPipeline(spec, initialInput, broker, emit) {
	const ctx = {
		specName: spec.name,
		runId: crypto.randomUUID(),
		stageOutputs: /* @__PURE__ */ new Map(),
		iteration: 1,
		startedAt: performance.now(),
		stopped: false
	};
	const knownStageIds = new Set(spec.stages.map((s) => s.id));
	emit(PIPELINE_EVENTS.STARTED, {
		runId: ctx.runId,
		specName: spec.name,
		iteration: ctx.iteration
	});
	let currentStageId = "<pre-loop>";
	try {
		for (let i = 0; i < spec.termination.maxIterations; i++) {
			ctx.iteration = i + 1;
			emit(PIPELINE_EVENTS.ITERATION_STARTED, {
				runId: ctx.runId,
				specName: spec.name,
				iteration: ctx.iteration
			});
			for (const stage of spec.stages) {
				currentStageId = stage.id;
				const input = composeInput(stage, knownStageIds, ctx, initialInput);
				if (stage.policy === "fanout") await executeFanoutStage(stage, ctx, input, broker.resolveAll, emit);
				else await executeSingleStage(stage, ctx, input, broker.resolve, emit);
			}
			if (spec.termination.stopCondition) {
				currentStageId = "<stop-condition>";
				const cap = spec.termination.stopCondition.capability;
				const checker = broker.resolve(cap);
				if (typeof checker !== "function") throw new Error(`Stop condition "${cap}" did not resolve to a function`);
				if (checker({
					iteration: ctx.iteration,
					stageOutputs: ctx.stageOutputs
				})) {
					ctx.stopped = true;
					break;
				}
			}
			if (i === spec.termination.maxIterations - 1 && !ctx.stopped) emit(PIPELINE_EVENTS.HALTED_ITERATION_LIMIT, {
				runId: ctx.runId,
				specName: spec.name,
				iteration: ctx.iteration
			});
		}
		const durationMs = Math.round(performance.now() - ctx.startedAt);
		emit(PIPELINE_EVENTS.COMPLETE, {
			runId: ctx.runId,
			specName: spec.name,
			durationMs,
			stageCount: spec.stages.length
		});
		return {
			runId: ctx.runId,
			specName: spec.name,
			stageOutputs: ctx.stageOutputs,
			iteration: ctx.iteration,
			durationMs,
			stopped: ctx.stopped
		};
	} catch (err) {
		emit(PIPELINE_EVENTS.FAILED, {
			runId: ctx.runId,
			specName: spec.name,
			failedStageId: currentStageId,
			error: err instanceof Error ? err.message : String(err)
		});
		throw err;
	}
}
//#endregion
//#region ../rhodium/packages/pipeline-runner/dist/plugin.js
function createPipelineRunnerPlugin() {
	return {
		key: "pipeline-runner",
		version: "0.1.0",
		manifest: {
			name: "Pipeline Runner",
			description: "Executes declared pipeline specs over broker-resolved capabilities",
			provides: [{ capability: "pipeline-runner" }],
			needs: []
		},
		activate(ctx) {
			ctx.provide("pipeline-runner", { async run(spec, initialInput) {
				return runPipeline(spec, initialInput, {
					resolve: (cap) => ctx.resolve(cap),
					resolveAll: (cap) => {
						return ctx.resolveAll(cap).map((impl, i) => ({
							id: `${cap}-${i}`,
							priority: 0,
							impl: typeof impl === "function" ? impl : (_input, _meta) => impl
						}));
					}
				}, (event, payload) => {
					ctx.emit(event, payload);
				});
			} });
		}
	};
}
//#endregion
//#region electron/logger.ts
var LOG_DIR = (0, node_path.join)((0, node_os.homedir)(), ".catalyst", "logs");
var MAX_AGE_DAYS = 7;
var stream = null;
function dateTag() {
	return (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
}
function ensureStream() {
	if (!stream) {
		(0, node_fs.mkdirSync)(LOG_DIR, { recursive: true });
		stream = (0, node_fs.createWriteStream)((0, node_path.join)(LOG_DIR, `catalyst-${dateTag()}.log`), { flags: "a" });
	}
	return stream;
}
function write(level, source, message, data) {
	const entry = {
		ts: (/* @__PURE__ */ new Date()).toISOString(),
		level,
		source,
		message,
		...data !== void 0 ? { data } : {}
	};
	ensureStream().write(JSON.stringify(entry) + "\n");
}
/** Prune log files older than MAX_AGE_DAYS. Call once at startup. */
function pruneOldLogs() {
	try {
		(0, node_fs.mkdirSync)(LOG_DIR, { recursive: true });
		const cutoff = Date.now() - MAX_AGE_DAYS * 24 * 60 * 60 * 1e3;
		for (const name of (0, node_fs.readdirSync)(LOG_DIR)) {
			const match = name.match(/^catalyst-(\d{4}-\d{2}-\d{2})\.log$/);
			if (match && new Date(match[1]).getTime() < cutoff) (0, node_fs.unlinkSync)((0, node_path.join)(LOG_DIR, name));
		}
	} catch {}
}
var log = {
	debug: (source, message, data) => write("debug", source, message, data),
	info: (source, message, data) => write("info", source, message, data),
	warn: (source, message, data) => write("warn", source, message, data),
	error: (source, message, data) => write("error", source, message, data)
};
//#endregion
//#region src/plugins/ollama-provider.ts
function ollamaProviderPlugin(options = {}) {
	const model = options.model ?? process.env.OLLAMA_MODEL ?? "gemma4";
	const baseUrl = options.baseUrl ?? process.env.OLLAMA_URL ?? "http://localhost:11434";
	return {
		key: "ollama-provider",
		version: "1.0.0",
		manifest: {
			name: "Ollama Provider",
			description: `LLM capability via Ollama (${model})`,
			provides: [{
				capability: "llm.generate",
				priority: 100
			}],
			needs: [],
			tags: ["llm"]
		},
		activate(ctx) {
			ctx.provide("llm.generate", { async generate(prompt, opts = {}) {
				const callId = crypto.randomUUID();
				const temperature = opts.temperature ?? .3;
				const caller = opts.caller ?? "unknown";
				ctx.emit("llm:call-start", {
					callId,
					caller,
					model,
					prompt,
					temperature
				});
				const start = performance.now();
				const url = new URL("/api/generate", baseUrl);
				const reqBody = JSON.stringify({
					model,
					prompt,
					stream: false,
					options: { temperature }
				});
				let data;
				try {
					data = await new Promise((resolve, reject) => {
						const req = node_http.default.request(url, {
							method: "POST",
							headers: {
								"Content-Type": "application/json",
								"Content-Length": Buffer.byteLength(reqBody)
							}
						}, (res) => {
							const chunks = [];
							res.on("data", (chunk) => chunks.push(chunk));
							res.on("end", () => {
								const body = Buffer.concat(chunks).toString();
								if (res.statusCode && res.statusCode >= 400) reject(/* @__PURE__ */ new Error(`Ollama error ${res.statusCode}: ${body}`));
								else resolve(JSON.parse(body));
							});
						});
						req.on("error", (err) => reject(err));
						req.write(reqBody);
						req.end();
					});
				} catch (err) {
					const durationMs = Math.round(performance.now() - start);
					const error = `Ollama unreachable at ${baseUrl}: ${err.message}`;
					ctx.emit("llm:call-failed", {
						callId,
						caller,
						model,
						error,
						durationMs
					});
					throw new Error(error);
				}
				const durationMs = Math.round(performance.now() - start);
				ctx.emit("llm:call-complete", {
					callId,
					caller,
					model,
					response: data.response,
					temperature,
					durationMs,
					promptTokens: data.prompt_eval_count,
					responseTokens: data.eval_count
				});
				return data.response;
			} });
		}
	};
}
//#endregion
//#region src/context.ts
var CURRENT_CONTEXT = null;
function setCatalystContext(ctx) {
	CURRENT_CONTEXT = ctx;
}
function getCatalystContext() {
	if (!CURRENT_CONTEXT) throw new Error("Catalyst context not initialized — call setCatalystContext first");
	return CURRENT_CONTEXT;
}
/** Per-run pipeline scope — set before each pipeline execution, cleared after. */
var PIPELINE_COMPANY_ID;
function setPipelineCompanyId(id) {
	PIPELINE_COMPANY_ID = id;
}
function getPipelineCompanyId() {
	return PIPELINE_COMPANY_ID;
}
function buildUserContext(userName) {
	const userDataDir = (0, node_path.join)((0, node_os.homedir)(), ".catalyst", "users", userName);
	return {
		userName,
		userDataDir,
		docsDir: (0, node_path.join)(userDataDir, "docs"),
		dbPaths: {
			catalog: (0, node_path.join)(userDataDir, "catalyst.db"),
			results: (0, node_path.join)(userDataDir, "results.db"),
			traces: (0, node_path.join)(userDataDir, "traces.db")
		}
	};
}
//#endregion
//#region src/plugins/results-store.ts
function resultsStorePlugin(options = {}) {
	return {
		key: "results-store",
		version: "1.0.0",
		manifest: {
			name: "Results Store",
			description: "Persists pipeline results to SQLite",
			provides: [{ capability: "results.store" }, { capability: "results.query" }],
			needs: []
		},
		activate(ctx) {
			const dbPath = options.dbPath ?? getCatalystContext().dbPaths.results;
			if (dbPath !== ":memory:") (0, node_fs.mkdirSync)((0, node_path.dirname)(dbPath), { recursive: true });
			const db = require_platform.openDatabase(dbPath);
			db.exec(`CREATE TABLE IF NOT EXISTS runs (
        id TEXT PRIMARY KEY,
        created_at TEXT NOT NULL,
        resume_name TEXT NOT NULL,
        iteration INTEGER NOT NULL,
        duration_ms INTEGER NOT NULL,
        model TEXT NOT NULL
      )`);
			const cols = db.pragma("table_info(runs)");
			const colNames = new Set(cols.map((c) => c.name));
			if (!colNames.has("profile_json")) {
				db.exec(`ALTER TABLE runs ADD COLUMN profile_json TEXT`);
				db.exec(`ALTER TABLE runs ADD COLUMN normalized_jobs_json TEXT`);
				db.exec(`ALTER TABLE runs ADD COLUMN analyses_json TEXT`);
				db.exec(`ALTER TABLE runs ADD COLUMN reflect_rationale TEXT`);
				db.exec(`ALTER TABLE runs ADD COLUMN confidence REAL`);
			}
			if (!colNames.has("company_source_id")) db.exec(`ALTER TABLE runs ADD COLUMN company_source_id TEXT`);
			if (!colNames.has("summary")) db.exec(`ALTER TABLE runs ADD COLUMN summary TEXT`);
			db.exec(`CREATE TABLE IF NOT EXISTS ranked_jobs (
        run_id TEXT NOT NULL,
        rank INTEGER NOT NULL,
        job_id TEXT NOT NULL,
        title TEXT NOT NULL,
        company TEXT NOT NULL,
        url TEXT NOT NULL,
        score INTEGER NOT NULL,
        skill INTEGER NOT NULL,
        culture INTEGER NOT NULL,
        salary INTEGER NOT NULL,
        summary TEXT NOT NULL,
        source TEXT NOT NULL,
        job_json TEXT NOT NULL
      )`);
			const saveTransaction = db.transaction((runId, resumeName, model, iteration, durationMs, jobs, companySourceId) => {
				db.prepare(`INSERT INTO runs (id, created_at, resume_name, iteration, duration_ms, model, company_source_id)
           VALUES (?,?,?,?,?,?,?)`).run(runId, (/* @__PURE__ */ new Date()).toISOString(), resumeName, iteration, durationMs, model, companySourceId);
				for (const [i, ranked] of jobs.entries()) db.prepare(`INSERT INTO ranked_jobs VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)`).run(runId, i + 1, ranked.job.id, ranked.job.title, ranked.job.company, ranked.job.url, ranked.overallScore, ranked.scores.skill, ranked.scores.culture, ranked.scores.salary, ranked.summary, ranked.job.source, JSON.stringify(ranked));
			});
			ctx.provide("results.store", {
				async save(runId, resumeName, model, iteration, durationMs, jobs, companySourceId) {
					saveTransaction(runId, resumeName, model, iteration, durationMs, jobs, companySourceId ?? null);
				},
				saveSummary(runId, summary) {
					db.prepare("UPDATE runs SET summary = ? WHERE id = ?").run(summary, runId);
				},
				saveEnrichment(runId, data) {
					db.prepare(`UPDATE runs SET profile_json = ?, normalized_jobs_json = ?, analyses_json = ?,
             reflect_rationale = ?, confidence = ? WHERE id = ?`).run(data.profile ? JSON.stringify(data.profile) : null, data.normalizedJobs ? JSON.stringify(data.normalizedJobs) : null, data.analyses ? JSON.stringify(data.analyses) : null, data.reflectRationale ?? null, data.confidence ?? null, runId);
				}
			});
			ctx.provide("results.query", {
				async listRuns() {
					return db.prepare(`SELECT id, created_at as createdAt, resume_name as resumeName,
                    iteration, duration_ms as durationMs, model, summary
             FROM runs ORDER BY created_at DESC`).all();
				},
				async getJobs(runId) {
					return db.prepare(`SELECT job_json FROM ranked_jobs WHERE run_id = ? ORDER BY rank`).all(runId).map((r) => JSON.parse(r.job_json));
				},
				async getRunDetail(runId) {
					const run = db.prepare(`SELECT id, created_at as createdAt, resume_name as resumeName,
                    iteration, duration_ms as durationMs, model,
                    profile_json, normalized_jobs_json, analyses_json,
                    reflect_rationale, confidence, summary
             FROM runs WHERE id = ?`).get(runId);
					if (!run) return null;
					const jobRows = db.prepare(`SELECT job_json FROM ranked_jobs WHERE run_id = ? ORDER BY rank`).all(runId);
					return {
						run: {
							id: run.id,
							createdAt: run.createdAt,
							resumeName: run.resumeName,
							iteration: run.iteration,
							durationMs: run.durationMs,
							model: run.model
						},
						jobs: jobRows.map((r) => JSON.parse(r.job_json)),
						profile: run.profile_json ? JSON.parse(run.profile_json) : void 0,
						normalizedJobs: run.normalized_jobs_json ? JSON.parse(run.normalized_jobs_json) : void 0,
						analyses: run.analyses_json ? JSON.parse(run.analyses_json) : void 0,
						reflectRationale: run.reflect_rationale ?? void 0,
						confidence: run.confidence ?? void 0,
						summary: run.summary ?? void 0
					};
				},
				async getLatestRunId() {
					return db.prepare(`SELECT id FROM runs ORDER BY created_at DESC LIMIT 1`).get()?.id ?? null;
				}
			});
		}
	};
}
//#endregion
//#region src/plugins/trace-store.ts
function traceStorePlugin(options = {}) {
	return {
		key: "trace-store",
		version: "1.0.0",
		manifest: {
			name: "Trace Store",
			description: "Persists pipeline traces to SQLite for post-run review",
			provides: [{ capability: "trace.store" }, { capability: "trace.query" }],
			needs: []
		},
		activate(ctx) {
			const dbPath = options.dbPath ?? getCatalystContext().dbPaths.traces;
			if (dbPath !== ":memory:") (0, node_fs.mkdirSync)((0, node_path.dirname)(dbPath), { recursive: true });
			const db = require_platform.openDatabase(dbPath);
			db.exec(`CREATE TABLE IF NOT EXISTS trace_runs (
        run_id       TEXT PRIMARY KEY,
        spec_name    TEXT NOT NULL,
        model        TEXT NOT NULL,
        resume_name  TEXT NOT NULL,
        started_at   TEXT NOT NULL,
        completed_at TEXT,
        duration_ms  INTEGER,
        iteration    INTEGER,
        status       TEXT NOT NULL DEFAULT 'running'
      )`);
			db.exec(`CREATE TABLE IF NOT EXISTS trace_events (
        id        INTEGER PRIMARY KEY AUTOINCREMENT,
        run_id    TEXT NOT NULL,
        timestamp TEXT NOT NULL,
        event     TEXT NOT NULL,
        stage_id  TEXT,
        plugin_id TEXT,
        duration_ms INTEGER,
        data_json TEXT,
        FOREIGN KEY (run_id) REFERENCES trace_runs(run_id)
      )`);
			db.exec(`CREATE INDEX IF NOT EXISTS idx_trace_events_run ON trace_events(run_id)`);
			db.exec(`CREATE TABLE IF NOT EXISTS trace_llm_calls (
        id              INTEGER PRIMARY KEY AUTOINCREMENT,
        run_id          TEXT NOT NULL,
        call_id         TEXT NOT NULL UNIQUE,
        plugin_key      TEXT NOT NULL,
        model           TEXT NOT NULL,
        prompt          TEXT NOT NULL,
        response        TEXT,
        temperature     REAL,
        started_at      TEXT NOT NULL,
        completed_at    TEXT,
        duration_ms     INTEGER,
        prompt_tokens   INTEGER,
        response_tokens INTEGER,
        error           TEXT,
        FOREIGN KEY (run_id) REFERENCES trace_runs(run_id)
      )`);
			db.exec(`CREATE INDEX IF NOT EXISTS idx_trace_llm_run ON trace_llm_calls(run_id)`);
			const insertRun = db.prepare(`INSERT INTO trace_runs (run_id, spec_name, model, resume_name, started_at, status)
         VALUES (?, ?, ?, ?, ?, 'running')`);
			const completeRun = db.prepare(`UPDATE trace_runs SET completed_at = ?, duration_ms = ?, iteration = ?, status = 'complete'
         WHERE run_id = ?`);
			const failRun = db.prepare(`UPDATE trace_runs SET completed_at = ?, status = 'failed' WHERE run_id = ?`);
			const insertEvent = db.prepare(`INSERT INTO trace_events (run_id, timestamp, event, stage_id, plugin_id, duration_ms, data_json)
         VALUES (?, ?, ?, ?, ?, ?, ?)`);
			const insertLLMCall = db.prepare(`INSERT INTO trace_llm_calls (run_id, call_id, plugin_key, model, prompt, temperature, started_at)
         VALUES (?, ?, ?, ?, ?, ?, ?)`);
			const completeLLMCall = db.prepare(`UPDATE trace_llm_calls
         SET response = ?, completed_at = ?, duration_ms = ?, prompt_tokens = ?, response_tokens = ?
         WHERE call_id = ?`);
			const failLLMCall = db.prepare(`UPDATE trace_llm_calls SET error = ?, completed_at = ?, duration_ms = ? WHERE call_id = ?`);
			ctx.provide("trace.store", {
				startRun(runId, specName, model, resumeName) {
					insertRun.run(runId, specName, model, resumeName, (/* @__PURE__ */ new Date()).toISOString());
				},
				completeRun(runId, durationMs, iteration) {
					completeRun.run((/* @__PURE__ */ new Date()).toISOString(), durationMs, iteration, runId);
				},
				failRun(runId, _error) {
					failRun.run((/* @__PURE__ */ new Date()).toISOString(), runId);
				},
				recordEvent(runId, event, payload) {
					insertEvent.run(runId, (/* @__PURE__ */ new Date()).toISOString(), event, payload.stageId ?? null, payload.providerId ?? null, payload.durationMs ?? null, JSON.stringify(payload));
				},
				startLLMCall(runId, callId, pluginKey, model, prompt, temperature) {
					insertLLMCall.run(runId, callId, pluginKey, model, prompt, temperature, (/* @__PURE__ */ new Date()).toISOString());
				},
				completeLLMCall(callId, response, durationMs, tokens) {
					completeLLMCall.run(response, (/* @__PURE__ */ new Date()).toISOString(), durationMs, tokens?.prompt ?? null, tokens?.response ?? null, callId);
				},
				failLLMCall(callId, error, durationMs) {
					failLLMCall.run(error, (/* @__PURE__ */ new Date()).toISOString(), durationMs, callId);
				}
			});
			ctx.provide("trace.query", {
				listRuns() {
					return db.prepare(`SELECT run_id as runId, spec_name as specName, model, resume_name as resumeName,
                    started_at as startedAt, completed_at as completedAt,
                    duration_ms as durationMs, iteration, status
             FROM trace_runs ORDER BY started_at DESC`).all();
				},
				getRun(runId) {
					return db.prepare(`SELECT run_id as runId, spec_name as specName, model, resume_name as resumeName,
                    started_at as startedAt, completed_at as completedAt,
                    duration_ms as durationMs, iteration, status
             FROM trace_runs WHERE run_id = ?`).get(runId) ?? null;
				},
				getEvents(runId) {
					return db.prepare(`SELECT id, run_id as runId, timestamp, event, stage_id as stageId,
                    plugin_id as pluginId, duration_ms as durationMs, data_json
             FROM trace_events WHERE run_id = ? ORDER BY id`).all(runId).map((r) => ({
						...r,
						data: r.data_json ? JSON.parse(r.data_json) : void 0,
						data_json: void 0
					}));
				},
				getLLMCalls(runId) {
					return db.prepare(`SELECT id, run_id as runId, call_id as callId, plugin_key as pluginKey,
                    model, prompt, response, temperature,
                    started_at as startedAt, completed_at as completedAt,
                    duration_ms as durationMs, prompt_tokens as promptTokens,
                    response_tokens as responseTokens, error
             FROM trace_llm_calls WHERE run_id = ? ORDER BY id`).all(runId);
				},
				getLLMCall(callId) {
					return db.prepare(`SELECT id, run_id as runId, call_id as callId, plugin_key as pluginKey,
                    model, prompt, response, temperature,
                    started_at as startedAt, completed_at as completedAt,
                    duration_ms as durationMs, prompt_tokens as promptTokens,
                    response_tokens as responseTokens, error
             FROM trace_llm_calls WHERE call_id = ?`).get(callId) ?? null;
				}
			});
		}
	};
}
//#endregion
//#region src/plugins/catalog-db.ts
function catalogDbPlugin(options = {}) {
	return {
		key: "catalog-db",
		version: "1.0.0",
		manifest: {
			name: "Catalog Database",
			description: "Shared SQLite database for company sources and indexed jobs",
			provides: [{ capability: "catalog.db" }],
			needs: [],
			tags: ["indexer"]
		},
		activate(ctx) {
			const dbPath = options.dbPath ?? getCatalystContext().dbPaths.catalog;
			if (dbPath !== ":memory:") (0, node_fs.mkdirSync)((0, node_path.dirname)(dbPath), { recursive: true });
			const db = require_platform.openDatabase(dbPath);
			db.exec("PRAGMA foreign_keys = ON");
			db.exec(`CREATE TABLE IF NOT EXISTS company_sources (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        url TEXT NOT NULL UNIQUE,
        ats_type TEXT NOT NULL,
        slug TEXT NOT NULL,
        added_at TEXT NOT NULL,
        last_indexed_at TEXT,
        job_count INTEGER NOT NULL DEFAULT 0,
        enabled INTEGER NOT NULL DEFAULT 1
      )`);
			db.exec(`CREATE TABLE IF NOT EXISTS indexed_jobs (
        id TEXT NOT NULL,
        company_source_id TEXT NOT NULL,
        source TEXT NOT NULL,
        title TEXT NOT NULL,
        company TEXT NOT NULL,
        location TEXT NOT NULL,
        description TEXT NOT NULL,
        url TEXT NOT NULL,
        posted_at TEXT NOT NULL,
        first_seen_at TEXT NOT NULL,
        last_seen_at TEXT NOT NULL,
        is_active INTEGER NOT NULL DEFAULT 1,
        ats_type TEXT NOT NULL,
        PRIMARY KEY (id, company_source_id),
        FOREIGN KEY (company_source_id) REFERENCES company_sources(id) ON DELETE CASCADE
      )`);
			db.exec(`CREATE INDEX IF NOT EXISTS idx_indexed_jobs_active
              ON indexed_jobs(is_active)`);
			db.exec(`CREATE INDEX IF NOT EXISTS idx_indexed_jobs_company
              ON indexed_jobs(company_source_id)`);
			if (!db.prepare("SELECT COUNT(*) as c FROM pragma_table_info('company_sources') WHERE name = 'filters'").get().c) db.exec("ALTER TABLE company_sources ADD COLUMN filters TEXT NOT NULL DEFAULT '{}'");
			if (!db.prepare("SELECT COUNT(*) as c FROM pragma_table_info('indexed_jobs') WHERE name = 'department'").get().c) db.exec("ALTER TABLE indexed_jobs ADD COLUMN department TEXT");
			ctx.provide("catalog.db", db);
		}
	};
}
//#endregion
//#region src/plugins/ats-detector.ts
var IGNORED_SUBDOMAINS = new Set([
	"jobs",
	"careers",
	"boards",
	"apply",
	"www",
	"hire"
]);
var IGNORED_PATH_SEGMENTS = new Set([
	"careers",
	"jobs",
	"openings",
	"positions",
	"work",
	"join",
	"apply"
]);
/** Extract candidate slugs from a career page URL. */
function extractSlugs(url) {
	const slugs = /* @__PURE__ */ new Set();
	try {
		const parsed = new URL(url);
		const host = parsed.hostname.replace(/^www\./, "");
		const parts = host.split(".");
		if (host.endsWith(".lever.co") || host.endsWith(".greenhouse.io") || host.endsWith(".ashbyhq.com") || host.endsWith(".workable.com")) {
			const pathSegments = parsed.pathname.split("/").filter(Boolean);
			if (pathSegments[0]) slugs.add(pathSegments[0].toLowerCase());
			return [...slugs];
		}
		const domainBase = parts[0];
		if (domainBase && !IGNORED_SUBDOMAINS.has(domainBase)) slugs.add(domainBase);
		if (domainBase && IGNORED_SUBDOMAINS.has(domainBase) && parts[1]) slugs.add(parts[1]);
		const segments = parsed.pathname.split("/").filter(Boolean);
		for (const seg of segments) if (!IGNORED_PATH_SEGMENTS.has(seg.toLowerCase())) slugs.add(seg.toLowerCase());
	} catch {
		slugs.add(url.replace(/[^a-z0-9-]/gi, "").toLowerCase());
	}
	return [...slugs];
}
async function probeATS(slug, atsType, url, timeout) {
	const controller = new AbortController();
	const timer = setTimeout(() => controller.abort(), timeout);
	try {
		const res = await fetch(url, { signal: controller.signal });
		if (!res.ok) return null;
		const data = await res.json();
		if (atsType === "greenhouse") {
			if (!data?.jobs || !Array.isArray(data.jobs)) return null;
			return {
				atsType,
				slug,
				name: data.jobs[0]?.company_name ?? slug
			};
		}
		if (atsType === "lever") {
			if (!Array.isArray(data) || data.length === 0) return null;
			return {
				atsType,
				slug,
				name: slug.charAt(0).toUpperCase() + slug.slice(1)
			};
		}
		if (atsType === "ashby") {
			if (!data?.jobs || !Array.isArray(data.jobs)) return null;
			return {
				atsType,
				slug,
				name: data.jobs[0]?.organizationName ?? slug
			};
		}
		if (atsType === "workable") {
			if (!data?.jobs || !Array.isArray(data.jobs)) return null;
			return {
				atsType,
				slug,
				name: data.name ?? slug
			};
		}
		return null;
	} catch {
		return null;
	} finally {
		clearTimeout(timer);
	}
}
function buildProbeUrl(atsType, slug) {
	switch (atsType) {
		case "greenhouse": return `https://boards-api.greenhouse.io/v1/boards/${slug}/jobs`;
		case "lever": return `https://api.lever.co/v0/postings/${slug}?mode=json`;
		case "ashby": return `https://api.ashbyhq.com/posting-api/job-board/${slug}`;
		case "workable": return `https://apply.workable.com/api/v1/widget/accounts/${slug}`;
	}
}
var ATS_TYPES = [
	"greenhouse",
	"lever",
	"ashby",
	"workable"
];
var PROBE_TIMEOUT = 3e3;
function atsDetectorPlugin() {
	return {
		key: "ats-detector",
		version: "1.0.0",
		manifest: {
			name: "ATS Detector",
			description: "Detects which ATS platform a company uses by probing known API endpoints",
			provides: [{ capability: "ats.detect" }],
			needs: [],
			tags: ["indexer"]
		},
		activate(ctx) {
			ctx.provide("ats.detect", { async detect(url) {
				const probes = extractSlugs(url).flatMap((slug) => ATS_TYPES.map((atsType) => probeATS(slug, atsType, buildProbeUrl(atsType, slug), PROBE_TIMEOUT)));
				const results = await Promise.allSettled(probes);
				for (const result of results) if (result.status === "fulfilled" && result.value) return result.value;
				return null;
			} });
		}
	};
}
//#endregion
//#region src/plugins/company-store.ts
function companyStorePlugin() {
	return {
		key: "company-store",
		version: "1.0.0",
		manifest: {
			name: "Company Store",
			description: "Persists watched company sources to SQLite",
			provides: [{ capability: "company.store" }],
			needs: [{ capability: "catalog.db" }, { capability: "ats.detect" }],
			tags: ["indexer"]
		},
		activate(ctx) {
			const db = ctx.resolve("catalog.db");
			const atsDetect = ctx.resolve("ats.detect");
			ctx.provide("company.store", {
				async add(url) {
					const existing = db.prepare("SELECT * FROM company_sources WHERE url = ?").get(url);
					if (existing) return rowToCompanySource(existing);
					const detection = await atsDetect.detect(url);
					if (!detection) throw new Error(`Could not detect ATS for ${url}. Supported: Greenhouse, Lever, Ashby, Workable.`);
					const source = {
						id: crypto.randomUUID(),
						name: detection.name,
						url,
						atsType: detection.atsType,
						slug: detection.slug,
						addedAt: (/* @__PURE__ */ new Date()).toISOString(),
						jobCount: 0,
						enabled: true
					};
					db.prepare(`INSERT INTO company_sources (id, name, url, ats_type, slug, added_at, job_count, enabled)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`).run(source.id, source.name, source.url, source.atsType, source.slug, source.addedAt, source.jobCount, source.enabled ? 1 : 0);
					return source;
				},
				async remove(id) {
					db.prepare("DELETE FROM company_sources WHERE id = ?").run(id);
				},
				async list() {
					return db.prepare("SELECT * FROM company_sources ORDER BY added_at DESC").all().map(rowToCompanySource);
				},
				async get(id) {
					const row = db.prepare("SELECT * FROM company_sources WHERE id = ?").get(id);
					return row ? rowToCompanySource(row) : null;
				},
				async setEnabled(id, enabled) {
					db.prepare("UPDATE company_sources SET enabled = ? WHERE id = ?").run(enabled ? 1 : 0, id);
				},
				async updateIndexed(id, jobCount) {
					db.prepare("UPDATE company_sources SET last_indexed_at = ?, job_count = ? WHERE id = ?").run((/* @__PURE__ */ new Date()).toISOString(), jobCount, id);
				},
				async setFilters(id, filters) {
					db.prepare("UPDATE company_sources SET filters = ? WHERE id = ?").run(JSON.stringify(filters), id);
				}
			});
		}
	};
}
function rowToCompanySource(row) {
	let filters;
	try {
		const parsed = JSON.parse(row.filters || "{}");
		if (Object.keys(parsed).length > 0) filters = parsed;
	} catch {}
	return {
		id: row.id,
		name: row.name,
		url: row.url,
		atsType: row.ats_type,
		slug: row.slug,
		addedAt: row.added_at,
		lastIndexedAt: row.last_indexed_at ?? void 0,
		jobCount: row.job_count,
		enabled: !!row.enabled,
		filters
	};
}
//#endregion
//#region src/plugins/job-index-store.ts
function escapeLike(s) {
	return s.replace(/\\/g, "\\\\").replace(/%/g, "\\%").replace(/_/g, "\\_");
}
function jobIndexStorePlugin() {
	return {
		key: "job-index-store",
		version: "1.0.0",
		manifest: {
			name: "Job Index Store",
			description: "SQLite storage for indexed job listings",
			provides: [{ capability: "job.index" }],
			needs: [{ capability: "catalog.db" }],
			tags: ["indexer"]
		},
		activate(ctx) {
			const db = ctx.resolve("catalog.db");
			const upsertStmt = db.prepare(`
        INSERT INTO indexed_jobs (id, company_source_id, source, title, company, location,
                                  description, url, posted_at, first_seen_at, last_seen_at,
                                  is_active, ats_type, department)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?, ?)
        ON CONFLICT(id, company_source_id) DO UPDATE SET
          title = excluded.title,
          company = excluded.company,
          location = excluded.location,
          description = excluded.description,
          url = excluded.url,
          posted_at = excluded.posted_at,
          last_seen_at = excluded.last_seen_at,
          is_active = 1,
          department = excluded.department
      `);
			ctx.provide("job.index", {
				async upsertJobs(companySourceId, jobs, atsType) {
					const now = (/* @__PURE__ */ new Date()).toISOString();
					db.transaction(() => {
						for (const job of jobs) upsertStmt.run(job.id, companySourceId, job.source, job.title, job.company, job.location, job.description, job.url, job.postedAt, now, now, atsType, job.department ?? null);
					})();
					return jobs.length;
				},
				async markInactive(companySourceId, activeIds) {
					if (activeIds.length === 0) return db.prepare("UPDATE indexed_jobs SET is_active = 0 WHERE company_source_id = ? AND is_active = 1").run(companySourceId).changes;
					const placeholders = activeIds.map(() => "?").join(",");
					return db.prepare(`UPDATE indexed_jobs SET is_active = 0
             WHERE company_source_id = ? AND is_active = 1
             AND id NOT IN (${placeholders})`).run(companySourceId, ...activeIds).changes;
				},
				async query(filter) {
					let sql = "SELECT * FROM indexed_jobs WHERE is_active = 1";
					const params = [];
					if (filter?.companyIds?.length) {
						const placeholders = filter.companyIds.map(() => "?").join(",");
						sql += ` AND company_source_id IN (${placeholders})`;
						params.push(...filter.companyIds);
					}
					if (filter?.titleKeywords?.length) {
						const conditions = filter.titleKeywords.map(() => "LOWER(title) LIKE ? ESCAPE '\\'");
						sql += ` AND (${conditions.join(" OR ")})`;
						for (const kw of filter.titleKeywords) params.push(`%${escapeLike(kw.toLowerCase())}%`);
					}
					if (filter?.locations?.length) {
						const conditions = filter.locations.map(() => "LOWER(location) LIKE ? ESCAPE '\\'");
						sql += ` AND (${conditions.join(" OR ")})`;
						for (const loc of filter.locations) params.push(`%${escapeLike(loc.toLowerCase())}%`);
					}
					if (filter?.departments?.length) {
						const conditions = filter.departments.map(() => "LOWER(department) LIKE ? ESCAPE '\\'");
						sql += ` AND (${conditions.join(" OR ")})`;
						for (const dept of filter.departments) params.push(`%${escapeLike(dept.toLowerCase())}%`);
					}
					if (filter?.postedWithinDays) {
						const cutoff = /* @__PURE__ */ new Date();
						cutoff.setDate(cutoff.getDate() - filter.postedWithinDays);
						sql += " AND posted_at >= ?";
						params.push(cutoff.toISOString());
					}
					sql += " ORDER BY posted_at DESC LIMIT 500";
					return db.prepare(sql).all(...params).map(rowToIndexedJob);
				},
				async stats() {
					const total = db.prepare("SELECT COUNT(*) as c FROM indexed_jobs").get();
					const active = db.prepare("SELECT COUNT(*) as c FROM indexed_jobs WHERE is_active = 1").get();
					const companies = db.prepare("SELECT COUNT(DISTINCT company_source_id) as c FROM indexed_jobs").get();
					return {
						totalJobs: total.c,
						activeJobs: active.c,
						companies: companies.c
					};
				}
			});
		}
	};
}
function rowToIndexedJob(row) {
	return {
		id: row.id,
		source: row.source,
		title: row.title,
		company: row.company,
		location: row.location,
		description: row.description,
		url: row.url,
		postedAt: row.posted_at,
		companySourceId: row.company_source_id,
		firstSeenAt: row.first_seen_at,
		lastSeenAt: row.last_seen_at,
		isActive: !!row.is_active,
		atsType: row.ats_type,
		department: row.department ?? void 0
	};
}
//#endregion
//#region src/concurrency.ts
/**
* Run an async function over items with a concurrency limit, collecting results.
* Results preserve input ordering. If `onError` is provided, failed items are
* excluded from results; otherwise the first error rejects the entire call.
*/
async function withConcurrency(items, fn, options = {}) {
	const limit = options.limit ?? 3;
	if (!items.length) return [];
	const results = new Array(items.length);
	const succeeded = new Array(items.length).fill(false);
	let nextIndex = 0;
	async function worker() {
		while (nextIndex < items.length) {
			const idx = nextIndex++;
			try {
				results[idx] = await fn(items[idx], idx);
				succeeded[idx] = true;
			} catch (err) {
				if (options.onError) options.onError(err, idx);
				else throw err;
			}
		}
	}
	await Promise.all(Array.from({ length: Math.min(limit, items.length) }, () => worker()));
	return results.filter((_, i) => succeeded[i]);
}
//#endregion
//#region src/plugins/job-indexer.ts
async function fetchGreenhouseJobs(slug, companyName) {
	const res = await fetchWithTimeout(`https://boards-api.greenhouse.io/v1/boards/${slug}/jobs?content=true`, 15e3);
	if (!res.ok) throw new Error(`Greenhouse API error: ${res.status}`);
	return (await res.json()).jobs.map((j) => ({
		id: `greenhouse-${j.id}`,
		source: `greenhouse:${slug}`,
		title: j.title,
		company: companyName,
		location: j.location?.name ?? "Unknown",
		description: stripHtml(j.content ?? ""),
		url: j.absolute_url,
		department: j.departments?.[0]?.name,
		postedAt: j.updated_at ?? j.first_published ?? (/* @__PURE__ */ new Date()).toISOString()
	}));
}
async function fetchLeverJobs(slug, companyName) {
	const res = await fetchWithTimeout(`https://api.lever.co/v0/postings/${slug}?mode=json`, 15e3);
	if (!res.ok) throw new Error(`Lever API error: ${res.status}`);
	return (await res.json()).map((j) => ({
		id: `lever-${j.id}`,
		source: `lever:${slug}`,
		title: j.text,
		company: companyName,
		location: j.categories?.location ?? "Unknown",
		description: j.descriptionPlain ?? stripHtml(j.description ?? ""),
		url: j.hostedUrl,
		department: j.categories?.department ?? j.categories?.team,
		postedAt: j.createdAt ? new Date(j.createdAt).toISOString() : (/* @__PURE__ */ new Date()).toISOString()
	}));
}
async function fetchAshbyJobs(slug, companyName) {
	const res = await fetchWithTimeout(`https://api.ashbyhq.com/posting-api/job-board/${slug}?includeCompensation=true`, 15e3);
	if (!res.ok) throw new Error(`Ashby API error: ${res.status}`);
	return (await res.json()).jobs.map((j) => ({
		id: `ashby-${j.id}`,
		source: `ashby:${slug}`,
		title: j.title,
		company: companyName,
		location: j.location ?? "Unknown",
		description: j.descriptionPlain ?? stripHtml(j.descriptionHtml ?? ""),
		url: j.jobUrl,
		department: j.department,
		postedAt: j.publishedAt ?? (/* @__PURE__ */ new Date()).toISOString()
	}));
}
async function fetchWorkableJobs(slug, companyName) {
	const res = await fetchWithTimeout(`https://apply.workable.com/api/v1/widget/accounts/${slug}`, 15e3);
	if (!res.ok) throw new Error(`Workable API error: ${res.status}`);
	return (await res.json()).jobs.map((j) => ({
		id: `workable-${j.shortcode}`,
		source: `workable:${slug}`,
		title: j.title,
		company: companyName,
		location: [j.city, j.country].filter(Boolean).join(", ") || "Unknown",
		description: j.description ?? "",
		url: j.url ?? `https://apply.workable.com/${slug}/j/${j.shortcode}/`,
		department: j.department,
		postedAt: j.created_at ?? (/* @__PURE__ */ new Date()).toISOString()
	}));
}
var ATS_FETCHERS = {
	greenhouse: fetchGreenhouseJobs,
	lever: fetchLeverJobs,
	ashby: fetchAshbyJobs,
	workable: fetchWorkableJobs
};
function applyFilters(jobs, filters) {
	return jobs.filter((job) => {
		if (filters.titleKeywords?.length) {
			const titleLower = job.title.toLowerCase();
			if (!filters.titleKeywords.some((kw) => titleLower.includes(kw.toLowerCase()))) return false;
		}
		if (filters.locations?.length) {
			const locLower = job.location.toLowerCase();
			if (!filters.locations.some((loc) => locLower.includes(loc.toLowerCase()))) return false;
		}
		if (filters.departments?.length && job.department) {
			const deptLower = job.department.toLowerCase();
			if (!filters.departments.some((d) => deptLower.includes(d.toLowerCase()))) return false;
		}
		if (filters.postedWithinDays) {
			const cutoff = /* @__PURE__ */ new Date();
			cutoff.setDate(cutoff.getDate() - filters.postedWithinDays);
			if (new Date(job.postedAt) < cutoff) return false;
		}
		return true;
	});
}
function stripHtml(html) {
	return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}
async function fetchWithTimeout(url, timeout) {
	const controller = new AbortController();
	const timer = setTimeout(() => controller.abort(), timeout);
	try {
		return await fetch(url, { signal: controller.signal });
	} finally {
		clearTimeout(timer);
	}
}
function jobIndexerPlugin(options = {}) {
	let intervalHandle = null;
	let startupTimeout = null;
	return {
		key: "job-indexer",
		version: "1.0.0",
		manifest: {
			name: "Job Indexer",
			description: "Background crawler that fetches jobs from ATS APIs and indexes them locally",
			provides: [{ capability: "indexer.run" }],
			needs: [{ capability: "company.store" }, { capability: "job.index" }],
			tags: ["indexer"]
		},
		activate(ctx) {
			const companyStore = ctx.resolve("company.store");
			const jobIndex = ctx.resolve("job.index");
			async function indexCompany(company) {
				const fetcher = ATS_FETCHERS[company.atsType];
				if (!fetcher) throw new Error(`Unknown ATS type: ${company.atsType}`);
				let jobs = await fetcher(company.slug, company.name);
				const filters = company.filters;
				if (filters && Object.keys(filters).length > 0) jobs = applyFilters(jobs, filters);
				await jobIndex.upsertJobs(company.id, jobs, company.atsType);
				await jobIndex.markInactive(company.id, jobs.map((j) => j.id));
				await companyStore.updateIndexed(company.id, jobs.length);
				ctx.emit("indexer:company-done", {
					companyId: company.id,
					companyName: company.name,
					jobCount: jobs.length
				});
				return jobs.length;
			}
			async function indexNow() {
				const enabled = (await companyStore.list()).filter((c) => c.enabled);
				if (enabled.length === 0) return;
				ctx.emit("indexer:started", { companyCount: enabled.length });
				let totalJobs = 0;
				const errors = [];
				await withConcurrency(enabled, async (company) => {
					const count = await indexCompany(company);
					totalJobs += count;
					return count;
				}, {
					limit: 3,
					onError: (err, i) => errors.push({
						company: enabled[i].name,
						error: String(err)
					})
				});
				ctx.emit("indexer:complete", {
					totalJobs,
					errors
				});
			}
			ctx.provide("indexer.run", {
				indexNow,
				async indexCompany(id) {
					const company = await companyStore.get(id);
					if (!company) throw new Error(`Company not found: ${id}`);
					await indexCompany(company);
				}
			});
			if (options.autoStart !== false) {
				const intervalMs = (options.intervalHours ?? 6) * 60 * 60 * 1e3;
				intervalHandle = setInterval(() => {
					indexNow().catch((err) => ctx.emit("indexer:error", { error: String(err) }));
				}, intervalMs);
				startupTimeout = setTimeout(() => {
					indexNow().catch((err) => ctx.emit("indexer:error", { error: String(err) }));
				}, 5e3);
			}
		},
		deactivate() {
			if (intervalHandle) clearInterval(intervalHandle);
			if (startupTimeout) clearTimeout(startupTimeout);
		}
	};
}
//#endregion
//#region src/plugins/index-fetcher.ts
function indexFetcherPlugin() {
	return {
		key: "index-fetcher",
		version: "1.0.0",
		manifest: {
			name: "Index Fetcher",
			description: "Provides jobs from the local index for pipeline consumption",
			provides: [{
				capability: "jobs.fetch",
				priority: 90
			}],
			needs: [{ capability: "job.index" }, { capability: "company.store" }],
			tags: ["job-source", "local-index"]
		},
		activate(ctx) {
			const jobIndex = ctx.resolve("job.index");
			const companyStore = ctx.resolve("company.store");
			ctx.provide("jobs.fetch", async (input) => {
				const companySourceId = getPipelineCompanyId();
				const companyIds = companySourceId ? [companySourceId] : void 0;
				let filters = {};
				if (companySourceId) {
					const company = await companyStore.get(companySourceId);
					if (company?.filters) filters = company.filters;
				}
				if (!companySourceId || Object.keys(filters).length === 0) {
					const profile = input["parse-profile"];
					const refinements = input.refinements;
					filters = { titleKeywords: [...profile.titles, ...refinements?.additionalKeywords ?? []] };
				}
				return jobIndex.query({
					...filters,
					companyIds
				});
			});
		}
	};
}
//#endregion
//#region src/plugins/remotive-fetcher.ts
function remotiveFetcherPlugin() {
	return {
		key: "remotive-fetcher",
		version: "1.0.0",
		manifest: {
			name: "Remotive Fetcher",
			description: "Fetches remote job postings from Remotive public API",
			provides: [{
				capability: "jobs.fetch",
				priority: 60
			}],
			needs: [],
			tags: ["job-source", "real-api"]
		},
		activate(ctx) {
			ctx.provide("jobs.fetch", async (input) => {
				if (getPipelineCompanyId()) return [];
				const profile = input["parse-profile"];
				const refinements = input.refinements;
				const search = [...profile.titles.slice(0, 1), ...refinements?.additionalKeywords ?? []].join(" ");
				const url = `https://remotive.com/api/remote-jobs?search=${encodeURIComponent(search)}&limit=10`;
				const controller = new AbortController();
				const timeout = setTimeout(() => controller.abort(), 1e4);
				let res;
				try {
					res = await fetch(url, { signal: controller.signal });
				} finally {
					clearTimeout(timeout);
				}
				if (!res.ok) throw new Error(`Remotive API error: ${res.status}`);
				return (await res.json()).jobs.map((j) => ({
					id: `remotive-${j.id}`,
					source: "remotive",
					title: j.title,
					company: j.company_name,
					location: j.candidate_required_location || "Remote",
					description: j.description.replace(/<[^>]+>/g, ""),
					url: j.url,
					postedAt: j.date
				}));
			});
		}
	};
}
//#endregion
//#region src/plugins/profile-store.ts
/** Migrate old flat skills array to categorized Record format. */
function migrateProfile(raw) {
	const profile = raw;
	if (Array.isArray(profile.skills)) profile.skills = { General: profile.skills };
	return profile;
}
function profileStorePlugin(options = {}) {
	return {
		key: "profile-store",
		version: "1.0.0",
		manifest: {
			name: "Profile Store",
			description: "Persists the parsed candidate profile to SQLite",
			provides: [{ capability: "profile.store" }],
			needs: []
		},
		activate(ctx) {
			const dbPath = options.dbPath ?? getCatalystContext().dbPaths.results;
			if (dbPath !== ":memory:") (0, node_fs.mkdirSync)((0, node_path.dirname)(dbPath), { recursive: true });
			const db = require_platform.openDatabase(dbPath);
			db.exec(`CREATE TABLE IF NOT EXISTS stored_profile (
        id INTEGER PRIMARY KEY CHECK (id = 1),
        profile_json TEXT NOT NULL,
        source_resume TEXT NOT NULL,
        updated_at TEXT NOT NULL
      )`);
			ctx.provide("profile.store", {
				get() {
					const row = db.prepare(`SELECT profile_json FROM stored_profile WHERE id = 1`).get();
					return row ? migrateProfile(JSON.parse(row.profile_json)) : null;
				},
				getWithMeta() {
					const row = db.prepare(`SELECT profile_json, source_resume, updated_at FROM stored_profile WHERE id = 1`).get();
					if (!row) return null;
					return {
						profile: migrateProfile(JSON.parse(row.profile_json)),
						sourceResume: row.source_resume,
						updatedAt: row.updated_at
					};
				},
				save(profile, sourceResume) {
					db.prepare(`INSERT OR REPLACE INTO stored_profile (id, profile_json, source_resume, updated_at)
             VALUES (1, ?, ?, ?)`).run(JSON.stringify(profile), sourceResume, (/* @__PURE__ */ new Date()).toISOString());
				}
			});
		}
	};
}
//#endregion
//#region src/prompts/profile-parser.ts
function profileParserPrompt(resumeText) {
	return `You are a resume parser. Extract structured information from the resume below.

Return ONLY a JSON object with this exact shape (no markdown, no explanation):
{
  "name": "string",
  "skills": { "Category Name": ["skill1", "skill2"], "Another Category": ["skill3"] },
  "yearsExperience": number,
  "titles": ["most recent title first"],
  "preferredLocations": ["city or Remote"],
  "remotePreference": "remote" | "hybrid" | "onsite" | "flexible",
  "salaryExpectation": { "min": number, "max": number, "currency": "USD" } | null
}

RESUME:
${resumeText}`;
}
//#endregion
//#region src/llm-parse.ts
/**
* Parse an LLM response as JSON, stripping markdown fences and providing clear errors.
*/
function parseLLMJson(raw, pluginName) {
	const cleaned = raw.replace(/```\w*\s*\n?|\n?\s*```/g, "").trim();
	try {
		return JSON.parse(cleaned);
	} catch (e) {
		throw new Error(`${pluginName}: failed to parse LLM response as JSON: ${cleaned.slice(0, 300)}`, { cause: e });
	}
}
//#endregion
//#region src/plugins/profile-parser.ts
function profileParserPlugin() {
	return {
		key: "profile-parser",
		version: "1.0.0",
		manifest: {
			name: "Profile Parser",
			description: "Extracts structured candidate profile from resume text",
			provides: [{ capability: "profile.parse" }],
			needs: [{ capability: "llm.generate" }]
		},
		activate(ctx) {
			const llm = ctx.resolve("llm.generate");
			let profileStore = null;
			try {
				profileStore = ctx.resolve("profile.store");
			} catch {}
			ctx.provide("profile.parse", async (input) => {
				if (profileStore) {
					const stored = profileStore.get();
					if (stored) return stored;
				}
				return parseLLMJson(await llm.generate(profileParserPrompt(input.resumeText)), "profile-parser");
			});
		}
	};
}
//#endregion
//#region src/prompts/job-normalizer.ts
function jobNormalizerPrompt(job) {
	return `You are a job data normalizer. Clean and structure the following job posting.

Extract skills mentioned in the description and determine if it is remote.

Return ONLY a JSON object — no markdown, no explanation:
{
  "id": "${job.id}",
  "title": "cleaned title",
  "company": "company name",
  "location": "city/state or Remote",
  "remote": true | false,
  "skills": ["extracted", "skills"],
  "description": "first 200 chars of cleaned description",
  "url": "same url",
  "source": "same source"
}

JOB:
${JSON.stringify(job, null, 2)}`;
}
//#endregion
//#region src/plugins/job-normalizer.ts
function jobNormalizerPlugin() {
	return {
		key: "job-normalizer",
		version: "1.0.0",
		manifest: {
			name: "Job Normalizer",
			description: "Deduplicates and standardizes job postings across sources",
			provides: [{ capability: "jobs.normalize" }],
			needs: [{ capability: "llm.generate" }]
		},
		activate(ctx) {
			const llm = ctx.resolve("llm.generate");
			let resultsQuery = null;
			try {
				resultsQuery = ctx.resolve("results.query");
			} catch {}
			ctx.provide("jobs.normalize", async (input) => {
				const jobs = Array.isArray(input["fetch-jobs"]) ? input["fetch-jobs"].flat() : [];
				if (!jobs.length) return [];
				const prevNormalized = /* @__PURE__ */ new Map();
				if (resultsQuery) {
					const latestRunId = await resultsQuery.getLatestRunId();
					if (latestRunId) {
						const detail = await resultsQuery.getRunDetail(latestRunId);
						for (const nj of detail?.normalizedJobs ?? []) prevNormalized.set(nj.id, nj);
					}
				}
				ctx.emit("job:progress", {
					stage: "normalize-jobs",
					total: jobs.length,
					completed: 0,
					cached: 0
				});
				let completed = 0;
				let cached = 0;
				return withConcurrency(jobs, async (job) => {
					const prev = prevNormalized.get(job.id);
					if (prev) {
						cached++;
						completed++;
						ctx.emit("job:progress", {
							stage: "normalize-jobs",
							total: jobs.length,
							completed,
							cached,
							jobTitle: job.title,
							jobCompany: job.company,
							status: "cached"
						});
						return prev;
					}
					ctx.emit("job:progress", {
						stage: "normalize-jobs",
						total: jobs.length,
						completed,
						cached,
						jobTitle: job.title,
						jobCompany: job.company,
						status: "processing"
					});
					const result = parseLLMJson(await llm.generate(jobNormalizerPrompt(job)), "job-normalizer");
					completed++;
					ctx.emit("job:progress", {
						stage: "normalize-jobs",
						total: jobs.length,
						completed,
						cached,
						jobTitle: job.title,
						jobCompany: job.company,
						status: "done"
					});
					return result;
				}, { limit: 3 });
			});
		}
	};
}
//#endregion
//#region src/prompts/skill-matcher.ts
function skillMatcherPrompt(job, profile) {
	return `You are a technical skill matcher. Score this job's skill fit for the candidate.

Candidate skills: ${Object.values(profile.skills).flat().join(", ")}
Candidate experience: ${profile.yearsExperience} years as ${profile.titles[0] ?? "professional"}

Return a score 0-100 for technical skill overlap.
Also return:
- matchedSkills: candidate skills that match this job's requirements
- missingSkills: skills the job requires that the candidate lacks
- matchPercent: percentage of required skills the candidate has (0-100)
- gapSeverity: "minor" if matchPercent >= 80, "moderate" if >= 60, "major" if < 60

Return ONLY a JSON object — no markdown, no explanation:
{ "jobId": "${job.id}", "variant": "skill", "score": number, "reasoning": "1 sentence", "signals": ["key signal"], "matchedSkills": ["skill"], "missingSkills": ["skill"], "matchPercent": number, "gapSeverity": "minor"|"moderate"|"major" }

JOB:
${JSON.stringify({
		id: job.id,
		title: job.title,
		skills: job.skills
	}, null, 2)}`;
}
//#endregion
//#region src/profile-hash.ts
/** Deterministic hash of the profile fields that affect job analysis. */
function hashProfile(profile) {
	const data = JSON.stringify({
		skills: profile.skills,
		yearsExperience: profile.yearsExperience,
		titles: profile.titles,
		salaryExpectation: profile.salaryExpectation
	});
	return (0, node_crypto.createHash)("sha256").update(data).digest("hex");
}
//#endregion
//#region src/plugins/skill-matcher.ts
function skillMatcherPlugin() {
	return {
		key: "skill-matcher",
		version: "1.0.0",
		manifest: {
			name: "Skill Matcher",
			description: "Scores technical skill overlap between candidate and jobs",
			provides: [{
				capability: "jobs.analyze",
				priority: 100
			}],
			needs: [{ capability: "llm.generate" }]
		},
		activate(ctx) {
			const llm = ctx.resolve("llm.generate");
			let resultsQuery = null;
			try {
				resultsQuery = ctx.resolve("results.query");
			} catch {}
			ctx.provide("jobs.analyze", async (input) => {
				const jobs = Array.isArray(input["normalize-jobs"]) ? input["normalize-jobs"].flat() : [];
				const profile = input["parse-profile"];
				const prevAnalyses = /* @__PURE__ */ new Map();
				if (resultsQuery) {
					const latestRunId = await resultsQuery.getLatestRunId();
					if (latestRunId) {
						const detail = await resultsQuery.getRunDetail(latestRunId);
						if (detail?.profile && hashProfile(detail.profile) === hashProfile(profile)) {
							for (const a of detail.analyses ?? []) if (a.variant === "skill") prevAnalyses.set(a.jobId, a);
						}
					}
				}
				ctx.emit("job:progress", {
					stage: "analyze-jobs",
					provider: "skill",
					total: jobs.length,
					completed: 0,
					cached: 0
				});
				let completed = 0;
				let cached = 0;
				return withConcurrency(jobs, async (job) => {
					const prev = prevAnalyses.get(job.id);
					if (prev) {
						cached++;
						completed++;
						ctx.emit("job:progress", {
							stage: "analyze-jobs",
							provider: "skill",
							total: jobs.length,
							completed,
							cached,
							jobTitle: job.title,
							jobCompany: job.company,
							status: "cached"
						});
						return prev;
					}
					ctx.emit("job:progress", {
						stage: "analyze-jobs",
						provider: "skill",
						total: jobs.length,
						completed,
						cached,
						jobTitle: job.title,
						jobCompany: job.company,
						status: "processing"
					});
					const result = parseLLMJson(await llm.generate(skillMatcherPrompt(job, profile)), "skill-matcher");
					completed++;
					ctx.emit("job:progress", {
						stage: "analyze-jobs",
						provider: "skill",
						total: jobs.length,
						completed,
						cached,
						jobTitle: job.title,
						jobCompany: job.company,
						status: "done"
					});
					return result;
				}, { limit: 3 });
			});
		}
	};
}
//#endregion
//#region src/prompts/culture-fit-analyzer.ts
function cultureFitPrompt(job, profile) {
	return `You are a culture fit analyzer. Score this job's culture alignment for the candidate.

Candidate preference: ${profile.remotePreference}, locations: ${profile.preferredLocations.join(", ")}

Score 0-100 for culture/team/values fit based on location, remote policy, and description signals.

Return ONLY a JSON object — no markdown, no explanation:
{ "jobId": "${job.id}", "variant": "culture", "score": number, "reasoning": "1 sentence", "signals": ["key signal"] }

JOB:
${JSON.stringify({
		id: job.id,
		title: job.title,
		location: job.location,
		remote: job.remote,
		description: job.description
	}, null, 2)}`;
}
//#endregion
//#region src/plugins/culture-fit-analyzer.ts
function cultureFitAnalyzerPlugin() {
	return {
		key: "culture-fit-analyzer",
		version: "1.0.0",
		manifest: {
			name: "Culture Fit Analyzer",
			description: "Scores culture and values alignment between candidate and jobs",
			provides: [{
				capability: "jobs.analyze",
				priority: 90
			}],
			needs: [{ capability: "llm.generate" }]
		},
		activate(ctx) {
			const llm = ctx.resolve("llm.generate");
			let resultsQuery = null;
			try {
				resultsQuery = ctx.resolve("results.query");
			} catch {}
			ctx.provide("jobs.analyze", async (input) => {
				const jobs = Array.isArray(input["normalize-jobs"]) ? input["normalize-jobs"].flat() : [];
				const profile = input["parse-profile"];
				const prevAnalyses = /* @__PURE__ */ new Map();
				if (resultsQuery) {
					const latestRunId = await resultsQuery.getLatestRunId();
					if (latestRunId) {
						const detail = await resultsQuery.getRunDetail(latestRunId);
						if (detail?.profile && hashProfile(detail.profile) === hashProfile(profile)) {
							for (const a of detail.analyses ?? []) if (a.variant === "culture") prevAnalyses.set(a.jobId, a);
						}
					}
				}
				ctx.emit("job:progress", {
					stage: "analyze-jobs",
					provider: "culture",
					total: jobs.length,
					completed: 0,
					cached: 0
				});
				let completed = 0;
				let cached = 0;
				return withConcurrency(jobs, async (job) => {
					const prev = prevAnalyses.get(job.id);
					if (prev) {
						cached++;
						completed++;
						ctx.emit("job:progress", {
							stage: "analyze-jobs",
							provider: "culture",
							total: jobs.length,
							completed,
							cached,
							jobTitle: job.title,
							jobCompany: job.company,
							status: "cached"
						});
						return prev;
					}
					ctx.emit("job:progress", {
						stage: "analyze-jobs",
						provider: "culture",
						total: jobs.length,
						completed,
						cached,
						jobTitle: job.title,
						jobCompany: job.company,
						status: "processing"
					});
					const result = parseLLMJson(await llm.generate(cultureFitPrompt(job, profile)), "culture-fit-analyzer");
					completed++;
					ctx.emit("job:progress", {
						stage: "analyze-jobs",
						provider: "culture",
						total: jobs.length,
						completed,
						cached,
						jobTitle: job.title,
						jobCompany: job.company,
						status: "done"
					});
					return result;
				}, { limit: 3 });
			});
		}
	};
}
//#endregion
//#region src/prompts/salary-estimator.ts
function salaryEstimatorPrompt(job, profile) {
	return `You are a salary fit estimator. Score this job's likely comp alignment.

Candidate expected range: ${profile.salaryExpectation ? `$${profile.salaryExpectation.min / 1e3}k–$${profile.salaryExpectation.max / 1e3}k` : "unknown"}

Estimate based on company, title, and location. Score 0-100 for salary fit.

Return ONLY a JSON object — no markdown, no explanation:
{ "jobId": "${job.id}", "variant": "salary", "score": number, "reasoning": "1 sentence", "signals": ["key signal"] }

JOB:
${JSON.stringify({
		id: job.id,
		title: job.title,
		company: job.company,
		location: job.location
	}, null, 2)}`;
}
//#endregion
//#region src/plugins/salary-estimator.ts
function salaryEstimatorPlugin() {
	return {
		key: "salary-estimator",
		version: "1.0.0",
		manifest: {
			name: "Salary Estimator",
			description: "Estimates compensation fit between candidate expectations and jobs",
			provides: [{
				capability: "jobs.analyze",
				priority: 80
			}],
			needs: [{ capability: "llm.generate" }]
		},
		activate(ctx) {
			const llm = ctx.resolve("llm.generate");
			let resultsQuery = null;
			try {
				resultsQuery = ctx.resolve("results.query");
			} catch {}
			ctx.provide("jobs.analyze", async (input) => {
				const jobs = Array.isArray(input["normalize-jobs"]) ? input["normalize-jobs"].flat() : [];
				const profile = input["parse-profile"];
				const prevAnalyses = /* @__PURE__ */ new Map();
				if (resultsQuery) {
					const latestRunId = await resultsQuery.getLatestRunId();
					if (latestRunId) {
						const detail = await resultsQuery.getRunDetail(latestRunId);
						if (detail?.profile && hashProfile(detail.profile) === hashProfile(profile)) {
							for (const a of detail.analyses ?? []) if (a.variant === "salary") prevAnalyses.set(a.jobId, a);
						}
					}
				}
				ctx.emit("job:progress", {
					stage: "analyze-jobs",
					provider: "salary",
					total: jobs.length,
					completed: 0,
					cached: 0
				});
				let completed = 0;
				let cached = 0;
				return withConcurrency(jobs, async (job) => {
					const prev = prevAnalyses.get(job.id);
					if (prev) {
						cached++;
						completed++;
						ctx.emit("job:progress", {
							stage: "analyze-jobs",
							provider: "salary",
							total: jobs.length,
							completed,
							cached,
							jobTitle: job.title,
							jobCompany: job.company,
							status: "cached"
						});
						return prev;
					}
					ctx.emit("job:progress", {
						stage: "analyze-jobs",
						provider: "salary",
						total: jobs.length,
						completed,
						cached,
						jobTitle: job.title,
						jobCompany: job.company,
						status: "processing"
					});
					const result = parseLLMJson(await llm.generate(salaryEstimatorPrompt(job, profile)), "salary-estimator");
					completed++;
					ctx.emit("job:progress", {
						stage: "analyze-jobs",
						provider: "salary",
						total: jobs.length,
						completed,
						cached,
						jobTitle: job.title,
						jobCompany: job.company,
						status: "done"
					});
					return result;
				}, { limit: 3 });
			});
		}
	};
}
//#endregion
//#region src/prompts/synthesizer.ts
function synthesizerPrompt(jobs, analyses, profile) {
	const byJob = jobs.map((job) => ({
		job,
		skill: analyses.find((a) => a.jobId === job.id && a.variant === "skill"),
		culture: analyses.find((a) => a.jobId === job.id && a.variant === "culture"),
		salary: analyses.find((a) => a.jobId === job.id && a.variant === "salary")
	}));
	return `You are a job match synthesizer. Rank these jobs for ${profile.name} (${profile.titles[0] ?? "professional"}).

Combine skill, culture, and salary scores into an overall score. Write a 2-sentence summary.

Return ONLY a JSON array sorted by overallScore DESC:
[{
  "jobId": "id",
  "overallScore": number,
  "scores": { "skill": number, "culture": number, "salary": number },
  "summary": "2 sentence explanation",
  "redFlags": ["any concerns"]
}]

DATA:
${JSON.stringify(byJob, null, 2)}`;
}
//#endregion
//#region src/plugins/synthesizer.ts
function synthesizerPlugin() {
	return {
		key: "synthesizer",
		version: "1.0.0",
		manifest: {
			name: "Synthesizer",
			description: "Merges analysis scores into a ranked job list",
			provides: [{ capability: "jobs.synthesize" }],
			needs: [{ capability: "llm.generate" }]
		},
		activate(ctx) {
			const llm = ctx.resolve("llm.generate");
			ctx.provide("jobs.synthesize", async (input) => {
				const analyses = Array.isArray(input["analyze-jobs"]) ? input["analyze-jobs"].flat() : [];
				const jobs = Array.isArray(input["normalize-jobs"]) ? input["normalize-jobs"].flat() : [];
				return parseLLMJson(await llm.generate(synthesizerPrompt(jobs, analyses, input["parse-profile"])), "synthesizer").map((p) => ({
					job: jobs.find((j) => j.id === p.jobId) ?? {
						id: p.jobId,
						title: "",
						company: "",
						location: "",
						remote: false,
						skills: [],
						description: "",
						url: "",
						source: ""
					},
					overallScore: p.overallScore,
					scores: p.scores,
					summary: p.summary,
					redFlags: p.redFlags
				}));
			});
		}
	};
}
//#endregion
//#region src/prompts/reflection-agent.ts
function reflectionAgentPrompt(jobs, profile, iteration, priorFeedback) {
	const topScore = jobs[0]?.overallScore ?? 0;
	let feedbackSection = "";
	if (priorFeedback && (priorFeedback.totalRejected > 0 || priorFeedback.totalNotApplying > 0)) {
		const tagLines = Object.entries(priorFeedback.tagCounts).sort(([, a], [, b]) => b - a).map(([tag, count]) => `  - ${tag}: ${count} times`).join("\n");
		const notesLines = priorFeedback.recentNotes.length > 0 ? `\nRecent user notes:\n${priorFeedback.recentNotes.map((n) => `  - "${n}"`).join("\n")}` : "";
		feedbackSection = `
PRIOR USER FEEDBACK (from previous pipeline runs):
The user has rejected ${priorFeedback.totalRejected} jobs and marked ${priorFeedback.totalNotApplying} as "not applying".
Common rejection reasons:
${tagLines}${notesLines}

Use this feedback to AVOID recommending similar jobs. For example:
- If "low-pay" is common, prioritize higher-paying roles
- If "bad-location" is common, focus on remote or preferred-location roles
- If "wrong-level" is common, better match seniority
- If "wrong-tech-stack" is common, prioritize matching technologies
Include this context in your refinement suggestions.
`;
	}
	return `You are a job search reflection agent. Evaluate if these results are good enough.

Iteration: ${iteration} of 3
Top result score: ${topScore}/100
Candidate: ${profile.name}, ${profile.titles[0] ?? "professional"}

If top score >= 80 and there are 3+ results with score >= 70, the search is complete.
Otherwise suggest refinements.
${feedbackSection}
Return ONLY JSON:
{
  "confidence": number between 0 and 1,
  "rationale": "1 sentence",
  "searchRefinements": {
    "additionalKeywords": ["optional", "keywords"],
    "expandLocation": true | false,
    "relaxedRequirements": ["optional relaxed requirement"]
  } | null
}

TOP RESULTS:
${JSON.stringify(jobs.slice(0, 5).map((j) => ({
		title: j.job.title,
		company: j.job.company,
		score: j.overallScore
	})), null, 2)}`;
}
//#endregion
//#region src/plugins/reflection-agent.ts
function reflectionAgentPlugin() {
	return {
		key: "reflection-agent",
		version: "1.0.0",
		manifest: {
			name: "Reflection Agent",
			description: "Evaluates result quality and decides whether to refine the search",
			provides: [{ capability: "jobs.reflect" }, { capability: "jobs.search-complete" }],
			needs: [{ capability: "llm.generate" }]
		},
		activate(ctx) {
			const llm = ctx.resolve("llm.generate");
			ctx.provide("jobs.reflect", async (input) => {
				return parseLLMJson(await llm.generate(reflectionAgentPrompt(input.synthesize, input["parse-profile"], 1)), "reflection-agent");
			});
			ctx.provide("jobs.search-complete", (stopCtx) => {
				const reflect = stopCtx.stageOutputs.get("reflect");
				if (!reflect) return false;
				return reflect.confidence >= .8 || stopCtx.iteration >= 3;
			});
		}
	};
}
//#endregion
//#region src/plugins/user-manager.ts
function userManagerPlugin() {
	return {
		key: "user-manager",
		version: "1.0.0",
		manifest: {
			name: "User Manager",
			description: "Manages user profiles with isolated data directories",
			provides: [{ capability: "user.manager" }],
			needs: []
		},
		activate(ctx) {
			const catalystDir = (0, node_path.join)((0, node_os.homedir)(), ".catalyst");
			const usersDir = (0, node_path.join)(catalystDir, "users");
			const dbPath = (0, node_path.join)(catalystDir, "users-index.db");
			(0, node_fs.mkdirSync)(usersDir, { recursive: true });
			const db = require_platform.openDatabase(dbPath);
			db.exec(`CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL UNIQUE,
        created_at TEXT NOT NULL,
        data_dir TEXT NOT NULL
      )`);
			db.exec(`CREATE TABLE IF NOT EXISTS current_user (
        singleton INTEGER PRIMARY KEY DEFAULT 1 CHECK (singleton = 1),
        user_id TEXT NOT NULL,
        switched_at TEXT NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id)
      )`);
			const legacyCatalog = (0, node_path.join)(catalystDir, "catalyst.db");
			if (db.prepare("SELECT COUNT(*) as c FROM users").get().c === 0 && (0, node_fs.existsSync)(legacyCatalog)) {
				const defaultUser = createUserInternal(db, usersDir, "default");
				for (const file of [
					"catalyst.db",
					"results.db",
					"traces.db"
				]) {
					const src = (0, node_path.join)(catalystDir, file);
					if ((0, node_fs.existsSync)(src)) (0, node_fs.renameSync)(src, (0, node_path.join)(defaultUser.dataDir, file));
				}
				const legacyDocs = (0, node_path.join)(catalystDir, "docs");
				if ((0, node_fs.existsSync)(legacyDocs)) (0, node_fs.cpSync)(legacyDocs, (0, node_path.join)(defaultUser.dataDir, "docs"), { recursive: true });
				db.prepare(`INSERT OR REPLACE INTO current_user (singleton, user_id, switched_at) VALUES (1, ?, ?)`).run(defaultUser.id, (/* @__PURE__ */ new Date()).toISOString());
			}
			ctx.provide("user.manager", {
				list() {
					return db.prepare(`SELECT id, name, created_at as createdAt, data_dir as dataDir
             FROM users ORDER BY created_at ASC`).all();
				},
				create(name) {
					return createUserInternal(db, usersDir, name);
				},
				get(id) {
					return db.prepare(`SELECT id, name, created_at as createdAt, data_dir as dataDir
             FROM users WHERE id = ?`).get(id) ?? null;
				},
				getByName(name) {
					return db.prepare(`SELECT id, name, created_at as createdAt, data_dir as dataDir
             FROM users WHERE name = ?`).get(name) ?? null;
				},
				getCurrentId() {
					return db.prepare("SELECT user_id FROM current_user WHERE singleton = 1").get()?.user_id ?? null;
				},
				setCurrentId(id) {
					db.prepare(`INSERT OR REPLACE INTO current_user (singleton, user_id, switched_at) VALUES (1, ?, ?)`).run(id, (/* @__PURE__ */ new Date()).toISOString());
				}
			});
		}
	};
}
function createUserInternal(db, usersDir, name) {
	const sanitized = name.toLowerCase().replace(/[^a-z0-9_-]/g, "-").replace(/-+/g, "-");
	if (!sanitized) throw new Error("Invalid user name");
	if (db.prepare("SELECT id FROM users WHERE name = ?").get(sanitized)) throw new Error(`User "${sanitized}" already exists`);
	const id = crypto.randomUUID();
	const dataDir = (0, node_path.join)(usersDir, sanitized);
	const createdAt = (/* @__PURE__ */ new Date()).toISOString();
	(0, node_fs.mkdirSync)((0, node_path.join)(dataDir, "docs"), { recursive: true });
	db.prepare(`INSERT INTO users (id, name, created_at, data_dir) VALUES (?, ?, ?, ?)`).run(id, sanitized, createdAt, dataDir);
	return {
		id,
		name: sanitized,
		createdAt,
		dataDir
	};
}
//#endregion
//#region src/plugins/kanban-store.ts
function kanbanStorePlugin() {
	return {
		key: "kanban-store",
		version: "1.0.0",
		manifest: {
			name: "Kanban Store",
			description: "Tracks job application status and feedback per company",
			provides: [{ capability: "kanban.store" }],
			needs: [{ capability: "catalog.db" }],
			tags: ["kanban"]
		},
		activate(ctx) {
			const db = ctx.resolve("catalog.db");
			db.exec(`CREATE TABLE IF NOT EXISTS job_kanban (
        job_id TEXT PRIMARY KEY,
        company_source_id TEXT NOT NULL,
        column_name TEXT NOT NULL DEFAULT 'new',
        tags TEXT,
        notes TEXT,
        job_title TEXT,
        job_company TEXT,
        job_url TEXT,
        overall_score INTEGER,
        job_json TEXT,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      )`);
			db.exec(`CREATE INDEX IF NOT EXISTS idx_kanban_company ON job_kanban(company_source_id)`);
			db.exec(`CREATE INDEX IF NOT EXISTS idx_kanban_column ON job_kanban(column_name)`);
			const getColumn = db.prepare("SELECT column_name FROM job_kanban WHERE job_id = ?");
			db.prepare(`INSERT INTO job_kanban (job_id, company_source_id, column_name, tags, notes, job_title, job_company, job_url, overall_score, job_json, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
         ON CONFLICT(job_id) DO UPDATE SET
           column_name = excluded.column_name,
           tags = excluded.tags,
           notes = excluded.notes,
           updated_at = excluded.updated_at`);
			const ensureRow = db.prepare(`INSERT OR IGNORE INTO job_kanban (job_id, company_source_id, column_name, tags, notes, job_title, job_company, job_url, overall_score, job_json, created_at, updated_at)
         VALUES (?, ?, 'new', NULL, NULL, ?, ?, ?, ?, ?, ?, ?)`);
			ctx.provide("kanban.store", {
				getJobColumn(jobId) {
					return getColumn.get(jobId)?.column_name ?? null;
				},
				moveJob(jobId, companySourceId, toColumn, feedback) {
					const now = (/* @__PURE__ */ new Date()).toISOString();
					const tags = feedback?.tags ? JSON.stringify(feedback.tags) : null;
					const notes = feedback?.notes ?? null;
					db.prepare(`UPDATE job_kanban SET column_name = ?, tags = ?, notes = ?, updated_at = ? WHERE job_id = ?`).run(toColumn, tags, notes, now, jobId);
				},
				getColumnJobs(companySourceId, column) {
					return db.prepare(`SELECT job_id, job_title, job_company, overall_score FROM job_kanban WHERE company_source_id = ? AND column_name = ?`).all(companySourceId, column).map((r) => ({
						jobId: r.job_id,
						title: r.job_title ?? r.job_id.slice(0, 20),
						company: r.job_company ?? "",
						score: r.overall_score ?? 0
					}));
				},
				getAllFeedback(companySourceId) {
					const sql = companySourceId ? `SELECT * FROM job_kanban WHERE company_source_id = ? AND (column_name = 'rejected' OR column_name = 'not-applying')` : `SELECT * FROM job_kanban WHERE column_name = 'rejected' OR column_name = 'not-applying'`;
					return (companySourceId ? db.prepare(sql).all(companySourceId) : db.prepare(sql).all()).map(rowToFeedback);
				},
				getFeedback(jobId) {
					const row = db.prepare(`SELECT * FROM job_kanban WHERE job_id = ? AND (column_name = 'rejected' OR column_name = 'not-applying')`).get(jobId);
					return row ? rowToFeedback(row) : null;
				},
				ensureTracked(companySourceId, jobs) {
					const now = (/* @__PURE__ */ new Date()).toISOString();
					for (const ranked of jobs) ensureRow.run(ranked.job.id, companySourceId, ranked.job.title, ranked.job.company, ranked.job.url, ranked.overallScore, JSON.stringify(ranked), now, now);
				},
				getFeedbackSummary(companySourceId) {
					const feedback = this.getAllFeedback(companySourceId);
					const tagCounts = {};
					let totalRejected = 0;
					let totalNotApplying = 0;
					const recentNotes = [];
					for (const fb of feedback) {
						if (fb.column === "rejected") totalRejected++;
						if (fb.column === "not-applying") totalNotApplying++;
						for (const tag of fb.tags) tagCounts[tag] = (tagCounts[tag] ?? 0) + 1;
						if (fb.notes) recentNotes.push(fb.notes);
					}
					return {
						totalRejected,
						totalNotApplying,
						tagCounts,
						recentNotes: recentNotes.slice(-10)
					};
				},
				getStageCounts(companySourceId) {
					const where = companySourceId ? "WHERE company_source_id = ?" : "";
					const params = companySourceId ? [companySourceId] : [];
					const rows = db.prepare(`SELECT column_name, COUNT(*) as cnt FROM job_kanban ${where} GROUP BY column_name`).all(...params);
					const counts = {
						new: 0,
						"looking-at": 0,
						applying: 0,
						rejected: 0,
						"not-applying": 0
					};
					for (const row of rows) counts[row.column_name] = row.cnt;
					return counts;
				},
				getRecentActivityCount(sinceDays = 7) {
					const since = (/* @__PURE__ */ new Date(Date.now() - sinceDays * 864e5)).toISOString();
					const rows = db.prepare(`SELECT column_name, COUNT(*) as cnt FROM job_kanban WHERE updated_at >= ? AND column_name != 'new' GROUP BY column_name`).all(since);
					let reviewed = 0, applied = 0, rejected = 0;
					for (const row of rows) {
						if (row.column_name === "applying") applied = row.cnt;
						else if (row.column_name === "rejected" || row.column_name === "not-applying") rejected += row.cnt;
						reviewed += row.cnt;
					}
					return {
						reviewed,
						applied,
						rejected
					};
				},
				getRecentMoves(limit = 50) {
					return db.prepare(`SELECT job_id, job_title, job_company, column_name, tags, notes, updated_at
             FROM job_kanban
             WHERE column_name != 'new'
             ORDER BY updated_at DESC
             LIMIT ?`).all(limit).map((r) => ({
						jobId: r.job_id,
						title: r.job_title ?? "Untitled",
						company: r.job_company ?? "",
						column: r.column_name,
						tags: r.tags ? JSON.parse(r.tags) : [],
						notes: r.notes || void 0,
						updatedAt: r.updated_at
					}));
				}
			});
		}
	};
}
function rowToFeedback(row) {
	return {
		id: row.job_id,
		jobId: row.job_id,
		companySourceId: row.company_source_id,
		column: row.column_name,
		tags: row.tags ? JSON.parse(row.tags) : [],
		notes: row.notes ?? void 0,
		createdAt: row.created_at,
		updatedAt: row.updated_at
	};
}
//#endregion
//#region src/shared/ipc-channels.ts
var IPC = {
	USERS_LIST: "users:list",
	USERS_CREATE: "users:create",
	USERS_SELECT: "users:select",
	USERS_CURRENT: "users:current",
	PIPELINE_RUN: "pipeline:run",
	PIPELINE_RUN_COMPANY: "pipeline:run-company",
	COMPANIES_LIST: "companies:list",
	COMPANIES_ADD: "companies:add",
	COMPANIES_REMOVE: "companies:remove",
	COMPANIES_TOGGLE: "companies:toggle",
	COMPANIES_SET_FILTERS: "companies:set-filters",
	INDEX_RUN: "index:run",
	INDEX_COMPANY: "index:company",
	KANBAN_COLUMNS: "kanban:columns",
	KANBAN_MOVE: "kanban:move",
	KANBAN_STAGE_COUNTS: "kanban:stage-counts",
	KANBAN_RECENT_ACTIVITY: "kanban:recent-activity",
	KANBAN_RECENT_MOVES: "kanban:recent-moves",
	RESULTS_LIST_RUNS: "results:list-runs",
	RESULTS_GET_RUN: "results:get-run",
	RESULTS_GET_JOBS: "results:get-jobs",
	DOCS_LIST: "docs:list",
	DOCS_READ: "docs:read",
	DOCS_IMPORT: "docs:import",
	SETTINGS_GET: "settings:get",
	SETTINGS_SET: "settings:set",
	OLLAMA_MODELS: "ollama:models",
	PROFILE_GET: "profile:get",
	PROFILE_PARSE: "profile:parse",
	PROFILE_SAVE: "profile:save",
	OPEN_URL: "open-url",
	RESULTS_GET_ALL_JOBS: "results:get-all-jobs",
	KANBAN_FEEDBACK_SUMMARY: "kanban:feedback-summary",
	TRACES_LIST_RUNS: "traces:list-runs",
	TRACES_GET_EVENTS: "traces:get-events",
	TRACES_GET_LLM_CALLS: "traces:get-llm-calls",
	TRACES_GET_LLM_CALL: "traces:get-llm-call",
	PIPELINE_STAGE_UPDATE: "pipeline:stage-update",
	PIPELINE_PROVIDER_UPDATE: "pipeline:provider-update",
	PIPELINE_ENRICHMENT: "pipeline:enrichment",
	PIPELINE_ITERATION: "pipeline:iteration",
	PIPELINE_DONE: "pipeline:done",
	PIPELINE_ERROR: "pipeline:error",
	INDEX_NEW_JOBS: "index:new-jobs",
	PIPELINE_JOB_PROGRESS: "pipeline:job-progress",
	PIPELINE_RUN_SUMMARY: "pipeline:run-summary",
	RESULTS_GET_LATEST_SUMMARY: "results:latest-summary"
};
//#endregion
//#region electron/events.ts
/**
* Wire broker events to the renderer window via IPC.
* Ported from src/index.ts wireBrokerEvents() — replaces TUI dispatch with
* win.webContents.send() calls.
*/
function wireBrokerEvents(broker, getWindow) {
	let currentRunId = null;
	let currentResumeName = "";
	const on = (event, handler) => {
		broker.on(event, (wrapped) => {
			handler("detail" in wrapped ? wrapped.detail : wrapped);
		});
	};
	/** Safe send — checks window is still alive before sending. */
	const send = (channel, data) => {
		const win = getWindow();
		if (win && !win.isDestroyed()) win.webContents.send(channel, data);
	};
	on(STAGE_EVENTS.STARTED, ({ stageId, capability }) => {
		send(IPC.PIPELINE_STAGE_UPDATE, {
			type: "start",
			stageId,
			capability
		});
	});
	on(STAGE_EVENTS.COMPLETE, ({ stageId, durationMs }) => {
		send(IPC.PIPELINE_STAGE_UPDATE, {
			type: "done",
			stageId,
			durationMs
		});
	});
	on(STAGE_EVENTS.DEGRADED, ({ stageId, reason }) => {
		send(IPC.PIPELINE_STAGE_UPDATE, {
			type: "degraded",
			stageId,
			reason
		});
	});
	on(STAGE_EVENTS.SKIPPED, ({ stageId, reason }) => {
		send(IPC.PIPELINE_STAGE_UPDATE, {
			type: "skipped",
			stageId,
			reason
		});
	});
	on(PROVIDER_EVENTS.SELECTED, ({ stageId, providerId }) => {
		send(IPC.PIPELINE_PROVIDER_UPDATE, {
			type: "start",
			stageId,
			providerId
		});
	});
	on(PROVIDER_EVENTS.COMPLETE, ({ stageId, providerId, durationMs }) => {
		send(IPC.PIPELINE_PROVIDER_UPDATE, {
			type: "done",
			stageId,
			providerId,
			durationMs
		});
	});
	on(PROVIDER_EVENTS.FAILED, ({ stageId, providerId, error }) => {
		send(IPC.PIPELINE_PROVIDER_UPDATE, {
			type: "fail",
			stageId,
			providerId,
			error: String(error)
		});
	});
	const trace = broker.resolve("trace.store");
	on(PIPELINE_EVENTS.STARTED, (payload) => {
		currentRunId = payload.runId;
		trace.startRun(payload.runId, payload.specName, getModel(), currentResumeName);
		trace.recordEvent(payload.runId, PIPELINE_EVENTS.STARTED, payload);
	});
	on(PIPELINE_EVENTS.COMPLETE, (payload) => {
		trace.recordEvent(payload.runId, PIPELINE_EVENTS.COMPLETE, payload);
		trace.completeRun(payload.runId, payload.durationMs, payload.stageCount);
		currentRunId = null;
	});
	on(PIPELINE_EVENTS.FAILED, (payload) => {
		trace.recordEvent(payload.runId, PIPELINE_EVENTS.FAILED, payload);
		trace.failRun(payload.runId, payload.error);
		currentRunId = null;
	});
	on(PIPELINE_EVENTS.HALTED_ITERATION_LIMIT, (payload) => {
		trace.recordEvent(payload.runId, PIPELINE_EVENTS.HALTED_ITERATION_LIMIT, payload);
	});
	on(PIPELINE_EVENTS.ITERATION_STARTED, (payload) => {
		trace.recordEvent(payload.runId, PIPELINE_EVENTS.ITERATION_STARTED, payload);
		send(IPC.PIPELINE_ITERATION, { iteration: payload.iteration });
	});
	for (const event of [
		STAGE_EVENTS.STARTED,
		STAGE_EVENTS.COMPLETE,
		STAGE_EVENTS.SKIPPED,
		STAGE_EVENTS.DEGRADED,
		PROVIDER_EVENTS.SELECTED,
		PROVIDER_EVENTS.COMPLETE,
		PROVIDER_EVENTS.FAILED,
		PROVIDER_EVENTS.FANOUT_STARTED,
		PROVIDER_EVENTS.FANOUT_COMPLETE
	]) on(event, (payload) => {
		trace.recordEvent(payload.runId, event, payload);
	});
	on("job:progress", (payload) => {
		send(IPC.PIPELINE_JOB_PROGRESS, payload);
	});
	on("llm:call-start", (payload) => {
		if (currentRunId) trace.startLLMCall(currentRunId, payload.callId, payload.caller, payload.model, payload.prompt, payload.temperature);
	});
	on("llm:call-complete", (payload) => {
		trace.completeLLMCall(payload.callId, payload.response, payload.durationMs, payload.promptTokens != null ? {
			prompt: payload.promptTokens,
			response: payload.responseTokens
		} : void 0);
	});
	on("llm:call-failed", (payload) => {
		trace.failLLMCall(payload.callId, payload.error, payload.durationMs);
	});
	_setResumeName = (name) => {
		currentResumeName = name;
	};
}
var _setResumeName = null;
function setCurrentResumeName(name) {
	if (_setResumeName) _setResumeName(name);
}
//#endregion
//#region electron/scheduler.ts
var schedulerInterval = null;
/**
* Start the background job indexer scheduler.
* Runs indexer.run on the configured interval and notifies the renderer
* if new jobs are found.
*/
function startScheduler(broker, config) {
	stopScheduler();
	const intervalMs = config.indexIntervalHours * 60 * 60 * 1e3;
	schedulerInterval = setInterval(async () => {
		try {
			const jobIndex = broker.resolve("job.index");
			const indexer = broker.resolve("indexer.run");
			const before = await jobIndex.stats();
			await indexer.indexNow();
			const after = await jobIndex.stats();
			const newJobCount = after.activeJobs - before.activeJobs;
			if (newJobCount > 0) {
				new electron.Notification({
					title: "Catalyst — New Jobs Found",
					body: `${newJobCount} new job${newJobCount === 1 ? "" : "s"} indexed from ${after.companies} companies.`
				}).show();
				const win = getMainWindow();
				if (win && !win.isDestroyed()) win.webContents.send(IPC.INDEX_NEW_JOBS, {
					newJobCount,
					totalActive: after.activeJobs,
					companies: after.companies
				});
			}
		} catch (err) {
			log.error("scheduler", "Index tick failed", { error: String(err) });
		}
	}, intervalMs);
}
/**
* Stop the background scheduler if running.
*/
function stopScheduler() {
	if (schedulerInterval) {
		clearInterval(schedulerInterval);
		schedulerInterval = null;
	}
}
//#endregion
//#region electron/ipc/users.ts
function registerUserHandlers(config) {
	electron.ipcMain.handle(IPC.USERS_LIST, () => {
		const broker = getUserBroker();
		if (!broker) throw new Error("User broker not initialized");
		return broker.resolve("user.manager").list();
	});
	electron.ipcMain.handle(IPC.USERS_CREATE, (_event, name) => {
		const broker = getUserBroker();
		if (!broker) throw new Error("User broker not initialized");
		return broker.resolve("user.manager").create(name);
	});
	electron.ipcMain.handle(IPC.USERS_CURRENT, () => {
		const broker = getUserBroker();
		if (!broker) throw new Error("User broker not initialized");
		const manager = broker.resolve("user.manager");
		const id = manager.getCurrentId();
		if (!id) return null;
		return manager.get(id) ?? null;
	});
	electron.ipcMain.handle(IPC.USERS_SELECT, async (_event, id) => {
		const userBroker = getUserBroker();
		if (!userBroker) throw new Error("User broker not initialized");
		const manager = userBroker.resolve("user.manager");
		const user = manager.get(id);
		if (!user) throw new Error(`User not found: ${id}`);
		manager.setCurrentId(id);
		setCatalystContext(buildUserContext(user.name));
		const appBroker = await createAppBroker(config, config.ollamaModel);
		wireBrokerEvents(appBroker, getMainWindow);
		startScheduler(appBroker, config);
		return user;
	});
}
//#endregion
//#region src/spec.ts
var jobSeekerSpec = {
	name: "job-seeker",
	stages: [
		{
			id: "parse-profile",
			capability: "profile.parse",
			policy: "single",
			errorPolicy: "fail-fast"
		},
		{
			id: "fetch-jobs",
			capability: "jobs.fetch",
			policy: "fanout",
			errorPolicy: "skip",
			reducer: { kind: "concat" },
			inputFrom: ["parse-profile"]
		},
		{
			id: "normalize-jobs",
			capability: "jobs.normalize",
			policy: "single",
			errorPolicy: "fail-fast",
			inputFrom: ["fetch-jobs"]
		},
		{
			id: "analyze-jobs",
			capability: "jobs.analyze",
			policy: "fanout",
			errorPolicy: "skip",
			reducer: { kind: "concat" },
			inputFrom: ["normalize-jobs", "parse-profile"]
		},
		{
			id: "synthesize",
			capability: "jobs.synthesize",
			policy: "single",
			errorPolicy: "fail-fast",
			inputFrom: [
				"analyze-jobs",
				"parse-profile",
				"normalize-jobs"
			]
		},
		{
			id: "reflect",
			capability: "jobs.reflect",
			policy: "single",
			errorPolicy: "fall-through",
			inputFrom: ["synthesize", "parse-profile"]
		}
	],
	termination: {
		maxIterations: 3,
		stopCondition: { capability: "jobs.search-complete" }
	}
};
//#endregion
//#region electron/ipc/pipeline.ts
async function executePipeline(resumeText, resumeName, companySourceId) {
	const broker = getBroker();
	if (!broker) throw new Error("No user selected");
	setCurrentResumeName(resumeName);
	setPipelineCompanyId(companySourceId);
	const runner = broker.resolve("pipeline-runner");
	const model = getModel();
	const runId = crypto.randomUUID();
	const start = Date.now();
	const win = getMainWindow();
	log.info("pipeline", "Pipeline started", {
		resumeName,
		model,
		runId,
		companySourceId
	});
	try {
		const result = await runner.run(jobSeekerSpec, {
			resumeText,
			resumeName
		});
		const jobs = result.stageOutputs.get("synthesize") ?? [];
		const durationMs = Date.now() - start;
		const store = broker.resolve("results.store");
		await store.save(runId, resumeName, model, result.iteration, durationMs, jobs, companySourceId);
		const profile = result.stageOutputs.get("parse-profile");
		const normalizedJobs = result.stageOutputs.get("normalize-jobs");
		const analyses = result.stageOutputs.get("analyze-jobs")?.flat();
		const reflectOutput = result.stageOutputs.get("reflect");
		store.saveEnrichment(runId, {
			profile,
			normalizedJobs,
			analyses,
			reflectRationale: reflectOutput?.rationale,
			confidence: reflectOutput?.confidence
		});
		if (win && !win.isDestroyed()) {
			win.webContents.send(IPC.PIPELINE_ENRICHMENT, {
				profile,
				normalizedJobs,
				analyses,
				reflectRationale: reflectOutput?.rationale,
				confidence: reflectOutput?.confidence
			});
			win.webContents.send(IPC.PIPELINE_DONE, {
				results: jobs,
				iteration: result.iteration,
				durationMs,
				runId
			});
		}
		if (companySourceId && jobs.length > 0) try {
			broker.resolve("kanban.store").ensureTracked(companySourceId, jobs);
		} catch {}
		log.info("pipeline", "Pipeline complete", {
			runId,
			jobCount: jobs.length,
			iteration: result.iteration,
			durationMs
		});
		try {
			const llm = broker.resolve("llm.generate");
			const profileData = broker.resolve("profile.store").get();
			if (profileData && jobs.length > 0) {
				const { runSummaryPrompt } = await Promise.resolve().then(() => require("./run-summary-C6ly2hd2.js"));
				const summaryText = await llm.generate(runSummaryPrompt(jobs, profileData), { temperature: .3 });
				store.saveSummary(runId, summaryText);
				if (win && !win.isDestroyed()) win.webContents.send(IPC.PIPELINE_RUN_SUMMARY, {
					runId,
					summary: summaryText
				});
			}
		} catch (err) {
			log.warn("pipeline", "Failed to generate run summary", {
				runId,
				error: String(err)
			});
		}
		return {
			runId,
			jobs,
			iteration: result.iteration,
			durationMs
		};
	} catch (err) {
		log.error("pipeline", "Pipeline failed", {
			runId,
			error: String(err)
		});
		if (win && !win.isDestroyed()) win.webContents.send(IPC.PIPELINE_ERROR, { error: String(err) });
		throw err;
	} finally {
		setPipelineCompanyId(void 0);
	}
}
function registerPipelineHandlers() {
	electron.ipcMain.handle(IPC.PIPELINE_RUN, async (_event, text, name) => {
		return executePipeline(text, name);
	});
	electron.ipcMain.handle(IPC.PIPELINE_RUN_COMPANY, async (_event, text, name, companyId) => {
		return executePipeline(text, name, companyId);
	});
	electron.ipcMain.handle(IPC.OPEN_URL, async (_event, url) => {
		const parsed = new URL(url);
		if (parsed.protocol !== "https:" && parsed.protocol !== "http:") throw new Error("Only http/https URLs are allowed");
		await electron.shell.openExternal(url);
	});
}
//#endregion
//#region electron/ipc/companies.ts
function registerCompanyHandlers() {
	electron.ipcMain.handle(IPC.COMPANIES_LIST, async () => {
		const broker = getBroker();
		if (!broker) throw new Error("No user selected");
		return broker.resolve("company.store").list();
	});
	electron.ipcMain.handle(IPC.COMPANIES_ADD, async (_event, url) => {
		const broker = getBroker();
		if (!broker) throw new Error("No user selected");
		return broker.resolve("company.store").add(url);
	});
	electron.ipcMain.handle(IPC.COMPANIES_REMOVE, async (_event, id) => {
		const broker = getBroker();
		if (!broker) throw new Error("No user selected");
		return broker.resolve("company.store").remove(id);
	});
	electron.ipcMain.handle(IPC.COMPANIES_TOGGLE, async (_event, id, enabled) => {
		const broker = getBroker();
		if (!broker) throw new Error("No user selected");
		return broker.resolve("company.store").setEnabled(id, enabled);
	});
	electron.ipcMain.handle(IPC.COMPANIES_SET_FILTERS, async (_event, id, filters) => {
		const broker = getBroker();
		if (!broker) throw new Error("No user selected");
		return broker.resolve("company.store").setFilters(id, filters);
	});
	electron.ipcMain.handle(IPC.INDEX_RUN, async () => {
		const broker = getBroker();
		if (!broker) throw new Error("No user selected");
		return broker.resolve("indexer.run").indexNow();
	});
	electron.ipcMain.handle(IPC.INDEX_COMPANY, async (_event, id) => {
		const broker = getBroker();
		if (!broker) throw new Error("No user selected");
		return broker.resolve("indexer.run").indexCompany(id);
	});
}
//#endregion
//#region electron/ipc/kanban.ts
function registerKanbanHandlers() {
	electron.ipcMain.handle(IPC.KANBAN_COLUMNS, async (_event, companyId, column) => {
		const broker = getBroker();
		if (!broker) throw new Error("No user selected");
		return broker.resolve("kanban.store").getColumnJobs(companyId, column);
	});
	electron.ipcMain.handle(IPC.KANBAN_STAGE_COUNTS, async (_e, companyIds) => {
		const broker = getBroker();
		if (!broker) throw new Error("No user selected");
		return broker.resolve("kanban.store").getStageCounts(companyIds?.[0]);
	});
	electron.ipcMain.handle(IPC.KANBAN_RECENT_ACTIVITY, async () => {
		const broker = getBroker();
		if (!broker) throw new Error("No user selected");
		return broker.resolve("kanban.store").getRecentActivityCount(7);
	});
	electron.ipcMain.handle(IPC.KANBAN_RECENT_MOVES, async () => {
		const broker = getBroker();
		if (!broker) throw new Error("No user selected");
		return broker.resolve("kanban.store").getRecentMoves(50);
	});
	electron.ipcMain.handle(IPC.KANBAN_MOVE, async (_event, jobId, companyId, column, feedback) => {
		const broker = getBroker();
		if (!broker) throw new Error("No user selected");
		broker.resolve("kanban.store").moveJob(jobId, companyId, column, feedback ? {
			tags: feedback.tags,
			notes: feedback.notes
		} : void 0);
	});
}
//#endregion
//#region electron/ipc/results.ts
function registerResultsHandlers() {
	electron.ipcMain.handle(IPC.RESULTS_LIST_RUNS, async () => {
		const broker = getBroker();
		if (!broker) throw new Error("No user selected");
		return broker.resolve("results.query").listRuns();
	});
	electron.ipcMain.handle(IPC.RESULTS_GET_RUN, async (_event, id) => {
		const broker = getBroker();
		if (!broker) throw new Error("No user selected");
		return broker.resolve("results.query").getRunDetail(id);
	});
	electron.ipcMain.handle(IPC.RESULTS_GET_JOBS, async (_event, id) => {
		const broker = getBroker();
		if (!broker) throw new Error("No user selected");
		return broker.resolve("results.query").getJobs(id);
	});
	electron.ipcMain.handle(IPC.RESULTS_GET_LATEST_SUMMARY, async () => {
		const broker = getBroker();
		if (!broker) throw new Error("No user selected");
		const query = broker.resolve("results.query");
		const runId = await query.getLatestRunId();
		if (!runId) return null;
		return (await query.getRunDetail(runId))?.summary ?? null;
	});
}
//#endregion
//#region electron/ipc/docs.ts
function registerDocsHandlers() {
	electron.ipcMain.handle(IPC.DOCS_LIST, () => {
		return require_input.listDocsFolder(getCatalystContext().docsDir);
	});
	electron.ipcMain.handle(IPC.DOCS_READ, async (_event, filePath) => {
		const { resolve, sep } = await import("node:path");
		const ctx = getCatalystContext();
		const resolved = resolve(filePath);
		const prefix = ctx.docsDir.endsWith(sep) ? ctx.docsDir : ctx.docsDir + sep;
		if (!resolved.startsWith(prefix) && resolved !== ctx.docsDir) throw new Error("Path outside user docs directory");
		return require_input.readResumeFile(resolved);
	});
	electron.ipcMain.handle(IPC.DOCS_IMPORT, async () => {
		const { basename, join } = await import("node:path");
		const { copyFile, mkdir } = await import("node:fs/promises");
		const win = electron.BrowserWindow.getFocusedWindow();
		const result = await electron.dialog.showOpenDialog(win, {
			title: "Import Resume",
			filters: [{
				name: "Documents",
				extensions: [
					"txt",
					"md",
					"pdf"
				]
			}],
			properties: ["openFile"]
		});
		if (result.canceled || result.filePaths.length === 0) return null;
		const srcPath = result.filePaths[0];
		const ctx = getCatalystContext();
		await mkdir(ctx.docsDir, { recursive: true });
		const name = basename(srcPath);
		const destPath = join(ctx.docsDir, name);
		await copyFile(srcPath, destPath);
		return {
			name,
			path: destPath
		};
	});
	electron.ipcMain.handle(IPC.SETTINGS_GET, async () => {
		const { loadConfig } = await Promise.resolve().then(() => require("./input-CAFfFXdH.js"));
		return loadConfig();
	});
	electron.ipcMain.handle(IPC.SETTINGS_SET, async (_event, key, value) => {
		if (!new Set([
			"ollamaModel",
			"ollamaUrl",
			"indexIntervalHours"
		]).has(key)) throw new Error(`Unknown config key: ${key}`);
		const { loadConfig } = await Promise.resolve().then(() => require("./input-CAFfFXdH.js"));
		const { join } = await import("node:path");
		const { homedir } = await import("node:os");
		const { writeFileText } = await Promise.resolve().then(() => require("./platform-BwsN4pjh.js")).then((n) => n.platform_exports);
		const config = await loadConfig();
		config[key] = value;
		await writeFileText(join(homedir(), ".catalyst", "config.json"), JSON.stringify(config, null, 2));
		return config;
	});
	electron.ipcMain.handle(IPC.OLLAMA_MODELS, async () => {
		const { loadConfig } = await Promise.resolve().then(() => require("./input-CAFfFXdH.js"));
		const baseUrl = (await loadConfig()).ollamaUrl ?? "http://localhost:11434";
		const url = new URL("/api/tags", baseUrl);
		return (await new Promise((resolve, reject) => {
			node_http.default.get(url, (res) => {
				const chunks = [];
				res.on("data", (chunk) => chunks.push(chunk));
				res.on("end", () => {
					if (res.statusCode && res.statusCode >= 400) reject(/* @__PURE__ */ new Error(`Ollama error ${res.statusCode}`));
					else resolve(JSON.parse(Buffer.concat(chunks).toString()));
				});
			}).on("error", (err) => reject(/* @__PURE__ */ new Error(`Ollama unreachable at ${baseUrl}: ${err.message}`)));
		})).models.map((m) => ({
			name: m.name,
			size: m.size,
			parameterSize: m.details?.parameter_size,
			quantization: m.details?.quantization_level
		}));
	});
}
//#endregion
//#region electron/ipc/profile.ts
function registerProfileHandlers() {
	electron.ipcMain.handle(IPC.PROFILE_GET, () => {
		const broker = getBroker();
		if (!broker) return null;
		return broker.resolve("profile.store").getWithMeta();
	});
	electron.ipcMain.handle(IPC.PROFILE_PARSE, async (_event, resumeText, resumeName) => {
		const broker = getBroker();
		if (!broker) throw new Error("No user selected");
		const profile = await broker.resolve("profile.parse")({
			resumeText,
			resumeName
		});
		broker.resolve("profile.store").save(profile, resumeName);
		const win = getMainWindow();
		if (win && !win.isDestroyed()) win.webContents.send(IPC.PIPELINE_ENRICHMENT, { profile });
		return profile;
	});
	electron.ipcMain.handle(IPC.PROFILE_SAVE, (_event, profile) => {
		const broker = getBroker();
		if (!broker) throw new Error("No user selected");
		const store = broker.resolve("profile.store");
		const existing = store.getWithMeta();
		store.save(profile, existing?.sourceResume ?? "manual-edit");
	});
}
//#endregion
//#region electron/ipc/traces.ts
function registerTraceHandlers() {
	electron.ipcMain.handle(IPC.TRACES_LIST_RUNS, async () => {
		const broker = getBroker();
		if (!broker) throw new Error("No user selected");
		return broker.resolve("trace.query").listRuns();
	});
	electron.ipcMain.handle(IPC.TRACES_GET_EVENTS, async (_event, runId) => {
		const broker = getBroker();
		if (!broker) throw new Error("No user selected");
		return broker.resolve("trace.query").getEvents(runId);
	});
	electron.ipcMain.handle(IPC.TRACES_GET_LLM_CALLS, async (_event, runId) => {
		const broker = getBroker();
		if (!broker) throw new Error("No user selected");
		return broker.resolve("trace.query").getLLMCalls(runId);
	});
	electron.ipcMain.handle(IPC.TRACES_GET_LLM_CALL, async (_event, callId) => {
		const broker = getBroker();
		if (!broker) throw new Error("No user selected");
		return broker.resolve("trace.query").getLLMCall(callId);
	});
}
//#endregion
//#region electron/ipc/dashboard.ts
function registerDashboardHandlers() {
	electron.ipcMain.handle(IPC.RESULTS_GET_ALL_JOBS, async (_event, companyIds) => {
		const broker = getBroker();
		if (!broker) throw new Error("No user selected");
		const query = broker.resolve("results.query");
		const runs = await query.listRuns();
		const jobMap = /* @__PURE__ */ new Map();
		for (const run of runs) {
			const jobs = await query.getJobs(run.id);
			const analyses = (await query.getRunDetail(run.id))?.analyses ?? [];
			for (const ranked of jobs) if (!jobMap.has(ranked.job.id)) {
				const jobAnalyses = analyses.filter((a) => a.jobId === ranked.job.id);
				jobMap.set(ranked.job.id, {
					ranked,
					analyses: jobAnalyses
				});
			}
		}
		let entries = Array.from(jobMap.values());
		if (companyIds && companyIds.length > 0) try {
			const kanban = broker.resolve("kanban.store");
			entries = entries.filter((e) => {
				return companyIds.some((cid) => {
					return [
						"new",
						"looking-at",
						"applying",
						"rejected",
						"not-applying"
					].some((col) => {
						return kanban.getColumnJobs(cid, col).some((j) => j.jobId === e.ranked.job.id);
					});
				});
			});
		} catch {}
		try {
			const kanban = broker.resolve("kanban.store");
			return entries.map((e) => ({
				...e,
				kanbanColumn: kanban.getJobColumn(e.ranked.job.id) ?? "new"
			}));
		} catch {
			return entries;
		}
	});
	electron.ipcMain.handle(IPC.KANBAN_FEEDBACK_SUMMARY, async (_event, companyIds) => {
		const broker = getBroker();
		if (!broker) throw new Error("No user selected");
		const kanban = broker.resolve("kanban.store");
		if (!companyIds || companyIds.length === 0) return kanban.getFeedbackSummary();
		const combined = {
			totalRejected: 0,
			totalNotApplying: 0,
			tagCounts: {},
			recentNotes: []
		};
		for (const cid of companyIds) {
			const summary = kanban.getFeedbackSummary(cid);
			combined.totalRejected += summary.totalRejected;
			combined.totalNotApplying += summary.totalNotApplying;
			for (const [tag, count] of Object.entries(summary.tagCounts)) combined.tagCounts[tag] = (combined.tagCounts[tag] ?? 0) + count;
			combined.recentNotes.push(...summary.recentNotes);
		}
		combined.recentNotes = combined.recentNotes.slice(-10);
		return combined;
	});
}
//#endregion
//#region electron/ipc/index.ts
/**
* Register all IPC handlers. Called once during app startup.
*/
function registerAllIpc(config) {
	registerUserHandlers(config);
	registerPipelineHandlers();
	registerCompanyHandlers();
	registerKanbanHandlers();
	registerResultsHandlers();
	registerDocsHandlers();
	registerProfileHandlers();
	registerTraceHandlers();
	registerDashboardHandlers();
}
//#endregion
//#region electron/main.ts
pruneOldLogs();
log.info("main", "Catalyst starting");
process.on("uncaughtException", (err) => {
	log.error("main", "Uncaught exception", {
		error: err.message,
		stack: err.stack
	});
	electron.dialog.showErrorBox("Unexpected Error", err.message);
});
process.on("unhandledRejection", (reason) => {
	const message = reason instanceof Error ? reason.message : String(reason);
	const stack = reason instanceof Error ? reason.stack : void 0;
	log.error("main", "Unhandled rejection", {
		error: message,
		stack
	});
});
var mainWindow = null;
var userBroker = null;
var appBroker = null;
var currentConfig = null;
var currentModel = "gemma4";
function getMainWindow() {
	return mainWindow;
}
function getBroker() {
	return appBroker;
}
function getUserBroker() {
	return userBroker;
}
function getConfig() {
	return currentConfig;
}
function getModel() {
	return currentModel;
}
/** Create the lightweight user-management broker (no per-user context needed). */
async function createUserBroker() {
	const broker = createBroker({ debug: false });
	broker.register(userManagerPlugin());
	await broker.activate();
	userBroker = broker;
	return broker;
}
/** Create and activate the full per-user broker with all plugins. */
async function createAppBroker(config, model) {
	if (appBroker) {
		log.info("main", "Deactivating previous app broker");
		stopScheduler();
		await appBroker.deactivate();
		appBroker = null;
	}
	currentModel = model;
	const broker = createBroker({ debug: false });
	broker.register(ollamaProviderPlugin({
		model,
		baseUrl: config.ollamaUrl
	}));
	broker.register(resultsStorePlugin());
	broker.register(traceStorePlugin());
	broker.register(createPipelineRunnerPlugin());
	broker.register(catalogDbPlugin());
	broker.register(atsDetectorPlugin());
	broker.register(companyStorePlugin());
	broker.register(jobIndexStorePlugin());
	broker.register(jobIndexerPlugin({
		intervalHours: config.indexIntervalHours,
		autoStart: false
	}));
	broker.register(kanbanStorePlugin());
	broker.register(indexFetcherPlugin());
	broker.register(remotiveFetcherPlugin());
	broker.register(profileStorePlugin());
	broker.register(profileParserPlugin());
	broker.register(jobNormalizerPlugin());
	broker.register(skillMatcherPlugin());
	broker.register(cultureFitAnalyzerPlugin());
	broker.register(salaryEstimatorPlugin());
	broker.register(synthesizerPlugin());
	broker.register(reflectionAgentPlugin());
	await broker.activate();
	appBroker = broker;
	log.info("main", "App broker activated", { model });
	return broker;
}
function createWindow() {
	const win = new electron.BrowserWindow({
		width: 1200,
		height: 800,
		webPreferences: {
			preload: (0, node_path.join)(__dirname, "preload.js"),
			contextIsolation: true,
			nodeIntegration: false,
			sandbox: true
		}
	});
	win.loadURL("http://localhost:5173");
	mainWindow = win;
	win.on("closed", () => {
		mainWindow = null;
	});
	return win;
}
electron.app.whenReady().then(async () => {
	currentConfig = await require_input.loadConfig();
	currentModel = currentConfig.ollamaModel;
	await createUserBroker();
	registerAllIpc(currentConfig);
	createWindow();
	electron.app.on("activate", () => {
		if (electron.BrowserWindow.getAllWindows().length === 0) createWindow();
	});
});
electron.app.on("window-all-closed", () => {
	if (process.platform !== "darwin") electron.app.quit();
});
electron.app.on("will-quit", async (e) => {
	e.preventDefault();
	stopScheduler();
	if (appBroker) {
		await appBroker.deactivate();
		appBroker = null;
	}
	if (userBroker) {
		await userBroker.deactivate();
		userBroker = null;
	}
	electron.app.exit(0);
});
//#endregion
exports.createAppBroker = createAppBroker;
exports.createUserBroker = createUserBroker;
exports.getBroker = getBroker;
exports.getConfig = getConfig;
exports.getMainWindow = getMainWindow;
exports.getModel = getModel;
exports.getUserBroker = getUserBroker;
