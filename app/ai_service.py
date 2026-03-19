import os
from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# Historial por negocio
conversation_store = {
    "clinica": [],
    "inmobiliaria": [],
    "abogado": []
}


def load_business_context(business: str):
    file_path = f"app/data/{business}.txt"

    with open(file_path, "r", encoding="utf-8") as file:
        return file.read()


def get_chat_response(user_message: str, business: str) -> str:
    business_context = load_business_context(business)
    history = conversation_store.get(business, [])

    system_prompt = f"""
Eres un asistente virtual del negocio seleccionado.
Debes responder de forma clara, profesional, cercana y útil.
Usa exclusivamente esta información del negocio para responder:

{business_context}

Reglas:
- Responde siempre en español.
- No inventes datos que no estén en el contexto.
- Si el dato no aparece, indica que el usuario puede contactar con el negocio.
- Si el contexto incluye servicios, horarios, teléfono o ubicación, utilízalos.
- NO redirijas al usuario a llamar por teléfono directamente.
- Siempre que el usuario quiera reservar y muestre su intención.  Sugiere dejar sus datos en el formulario.
- Usa frases como: "Si quieres, puedes dejar tus datos y te contactamos".
"""

    messages = [{"role": "system", "content": system_prompt}]
    messages.extend(history[-10:])
    messages.append({"role": "user", "content": user_message})

    response = client.chat.completions.create(
        model="gpt-4.1-mini",
        messages=messages,
        temperature=0.4
    )

    reply = response.choices[0].message.content

    history.append({"role": "user", "content": user_message})
    history.append({"role": "assistant", "content": reply})
    conversation_store[business] = history

    return reply


def reset_conversation(business: str):
    conversation_store[business] = []