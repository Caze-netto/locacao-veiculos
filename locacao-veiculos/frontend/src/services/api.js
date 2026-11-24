import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3333',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (resposta) => resposta,
  (erro) => {
    const semSessao = erro.response?.status === 401 && !erro.config.url.startsWith('/auth/');
    if (semSessao) {
      localStorage.removeItem('token');
      localStorage.removeItem('usuario');
      window.location.href = '/login';
    }
    return Promise.reject(erro);
  }
);

export function mensagemDeErro(erro) {
  const dados = erro.response?.data;
  if (dados?.detalhes?.length) {
    return dados.detalhes.map((d) => d.mensagem).join(' • ');
  }
  return dados?.erro || 'Não foi possível conectar ao servidor';
}

export default api;
