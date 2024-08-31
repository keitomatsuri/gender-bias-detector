import uuid
from app.config import settings
from google.cloud import storage


async def detect_audio_by_vertexai(file):
    import vertexai
    from vertexai.generative_models import GenerativeModel, Part

    # vertexai settings
    vertexai.init(project=settings.google_project_id, location=settings.google_location)
    model = GenerativeModel(settings.google_generative_model_vertexai)
    prompt = """
  与えられた会話の録音から、ジェンダーバイアスを含む発言についてのレポートを生成します。
  以下のフォーマットに従ってください。
  # 会話の概要
  参加者の人数、性別、会話のテーマ、会話の長さ など
  # 会話の分析結果
  会話に含まれるジェンダーバイアスの具体的な例、頻度や割合、バイアスの種別、定性的なバイアスの強さ など
  # 改善提案
  検出されたバイアスを減少させるための具体的な提案、ジェンダー平等を促進するための発言の改善方法
  """

    # ファイル読み込み
    file_content = await file.read()
    file_content_type = file.content_type
    unique_filename = f"{uuid.uuid4()}-{file.filename}"

    # GCSにファイルをアップロードする
    bucket_name = settings.google_storage_bucket_name
    client = storage.Client()
    bucket = client.bucket(bucket_name)
    blob = bucket.blob(unique_filename)
    blob.upload_from_string(file_content, content_type=file_content_type)

    # レポート生成
    audio_file_uri = "gs://" + bucket_name + "/" + unique_filename
    audio_file = Part.from_uri(audio_file_uri, mime_type=file_content_type)
    contents = [audio_file, prompt]
    response = model.generate_content(contents)

    # ファイル削除
    blob.delete()

    return response.text


async def detect_audio_by_gemini_api(file):
    import google.generativeai as genai

    # genai settings
    genai.configure(api_key=settings.google_gemini_api_key)
    model = genai.GenerativeModel(settings.google_generative_model_gemini_api)
    prompt = """
    `transcription`に音声の文字起こしを出力してください。
    `has_gender_bias`に文字起こしした文章がジェンダーバイアスを含むか否かをtrue/falseで出力してください。
    以下のJSON schemaを使用してください。:
        Schema = {"transcription": str,"has_gender_bias": bool}
    Return a `Schema`
    """

    # ファイル読み込み
    file_content = await file.read()
    file_content_type = file.content_type

    # 検出結果
    response = model.generate_content([
        prompt,
        {
            "mime_type": file_content_type,
            "data": file_content
        }
    ])

    # 整形
    response_dict = response.to_dict()
    text = response_dict['candidates'][0]['content']['parts'][0]['text']

    return text
