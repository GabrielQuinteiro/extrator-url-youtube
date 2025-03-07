document.addEventListener("DOMContentLoaded", async function () {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    chrome.scripting.executeScript(
        {
            target: { tabId: tab.id },
            function: getYoutubeURL
        },
        (results) => {
            if (results && results[0] && results[0].result) {
                let embedUrl = results[0].result;
                let videoId = extractVideoId(embedUrl);
                let youtubeUrl = `https://www.youtube.com/watch?v=${videoId}`;

                // Exibe a URL no pop-up
                document.getElementById("status").style.display = "none";
                let linkElement = document.getElementById("videoLink");
                linkElement.style.display = "block";
                linkElement.innerHTML = `<a href="${youtubeUrl}" target="_blank">${youtubeUrl}</a>`;

                // Exibe o botão de copiar
                let copyButton = document.getElementById("copyButton");
                copyButton.style.display = "block";

                // Copiar a URL ao clicar no botão
                copyButton.addEventListener("click", function () {
                    navigator.clipboard.writeText(youtubeUrl).then(() => {
                        copyButton.innerText = "Copiado!";
                        setTimeout(() => copyButton.innerText = "Copiar URL", 2000);
                    }).catch(err => {
                        console.error("Erro ao copiar: ", err);
                    });
                });
            } else {
                document.getElementById("status").innerText = "Nenhum vídeo encontrado.";
            }
        }
    );
});

// Função para capturar o iframe do YouTube
function getYoutubeURL() {
    let iframe = document.querySelector("iframe[src*='youtube.com/embed/']");
    return iframe ? iframe.src : null;
}

// Função para extrair o ID do vídeo do link embed
function extractVideoId(embedUrl) {
    let match = embedUrl.match(/embed\/([a-zA-Z0-9_-]+)\?/);
    return match ? match[1] : null;
}
