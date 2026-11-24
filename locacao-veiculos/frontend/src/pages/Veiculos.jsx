import { useCallback, useEffect, useState } from 'react';
import api, { mensagemDeErro } from '../services/api.js';
import CartaoVeiculo from '../components/CartaoVeiculo.jsx';
import FormVeiculo from '../components/FormVeiculo.jsx';

export default function Veiculos() {
  const [veiculos, setVeiculos] = useState([]);
  const [busca, setBusca] = useState('');
  const [status, setStatus] = useState('');
  const [carregando, setCarregando] = useState(true);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');

  const carregar = useCallback(async () => {
    setCarregando(true);
    try {
      const params = {};
      if (busca.trim()) {
        params.busca = busca.trim();
      }
      if (status) {
        params.status = status;
      }
      const { data } = await api.get('/veiculos', { params });
      setVeiculos(data);
    } catch (e) {
      setErro(mensagemDeErro(e));
    } finally {
      setCarregando(false);
    }
  }, [busca, status]);

  useEffect(() => {
    const espera = setTimeout(carregar, 300);
    return () => clearTimeout(espera);
  }, [carregar]);

  function mostrarErro(mensagem) {
    setSucesso('');
    setErro(mensagem);
  }

  function mostrarSucesso(mensagem) {
    setErro('');
    setSucesso(mensagem);
  }

  function aoCadastrar() {
    setMostrarForm(false);
    mostrarSucesso('Veículo cadastrado');
    carregar();
  }

  return (
    <section>
      <div className="titulo-pagina">
        <h1>Veículos</h1>
        <button className="botao" onClick={() => setMostrarForm(!mostrarForm)}>
          {mostrarForm ? 'Fechar' : 'Novo veículo'}
        </button>
      </div>

      {mostrarForm && <FormVeiculo aoCadastrar={aoCadastrar} />}

      <div className="filtros">
        <input
          placeholder="Buscar por marca, modelo ou placa"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
        />
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">Todos</option>
          <option value="DISPONIVEL">Disponíveis</option>
          <option value="ALUGADO">Alugados</option>
        </select>
      </div>

      {erro && <p className="alerta alerta-erro">{erro}</p>}
      {sucesso && <p className="alerta alerta-ok">{sucesso}</p>}

      {carregando ? (
        <p>Carregando...</p>
      ) : veiculos.length === 0 ? (
        <p className="vazio">Nenhum veículo encontrado.</p>
      ) : (
        <div className="grade-veiculos">
          {veiculos.map((veiculo) => (
            <CartaoVeiculo
              key={veiculo.id}
              veiculo={veiculo}
              aoMudar={carregar}
              aoErro={mostrarErro}
              aoSucesso={mostrarSucesso}
            />
          ))}
        </div>
      )}
    </section>
  );
}
