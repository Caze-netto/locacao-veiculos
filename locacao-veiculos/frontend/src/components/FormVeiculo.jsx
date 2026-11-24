import { useState } from 'react';
import api, { mensagemDeErro } from '../services/api.js';

const vazio = { marca: '', modelo: '', ano: '', placa: '', cor: '', valorDiaria: '' };

export default function FormVeiculo({ aoCadastrar }) {
  const [campos, setCampos] = useState(vazio);
  const [erro, setErro] = useState('');
  const [enviando, setEnviando] = useState(false);

  function alterar(evento) {
    setCampos({ ...campos, [evento.target.name]: evento.target.value });
  }

  async function aoEnviar(evento) {
    evento.preventDefault();
    setErro('');
    setEnviando(true);
    try {
      await api.post('/veiculos', campos);
      setCampos(vazio);
      aoCadastrar();
    } catch (e) {
      setErro(mensagemDeErro(e));
    } finally {
      setEnviando(false);
    }
  }

  return (
    <form className="cartao grade-form" onSubmit={aoEnviar}>
      <h2>Cadastrar veículo</h2>
      {erro && <p className="alerta alerta-erro largura-total">{erro}</p>}
      <label>
        Marca
        <input name="marca" value={campos.marca} onChange={alterar} required />
      </label>
      <label>
        Modelo
        <input name="modelo" value={campos.modelo} onChange={alterar} required />
      </label>
      <label>
        Ano
        <input name="ano" type="number" value={campos.ano} onChange={alterar} required />
      </label>
      <label>
        Placa
        <input name="placa" value={campos.placa} onChange={alterar} required maxLength={8} />
      </label>
      <label>
        Cor
        <input name="cor" value={campos.cor} onChange={alterar} required />
      </label>
      <label>
        Diária (R$)
        <input
          name="valorDiaria"
          type="number"
          step="0.01"
          min="0.01"
          value={campos.valorDiaria}
          onChange={alterar}
          required
        />
      </label>
      <div className="largura-total">
        <button className="botao" disabled={enviando}>
          {enviando ? 'Salvando...' : 'Salvar veículo'}
        </button>
      </div>
    </form>
  );
}
