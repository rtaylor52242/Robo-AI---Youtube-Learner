import React, { useEffect } from 'react';
import type { VideoData, TranscriptItem } from '../types';
import Loader from './Loader';
import { GoogleGenAI, Type } from "@google/genai";

interface VideoPageProps {
  videoData: VideoData;
  onSaveInsights: (videoId: string, insights: string[], transcript: TranscriptItem[]) => void;
}

const VideoPage: React.FC<VideoPageProps> = ({ videoData, onSaveInsights }) => {
  const isLoading = !videoData.insights || !videoData.transcript;

  useEffect(() => {
    if (isLoading) {
      const generateAndSaveData = async () => {
        try {
          const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

          // 1. Generate Transcript
          const transcriptPrompt = `Create a detailed transcript with timestamps for the YouTube video at this URL: ${videoData.url}. Format the entire response as a valid JSON array of objects, where each object has a "timestamp" key (string) and a "text" key (string). Do not include any introductory text, closing text, or markdown formatting like \`\`\`json. The response should be only the JSON array.`;
          
          const transcriptResponse = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: transcriptPrompt,
            config: {
              responseMimeType: "application/json",
              responseSchema: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    timestamp: { type: Type.STRING },
                    text: { type: Type.STRING },
                  },
                  required: ["timestamp", "text"],
                },
              },
            },
          });

          const transcript: TranscriptItem[] = JSON.parse(transcriptResponse.text);
          
          if (!transcript || transcript.length === 0) {
            throw new Error("Failed to generate a valid transcript.");
          }

          // 2. Generate Insights from Transcript
          const transcriptForInsights = transcript.map(t => `${t.timestamp} ${t.text}`).join('\n');
          const insightsPrompt = `Based on the following video transcript, generate a list of 4-5 key insights. Do not include any text at the beginning or end of the response. Output only the insights, each on a new line.\n\nTranscript:\n${transcriptForInsights}`;

          const insightsResponse = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: insightsPrompt
          });

          const insightsText = insightsResponse.text;
          const insights = insightsText.split('\n').map(line => line.trim().replace(/^- /,'')).filter(Boolean);

          if (!insights || insights.length === 0) {
             throw new Error("Failed to generate insights.");
          }

          // 3. Save to Firestore
          onSaveInsights(videoData.id, insights, transcript);

        } catch (error) {
          console.error("Error generating AI content:", error);
          // In case of an error, we can save empty arrays to stop the loader
          // or implement a proper error state. For now, it will keep loading.
        }
      };

      generateAndSaveData();
    }
  }, [videoData.id, videoData.url, isLoading, onSaveInsights]);

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl md:text-3xl font-bold text-white mb-4 truncate">{videoData.title}</h1>

      <div className="aspect-video w-full mb-8">
        <iframe
          className="w-full h-full rounded-lg shadow-2xl"
          src={`https://www.youtube.com/embed/${videoData.id}?autoplay=1`}
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>

      {isLoading ? (
        <Loader />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* AI Insights Box */}
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <h2 className="text-xl font-semibold text-white mb-4">AI Insights</h2>
            <ul className="space-y-3 list-disc list-inside text-gray-300">
              {videoData.insights?.map((insight, index) => (
                <li key={index}>{insight}</li>
              ))}
            </ul>
          </div>

          {/* Transcript Box */}
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <h2 className="text-xl font-semibold text-white mb-4">Transcript</h2>
            <div className="max-h-96 overflow-y-auto space-y-4 pr-2">
              {videoData.transcript?.map((item, index) => (
                <div key={index} className="flex gap-4 text-gray-300">
                  <span className="font-mono text-brand-light font-medium">{item.timestamp}</span>
                  <p>{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoPage;