from fastapi import FastAPI
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from app.ai_service import get_chat_response, reset_conversation
import json
from pathlib import Path

app = FastAPI(title="Chatbot Negocio")

app.mount("/static", StaticFiles(directory="static"), name="static")


class ChatRequest(BaseModel):
    message: str
    business: str


class ResetRequest(BaseModel):
    business: str

class LeadRequest(BaseModel):
    business: str
    name: str
    phone: str
    email: str
    message: str


@app.get("/")
def read_index():
    return FileResponse("static/index.html")


@app.post("/chat")
def chat(request: ChatRequest):
    reply = get_chat_response(request.message, request.business)
    return {"reply": reply}


@app.post("/reset")
def reset_chat(request: ResetRequest):
    reset_conversation(request.business)
    return {"status": "ok"}

@app.post("/lead")
def save_lead(request: LeadRequest):
    leads_file = Path(__file__).resolve().parent / "leads.json"

    if leads_file.exists():
        with open(leads_file, "r", encoding="utf-8") as file:
            leads = json.load(file)
    else:
        leads = []

    new_lead = {
        "business": request.business,
        "name": request.name,
        "phone": request.phone,
        "email": request.email,
        "message": request.message
    }

    leads.append(new_lead)

    with open(leads_file, "w", encoding="utf-8") as file:
        json.dump(leads, file, ensure_ascii=False, indent=2)

    return {"status": "ok", "message": "Lead guardado correctamente"}

@app.get("/leads")
def get_leads():
    leads_file = Path(__file__).resolve().parent / "leads.json"

    if leads_file.exists():
        with open(leads_file, "r", encoding="utf-8") as file:
            leads = json.load(file)
    else:
        leads = []

    return leads

@app.get("/leads-view")
def leads_view():
    return FileResponse("static/leads.html")