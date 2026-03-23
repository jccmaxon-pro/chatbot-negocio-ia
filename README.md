# AI Business Chatbot

Chatbot multi-negocio desarrollado con Python, FastAPI y OpenAI para atención automática de clientes, resolución de dudas frecuentes y captación de leads.

## Descripción

Este proyecto consiste en un chatbot web orientado a negocios como clínicas, inmobiliarias o despachos profesionales. El sistema permite mantener conversaciones con contexto, adaptar el comportamiento según el tipo de negocio, sugerir contacto cuando detecta intención comercial y guardar leads para seguimiento posterior.

La aplicación está pensada como una primera versión funcional de un asistente virtual vendible a pequeños negocios.

## Características principales

- Chatbot web con interfaz moderna
- Backend en FastAPI
- Integración con OpenAI API
- Soporte multi-negocio
- Cambio dinámico de contexto según el negocio seleccionado
- Memoria de conversación por negocio
- Reinicio de conversación
- Detección de intención comercial
- Formulario de contacto integrado
- Captación y guardado de leads
- Panel básico para visualizar leads
- Despliegue online en Render

## Tecnologías utilizadas

- Python
- FastAPI
- Uvicorn
- OpenAI API
- HTML
- CSS
- JavaScript
- JSON
- Render

## Estructura del proyecto

```bash
chatbot-negocio/
│
├── app/
│   ├── main.py
│   ├── ai_service.py
│   ├── leads.json
│   └── data/
│       ├── clinica.txt
│       ├── inmobiliaria.txt
│       └── abogado.txt
│
├── static/
│   ├── index.html
│   ├── style.css
│   ├── script.js
│   ├── leads.html
│   └── leads.js
│
├── .env
├── requirements.txt
└── README.md
```


### Funcionalidades
1. Chat multi-negocio

El usuario puede seleccionar entre varios tipos de negocio:

- Clínica

- Inmobiliaria

- Abogado

Cada opción carga un contexto distinto desde archivos de texto independientes.

2. Respuestas con IA

El chatbot utiliza OpenAI para responder preguntas usando exclusivamente la información del negocio seleccionado.

3. Memoria de conversación

Cada negocio mantiene su propio historial, lo que permite conversaciones con contexto sin mezclar sesiones entre sectores.

4. Captación de leads

Cuando el usuario muestra interés real, el sistema puede:

mostrar automáticamente el formulario de contacto,

rellenar el mensaje con la intención detectada,

guardar los datos en leads.json.

5. Panel de leads

Incluye una vista sencilla para consultar los leads captados desde el navegador.

### Instalación local
```bash
Clona el repositorio y entra en la carpeta del proyecto:

git clone <TU_REPO_URL>
cd chatbot-negocio

Crea y activa un entorno virtual:

python3 -m venv venv
source venv/bin/activate

Instala dependencias:

pip install -r requirements.txt

### Configuración

Crea un archivo .env en la raíz del proyecto con tu clave de OpenAI:

OPENAI_API_KEY=tu_clave_aqui
Ejecución local

Arranca el servidor con:

uvicorn app.main:app --reload

Abre en tu navegador:

http://127.0.0.1:8000
Visualización de leads

Para ver el panel de leads:

http://127.0.0.1:8000/leads-view
Despliegue

Este proyecto fue desplegado en Render como Web Service gratuito.

Comando de build
pip install -r requirements.txt
Comando de inicio
uvicorn app.main:app --host 0.0.0.0 --port $PORT
```

### Casos de uso

Este proyecto puede adaptarse para:

- clínicas estéticas

- inmobiliarias

- despachos legales

- academias

- pequeños negocios de atención al cliente

- soporte de preguntas frecuentes

- captación de leads desde web

### Mejoras futuras

- base de datos para leads

- autenticación para panel admin

- despliegue con persistencia real

- integración con email o WhatsApp

- agenda y reservas

- soporte para múltiples idiomas

- panel de analítica

- entrenamiento con documentos del negocio

### Valor del proyecto

Este chatbot no solo responde preguntas, sino que también:

guía la conversación,

detecta intención comercial,

convierte conversaciones en leads,

sirve como demo funcional de un producto SaaS simple orientado a negocio.

### Autor

Proyecto desarrollado por Juan Carrasco como parte de un portfolio de automatización, IA aplicada y soluciones freelance para negocio.

