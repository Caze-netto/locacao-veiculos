import { useCallback, useEffect, useState } from 'react';
import api, { mensagemDeErro } from '../services/api.js';
import { data, moeda } from '../services/formatar.js';

export default function Locacoes() {
  const [locacoes, setLocacoes] = useState([]);
  const [filtro, setFiltro] = useState('');
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');

  const carregar = useCallback(async () => {
    setCarregando(true);
    try {
      const params = filtro ? { status: filtro } : {};
      const resposta = await api.get('/locacoes', { params });
      setLocacoes(resposta.data);
    } catch (e) {
      setErro(mensagemDeErro(e));
    } finally {
      setCarregando(false);
    }
  }, [filtro]);

  useEffect(() => {
    carregar();
  }, [carregar]);

  async function devolver(locacao) {
    setErro('');
    setSucesso('');
    try {
      const resposta = await api.patch(`/locacoes/${locacao.id}/devolucao`);
      setSucesso(`Devolução registrada. Total a pagar: ${moeda(resposta.data.valorTotal)}`);
      carregar();
    } catch (e) {
      setErro(mensagemDeErro(e));
    }
  }

  return (
    <section>
      <div className="titulo-pagina">
        <h1>Minhas locações</h1>
        <select value={filtro} onChange={(e) => setFiltro(e.target.value)}>
          <option value="">Todas</option>
          <option value="ATIVA">Ativas</option>
          <option value="FINALIZADA">Finalizadas</option>
        </select>
      </div>

      {erro && <p className="alerta alerta-erro">{erro}</p>}
      {sucesso && <p className="alerta alerta-ok">{sucesso}</p>}

      {carregando ? (
        <p>Carregando...</p>
      ) : locacoes.length === 0 ? (
        <p className="vazio">Nenhuma locação registrada.</p>
      ) : (
        <div className="cartao tabela-wrap">
          <table>
            <thead>
              <tr>
                <th>Veículo</th>
                <th>Retirada</th>
                <th>Prevista</th>
                <th>Devolução</th>
                <th>Diária</th>
                <th>Total</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {locacoes.map((locacao) => (
                <tr key={locacao.id}>
                  <td>
                    {locacao.veiculo.marca} {locacao.veiculo.modelo}
                    <br />
                    <small>{locacao.veiculo.placa}</small>
                  </td>
                  <td>{data(locacao.dataRetirada)}</td>
                  <td>{data(locacao.dataPrevistaDevolucao)}</td>
                  <td>{data(locacao.dataDevolucao)}</td>
                  <td>{moeda(locacao.valorDiaria)}</td>
                  <td>{locacao.valorTotal ? moeda(locacao.valorTotal) : '—'}</td>
                  <td>
                    <span
                      className={`selo ${locacao.status === 'ATIVA' ? 'selo-alugado' : 'selo-ok'}`}
                    >
                      {locacao.status === 'ATIVA' ? 'Ativa' : 'Finalizada'}
                    </span>
                  </td>
                  <td>
                    {locacao.status === 'ATIVA' && (
                      <button className="botao" onClick={() => devolver(locacao)}>
                        Devolver
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
