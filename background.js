chrome.action.onClicked.addListener((tab) => {
    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: getYoutubeURL
    });
});

function getYoutubeURL() {
    let iframe = document.querySelector("iframe[src*='youtube.com/embed/']");
    if (iframe) {
        alert("URL do vídeo: " + iframe.src);
    } else {
        alert("Nenhum vídeo encontrado!");
    }
}
