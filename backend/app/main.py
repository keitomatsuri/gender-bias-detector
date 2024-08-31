import secure

import uvicorn
from app.config import settings
from app.auth.dependencies import validate_token
from fastapi import Depends, FastAPI, File, UploadFile, HTTPException, Request, status
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from starlette.exceptions import HTTPException as StarletteHTTPException

from app.gender_bias_detector import detect_audio_by_vertexai, detect_audio_by_gemini_api

app = FastAPI(openapi_url=None)

csp = secure.ContentSecurityPolicy().default_src("'self'").frame_ancestors("'none'")
hsts = secure.StrictTransportSecurity().max_age(31536000).include_subdomains()
referrer = secure.ReferrerPolicy().no_referrer()
cache_value = secure.CacheControl().no_cache().no_store().max_age(0).must_revalidate()
x_frame_options = secure.XFrameOptions().deny()

secure_headers = secure.Secure(
    csp=csp,
    hsts=hsts,
    referrer=referrer,
    cache=cache_value,
    xfo=x_frame_options,
)


@app.middleware("http")
async def set_secure_headers(request, call_next):
    response = await call_next(request)
    secure_headers.framework.fastapi(response)
    return response

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.client_origin_url],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["Authorization", "Content-Type"],
    max_age=86400,
)


@app.exception_handler(StarletteHTTPException)
async def http_exception_handler(request, exc):
    message = str(exc.detail)

    return JSONResponse({"message": message}, status_code=exc.status_code)


@app.exception_handler(RequestValidationError)
async def handler(request:Request, exc:RequestValidationError):
    print(exc)
    return JSONResponse(content={}, status_code=status.HTTP_422_UNPROCESSABLE_ENTITY)


@app.post("/api/detector", dependencies=[Depends(validate_token)])
async def detect_gender_bias(file: UploadFile = File(...)):

    # バリデーション
    accepted_audio_types = ["audio/mpeg", "audio/wav", "audio/mp3", "audio/webm", "audio/webm;codecs=opus"]

    if file.content_type not in accepted_audio_types:
        raise HTTPException(status_code=400, detail="音声ファイルのみをアップロードしてください。")

    result = await detect_audio_by_vertexai(file)
    return result


@app.post("/api/realtime-detector", dependencies=[Depends(validate_token)])
async def test(file: UploadFile = File(...)):

    # バリデーション
    accepted_audio_types = ["audio/webm"]

    if file.content_type not in accepted_audio_types:
        raise HTTPException(status_code=400, detail="音声ファイルのみをアップロードしてください。")

    result = await detect_audio_by_gemini_api(file)

    return {"result": result}


if __name__ == "__main__":
    if settings.environment == "local":
        uvicorn.run(
            "main:app",
            host="127.0.0.1",
            port=settings.port,
            reload=settings.reload,
            server_header=False,
            ssl_keyfile="../keitomatsuri.example.com-key.pem",
            ssl_certfile="../keitomatsuri.example.com.pem"
        )
    else:
        uvicorn.run(
            "main:app",
            host="127.0.0.1",
            port=settings.port,
            reload=settings.reload,
            server_header=False
        )
