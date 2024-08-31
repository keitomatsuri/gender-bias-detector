import React, { useState, useEffect, useRef } from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import { uploadAudioFileToRealtimeDetector } from '@/lib/api';
import { Button } from './ui/button';
import { CircleStop, Mic } from 'lucide-react';

export const RealtimeDetector: React.FC = () => {
  const { getAccessTokenSilently } = useAuth0()

  const [isRecording, setIsRecording] = useState(false);
  const [responses, setResponses] = useState<string[]>([]);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  // @ts-expect-error SpeechRecognition is not recognized by TypeScript by default
  const speechRecognitionRef = useRef<SpeechRecognition | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const getToken = async () => {
    const audience = import.meta.env.VITE_APP_AUTH0_AUDIENCE
    const token = await getAccessTokenSilently({ authorizationParams: { audience: audience } });

    return token
  }

  useEffect(() => {
    // @ts-expect-error SpeechRecognition is not recognized by TypeScript by default
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.interimResults = true;
    recognition.continuous = true;
    // @ts-expect-error SpeechRecognitionEvent is not recognized by TypeScript by default
    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const result = event.results[event.results.length - 1];
      if (result.isFinal) {
        console.log("recognition result is final")
        mediaRecorderRef.current?.stop();
        mediaRecorderRef.current?.start();
      }
    };

    speechRecognitionRef.current = recognition;

  }, []);

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream);

    mediaRecorder.ondataavailable = (event: BlobEvent) => {
      chunksRef.current.push(event.data);
    };

    mediaRecorder.onstop = async () => {
      const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
      const formData = new FormData();
      formData.append('file', blob, 'recording.webm');

      const token = await getToken();

      try {
        const data = await uploadAudioFileToRealtimeDetector(formData, token);
        setResponses((prevResponses) => [...prevResponses, data.result.replace(/```json|```/g, '').trim()]);
      } catch (error) {
        setResponses((prevResponses) => [...prevResponses, '検知に失敗しました。']);
      }

      if (isRecording) {
        chunksRef.current = [];
        mediaRecorderRef.current?.start();
      }
    };

    mediaRecorderRef.current = mediaRecorder;

    setIsRecording(true);
    speechRecognitionRef.current?.start();
    mediaRecorder.start();
  };

  const stopRecording = () => {
    setIsRecording(false);
    speechRecognitionRef.current?.stop();
    mediaRecorderRef.current?.stop();
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-white mt-4">
      <div className="p-4 shadow rounded-lg">
        <p className='m-4'>リアルタイム検出は実験的な機能です</p>
        <p className='m-4'>2回目の録音開始から動作します</p>
        <p className='m-4'>動作が不安定な場合があります</p>
        <div className='flex flex-col items-center space-y-4'>
          {isRecording ? (
            <Button onClick={stopRecording}>
              <CircleStop className="mr-2 h-4 w-4" /> 停止
            </Button>
          ) : (
            <Button onClick={startRecording}>
              <Mic className="mr-2 h-4 w-4" /> 開始
            </Button>
          )}
        </div>
      </div>
      <div className="m-4">
        {responses.map((response, index) => (
          <p key={index} className="text-center">{response}</p>
        ))}
      </div>
    </div>
  );
};
