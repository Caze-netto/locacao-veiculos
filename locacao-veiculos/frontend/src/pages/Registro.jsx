import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { mensagemDeErro } from '../services/api.js';

export default function Registro() {
  const { usuario, registrar } = useAuth();
  const navigate = useNavigate();
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [enviando, setEnviando] = useState(false);

  if (usuario) {
    return <Navigate to="/veiculos" replace />;
  }

  async function aoEnviar(evento) {
    evento.preventDefault();
    setErro('');
    setEnviando(true);
    try {
      await registrar(nome, email, senha);
      navigate('/veiculos');
    } catch (e) {
      setErro(mensagemDeErro(e));
    } finally {
      setEnviando(false);
    }
  }

  return (
    <section className="cartao formulario-centralizado">
      <h1>Criar conta</h1>
      {erro && <p className="alerta alerta-erro">{erro}</p>}
      <form onSubmit={aoEnviar}>
        <label>
          Nome
          <input value={nome} onChange={(e) => setNome(e.target.value)} required minLength={2} />
        </label>
        <label>
          E-mail
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </label>
        <label>
          Senha
          <input
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
            minLength={6}
          />
        </label>
        <button className="botao" disabled={enviando}>
          {enviando ? 'Criando...' : 'Cadastrar'}
        </button>
      </form>
      <p className="rodape-form">
        Já tem conta? <Link to="/login">Entrar</Link>
      </p>
    </section>
  );
}
