import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Navbar() {
  const { usuario, sair } = useAuth();
  const navigate = useNavigate();

  function aoSair() {
    sair();
    navigate('/login');
  }

  return (
    <header className="navbar">
      <div className="navbar-conteudo">
        <span className="marca">Locadora</span>
        {usuario ? (
          <nav>
            <NavLink to="/veiculos">Veículos</NavLink>
            <NavLink to="/locacoes">Minhas locações</NavLink>
            <span className="usuario">{usuario.nome}</span>
            <button className="botao botao-claro" onClick={aoSair}>
              Sair
            </button>
          </nav>
        ) : (
          <nav>
            <NavLink to="/login">Entrar</NavLink>
            <NavLink to="/registro">Cadastrar</NavLink>
          </nav>
        )}
      </div>
    </header>
  );
}
