import React, { useState, useCallback, useEffect } from 'react';
import type { HistoryItem, VideoData, TranscriptItem } from './types';
import Sidebar from './components/Sidebar';
import HomePage from './components/HomePage';
import VideoPage from './components/VideoPage';
import LoginPage from './components/LoginPage';
import HelpModal from './components/HelpModal';
import { 
  auth, 
  onAuthStateChanged, 
  signOut, 
  type User, 
  db,
  doc,
  setDoc,
  collection,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
  updateDoc,
  deleteDoc
} from './firebase';


const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [history, setHistory] = useState<VideoData[]>([]);
  const [currentView, setCurrentView] = useState<'home' | 'video'>('home');
  const [currentVideoId, setCurrentVideoId] = useState<string | null>(null);
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      const q = query(collection(db, "users", user.uid, "videos"), orderBy("createdAt", "desc"));
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const videosData: VideoData[] = [];
        querySnapshot.forEach((doc) => {
          videosData.push(doc.data() as VideoData);
        });
        setHistory(videosData);
      });
      return () => unsubscribe();
    } else {
      setHistory([]);
    }
  }, [user]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setHistory([]);
      setCurrentView('home');
      setCurrentVideoId(null);
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  const getYoutubeVideoId = (url: string): string | null => {
      const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
      const match = url.match(regExp);
      return (match && match[2].length === 11) ? match[2] : null;
  };

  const handleGenerateInsights = useCallback(async (url: string) => {
    if (!user || isGenerating) return;

    setIsGenerating(true);
    const videoId = getYoutubeVideoId(url);
    if (!videoId) {
      alert('Invalid YouTube URL. Please try again.');
      setIsGenerating(false);
      return;
    }
    
    try {
      let videoTitle = `Video: ${videoId}`; // Default title
      try {
          const response = await fetch(`https://noembed.com/embed?url=https://www.youtube.com/watch?v=${videoId}`);
          if (response.ok) {
              const data = await response.json();
              if (data.title) {
                  videoTitle = data.title;
              }
          }
      } catch (fetchError) {
          console.warn("Could not fetch video title, using default.", fetchError);
      }

      const newVideo: VideoData = { 
        id: videoId, 
        title: videoTitle,
        url: url,
        createdAt: serverTimestamp(),
      };

      await setDoc(doc(db, "users", user.uid, "videos", videoId), newVideo);
      setCurrentVideoId(videoId);
      setCurrentView('video');
    } catch (e) {
      console.error("Error adding document: ", e);
      alert("There was an error saving your video. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  }, [user, isGenerating]);

  const handleSaveInsights = useCallback(async (videoId: string, insights: string[], transcript: TranscriptItem[]) => {
    if (!user) return;
    try {
      const videoRef = doc(db, "users", user.uid, "videos", videoId);
      await updateDoc(videoRef, {
        insights,
        transcript
      });
    } catch (e) {
      console.error("Error updating document: ", e);
    }
  }, [user]);

  const handleSelectHistoryItem = useCallback((id: string) => {
    setCurrentVideoId(id);
    setCurrentView('video');
  }, []);

  const handleGoHome = useCallback(() => {
    setCurrentVideoId(null);
    setCurrentView('home');
  }, []);

  const handleDeleteHistoryItem = useCallback(async (videoId: string) => {
    if (!user) return;
    try {
      if (currentVideoId === videoId) {
        handleGoHome();
      }
      await deleteDoc(doc(db, "users", user.uid, "videos", videoId));
    } catch (e) {
      console.error("Error deleting document: ", e);
      alert("There was an error deleting the video. Please try again.");
    }
  }, [user, currentVideoId, handleGoHome]);


  if (authLoading) {
    return (
      <div className="bg-gray-900 min-h-screen flex items-center justify-center text-white">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-brand-primary border-t-transparent rounded-full animate-spin mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <LoginPage />;
  }

  const currentVideoData = history.find(v => v.id === currentVideoId);

  return (
    <div className="bg-gray-900 text-gray-200 font-sans min-h-screen flex">
      <Sidebar 
        history={history} 
        onSelectItem={handleSelectHistoryItem} 
        onGoHome={handleGoHome}
        currentVideoId={currentVideoId}
        isOpen={isSidebarOpen}
        setIsOpen={setSidebarOpen}
        onLogout={handleLogout}
        onDeleteItem={handleDeleteHistoryItem}
        onOpenHelp={() => setIsHelpModalOpen(true)}
      />
      <main className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'ml-64 md:ml-72' : 'ml-16'}`}>
        <div className="p-4 sm:p-6 lg:p-8 h-full">
          {currentView === 'home' && <HomePage onGenerate={handleGenerateInsights} isGenerating={isGenerating} />}
          {currentView === 'video' && currentVideoData && (
            <VideoPage 
              key={currentVideoData.id} 
              videoData={currentVideoData}
              onSaveInsights={handleSaveInsights}
            />
          )}
        </div>
      </main>
      <HelpModal isOpen={isHelpModalOpen} onClose={() => setIsHelpModalOpen(false)} />
    </div>
  );
};

export default App;