import { findGoogleDocsEditor } from "./utils";

export enum Mode {
  OFF = "OFF",
  COMMAND = "COMMAND",
  INSERT = "INSERT",
  VISUAL = "VISUAL",
}

export class VimState {
  private _mode: Mode = Mode.OFF;
  private _clipboard: string = "";
  private _editor: HTMLElement | null = null;

  constructor() {
    this._editor = findGoogleDocsEditor();
    if (!this._editor) {
      console.error("Failed to initialize VimState: Editor not found");
    }
  }

  get editor(): HTMLElement | null {
    return this._editor;
  }

  setMode(newMode: Mode) {
    this._mode = newMode;
    console.log(`Switched to ${newMode} mode.`);
    this.updateStatusBar();
  }

  get mode(): Mode {
    return this._mode;
  }

  isInOffMode(): boolean {
    return this._mode === Mode.OFF;
  }

  isInInsertMode(): boolean {
    return this._mode === Mode.INSERT;
  }

  isInCommandMode(): boolean {
    return this._mode === Mode.COMMAND;
  }

  isInVisualMode(): boolean {
    return this._mode === Mode.VISUAL;
  }

  setClipboard(text: string) {
    this._clipboard = text;
  }

  getClipboard(): string {
    return this._clipboard;
  }

  private updateStatusBar() {
    const statusBar = document.getElementById("vim-status-bar");
    if (statusBar) {
      statusBar.textContent = `MODE: ${this._mode}`;
    }
  }

  focusEditor() {
    if (this._editor) {
      this._editor.focus();
    }
  }
}
