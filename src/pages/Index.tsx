import React, { useRef, useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { FaceMesh } from '@mediapipe/face_mesh';
import { Camera } from '@mediapipe/camera_utils';

interface FaceData {
  x: number;
  y: number;
  z: number;
  eyeLeft: { x: number; y: number };
  eyeRight: { x: number; y: number };
  mouth: { x: number; y: number };
  nose: { x: number; y: number };
}

export default function Index() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const avatarCanvasRef = useRef<HTMLCanvasElement>(null);
  const [isActive, setIsActive] = useState(false);
  const [faceData, setFaceData] = useState<FaceData | null>(null);
  const faceMeshRef = useRef<FaceMesh | null>(null);
  const cameraRef = useRef<Camera | null>(null);

  // Anime character drawing function
  const drawAnimeCharacter = (ctx: CanvasRenderingContext2D, face: FaceData | null) => {
    const canvas = ctx.canvas;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Character head
    const headRadius = 120;
    const headX = centerX + (face ? face.x * 50 : 0);
    const headY = centerY + (face ? face.y * 30 : 0);

    // Head shadow
    ctx.fillStyle = 'rgba(155, 135, 245, 0.1)';
    ctx.beginPath();
    ctx.ellipse(headX + 5, headY + 5, headRadius, headRadius * 1.2, 0, 0, Math.PI * 2);
    ctx.fill();

    // Main head
    ctx.fillStyle = '#FFE4C4';
    ctx.beginPath();
    ctx.ellipse(headX, headY, headRadius, headRadius * 1.2, 0, 0, Math.PI * 2);
    ctx.fill();

    // Hair
    ctx.fillStyle = '#4A4A4A';
    ctx.beginPath();
    ctx.ellipse(headX, headY - 40, headRadius * 1.1, headRadius * 0.8, 0, 0, Math.PI * 2);
    ctx.fill();

    // Eyes
    const eyeOffset = face ? { x: face.eyeLeft.x * 20, y: face.eyeLeft.y * 10 } : { x: 0, y: 0 };
    
    // Left eye
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.ellipse(headX - 35 + eyeOffset.x, headY - 20 + eyeOffset.y, 25, 15, 0, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.fillStyle = '#9b87f5';
    ctx.beginPath();
    ctx.ellipse(headX - 35 + eyeOffset.x, headY - 20 + eyeOffset.y, 12, 12, 0, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.ellipse(headX - 35 + eyeOffset.x, headY - 20 + eyeOffset.y, 6, 6, 0, 0, Math.PI * 2);
    ctx.fill();

    // Right eye
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.ellipse(headX + 35 + eyeOffset.x, headY - 20 + eyeOffset.y, 25, 15, 0, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.fillStyle = '#9b87f5';
    ctx.beginPath();
    ctx.ellipse(headX + 35 + eyeOffset.x, headY - 20 + eyeOffset.y, 12, 12, 0, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.ellipse(headX + 35 + eyeOffset.x, headY - 20 + eyeOffset.y, 6, 6, 0, 0, Math.PI * 2);
    ctx.fill();

    // Nose
    ctx.fillStyle = '#FFB6C1';
    ctx.beginPath();
    ctx.ellipse(headX + (face ? face.nose.x * 10 : 0), headY + 10, 4, 2, 0, 0, Math.PI * 2);
    ctx.fill();

    // Mouth
    const mouthY = headY + 35 + (face ? face.mouth.y * 15 : 0);
    ctx.strokeStyle = '#FF69B4';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.arc(headX + (face ? face.mouth.x * 10 : 0), mouthY, 15, 0.2, Math.PI - 0.2);
    ctx.stroke();

    // Blush
    ctx.fillStyle = 'rgba(255, 182, 193, 0.6)';
    ctx.beginPath();
    ctx.ellipse(headX - 70, headY + 10, 15, 10, 0, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.beginPath();
    ctx.ellipse(headX + 70, headY + 10, 15, 10, 0, 0, Math.PI * 2);
    ctx.fill();
  };

  const initializeFaceTracking = async () => {
    if (!videoRef.current || !canvasRef.current) return;

    try {
      faceMeshRef.current = new FaceMesh({
        locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`
      });

      faceMeshRef.current.setOptions({
        maxNumFaces: 1,
        refineLandmarks: true,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5
      });

      faceMeshRef.current.onResults((results) => {
        if (results.multiFaceLandmarks && results.multiFaceLandmarks.length > 0) {
          const landmarks = results.multiFaceLandmarks[0];
          
          // Extract key facial features
          const nose = landmarks[1];
          const leftEye = landmarks[33];
          const rightEye = landmarks[263];
          const mouth = landmarks[13];

          const newFaceData: FaceData = {
            x: nose.x - 0.5,
            y: nose.y - 0.5,
            z: nose.z || 0,
            eyeLeft: { x: leftEye.x - 0.5, y: leftEye.y - 0.5 },
            eyeRight: { x: rightEye.x - 0.5, y: rightEye.y - 0.5 },
            mouth: { x: mouth.x - 0.5, y: mouth.y - 0.5 },
            nose: { x: nose.x - 0.5, y: nose.y - 0.5 }
          };

          setFaceData(newFaceData);
        }
      });

      cameraRef.current = new Camera(videoRef.current, {
        onFrame: async () => {
          if (faceMeshRef.current && videoRef.current) {
            await faceMeshRef.current.send({ image: videoRef.current });
          }
        },
        width: 640,
        height: 480
      });

      await cameraRef.current.start();
      setIsActive(true);
    } catch (error) {
      console.error('Error initializing face tracking:', error);
    }
  };

  const stopFaceTracking = () => {
    if (cameraRef.current) {
      cameraRef.current.stop();
    }
    setIsActive(false);
    setFaceData(null);
  };

  useEffect(() => {
    const avatarCanvas = avatarCanvasRef.current;
    if (!avatarCanvas) return;

    const ctx = avatarCanvas.getContext('2d');
    if (!ctx) return;

    const animate = () => {
      drawAnimeCharacter(ctx, faceData);
      requestAnimationFrame(animate);
    };

    animate();
  }, [faceData]);

  return (
    <div className="min-h-screen bg-background text-foreground p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
            Аниме Аватар
          </h1>
          <p className="text-lg text-muted-foreground">
            Виртуальный компаньон, который повторяет ваши движения
          </p>
        </div>

        {/* Main content */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Camera feed */}
          <Card className="bg-card border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Камера</h2>
                <Badge variant={isActive ? "default" : "secondary"}>
                  {isActive ? "Активна" : "Неактивна"}
                </Badge>
              </div>
              
              <div className="relative rounded-lg overflow-hidden bg-gray-900 aspect-video">
                <video
                  ref={videoRef}
                  className="w-full h-full object-cover"
                  playsInline
                  muted
                />
                <canvas
                  ref={canvasRef}
                  className="absolute top-0 left-0 w-full h-full"
                />
                {!isActive && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <Icon name="Camera" size={48} className="mx-auto mb-4 text-gray-500" />
                      <p className="text-gray-400">Нажмите "Запустить" для активации камеры</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-2 mt-4">
                <Button 
                  onClick={initializeFaceTracking}
                  disabled={isActive}
                  className="flex-1"
                >
                  <Icon name="Play" size={18} className="mr-2" />
                  Запустить
                </Button>
                <Button 
                  onClick={stopFaceTracking}
                  disabled={!isActive}
                  variant="outline"
                  className="flex-1"
                >
                  <Icon name="Square" size={18} className="mr-2" />
                  Остановить
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Anime avatar */}
          <Card className="bg-card border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Аватар</h2>
                <Badge variant={faceData ? "default" : "secondary"}>
                  {faceData ? "Синхронизирован" : "Ожидание"}
                </Badge>
              </div>
              
              <div className="relative rounded-lg overflow-hidden bg-gradient-to-br from-purple-900/20 to-blue-900/20 aspect-video">
                <canvas
                  ref={avatarCanvasRef}
                  width={640}
                  height={480}
                  className="w-full h-full"
                />
              </div>

              <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                <div className="bg-gray-800 rounded-lg p-3">
                  <p className="text-gray-400 mb-1">Позиция головы</p>
                  <p className="font-mono">
                    X: {faceData ? faceData.x.toFixed(3) : '0.000'}
                  </p>
                  <p className="font-mono">
                    Y: {faceData ? faceData.y.toFixed(3) : '0.000'}
                  </p>
                </div>
                <div className="bg-gray-800 rounded-lg p-3">
                  <p className="text-gray-400 mb-1">Статус</p>
                  <p className={`font-medium ${faceData ? 'text-green-400' : 'text-gray-400'}`}>
                    {faceData ? 'Лицо обнаружено' : 'Лицо не найдено'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Features */}
        <div className="mt-8 grid md:grid-cols-3 gap-4">
          <Card className="bg-card border-gray-700">
            <CardContent className="p-4 text-center">
              <Icon name="Eye" size={32} className="mx-auto mb-2 text-primary" />
              <h3 className="font-semibold mb-1">Отслеживание глаз</h3>
              <p className="text-sm text-muted-foreground">
                Аватар следит за движением ваших глаз
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-card border-gray-700">
            <CardContent className="p-4 text-center">
              <Icon name="Smile" size={32} className="mx-auto mb-2 text-primary" />
              <h3 className="font-semibold mb-1">Эмоции</h3>
              <p className="text-sm text-muted-foreground">
                Синхронизация выражения лица
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-card border-gray-700">
            <CardContent className="p-4 text-center">
              <Icon name="Zap" size={32} className="mx-auto mb-2 text-primary" />
              <h3 className="font-semibold mb-1">Реальное время</h3>
              <p className="text-sm text-muted-foreground">
                Мгновенная реакция на движения
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}