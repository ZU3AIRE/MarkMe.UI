import { useEffect, useRef, useState } from 'react';
import { detectFaces } from '../utils/azureFaceApi';

interface Props {
  onFaceEvent: (faceId: string, type: 'check-in' | 'check-out') => void;
}

export default function VideoStream({ onFaceEvent }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [activeFaces, setActiveFaces] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        })
        .catch(err => console.error('Error accessing camera:', err));
    }
  }, []);

  useEffect(() => {
    const checkFaces = async () => {
      if (!videoRef.current || !canvasRef.current) return;

      const context = canvasRef.current.getContext('2d');
      if (!context) return;

      // Capture video frame
      context.drawImage(videoRef.current, 0, 0, 640, 480);
      const imageData = canvasRef.current.toDataURL('image/jpeg');

      try {
        const faces = await detectFaces(imageData);
        const currentFaces = new Set(faces.map(face => face.faceId));

        // Check for new faces (check-in)
        currentFaces.forEach(faceId => {
          if (!activeFaces.has(faceId)) {
            onFaceEvent(faceId, 'check-in');
          }
        });

        // Check for removed faces (check-out)
        activeFaces.forEach(faceId => {
          if (!currentFaces.has(faceId)) {
            onFaceEvent(faceId, 'check-out');
          }
        });

        setActiveFaces(currentFaces);
      } catch (error) {
        console.error('Face detection error:', error);
      }
    };

    const interval = setInterval(checkFaces, 5000); // Check every 5 seconds
    return () => clearInterval(interval);
  }, [activeFaces, onFaceEvent]);

  return (
    <div>
      <video
        ref={videoRef}
        autoPlay
        playsInline
        style={{ 
          width: '640px', 
          height: '480px',
          transform: 'scaleX(-1)' 
        }}
      />
      <canvas
        ref={canvasRef}
        width={640}
        height={480}
        style={{ display: 'none' }}
      />
    </div>
  );
}
