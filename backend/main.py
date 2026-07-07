
# from fastapi import FastAPI, UploadFile, File
# from fastapi.middleware.cors import CORSMiddleware
# import shutil
# import os
# import requests  # 🔥 NEW

# # 👇 OCR function
# from ocr_engine import extract_prescription_text

# app = FastAPI()

# UPLOAD_DIR = "./uploads"
# OUTPUT_DIR = "./outputs"

# os.makedirs(UPLOAD_DIR, exist_ok=True)
# os.makedirs(OUTPUT_DIR, exist_ok=True)

# #  CORS (for frontend + Next.js)
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# #  MAIN ENDPOINT
# @app.post("/analyze")
# async def analyze(file: UploadFile = File(...)):
#     try:
#         # Step 1: Save uploaded file
#         file_path = os.path.join(UPLOAD_DIR, file.filename)

#         with open(file_path, "wb") as buffer:
#             shutil.copyfileobj(file.file, buffer)

#         print(f"📥 File received: {file.filename}")

#         # Step 2: OCR
#         text = extract_prescription_text(file_path)

#         print("🧠 OCR Output:", text)

#         # (Optional) Save locally (for debugging only)
#         output_file = os.path.join(OUTPUT_DIR, file.filename + ".txt")
#         with open(output_file, "w", encoding="utf-8") as f:
#             f.write("\n".join(text))

#         # 🔥 Step 3: Send OCR → LLM (Next.js API)
#         try:
#             llm_response = requests.post(
#                 "http://localhost:3000/api/chat",  # your LLM route
#                 json={
#                     "messages": [
#                         {
#                             "id": "1",
#                             "role": "user",
#                             "parts": [
#                                 {
#                                     "type": "text",
#                                     "text": "Analyze this prescription"
#                                 }
#                             ]
#                         }
#                     ],
#                     "ocrText": text # 🔥 DIRECT TRANSFER
#                     # "mode":"json" 
#                 },
#                 timeout=30
#             )
            

#             print("RAW RESPONSE:", llm_response.text)

#             if llm_response.text.strip():
#                 llm_data = llm_response.json()
#             else:
#                 raise ValueError("Empty response from LLM")
#             llm_data = llm_response.json()

#         except Exception as e:
#             print("❌ LLM Error:", str(e))
#             llm_data = {"error": str(e)}
            
#         print("RAW RESPONSE:", llm_response.text)

#         # Step 4: Return combined result
#         return {
#             "message": "Processed successfully",
#             "ocr_text": text,
#             "llm_response": llm_data
#         }

#     except Exception as e:
#         return {
#             "error": str(e)
#         }
    

from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from groq import Groq
from dotenv import load_dotenv

import os
import base64
import json

load_dotenv()

app = FastAPI()

api_key = os.getenv("GROQ_API_KEY")
client = Groq(api_key=api_key) if api_key else None

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def health():
    return {"status": "ok", "message": "RxAnalyzer backend is running"}


@app.post("/analyze")
async def analyze(
    file: UploadFile = File(...),
    question: str = Form(...),
    history: str | None = Form(None),
):
    try:
        if not client:
            return JSONResponse(
                status_code=500,
                content={"error": "GROQ_API_KEY is not configured. Set it in your environment or .env file before running analysis."},
            )

        file_bytes = await file.read()
        print(f"📥 File received: {file.filename}")

        image_base64 = base64.b64encode(file_bytes).decode("utf-8")

        history_text = ""
        if history:
            try:
                past_messages = json.loads(history)
                history_lines = []
                for msg in past_messages:
                    role = msg.get("role", "user")
                    content = msg.get("content", "")
                    if isinstance(content, list):
                        content_text = "".join(
                            part.get("text", "") if isinstance(part, dict) else str(part)
                            for part in content
                        )
                    else:
                        content_text = str(content)
                    history_lines.append(f"{role.capitalize()}: {content_text}")
                history_text = "\n".join(history_lines)
            except Exception:
                history_text = ""

        prompt_text = """
You are MedAssist AI, an intelligent prescription understanding assistant.

PRIMARY ROLE:
Help users understand uploaded prescriptions and answer follow-up questions naturally.

CONTEXT:
A prescription image and/or extracted prescription information may be provided in the conversation history.

IMPORTANT:
The user may ask either:

1. A full prescription analysis.
2. A specific follow-up question.

Always determine which one the user wants.

FOLLOW-UP QUESTION BEHAVIOR (CRITICAL):
If the user asks a specific question such as:

* "side effects?"
* "when to take?"
* "before food or after food?"
* "what is Delcon?"
* "is this safe?"
* "can I take with milk?"
* "tell dosage alone"

Then answer ONLY that question.

Do NOT repeat:

* Prescription summary
* Patient details
* Medicine list
* Disclaimer
* Previously explained information

Provide a direct answer.

GOOD EXAMPLE:

User:
"Tell side effects alone"

Assistant:

## Side Effects

### Calpol

* Nausea
* Stomach discomfort
* Rare allergic reactions

### Delcon

* Drowsiness
* Dry mouth
* Mild dizziness

### Levolin

* Tremors
* Nervousness
* Fast heartbeat

### Meftal-P

* Stomach pain
* Nausea
* Acidity

BAD EXAMPLE:
Repeating the entire prescription report.

MEDICINE UNDERSTANDING:

* Prescription handwriting may be unclear.
* Use medical knowledge to identify likely medicines.
* Correct obvious spelling mistakes when confidence is high.
* Never invent medicines.

MEAL-TIME QUESTIONS:
When asked:

* "before food or after food?"
* "time to eat?"
* "food instructions?"

Provide a concise table:

| Medicine   | Before Food / After Food |
| ---------- | ------------------------ |
| Medicine A | After food               |
| Medicine B | After food               |

Do not repeat the full analysis.

OUTPUT RULES:

* Be concise.
* Answer only what is asked.
* Use Markdown.
* Use headings only when useful.
* Avoid unnecessary disclaimers.
* Avoid repeating information.

SAFETY:

* Never prescribe new medicines.
* Never modify dosage.
* Never recommend stopping prescribed medicines.
* Suggest consulting a doctor only when genuinely necessary.

STYLE:

* Professional
* Conversational
* Direct
* Helpful

"""

        user_prompt = f"{prompt_text}\n\nConversation history:\n{history_text}\n\nCurrent user question:\n{question}"

        completion = client.chat.completions.create(
            model="meta-llama/llama-4-scout-17b-16e-instruct",
            messages=[
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "text",
                            "text": user_prompt
                        },
                        {
                            "type": "image_url",
                            "image_url": {
                                "url": f"data:image/jpeg;base64,{image_base64}"
                            }
                        }
                    ]
                }
            ],
            temperature=0.2,
            max_completion_tokens=2048
        )

        result = completion.choices[0].message.content

        print("\n🧠 Vision Output:\n")
        print(result)

        return {
            "message": "Processed Successfully",
            "analysis": result
        }

    except Exception as e:
        print("❌ ERROR:", str(e))
        return {
            "error": str(e)
        }