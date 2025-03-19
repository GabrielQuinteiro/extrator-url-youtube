document.addEventListener("DOMContentLoaded", async function () {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    chrome.tabs.sendMessage(tab.id, { action: "getVideoURL" }, (response) => {
        if (chrome.runtime.lastError) {
            console.error("Erro ao enviar mensagem:", chrome.runtime.lastError);
            document.getElementById("status").innerText = "Erro ao extrair URL.";
            return;
        }
        if (response && response.url) {
            let embedUrl = response.url;
            let videoId = extractVideoId(embedUrl);
            if (!videoId) {
                document.getElementById("status").innerText = "Não foi possível extrair o ID do vídeo.";
                return;
            }
            let youtubeUrl = `https://www.youtube.com/watch?v=${videoId}`;

            /* Atualiza o popup com a URL do vídeo */
            document.getElementById("status").style.display = "none";
            let linkElement = document.getElementById("videoLink");
            linkElement.style.display = "block";
            linkElement.innerHTML = `<a href="${youtubeUrl}" target="_blank">${youtubeUrl}</a>`;

            /* Configura o botão de copiar */
            let copyButton = document.getElementById("copyButton");
            copyButton.style.display = "block";
            copyButton.addEventListener("click", function () {
                navigator.clipboard.writeText(youtubeUrl).then(() => {
                    copyButton.innerText = "Copiado!";
                    setTimeout(() => copyButton.innerText = "Copiar URL", 2000);
                }).catch(err => {
                    console.error("Erro ao copiar:", err);
                });
            });
        } else {
            document.getElementById("status").innerText = "Nenhum vídeo encontrado.";
        }
    });
});

/* Função para capturar o iframe do YouTube */
function getYoutubeURL() {
    let iframe = document.querySelector("iframe[src*='youtube.com/embed/']");
    return iframe ? iframe.src : null;
}

/* Função para extrair o ID do vídeo do link embed */
function extractVideoId(embedUrl) {
    let match = embedUrl.match(/embed\/([a-zA-Z0-9_-]+)\?/);
    return match ? match[1] : null;
}
