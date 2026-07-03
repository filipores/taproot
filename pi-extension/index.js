import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const {
  DEFAULT_MODE,
  getDefaultMode,
  normalizeMode,
  writeDefaultMode,
} = require("../hooks/taproot-config.js");
const { getTaprootInstructions } = require("../hooks/taproot-instructions.js");

export const readDefaultMode = getDefaultMode;
export { getTaprootInstructions, writeDefaultMode };

export function resolveSessionMode(entries, fallbackMode = DEFAULT_MODE) {
  const fallback = normalizeMode(fallbackMode) || DEFAULT_MODE;
  if (!Array.isArray(entries)) return fallback;

  for (let i = entries.length - 1; i >= 0; i -= 1) {
    const entry = entries[i];
    if (entry?.type !== "custom" || entry?.customType !== "taproot-mode") continue;
    const mode = normalizeMode(entry?.data?.mode);
    if (mode) return mode;
  }

  return fallback;
}

export function parseTaprootCommand(text, defaultMode = DEFAULT_MODE) {
  const fallback = normalizeMode(defaultMode) || DEFAULT_MODE;
  const normalizedText = String(text || "").trim().toLowerCase();

  if (!normalizedText) return { type: "set-mode", mode: fallback === "off" ? "on" : fallback };

  const [primary, secondary] = normalizedText.split(/\s+/);
  if (primary === "status") return { type: "status" };

  if (primary === "default") {
    const mode = normalizeMode(secondary);
    return mode ? { type: "set-default", mode } : { type: "invalid", reason: "invalid-default-mode" };
  }

  const mode = normalizeMode(primary);
  return mode ? { type: "set-mode", mode } : { type: "invalid", reason: "invalid-mode", mode: primary };
}

export default function taprootExtension(pi) {
  let currentMode = DEFAULT_MODE;
  let configuredDefaultMode = getDefaultMode();

  const setMode = (mode, ctx) => {
    const normalized = normalizeMode(mode);
    if (!normalized) return;
    currentMode = normalized;
    pi.appendEntry("taproot-mode", { mode: normalized });
    ctx?.ui?.notify?.(`Taproot mode ${normalized}.`, "info");
  };

  const sendAlias = (skillName, args, ctx) => {
    const normalized = String(args || "").trim();
    const message = normalized ? `${skillName} ${normalized}` : skillName;

    if (ctx?.isIdle?.() === false) {
      pi.sendUserMessage(message, { deliverAs: "followUp" });
      ctx?.ui?.notify?.(`${skillName} queued as follow-up.`, "info");
      return;
    }

    pi.sendUserMessage(message);
  };

  pi.registerCommand("taproot", {
    description: "Set or report Taproot mode",
    handler: async (args, ctx) => {
      const parsed = parseTaprootCommand(args, configuredDefaultMode);

      if (parsed.type === "status") {
        ctx?.ui?.notify?.(`Taproot: current ${currentMode} • default ${configuredDefaultMode}`, "info");
        return;
      }

      if (parsed.type === "set-default") {
        const written = writeDefaultMode(parsed.mode);
        if (written) {
          configuredDefaultMode = getDefaultMode();
          const message = configuredDefaultMode === written
            ? `Default Taproot mode set to ${written}.`
            : `Saved default ${written}, but env override keeps default at ${configuredDefaultMode}.`;
          ctx?.ui?.notify?.(message, "info");
        }
        return;
      }

      if (parsed.type === "set-mode") {
        setMode(parsed.mode, ctx);
        return;
      }

      ctx?.ui?.notify?.("Unknown or unsupported /taproot mode.", "warning");
    },
  });

  pi.registerCommand("taproot-help", {
    description: "Run /skill:taproot",
    handler: (args, ctx) => sendAlias("/skill:taproot", args, ctx),
  });

  pi.on("input", async (event) => {
    if (event?.source === "extension") return;
    const text = String(event?.text || "");
    if (currentMode !== "off" && /\b(stop taproot|normal mode)\b/i.test(text)) {
      setMode("off");
    }
  });

  pi.on("session_start", async (_event, ctx) => {
    const entries = ctx?.sessionManager?.getBranch?.() || ctx?.sessionManager?.getEntries?.() || [];
    configuredDefaultMode = getDefaultMode();
    currentMode = resolveSessionMode(entries, configuredDefaultMode);
  });

  pi.on("before_agent_start", async (event) => {
    if (currentMode !== "on") return;
    return { systemPrompt: `${event.systemPrompt}\n\n${getTaprootInstructions()}` };
  });
}
