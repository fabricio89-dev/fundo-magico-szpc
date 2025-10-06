// Objetivo:
// Enviar um texto de um formulário para uma API do n8n e exibir o resultado do código html, css
// e colocar a animação no fundo da tela do site.

// Função para alterar o texto do botão de geração
function setLoading(isLoading) {
  const btnSpan = document.getElementById("generate-btn");

  if (isLoading) {
    btnSpan.innerHTML = "Gerando Background...";
  } else {
    btnSpan.innerHTML = "Gerar Background Mágico";
  }
}
// Função principal executada quando o conteúdo do DOM estiver carregado
document.addEventListener("DOMContentLoaded", function () {
  // 1. No JavaScript, pegar o evento de submit do formulário para evitar o recarregamento da página.

  const form = document.querySelector(".form-group");
  const textArea = document.getElementById("description");
  const htmlCode = document.getElementById("html-code");
  const cssCode = document.getElementById("css-code");
  const preview = document.getElementById("preview-section");

  form.addEventListener("submit", async function (event) {
    event.preventDefault(); // Evita o recarregamento da página

    // 2. Obter o valor digitado pelo usuário no campo de texto.
    const description = textArea.value.trim(); //O trim remove espaços em branco
    // Se o campo estiver vazio, não faz nada
    if (!description) {
      return; // Sai da função se a descrição estiver vazia
    }

    // 3. Exibir um indicador de carregamento enquanto a requisição está sendo processada.
    setLoading(true);

    /*4. Fazer uma requisição HTTP (POST) para a API do n8n, enviando o texto do formulário
    no corpo da requisição em formato JSON.*/
    try {
      const response = await fetch(
        //"https://robertodias123.app.n8n.cloud/webhook/gerador-fundo",
        "https://fabricioscjp.app.n8n.cloud/webhook/gerador-fundo",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" }, // Define o tipo de conteúdo como JSON
          body: JSON.stringify({ description }), // Envia o texto do formulário no corpo da requisição
        }
      );

      // 5. Receber a resposta da API do n8n (esperando um JSON com o código HTML/CSS do background).

      const data = await response.json(); //Recebe a resposta da API em formato JSON
      htmlCode.textContent = data.code || ""; //Exibe o código HTML retornado
      cssCode.textContent = data.style || ""; //Exibe o código CSS retornado

      preview.style.display = "block"; // Mostra a seção de preview
      preview.innerHTML = data.code || ""; // Insere o código HTML na seção de preview

      let styleTag = document.getElementById("dynamic-style"); // Seleciona a tag de estilo, se houver
      if (styleTag) styleTag.remove(); // Remove a tag de estilo anterior, se existir

      // 6. Se a resposta for válida, exibir o código HTML/CSS retornado na tela
      if (data.style) {
        styleTag = document.createElement("style"); // Cria uma nova tag de estilo
        styleTag.id = "dynamic-style"; // Define um ID para a tag de estilo

        styleTag.textContent = data.style; // Insere o código CSS na tag de estilo
        document.head.appendChild(styleTag); // Adiciona a tag de estilo ao cabeçalho do documento
      }
    } catch (error) {
      console.error("Erro ao gerar o fundo:", error); // Loga o erro no console para depuração
      htmlCode.textContent =
        "Não consegui gerar o código HTML, tente novamente";
      cssCode.textContent = "Não consegui gerar o código CSS, tente novamente";
      preview.innerHTML = ""; // Limpa a seção de preview em caso de erro
    } finally {
      setLoading(false); // Remove o indicador de carregamento após o recebimento da resposta
    }
  });
});


