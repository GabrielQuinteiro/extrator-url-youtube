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
                linkElement.value = youtubeUrl;

                // Exibe os botões
                let buttonGroup = document.getElementById("buttonGroup");
                buttonGroup.style.display = "flex";

                // Botão "Copiar URL"
                let copyButton = document.getElementById("copyButton");
                copyButton.addEventListener("click", function () {
                    navigator.clipboard.writeText(youtubeUrl).then(() => {
                        copyButton.innerText = "Copiado!";
                        const popup = document.getElementById("popup");
                        popup.style.display = "block";
                        setTimeout(() => {
                            popup.style.display = "none";
                            copyButton.innerText = "Copiar URL";
                        }, 2000);
                    }).catch(err => {
                        console.error("Erro ao copiar: ", err);
                    });
                });

                // Botão "Ir para o vídeo"
                let videoButton = document.getElementById("videoButton");
                videoButton.addEventListener("click", function () {
                    window.open(youtubeUrl, "_blank");
                });
            } else {
                document.getElementById("status").innerText = "Nenhum vídeo encontrado.";
            }
        }
    );
});

function getYoutubeURL() {
    let iframe = document.querySelector("iframe[src*='youtube.com/embed/']");
    return iframe ? iframe.src : null;
}

function extractVideoId(embedUrl) {
    let match = embedUrl.match(/embed\/([a-zA-Z0-9_-]+)\?/);
    return match ? match[1] : null;
}