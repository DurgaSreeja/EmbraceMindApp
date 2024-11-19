import React, { useState, useRef } from "react";

const VoiceRecorder: React.FC = () => {
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [emotion, setEmotion] = useState<string | null>(null);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);

  // Start recording
  const startRecording = () => {
    setEmotion(null); // Reset emotion before a new recording
    console.log("Requesting access to audio device...");
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream: MediaStream) => {
        mediaRecorder.current = new MediaRecorder(stream);

        mediaRecorder.current.ondataavailable = (event: BlobEvent) => {
          audioChunks.current.push(event.data);
        };

        mediaRecorder.current.onstop = () => {
          console.log("Recording stopped, preparing audio for backend...");
          const audioBlob = new Blob(audioChunks.current, {
            type: "audio/wav",
          });
          audioChunks.current = [];
          sendAudioToBackend(audioBlob);
        };

        mediaRecorder.current.start();
        setIsRecording(true);
        console.log("Recording started.");
      })
      .catch((error) => console.error("Error accessing media devices:", error));
  };

  // Stop recording
  const stopRecording = () => {
    if (mediaRecorder.current) {
      mediaRecorder.current.stop();
      setIsRecording(false);
      console.log("Recording stopped by user.");
    }
  };

  // Send audio file to backend
  const sendAudioToBackend = (audioBlob: Blob) => {
    console.log("Sending audio to backend...");
    const formData = new FormData();
    formData.append("audio_file", audioBlob, "recording.wav");

    fetch("http://127.0.0.1:5000/predict-emotion", {
      method: "POST",
      body: formData,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok.");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Received response from backend:", data);
        setEmotion(data.predicted_emotion);
      })
      .catch((error) =>
        console.error("Error sending audio to backend:", error)
      );
  };

  return (
    <div>
      <h1>Emotion Recognition</h1>
      <button onClick={isRecording ? stopRecording : startRecording}>
        {isRecording ? "Stop Recording" : "Start Recording"}
      </button>
      {emotion && <h2>Predicted Emotion: {emotion}</h2>}
      {/* Debugging Display */}
      <p>Recording: {isRecording.toString()}</p>
      <p>Emotion: {emotion ?? "No prediction yet"}</p>
    </div>
  );
};

export default VoiceRecorder;
