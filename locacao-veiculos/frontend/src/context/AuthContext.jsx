import { createContext, useContext, useState } from 'react';
import api from '../services/api.js';

const AuthContext = createContext(null);

function usuarioSalvo() {
  try {
    return JSON.parse(localStorage.getItem('usuario'));
  } catch (erro) {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(usuarioSalvo);

  function guardarSessao(resposta) {
    localStorage.setItem('token', resposta.token);
    localStorage.setItem('usuario', JSON.stringify(resposta.usuario));
    setUsuario(resposta.usuario);
  }

  async function entrar(email, senha) {
    const { data } = await api.post('/auth/login', { email, senha });
    guardarSessao(data);
  }

  async function registrar(nome, email, senha) {
    const { data } = await api.post('/auth/registro', { nome, email, senha });
    guardarSessao(data);
  }

  function sair() {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    setUsuario(null);
  }

  return (
    <AuthContext.Provider value={{ usuario, entrar, registrar, sair }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
