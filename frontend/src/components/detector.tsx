import React, { useState, useRef } from "react";
import { CircleStop, Mic, Loader2, ArrowLeft } from "lucide-react";
import Markdown from 'react-markdown'
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { useAuth0 } from "@auth0/auth0-react";
import { uploadAudioFileToDetector } from "@/lib/api";

export const Detector: React.FC = () => {
  const { getAccessTokenSilently } = useAuth0()

  const [isRecording, setIsRecording] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null
  );
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [responseMessage, setResponseMessage] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const startRecording = async () => {
    setElapsedTime(0);
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const recorder = new MediaRecorder(stream);
    recorder.start();

    recorder.ondataavailable = (event) => {
      setAudioBlob(event.data);
    };

    setMediaRecorder(recorder);
    setIsRecording(true);

    const startTime = Date.now();
    intervalRef.current = setInterval(() => {
      setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);
  };

  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      setIsRecording(false);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }
  };

  const saveAudioLocally = () => {
    if (audioBlob) {
      const url = URL.createObjectURL(audioBlob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "recording.webm";
      a.click();
    }
  };

  const getToken = async () => {
    const audience = import.meta.env.VITE_APP_AUTH0_AUDIENCE
    const token = await getAccessTokenSilently({ authorizationParams: { audience: audience } });

    return token
  }

  const sendAudioToServer = async (file: Blob, filename: string) => {
    setIsUploading(true); // アップロード開始
    setResponseMessage(null);

    const formData = new FormData();
    formData.append("file", file, filename);

    try {
      const token = await getToken();
      const result = await uploadAudioFileToDetector(formData, token);

      setResponseMessage(result);
    } catch (error) {
      console.error("Error uploading audio:", error);
      setResponseMessage("Error uploading audio");
    } finally {
      setIsUploading(false); // アップロード終了
    }
  };

  const cancelRecording = () => {
    setAudioBlob(null);
    setElapsedTime(0);
    setResponseMessage(null);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setUploadedFile(file);
  };

  const handleFileUpload = () => {
    if (uploadedFile) {
      sendAudioToServer(uploadedFile, uploadedFile.name);
    }
  };

  const resetResponse = () => {
    setResponseMessage(null);
    setAudioBlob(null);
    setUploadedFile(null);
    setElapsedTime(0);
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-white mt-4">
      <div className="p-4 shadow rounded-lg">
        {isUploading ? (
          <div className="flex items-center space-x-2">
            <Loader2 className="animate-spin" />
            <span>アップロード中...</span>
          </div>
        ) : responseMessage ? (
          <div className="">
            <Markdown>{responseMessage}</Markdown>
            <Button onClick={resetResponse} variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              録音に戻る
            </Button>
          </div>
        ) : (
          <Tabs defaultValue="recording" className="w-[400px]">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="recording">録音</TabsTrigger>
              <TabsTrigger value="file-upload">ファイルアップロード</TabsTrigger>
            </TabsList>
            <TabsContent value="recording">
              <div className="flex flex-col items-center space-y-4">
                {isRecording ? (
                  <Button onClick={stopRecording}>
                    <CircleStop className="mr-2 h-4 w-4" /> 停止
                  </Button>
                ) : audioBlob ? null : (
                  <Button onClick={startRecording}>
                    <Mic className="mr-2 h-4 w-4" /> 開始
                  </Button>
                )}
                <div className="text-lg">
                  録音中の経過時間: {elapsedTime} 秒
                </div>
                {!isRecording && audioBlob && (
                  <div className="flex flex-col items-center space-y-4">
                    <Button
                      onClick={() => sendAudioToServer(audioBlob, "recording.webm")}
                      variant="default"
                    >
                      レポートを生成
                    </Button>
                    <Button onClick={saveAudioLocally} variant="secondary">
                      録音を端末に保存
                    </Button>
                    <Button onClick={cancelRecording} variant="destructive">
                      キャンセル
                    </Button>
                  </div>
                )}
              </div>
            </TabsContent>
            <TabsContent value="file-upload">
              <div className="flex flex-col items-center space-y-4">
                <Input
                  type="file"
                  accept="audio/*"
                  onChange={handleFileChange}
                />
                <Button
                  onClick={handleFileUpload}
                  disabled={!uploadedFile}
                  variant="default"
                >
                  ファイルをアップロード
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
};