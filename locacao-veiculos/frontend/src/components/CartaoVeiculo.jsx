import { useState } from 'react';
import api, { mensagemDeErro } from '../services/api.js';
import { fimDoDia, hojeISO, moeda } from '../services/formatar.js';

export default function CartaoVeiculo({ veiculo, aoMudar, aoErro, aoSucesso }) {
  const [alugando, setAlugando] = useState(false);
  const [dataDevolucao, setDataDevolucao] = useState('');
  const [enviando, setEnviando] = useState(false);
  const disponivel = veiculo.status === 'DISPONIVEL';

  async function confirmarLocacao(evento) {
    evento.preventDefault();
    setEnviando(true);
    try {
      await api.post('/locacoes', {
        veiculoId: veiculo.id,
        dataPrevistaDevolucao: fimDoDia(dataDevolucao),
      });
      setAlugando(false);
      setDataDevolucao('');
      aoSucesso(`${veiculo.marca} ${veiculo.modelo} alugado com sucesso`);
      aoMudar();
    } catch (e) {
      aoErro(mensagemDeErro(e));
    } finally {
      setEnviando(false);
    }
  }

  async function remover() {
    if (!window.confirm(`Remover ${veiculo.marca} ${veiculo.modelo}?`)) {
      return;
    }
    try {
      await api.delete(`/veiculos/${veiculo.id}`);
      aoSucesso('Veículo removido');
      aoMudar();
    } catch (e) {
      aoErro(mensagemDeErro(e));
    }
  }

  return (
    <article className="cartao veiculo">
      <div className="veiculo-topo">
        <h3>
          {veiculo.marca} {veiculo.modelo}
        </h3>
        <span className={`selo ${disponivel ? 'selo-ok' : 'selo-alugado'}`}>
          {disponivel ? 'Disponível' : 'Alugado'}
        </span>
      </div>
      <p className="detalhes">
        {veiculo.ano} • {veiculo.cor} • {veiculo.placa}
      </p>
      <p className="preco">
        {moeda(veiculo.valorDiaria)} <small>/ dia</small>
      </p>

      {alugando ? (
        <form onSubmit={confirmarLocacao} className="form-inline">
          <label>
            Devolução prevista
            <input
              type="date"
              min={hojeISO()}
              value={dataDevolucao}
              onChange={(e) => setDataDevolucao(e.target.value)}
              required
            />
          </label>
          <div className="acoes">
            <button className="botao" disabled={enviando}>
              Confirmar
            </button>
            <button type="button" className="botao botao-claro" onClick={() => setAlugando(false)}>
              Cancelar
            </button>
          </div>
        </form>
      ) : (
        <div className="acoes">
          <button className="botao" disabled={!disponivel} onClick={() => setAlugando(true)}>
            Alugar
          </button>
          <button className="botao botao-perigo" onClick={remover}>
            Remover
          </button>
        </div>
      )}
    </article>
  );
}
