document.addEventListener("DOMContentLoaded", () => {
  const resultsContainer = document.getElementById("results");
  const copyButton = document.getElementById("copyButton");

  // Carregar sugestões do armazenamento local
  chrome.storage.local.get("suggestions", (data) => {
    if (chrome.runtime.lastError) {
      console.error("Erro ao acessar o armazenamento local:", chrome.runtime.lastError);
      resultsContainer.textContent = "Erro ao carregar as sugestões. Tente novamente.";
      resultsContainer.classList.add("error");
      return;
    }

    const suggestions = data.suggestions;

    if (Array.isArray(suggestions)) {
      // Exibir sugestões formatadas como lista
      resultsContainer.innerHTML = suggestions
        .map((sugestao, index) => `<p>${index + 1}. ${sugestao}</p>`)
        .join("");
    } else if (typeof suggestions === "string") {
      resultsContainer.textContent = suggestions;
    } else {
      resultsContainer.textContent = "Nenhuma sugestão disponível.";
    }

    // Remover classe de carregamento
    resultsContainer.classList.remove("loading");
    console.log("Sugestões carregadas no popup:", suggestions);
  });

  // Botão para copiar resultados
  copyButton.addEventListener("click", () => {
    const text = resultsContainer.textContent;
    navigator.clipboard
      .writeText(text)
      .then(() => alert("Resultados copiados para a área de transferência!"))
      .catch((err) => console.error("Erro ao copiar resultados:", err));
  });
});
