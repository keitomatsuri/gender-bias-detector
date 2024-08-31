"""
Reference
https://github.com/auth0-developer-hub/api_fastapi_python_hello-world/blob/main/application/config.py

Modified based on the following links
https://docs.pydantic.dev/latest/concepts/pydantic_settings/#usage
https://docs.pydantic.dev/latest/concepts/fields/#string-constraints
"""
from pydantic import Field
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    environment: str = Field(min_length=1, description="Environment")
    auth0_audience: str = Field(min_length=1, description="Auth0 Audience")
    auth0_domain: str = Field(min_length=1, description="Auth0 Domain")
    client_origin_url: str = Field(min_length=1, description="Client Origin URL")
    port: int = Field(6060, description="Port to run the server on")
    reload: bool = Field(True, description="Reload the server on changes")
    google_project_id: str = Field(min_length=1, description="Google Project ID")
    google_location: str = Field(min_length=1, description="Google Location")
    google_storage_bucket_name: str = Field(min_length=1, description="Google Storage Bucket Name")
    google_gemini_api_key: str = Field(min_length=1, description="Google Genai API Key")
    google_generative_model_vertexai: str = Field(min_length=1, description="Google Generative Model Vertexai")
    google_generative_model_gemini_api: str = Field(min_length=1, description="Google Generative Model Gemini API")

    class Config:
        # for local setting
        # env_file = "../.env"
        env_file_encoding = "utf-8"


settings = Settings()
