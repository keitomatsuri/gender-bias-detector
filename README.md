# 概要
「ジェンダーバイアス検出」は、人が無意識のうちに発しているジェンダーバイアスを含む発言に気付くことをサポートするWebアプリケーションです。

# 認証
Auth0の使用を前提としているため、アプリケーションの動作にはAuth0テナントとApplication、APIの設定が必要です。  
以下のサンプルを参考に構成をしています。  
[Hello World Full-Stack Security: React/TypeScript + FastAPI/Python](https://developer.auth0.com/resources/code-samples/full-stack/hello-world/basic-access-control/spa/react-typescript/fastapi-python)


# フロントエンド

## 環境変数

|key|value|
|-|-|
|VITE_AUTH0_DOMAIN|auth0のApplication作成時に生成されるDomain|
|VITE_AUTH0_CLIENT_ID|auth0のApplication作成時に生成されるClient ID|
|VITE_AUTH0_CALLBACK_URL|コールバックURL。Auth0のApplicationの設定と一致させる必要がある|
|VITE_APP_AUTH0_AUDIENCE|Auth0のAPIのIdentifierと一致させる必要がある|
|VITE_APP_API_SERVER_URL|バックエンドAPIのURL|

## ローカル動作

- 環境変数設定
- ローカル用証明書の発行
  - Auth0を使用するためにhttpsでアクセスできるようにする必要があります
- コード修正
  - `vite.config.ts`証明書の読み込みのコメントアウトを外し、証明書のパスを設定
- npm install
- npm run dev 


## デプロイ

- app.yaml作成
- .env作成
  - app.yamlからの環境変数読み込みがうまくいっておらず必要です。
- npm run build
- gcloud app deploy

# バックエンド

## 環境変数

|key|value|
|-|-|
|ENVIRONMENT|ローカルでは`local` 他指定なし|
|PORT|ローカルではAuth0の設定と合わせる必要あり|
|CLIENT_ORIGIN_URL|フロントエンドURL|
|RELOAD|True|
|AUTH0_DOMAIN|バックエンドAPIのURL|
|AUTH0_AUDIENCE|Auth0のAPIのIdentifierと一致させる必要がある|
|GOOGLE_PROJECT_ID|Google Cloud Project ID|
|GOOGLE_LOCATION|Google Cloud ロケーション|
|GOOGLE_STORAGE_BUCKET_NAME|音声ファイルを格納するバケット名|
|GOOGLE_GEMINI_API_KEY|Gemini APIキー|
|GOOGLE_GENERATIVE_MODEL_VERTEXAI|VertexAI モデル名 gemini-1.5-flash-001|
|GOOGLE_GENERATIVE_MODEL_GEMINI_API|Gemini API モデル名 models/gemini-1.5-flash|

## ローカル動作

- 環境変数設定
- ローカル用証明書の発行
  - Auth0を使用するためにhttpsでアクセスできるようにする必要があります。
- コード修正
  - `config.py`env_fileの読み込みのコメントアウトを外す
- python main.py

## デプロイ

- Cloud Runの継続的デプロイ機能を使用してデプロイ。