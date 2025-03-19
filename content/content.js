chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "getVideoURL") {
        const iframe = document.querySelector("iframe[src*='youtube.com/embed/']");
        if (iframe) {
            console.log("Extraiu URL do iframe:", iframe.src);
            sendResponse({ url: iframe.src });
        } else {
            console.warn("Nenhum iframe encontrado com URL do YouTube");
            sendResponse({ url: null });
        }
    }
});
