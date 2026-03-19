let leadPromptShown = false;
let messageCount =0;


function getWelcomeMessage(business) {
  const messages = {
    clinica: "Hola, ¿en qué puedo ayudarte sobre nuestros tratamientos o reservas?",
    inmobiliaria: "Hola, ¿buscas comprar, vender o alquilar una propiedad?",
    abogado: "Hola, ¿en qué asunto legal necesitas ayuda hoy?"
  };

  return messages[business] || "Hola, ¿en qué puedo ayudarte hoy?";
}

function getBusinessConfig(business) {
  const configs = {
    clinica: {
      title: "Chatbot de la Clínica",
      subtitle: "Atención automática con IA para responder dudas de clientes."
    },
    inmobiliaria: {
      title: "Chatbot de la Inmobiliaria",
      subtitle: "Asistente virtual para consultas sobre compra, venta y alquiler."
    },
    abogado: {
      title: "Chatbot del Bufete",
      subtitle: "Atención automática para dudas legales frecuentes y contacto inicial."
    }
  };

  return configs[business];
}

function renderWelcomeMessage() {
  const business = document.getElementById("business").value;
  const chatBox = document.getElementById("chat-box");

  chatBox.innerHTML = "";
  addMessage("bot", getWelcomeMessage(business));
}

function hasLeadIntent(text) {
  const normalized = text.toLowerCase();

  const keywords = [
    "quiero cita",
    "reservar",
    "reserva",
    "me interesa",
    "contactadme",
    "contactarme",
    "llamadme",
    "llamarme",
    "quiero contratar",
    "agendar",
    "cita"
  ];

  return keywords.some(keyword => normalized.includes(keyword));
}

function botSuggestsLead(text) {
  const normalized = text.toLowerCase();

  return (
    normalized.includes("dejar tus datos") ||
    normalized.includes("contactamos") ||
    normalized.includes("te llamamos") ||
    normalized.includes("reservar tu cita")
  );
}

function showLeadForm(prefillMessage = "") {
  const leadForm = document.getElementById("lead-form");
  const leadMessage = document.getElementById("lead-message");

  leadForm.classList.remove("hidden");

  if (prefillMessage && !leadMessage.value.trim()) {
    leadMessage.value = prefillMessage;
  }

  leadForm.scrollIntoView({ behavior: "smooth", block: "start" });
}

function hideLeadForm() {
  const leadForm = document.getElementById("lead-form");
  leadForm.classList.add("hidden");
}

function toggleLeadForm() {
  const leadForm = document.getElementById("lead-form");
  const isHidden = leadForm.classList.contains("hidden");

  if (isHidden) {
    showLeadForm();
  } else {
    hideLeadForm();
  }
}

function changeBusiness() {
  const business = document.getElementById("business").value;
  const config = getBusinessConfig(business);

  document.getElementById("chat-title").textContent = config.title;
  document.getElementById("chat-subtitle").textContent = config.subtitle;

  renderWelcomeMessage();
}

function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

function addMessage(role, text) {
  const chatBox = document.getElementById("chat-box");
  const safeText = escapeHtml(text);

  const rowClass = role === "user" ? "user-row" : "bot-row";
  const bubbleClass = role === "user" ? "user-bubble" : "bot-bubble";

  chatBox.innerHTML += `
    <div class="message-row ${rowClass}">
      <div class="message-bubble ${bubbleClass}">
        ${safeText}
      </div>
    </div>
  `;

  scrollToBottom(true);
}

function showTyping() {
  removeTyping(); // evita duplicados

  const chatBox = document.getElementById("chat-box");

  chatBox.innerHTML += `
    <div class="message-row bot-row" id="typing-indicator">
      <div class="message-bubble bot-bubble">
        <div class="typing">
          <span></span><span></span><span></span>
        </div>
      </div>
    </div>
  `;

  scrollToBottom(true);
}

function removeTyping() {
  const typing = document.getElementById("typing-indicator");
  if (typing) typing.remove();
}

function scrollToBottom(smooth = true) {
  const chatBox = document.getElementById("chat-box");

  chatBox.scrollTo({
    top: chatBox.scrollHeight,
    behavior: smooth ? "smooth" : "auto"
  });
}

async function sendMessage() {
  const input = document.getElementById("message");
  const business = document.getElementById("business").value;
  const message = input.value.trim();

  if (!message) return;

  messageCount++;

  addMessage("user", message);

  // SOLO si intención fuerte
  if (hasLeadIntent(message)) {
    showLeadForm(message);
  }

  scrollToBottom(true);
  input.value = "";
  input.focus();

  showTyping();

  try {
    const response = await fetch("/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ message, business })
    });

    const data = await response.json();

    setTimeout(() => {
      removeTyping();
      addMessage("bot", data.reply || "Ha ocurrido un problema al generar la respuesta.");

      // SOLO si ya hay conversación + bot empuja
      if (messageCount >= 2 && botSuggestsLead(data.reply)) {
        showLeadForm(message);
      }

    }, 300);

  } catch (error) {
    removeTyping();
    addMessage("bot", "Ha ocurrido un error de conexión. Inténtalo de nuevo.");
  }
}

async function resetChat() {
  const business = document.getElementById("business").value;

  await fetch("/reset", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ business })
  });

  renderWelcomeMessage();
  document.getElementById("message").focus();
}

function handleKeyPress(event) {
  if (event.key === "Enter") {
    sendMessage();
  }
}

window.addEventListener("DOMContentLoaded", () => {
  changeBusiness();
});

async function saveLead() {
  const business = document.getElementById("business").value;
  const name = document.getElementById("lead-name").value.trim();
  const phone = document.getElementById("lead-phone").value.trim();
  const email = document.getElementById("lead-email").value.trim();
  const message = document.getElementById("lead-message").value.trim();

  if (!name || !phone || !email || !message) {
    alert("Por favor, completa todos los campos.");
    return;
  }

  try {
    const response = await fetch("/lead", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        business,
        name,
        phone,
        email,
        message
      })
    });

    const data = await response.json();

    if (data.status === "ok") {
        alert("Solicitud enviada correctamente.");

        document.getElementById("lead-name").value = "";
        document.getElementById("lead-phone").value = "";
        document.getElementById("lead-email").value = "";
        document.getElementById("lead-message").value = "";

        hideLeadForm();
    } else {
        alert("No se pudo guardar la solicitud.");
    }
  } catch (error) {
    alert("Ha ocurrido un error al enviar la solicitud.");
  }
}