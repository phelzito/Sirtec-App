import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { Mail, Lock, LogIn, UserPlus, User, Calendar, Hash, Briefcase, MapPin } from 'lucide-react'

const units = [
  'São Borja',
  'São Leopoldo',
  'Fortaleza',
  'Barreiras',
  'Ibotirama',
  'Luis Eduardo Magalhães',
  'Guanambi',
  'Bom Jesus da Lapa',
  'Brumado',
  'Livramento de Nossa Senhora',
  'Vitória da Conquista',
  'Jequié',
  'Itapetinga',
  'Feira de Santana',
  'Serrinha',
  'Itaberaba',
  'Irecê'
]

export default function AuthForm() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [birthDate, setBirthDate] = useState('')
  const [registration, setRegistration] = useState('')
  const [position, setPosition] = useState('')
  const [unit, setUnit] = useState('')
  const [password, setPassword] = useState('')
  const [isLogin, setIsLogin] = useState(true)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState({ text: '', type: '' })

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage({ text: '', type: '' })

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
        setMessage({ text: 'Login realizado com sucesso! Redirecionando...', type: 'success' })
      } else {
        const { data: { user }, error } = await supabase.auth.signUp({ 
          email, 
          password,
          options: {
            data: {
              name,
              birth_date: birthDate,
              registration,
              position,
              unit
            }
          }
        })
        if (error) throw error
        setMessage({ 
          text: 'Cadastro realizado! Verifique seu email para confirmação.', 
          type: 'success' 
        })
      }
    } catch (error) {
      setMessage({
        text: error.message,
        type: 'error'
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md w-full bg-white rounded-xl shadow-lg overflow-hidden p-8">
      <div className="flex flex-col items-center mb-8">
        <div className="w-48 h-16 mb-4">
          <img 
            src="https://sirtec.com.br/wp-content/themes/sirtec/images/sirtec_logo_footer.png" 
            alt="Logo Sirtec" 
            className="w-full h-full object-contain"
          />
        </div>
        <h2 className="text-3xl font-bold text-[#b9262b]">
          {isLogin ? 'Bem-vindo de volta' : 'Criar conta'}
        </h2>
        <p className="text-[#b9262b] mt-2">
          {isLogin ? 'Faça login na sua conta' : 'Comece conosco hoje'}
        </p>
      </div>

      {message.text && (
        <div className={`mb-4 p-3 rounded-md ${message.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleAuth} className="space-y-6">
        {!isLogin && (
          <div className="space-y-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-[#b9262b]" />
              </div>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nome completo"
                className="w-full pl-10 pr-4 py-3 border border-[#b9262b]/20 rounded-lg focus:ring-2 focus:ring-[#b9262b] focus:border-[#b9262b]"
                required
              />
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Calendar className="h-5 w-5 text-[#b9262b]" />
              </div>
              <input
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                placeholder="Data de nascimento"
                className="w-full pl-10 pr-4 py-3 border border-[#b9262b]/20 rounded-lg focus:ring-2 focus:ring-[#b9262b] focus:border-[#b9262b]"
                required
              />
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Hash className="h-5 w-5 text-[#b9262b]" />
              </div>
              <input
                type="text"
                value={registration}
                onChange={(e) => setRegistration(e.target.value)}
                placeholder="Número de matrícula"
                className="w-full pl-10 pr-4 py-3 border border-[#b9262b]/20 rounded-lg focus:ring-2 focus:ring-[#b9262b] focus:border-[#b9262b]"
                required
              />
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Briefcase className="h-5 w-5 text-[#b9262b]" />
              </div>
              <input
                type="text"
                value={position}
                onChange={(e) => setPosition(e.target.value)}
                placeholder="Cargo"
                className="w-full pl-10 pr-4 py-3 border border-[#b9262b]/20 rounded-lg focus:ring-2 focus:ring-[#b9262b] focus:border-[#b9262b]"
                required
              />
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MapPin className="h-5 w-5 text-[#b9262b]" />
              </div>
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-[#b9262b]/20 rounded-lg focus:ring-2 focus:ring-[#b9262b] focus:border-[#b9262b] appearance-none"
                required
              >
                <option value="">Selecione a unidade</option>
                {units.map((unit) => (
                  <option key={unit} value={unit}>{unit}</option>
                ))}
              </select>
            </div>
          </div>
        )}

        <div className="space-y-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-[#b9262b]" />
            </div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Endereço de email"
              className="w-full pl-10 pr-4 py-3 border border-[#b9262b]/20 rounded-lg focus:ring-2 focus:ring-[#b9262b] focus:border-[#b9262b]"
              required
            />
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-[#b9262b]" />
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Senha"
              className="w-full pl-10 pr-4 py-3 border border-[#b9262b]/20 rounded-lg focus:ring-2 focus:ring-[#b9262b] focus:border-[#b9262b]"
              required
              minLength={6}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center items-center py-3 px-4 bg-[#b9262b] hover:bg-[#9e1e23] text-white font-medium rounded-lg transition duration-200"
        >
          {loading ? (
            'Processando...'
          ) : (
            <>
              {isLogin ? (
                <>
                  <LogIn className="w-5 h-5 mr-2" />
                  Entrar
                </>
              ) : (
                <>
                  <UserPlus className="w-5 h-5 mr-2" />
                  Cadastrar
                </>
              )}
            </>
          )}
        </button>
      </form>

      <div className="mt-6 text-center">
        <button
          onClick={() => setIsLogin(!isLogin)}
          className="text-[#b9262b] hover:text-[#9e1e23] font-medium"
        >
          {isLogin ? 'Precisa de uma conta? Cadastre-se' : 'Já tem uma conta? Faça login'}
        </button>
      </div>
    </div>
  )
}
