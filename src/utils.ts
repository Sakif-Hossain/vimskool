export function findGoogleDocsEditor(): HTMLElement | null {
  // The main editor in Google Docs is inside an iframe
  const editorIframe = Array.from(document.getElementsByTagName("iframe")).find(
    (iframe) => iframe.className.includes("docs-texteventtarget-iframe")
  );

  if (!editorIframe?.contentDocument) {
    console.log("Could not find Google Docs editor iframe");
    return null;
  }

  // The actual contenteditable element inside the iframe
  const editor = editorIframe.contentDocument.querySelector(
    '[contenteditable="true"]'
  );
  if (!editor) {
    console.log("Could not find editor element");
    return null;
  }

  return editor as HTMLElement;
}
