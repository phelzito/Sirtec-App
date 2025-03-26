import { useState, useEffect } from 'react'
import { supabase } from './lib/supabase'
import AuthForm from './components/AuthForm'
import { LogOut, Home, Newspaper, FileSearch, User as UserIcon } from 'lucide-react'

function App() {
  const [session, setSession] = useState(null)
  const [activeTab, setActiveTab] = useState('home')
  const [userData, setUserData] = useState(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      if (session) fetchUserData(session.user.id)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      if (session) fetchUserData(session.user.id)
    })

    return () => subscription.unsubscribe()
  }, [])

  const fetchUserData = async (userId) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()
    
    if (!error) setUserData(data)
  }

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) console.error('Erro ao sair:', error.message)
  }

  if (!session) return <AuthForm />

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-[#b9262b] text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">Portal Sirtec</h1>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition"
          >
            <LogOut size={18} />
            Sair
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto p-4">
        {activeTab === 'home' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold text-[#b9262b] mb-6">Comunicados Importantes</h2>
            <div className="space-y-4">
              <div className="border-l-4 border-[#b9262b] pl-4 py-2">
                <h3 className="font-semibold">Atualização do sistema</h3>
                <p className="text-gray-600">O sistema será atualizado no dia 15/10 às 20h.</p>
              </div>
              <div className="border-l-4 border-[#b9262b] pl-4 py-2">
                <h3 className="font-semibold">Treinamento obrigatório</h3>
                <p className="text-gray-600">Todos os colaboradores devem completar o treinamento até 30/10.</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'news' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold text-[#b9262b] mb-6">Notícias</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="border rounded-lg overflow-hidden">
                <div className="h-40 bg-gray-200"></div>
                <div className="p-4">
                  <h3 className="font-semibold">Novo contrato fechado</h3>
                  <p className="text-gray-600 mt-2">A Sirtec fechou novo contrato com importante cliente...</p>
                </div>
              </div>
              <div className="border rounded-lg overflow-hidden">
                <div className="h-40 bg-gray-200"></div>
                <div className="p-4">
                  <h3 className="font-semibold">Evento de integração</h3>
                  <p className="text-gray-600 mt-2">Confira as fotos do nosso último evento de integração...</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'documents' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold text-[#b9262b] mb-6">Consulta de Documentos</h2>
            <div className="flex flex-col space-y-4">
              <div className="flex items-center gap-4 p-4 border rounded-lg">
                <FileSearch className="text-[#b9262b]" />
                <div>
                  <h3 className="font-semibold">Manual do Colaborador</h3>
                  <p className="text-gray-600 text-sm">Última atualização: 01/10/2023</p>
                </div>
                <button className="ml-auto bg-[#b9262b] text-white px-4 py-2 rounded hover:bg-[#9e1e23] transition">
                  Baixar
                </button>
              </div>
              <div className="flex items-center gap-4 p-4 border rounded-lg">
                <FileSearch className="text-[#b9262b]" />
                <div>
                  <h3 className="font-semibold">Regulamento Interno</h3>
                  <p className="text-gray-600 text-sm">Última atualização: 15/09/2023</p>
                </div>
                <button className="ml-auto bg-[#b9262b] text-white px-4 py-2 rounded hover:bg-[#9e1e23] transition">
                  Baixar
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'profile' && userData && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold text-[#b9262b] mb-6">Meu Perfil</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <div className="w-32 h-32 rounded-full bg-gray-200 mb-4 mx-auto overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1180&q=80" 
                    alt="Usuário" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-semibold text-center">{userData.name}</h3>
                <p className="text-gray-600 text-center">{userData.email}</p>
              </div>
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Matrícula</h4>
                  <p>{userData.registration || 'Não informado'}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Data de Nascimento</h4>
                  <p>{userData.birth_date || 'Não informado'}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Cargo</h4>
                  <p>{userData.position || 'Não informado'}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Unidade</h4>
                  <p>{userData.unit || 'Não informado'}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Bottom Navigation */}
      <nav className="bg-white border-t fixed bottom-0 left-0 right-0">
        <div className="container mx-auto flex justify-around">
          <button
            onClick={() => setActiveTab('home')}
            className={`flex flex-col items-center p-3 ${activeTab === 'home' ? 'text-[#b9262b]' : 'text-gray-500'}`}
          >
            <Home size={20} />
            <span className="text-xs mt-1">Início</span>
          </button>
          <button
            onClick={() => setActiveTab('news')}
            className={`flex flex-col items-center p-3 ${activeTab === 'news' ? 'text-[#b9262b]' : 'text-gray-500'}`}
          >
            <Newspaper size={20} />
            <span className="text-xs mt-1">Notícias</span>
          </button>
          <button
            onClick={() => setActiveTab('documents')}
            className={`flex flex-col items-center p-3 ${activeTab === 'documents' ? 'text-[#b9262b]' : 'text-gray-500'}`}
          >
            <FileSearch size={20} />
            <span className="text-xs mt-1">Documentos</span>
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex flex-col items-center p-3 ${activeTab === 'profile' ? 'text-[#b9262b]' : 'text-gray-500'}`}
          >
            <UserIcon size={20} />
            <span className="text-xs mt-1">Perfil</span>
          </button>
        </div>
      </nav>
    </div>
  )
}

export default App
