import { VimState, Mode } from "./state";
import { handleCommand } from "./commands";
import { findGoogleDocsEditor } from "./utils";

let state: VimState | null = null;

// Create and display the status bar
function createStatusBar() {
  const statusBar = document.createElement("div");
  statusBar.id = "vim-status-bar";
  statusBar.style.position = "fixed";
  statusBar.style.bottom = "30px"; // Above Google Docs' bottom bar
  statusBar.style.left = "50%";
  statusBar.style.transform = "translateX(-50%)";
  statusBar.style.width = "200px";
  statusBar.style.backgroundColor = "#2e3436";
  statusBar.style.color = "#ffffff";
  statusBar.style.fontFamily = "monospace";
  statusBar.style.fontSize = "12px";
  statusBar.style.padding = "4px";
  statusBar.style.textAlign = "center";
  statusBar.style.zIndex = "9999999";
  statusBar.style.borderRadius = "4px";
  statusBar.style.boxShadow = "0 2px 4px rgba(0,0,0,0.2)";
  statusBar.textContent = "VIM: OFF";
  document.body.appendChild(statusBar);
}

// Set up keyboard event listeners
function setupEventListeners() {
  if (!state?.editor) {
    console.error("Cannot setup event listeners: editor not found");
    return;
  }

  // Listen for keyboard events on the editor
  state.editor.addEventListener("keydown", (event) => {
    // Only handle events when extension is enabled and not in OFF mode
    if (state?.isInOffMode()) {
      return;
    }

    const interceptedKeys = [
      "h",
      "j",
      "k",
      "l", // Movement
      "i", // Insert mode
      "v", // Visual mode
      "Escape",
      "Esc", // Return to command mode
      "w",
      "b", // Word movement
      "y",
      "p", // Copy/paste
      "0",
      "$", // Line start/end
    ];

    if (interceptedKeys.includes(event.key)) {
      event.preventDefault();
      event.stopPropagation();
      handleCommand(event.key, state!);
    }
  });
}

// Add message listener for extension toggle
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (!state) return;

  if (message.type === "toggleVim") {
    if (message.enabled) {
      state.setMode(Mode.COMMAND);
      updateStatusBarText("VIM: COMMAND");
    } else {
      state.setMode(Mode.OFF);
      updateStatusBarText("VIM: OFF");
    }
  }
});

// Helper function to update status bar text
function updateStatusBarText(text: string) {
  const statusBar = document.getElementById("vim-status-bar");
  if (statusBar) {
    statusBar.textContent = text;
  }
}

// Initialize the extension
function initializeExtension() {
  // Create new VimState instance
  state = new VimState();

  // Check if we successfully found the editor
  if (!state.editor) {
    console.error("Failed to initialize: Google Docs editor not found");
    return;
  }

  // Create the status bar
  createStatusBar();

  // Setup event listeners
  setupEventListeners();

  // Start in OFF mode
  state.setMode(Mode.OFF);
  updateStatusBarText("VIM: OFF");

  console.log("Vim extension initialized successfully");
}

// Wait for Google Docs to load, then initialize
function init() {
  if (!window.location.hostname.includes("docs.google.com")) {
    console.log("Not a Google Docs page, extension not initialized");
    return;
  }

  // Wait for Google Docs to fully initialize
  setTimeout(() => {
    initializeExtension();
  }, 1000);
}

// Start initialization when the DOM is ready
if (document.readyState === "loading") {
  window.addEventListener("DOMContentLoaded", init);
} else {
  init();
}

// Export state for debugging purposes
(window as any).vimState = state;
