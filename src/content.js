// Função para analisar o conteúdo com a API do OpenAI
async function analyzeAccessibility(htmlContent) {
  const openAiKey = document?.querySelector?.("#openAiKey")?.value;
  if (!openAiKey) return;
  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${openAiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o",
        temperature: 0.7,
        messages: [
          {
            role: "system",
            content:
              "Eu vou lhe enviar um documento HTML e gostaria que você julgasse mudanças necessarias a serem feitas em tal para o tornar mais acessivel segundo a WCAG da W3C para Autismo",
          },
          {
            role: "user",
            content: htmlContent,
          },
        ],
      }),
    });

    if (!response.ok) {
      console.error("Erro ao acessar a API do OpenAI:", response.statusText);
      return "Erro ao processar a análise de acessibilidade.";
    }

    const data = await response.json();
    return data?.choices?.[0]?.message?.content;
  } catch (error) {
    console.error("Erro na análise com IA:", error);
    return "Erro ao processar a análise com IA.";
  }
}

// Captura o conteúdo da página atual e processa a análise
// (async () => {
//   const htmlContent = document.documentElement.outerHTML; // Captura o HTML completo
//   const aiSuggestions = await analyzeAccessibility(htmlContent);
//
//   // Envia os resultados para o background.js
//   chrome.runtime.sendMessage({ suggestions: aiSuggestions }, () => {
//     console.log("Mensagem de sugestões enviada.");
//   });
// })();

async function getCurrentTab() {
  var browser = browser || chrome;

  if (browser.devtools && browser.devtools.inspectedWindow) {
    return {
      id: browser.devtools.inspectedWindow.tabId,
    };
  }
  return await new Promise((resolve, reject) => {
    browser.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (!tabs.length) {
        return reject();
      }
      resolve(tabs[0]);
    });
  });
}

document.addEventListener("DOMContentLoaded", async () => {
  const analyzeButton = document.querySelector(".page-init button");
  analyzeButton?.addEventListener("click", addAnalyzeEvent);
});

async function addAnalyzeEvent() {
  const pageResults = document.querySelector(".page-results");
  const reportP = pageResults?.querySelector("p");
  if (!reportP) return;
  toggleLoading(true);
  try {
    const html = await getCurrentTab();
    const res = await fetch(html.url);
    const html2 = await res.text();
    const response = await analyzeAccessibility(html2);
    reportP.innerText = response;
  } catch (error) {
    console.log(error);
    reportP.innerText = "Ocorreu um erro, tente mais tarde";
  } finally {
    toggleLoading(false);
    pageResults.classList.remove("hidden");
  }
}

function toggleLoading(isLoading = true) {
  const allPages = document.querySelectorAll(".page");
  const loadingPage = document.querySelector(".page-loading");
  allPages.forEach((thisPage) => {
    thisPage.classList.add("hidden");
  });
  if (isLoading) {
    loadingPage.classList.remove("hidden");
  }
}
