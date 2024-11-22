chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.suggestions) {
    console.log("Armazenando sugestões no storage:", message.suggestions);

    // Verificando se a mensagem contém sugestões válidas
    if (Array.isArray(message.suggestions) || typeof message.suggestions === "string") {
      chrome.storage.local.set({ suggestions: message.suggestions }, () => {
        if (chrome.runtime.lastError) {
          console.error("Erro ao armazenar sugestões:", chrome.runtime.lastError);
        } else {
          console.log("Sugestões armazenadas com sucesso!");
        }
      });
    } else {
      console.error("As sugestões enviadas não estão em um formato válido.");
    }
  }
});