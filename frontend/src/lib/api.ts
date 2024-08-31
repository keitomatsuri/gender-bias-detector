const serverUrl = import.meta.env.VITE_APP_API_SERVER_URL;

export const uploadAudioFileToDetector = async (formData: FormData, token: string): Promise<any> => {
  try {
    const response = await fetch(`${serverUrl}/api/detector`, {
      method: 'POST',
      headers: {
        "Authorization": `Bearer ${token}`,
      },
      body: formData,
    });
    return await response.json();
  } catch (error) {
    console.error("Error uploading audio with token:", error);
    throw new Error("Error uploading audio with token");
  }
};

export const uploadAudioFileToRealtimeDetector = async (formData: FormData, token: string): Promise<any> => {
  try {
    const response = await fetch(`${serverUrl}/api/realtime-detector`, {
      method: 'POST',
      headers: {
        "Authorization": `Bearer ${token}`,
      },
      body: formData,
    });
    return await response.json();
  } catch (error) {
    console.error("Error uploading audio with token:", error);
    throw new Error("Error uploading audio with token");
  }
};