chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "getVideoURL") {
        let iframe = document.querySelector("iframe[src*='youtube.com/embed/']");
        sendResponse({ url: iframe ? iframe.src : null });
    }
});
