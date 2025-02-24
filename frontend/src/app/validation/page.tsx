"use client";

import { useEffect, useState } from "react";
import Modal from "@/components/Modal";
import WebcamCapture from "@/components/Webcam";
import { Sidebar } from "@/components/Sidebar";
import { Input } from "@/components/Input";
import { IdCard, User } from "lucide-react";
import { api } from "@/lib/axios";
import { parseCookies } from "nookies";
import Result from "../../components/Result";
import Loading from "@/components/Loading";

export default function Validation() {
  const [data, setData] = useState<object | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imageData, setImageData] = useState<string>("")
  const [CPFData, setCPFData] = useState<string>("")
  const [percentageValue, setPercentageValue] = useState(0)
  const [probabilityText, setProbabilityText] = useState("")
  const [error, setError] = useState("")
  const [errorMessage, setErrorMessage] = useState("")
  const cookies = parseCookies();
  const walletAddress = cookies['walletAddress'];
  

  const userHasPreviousResult = async () => {
    setIsLoading(true)

    try {
      const { data } = await api.get(`/result/${walletAddress}`);
      
      setData(data);
      setImageData(data.base64Image)
      setCPFData(data.cpf)
      setProbabilityText(data?.biometryResult?.probability);
      setPercentageValue(data ? Math.round(data?.biometryResult?.similarity * 100) : 0);
    } catch (error) {
      console.error("Erro ao checar se usuário já está validado:", error);
    } finally {
      setIsLoading(false)
    }
  }

  const handleImageCapture = (image: string) => {
    setImageData(image);
  };

  useEffect(() => {
    if(walletAddress) userHasPreviousResult()
  }, [walletAddress])

  const handleSendKYC = async () => {
    if(CPFData && imageData) {
      let formatCPF = CPFData.replace(/[.-]/g, '')
      let formatBase64 = imageData.replace(/^data:image\/[a-z]+;base64,/, '');

      const formData = {
        cpf: formatCPF,
        validacao: {
          biometria_facial: { 
            base64: formatBase64
          },
        },
        walletAddress: walletAddress,
      }

      setIsLoading(true)

      try {
        const { data } = await api.post("/validation", formData, {
          headers: { "Content-Type": "application/json" },
        });

        setData(data);
        setProbabilityText(data?.biometryResult?.probability);
        setPercentageValue(data ? Math.round(data?.biometryResult?.similarity * 100) : 0);
        setImageData(imageData);
  
      } catch (error: any) {
        setError(error.response.data.error.message);
        setErrorMessage(error.response.data.error.userMessage);
      } finally {
        setIsLoading(false)
      }
    }
  }

  const closeWebcam = () => {
    setIsModalOpen(false)
  }

  return (
    <div className="min-h-screen md:grid md:grid-cols-app dark:bg-zinc-900">
      <Sidebar />

      { data && percentageValue && probabilityText ? <Result percentageValue={percentageValue} probabilityText={probabilityText} userImage={imageData} CPF={CPFData} /> : <main className="mt-28 md:mt-0 px-8 pb-12 pt-8">
        <h1 className="text-3xl font-medium dark:text-zinc-100">Validação</h1>

        <div className="mt-5 flex items-center justify-between border-t border-b dark:border-zinc-800">
          <div className="pt-8 pb-5 space-y-1">
            <h2 className="text-lg font-medium dark:text-zinc-100">Informações pessoais</h2>
            <span className="text-sm dark:text-zinc-400">Valide seus dados.</span>
          </div>
        </div>

        <div className="mt-5 pb-5 flex w-full flex-col gap-5 border-b dark:border-zinc-800">
          <div className="flex flex-col md:grid grid-cols-input gap-3">
            <label htmlFor="walletAddress" className="text-sm font-medium dark:text-zinc-300">CPF</label>
            <div className="flex items-center gap-3">
              <Input icon={<IdCard className="h-5 w-5 dark:text-zinc-500" />} placeholder="123.456.789-10" type="cpf" value={CPFData} onChange={(value) => setCPFData(value)} />
            </div>
          </div>
        </div>

        <div className="mt-5 pb-5 flex w-full flex-col gap-5 border-b dark:border-zinc-800">
          <div className="flex flex-col md:grid grid-cols-input gap-3">
            <label htmlFor="walletAddress" className="text-sm font-medium dark:text-zinc-300">Foto</label>
            <div className="flex border rounded-lg h-44 shadow-sm dark:border-zinc-700 dark:bg-zinc-800">
              <div className="flex justify-center items-center w-2/5 md:w-1/4 border-r dark:border-zinc-700">
                {imageData ? (
                  <img
                    src={imageData}
                    alt="Captura da Webcam"
                    className="w-full h-full object-cover rounded-l-lg"
                  />
                  ) : (<User className="w-8 h-8 dark:text-zinc-500"/>)
                }
              </div>

              <div className="flex flex-col justify-between w-3/4 p-4">
                <p className="text-sm md:text-base">
                  Capture uma imagem do seu rosto para realizar o reconhecimento facial.
                </p>

                <div className="flex justify-end">
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="px-4 py-3 rounded-md text-base font-semibold outline-none border shadow-sm dark:text-zinc-100 dark:bg-blue-500 dark:hover:bg-blue-600 dark:border-blue-500 dark:hover:border-blue-600"
                  >
                    {imageData ? "Alterar foto" : "Capturar foto"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex justify-end mt-5 pb-5 border-b dark:border-zinc-800">
          {isLoading ? <Loading /> : <button
            onClick={handleSendKYC}
            className="px-4 py-3 rounded-md text-base font-semibold outline-none border shadow-sm dark:text-zinc-100 dark:bg-blue-500 dark:hover:bg-blue-600 dark:border-blue-500 dark:hover:border-blue-600"
          >
            Fazer validação
          </button>}
        </div>

        {error && errorMessage && (
          <div className="flex flex-col gap-4 mt-5 text-red-500 dark:bg-red-900/20 p-3 rounded">
            <p>
              {error}
            </p>
            
            <p>
              {errorMessage}
            </p>
          </div>
        )}

        <Modal isOpen={isModalOpen} onClose={closeWebcam}>
          <WebcamCapture onCapture={handleImageCapture} onClose={closeWebcam}/>
        </Modal>

      </main>}
    </div>
  );
};
