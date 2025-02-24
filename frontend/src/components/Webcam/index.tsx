"use client";

import { User } from "lucide-react";
import React, { useRef, useState, useEffect } from "react";

interface WebcamCaptureProps {
  onCapture: (image: string) => void;
  onClose: () => void;
}

export default function WebcamCapture({ onCapture, onClose }: WebcamCaptureProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [imageData, setImageData] = useState<string | null>(null);
  const [isVideoRunning, setIsVideoRunning] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const isAndroid = /Android/i.test(navigator.userAgent);
  const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
  const isMobile = isAndroid || isIOS;

  const getAvailableCameras = async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      return devices.filter(device => device.kind === 'videoinput');
    } catch (error) {
      console.error('Erro ao listar câmeras:', error);
      return [];
    }
  };

  const getAndroidConstraints = async () => {
    const cameras = await getAvailableCameras();
    
    if (cameras.length > 1) {
      return {
        video: {
          deviceId: { exact: cameras[cameras.length - 1].deviceId },
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        }
      };
    }

    const constraints = [
      {
        video: {
          facingMode: { exact: "environment" },
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        }
      },

      {
        video: {
          facingMode: "environment",
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        }
      },
      {
        video: {
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        }
      },
      {
        video: true
      }
    ];

    return constraints;
  };

  const getIOSConstraints = () => {
    return {
      video: {
        facingMode: { exact: "environment" },
        width: { ideal: 1920 },
        height: { ideal: 1080 }
      }
    };
  };

  const tryConstraints = async (constraints: MediaStreamConstraints) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      return stream;
    } catch (error) {
      console.warn('Falha com constraints:', constraints, error);
      return null;
    }
  };

  const startCamera = async () => {
    try {
      setError("");
      
      if (videoRef.current?.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
      }

      let stream = null;

      if (isAndroid) {
        const androidConstraints = await getAndroidConstraints();
        
        if (Array.isArray(androidConstraints)) {
          for (const constraint of androidConstraints) {
            stream = await tryConstraints(constraint);
            if (stream) break;
          }
        } else {
          stream = await tryConstraints(androidConstraints);
        }
      } else if (isIOS) {
        stream = await tryConstraints(getIOSConstraints());
      } else {
        stream = await tryConstraints({ video: true });
      }

      if (!stream) {
        throw new Error("Não foi possível iniciar a câmera com nenhuma configuração");
      }

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await new Promise((resolve) => {
          if (videoRef.current) {
            videoRef.current.onloadedmetadata = resolve;
          }
        });
        setIsVideoRunning(true);
      }
    } catch (error: any) {
      console.error("Erro ao iniciar câmera:", error);
      setError(`Erro ao acessar a câmera: ${error.message}`);
      setIsVideoRunning(false);
    }
  };

  const checkCameraPermission = async () => {
    try {
      if (navigator.permissions && navigator.permissions.query) {
        const permission = await navigator.permissions.query({ name: "camera" as any });
        
        if (permission.state === "granted" || permission.state === "prompt") {
          await startCamera();
        } else {
          setError("Permissão para acessar a câmera foi negada. Ative manualmente nas configurações do navegador.");
        }
      } else {
        await startCamera();
      }
    } catch (error) {
      console.error("Erro ao verificar permissões:", error);
      setError("Erro ao verificar permissões da câmera");
    }
  };

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");

      if (ctx) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        try {
          const base64Image = canvas.toDataURL("image/jpeg", 0.95);
          setImageData(base64Image);
          onCapture(base64Image);
          onClose();
        } catch (error) {
          console.error("Erro ao converter imagem:", error);
          setError("Erro ao processar a imagem capturada");
        }
      }
    }
  };

  const handleNativeCapture = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.capture = 'environment';
    
    input.onchange = (e: Event) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) {
            onCapture(e.target.result as string);
            onClose();
          }
        };
        reader.readAsDataURL(file);
      }
    };
    
    input.click();
  };

  useEffect(() => {
    checkCameraPermission();

    return () => {
      if (videoRef.current?.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-center font-semibold text-xl md:text-3xl">
        Reconhecimento facial
      </h1>

      <div className="md:mt-8 mt-6 flex justify-center items-center relative">
        <div className="w-full max-w-md aspect-[4/3] shadow-sm dark:border-zinc-700 dark:bg-zinc-800 relative">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className={`border rounded-lg w-full h-full object-cover ${
              !isVideoRunning ? "hidden" : ""
            }`}
          />
          {!isVideoRunning && (
            <div className="absolute inset-0 flex items-center justify-center">
              <User className="w-16 h-16 dark:text-zinc-500" />
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 flex justify-center">
        <p className="text-center md:text-base text-sm max-w-lg">
          Posicione seu rosto no centro da câmera, em um ambiente bem iluminado, e certifique-se de que todo o rosto esteja visível. Quando estiver pronto, clique em 'Tirar foto'.
        </p>
      </div>

      <div className="md:mt-8 mt-6 flex justify-center gap-4">
        {isMobile ? (
          <button
            onClick={handleNativeCapture}
            className="px-4 py-3 rounded-md text-base font-semibold outline-none border shadow-sm dark:text-zinc-100 dark:bg-blue-500 dark:hover:bg-blue-600 dark:border-blue-500 dark:hover:border-blue-600"
          >
            Tirar foto
          </button>
        ) : (
          isVideoRunning ? (
            <button
              onClick={captureImage}
              className="px-4 py-3 rounded-md text-base font-semibold outline-none border shadow-sm dark:text-zinc-100 dark:bg-blue-500 dark:hover:bg-blue-600 dark:border-blue-500 dark:hover:border-blue-600"
            >
              Tirar Foto
            </button>
          ) : (
            <button
              onClick={checkCameraPermission}
              className="px-4 py-3 rounded-md text-base font-semibold outline-none border shadow-sm dark:text-zinc-100 dark:bg-blue-500 dark:hover:bg-blue-600 dark:border-blue-500 dark:hover:border-blue-600"
            >
              Permitir câmera
            </button>
          )
        )}
      </div>

      <canvas ref={canvasRef} style={{ display: "none" }} />
    </div>
  );
}