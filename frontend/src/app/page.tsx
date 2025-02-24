import HomeSvg from "@/components/HomeSvg"
import Navbar from "@/components/Navbar"
import Card from "@/components/Card"
import { CircleUser, IdCard, User } from "lucide-react"
import { Sidebar } from "@/components/Sidebar"

export default function App() {
  return (
    <>
      <Navbar />
      
      <div className="min-h-screen mt-9">
        <div className="flex flex-col lg:flex-row lg:justify-center pt-16 px-8 lg:px-0 lg:pt-32 gap-8 lg:gap-32">
          {/* Tranformar essas divs em componentes menores */}
          <div className="space-y-8 lg:space-y-14">
            <h1 className="text-xl lg:text-3xl font-semibold mt-8">KYC | Blockchain | Web3.0</h1>

            <div className="md:w-450">
              <h2>Nossa plataforma KYC foi projetada para ajudá-lo a cumprir as regulamentações, minimizar riscos e garantir transações financeiras transparentes.</h2>
            </div>

            <button className="w-42 lg:w-60 lg:h-14 px-4 py-2.5 rounded-lg text-base outline-none shadow-sm text-white dark:bg-blue-500 dark:hover:bg-blue-600">Explore nossos recursos</button>
          </div>

          <div className="flex justify-center items-center">
            <HomeSvg className="w-72 h-72 lg:w-96 lg:h-96" />
          </div>
        </div>

        <div className="flex flex-col lg:flex-row lg:justify-center mt-4 px-12 lg:px-0 lg:gap-32">
          <div className="space-y-8 lg:space-y-14">
            <h1 className="text-lg lg:text-2xl font-semibold mt-8 md:w-450">Processo simplificado</h1>

            <div className="text-sm">
              <ul className="list-disc pl-5 space-y-2">
                <li>Valida as informações de identificação emitidas pelo governo.</li>
                <li>Serve como insumo para atender às suas necessidades de KYC.</li>
                <li>Opção para validar o usuário por meio de:</li>
                <ul className="list-disc pl-10 space-y-1">
                  <li>Validação de documentos</li>
                  <li>Reconhecimento facial</li>
                </ul>
              </ul>
            </div>

          </div>

          <div className="flex justify-center items-center mt-4 md:mt-8 lg:mt-28 lg:max-w-96 gap-4">
            <Card 
              title1="VERIFICAÇÃO"
              title2="DE DOCUMENTO"
              subtitle="Fornecido documento de identidade com foto emitido pelo governo."
              svg={<IdCard className="md:w-9 md:h-9" />}
            />

            <Card 
              title1="IDENTIFICAÇÃO"
              title2="FACIAL"
              subtitle="Validação facial para garantir a identificação segura do usuário."
              svg={<CircleUser className="md:w-9 md:h-9" />}
            />
          </div>
        </div>
      </div>
    </>
  )
}
