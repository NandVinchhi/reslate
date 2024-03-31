from fastapi import FastAPI, UploadFile, File, HTTPException, Request
from starlette.responses import FileResponse
import os
import uuid
from voice_funcs import create_voice, generate_parallel, generate_audio
from voice_classify import predict
from prediction_funcs import parallel_functions
from translate import translate_text
from pydantic import BaseModel

import json
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

origins = [
    "*"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/createvoice")
async def create_voice_endpoint(file: UploadFile = File(...)):
    # Generate a unique UUID for the file
    audio_id = str(uuid.uuid1())
    
    # Construct the file path
    file_path = f"uploads/{audio_id}.mp3"
    
    # Save the uploaded file
    with open(file_path, "wb") as f:
        contents = await file.read()
        f.write(contents)

    voice_id = create_voice(file_path)

    classif = predict(file_path)

    os.remove(file_path)
    
    return {"voice_id": voice_id, "prediction": classif}

@app.get("/audio/{audio_id}")
async def get_audio(audio_id: str):
    file_path = f"outputs/{audio_id}_final.wav"

    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="Audio file not found")
    
    return FileResponse(file_path, media_type="audio/wav")

class PartialInput(BaseModel):
    words: str
    target_lang: str
    voice_class: str
    voice_id: str

@app.post("/sendpartial")
async def send_partial(partial_input: PartialInput):
    sentence_id = uuid.uuid1()
    ta, tb = parallel_functions(partial_input.words)
    t_arr = translate_text(partial_input.target_lang, [ta, tb])
    tra = t_arr[0]
    trb = t_arr[1]
    oa, ob = generate_parallel(tra, trb, partial_input.voice_id, partial_input.voice_class)
    
    d = {}
    with open("processing.json", "r") as f:
        d = json.load(f)
    
    d[str(sentence_id)] = {
        "output_a": oa,
        "output_b": ob,
        "transcript_a": ta,
        "transcript_b": tb,
        "translated_a": tra,
        "translated_b": trb
    }
    
    with open("processing.json", "w") as f:
        json.dump(d, f)
    
    return {"sentence_id": str(sentence_id)}


@app.post("/sendfull")
async def send_full(request: Request):
    full_input = await request.json()
    
    d = {}
    with open("processing.json", "r") as f:
        d = json.load(f)

    try:
        dd = d[full_input["sentence_id"]]
        if dd["transcript_a"] == full_input["words"]:
            return {"output_id": dd["output_a"], "translation": dd["translated_a"]}
        if dd["transcript_b"] == full_input["words"]:
            return {"output_id": dd["output_b"], "translation": dd["translated_b"]}
    except KeyError:
        pass

    t_arr = translate_text(full_input["target_lang"], [full_input["words"]])
    t = t_arr[0]
    o_id = generate_audio(t, full_input["voice_id"], full_input["voice_class"])
    return {"output_id": o_id, "translation": t}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="localhost", port=8000)