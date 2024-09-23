function openPage() {
  // This script will extract only HTML comments from the page
  const codeToExtractComments = `
    (() => {
      const html = document.documentElement.outerHTML;
      const comments = [];
      const regex = /<!--([\\s\\S]*?)-->/g;
      let match;
      while ((match = regex.exec(html)) !== null) {
        comments.push(match[0]);
      }
      return comments.join('\\n');
    })()
  `;

  browser.tabs
    .executeScript({
      code: codeToExtractComments,
    })
    .then((results) => {
      const commentsHTML = results[0] || "No comments found."; // If no comments, display a message

      // Create a new tab to display the comments
      browser.tabs
        .create({
          url: browser.runtime.getURL("view-source.html"),
        })
        .then((tab) => {
          // Send the extracted comments to the new tab
          browser.tabs.onUpdated.addListener(function listener(tabId, info) {
            if (info.status === "complete" && tabId === tab.id) {
              browser.tabs.sendMessage(tabId, { html: commentsHTML });
              browser.tabs.onUpdated.removeListener(listener);
            }
          });
        });
    });
}

browser.browserAction.onClicked.addListener(openPage);
