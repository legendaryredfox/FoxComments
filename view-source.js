// Receive the HTML content from the background script and display it
browser.runtime.onMessage.addListener((message) => {
  document.getElementById("source").textContent = message.html;
});
