import { useEffect, useState } from "react";
import "./App.css";

const moeda = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

function App() {
  const [statusApi, setStatusApi] = useState(null);
  const [eventos, setEventos] = useState([]);
  const [eventoSelecionado, setEventoSelecionado] = useState(null);
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(true);
  const [buscandoDetalhes, setBuscandoDetalhes] = useState(false);

  // Consulta o status da API e os eventos ao abrir a página.
  useEffect(() => {
    const controller = new AbortController();

    async function carregarDados() {
      try {
        const respostaStatus = await fetch("/api/status", {
          signal: controller.signal,
        });

        if (!respostaStatus.ok) {
          throw new Error(
            `Erro ao consultar o status da API (HTTP ${respostaStatus.status}).`
          );
        }

        const dadosStatus = await respostaStatus.json();

        if (controller.signal.aborted) return;
        setStatusApi(dadosStatus);

        const respostaEventos = await fetch("/api/eventos", {
          signal: controller.signal,
        });

        if (!respostaEventos.ok) {
          throw new Error(
            `Erro ao consultar os eventos (HTTP ${respostaEventos.status}).`
          );
        }

        const dadosEventos = await respostaEventos.json();

        if (!Array.isArray(dadosEventos)) {
          throw new Error("A API não retornou uma lista de eventos válida.");
        }

        if (controller.signal.aborted) return;
        setEventos(dadosEventos);
      } catch (error) {
        if (!controller.signal.aborted) {
          setErro(error.message);
        }
      } finally {
        if (!controller.signal.aborted) {
          setCarregando(false);
        }
      }
    }

    carregarDados();

    // Cancela as requisições se o componente for desmontado.
    return () => controller.abort();
  }, []);

  // Consulta os detalhes de um evento pelo ID.
  async function buscarEvento(id) {
    setErro("");
    setEventoSelecionado(null);
    setBuscandoDetalhes(true);

    try {
      const resposta = await fetch(
        `/api/eventos/${encodeURIComponent(id)}`
      );

      if (!resposta.ok) {
        throw new Error(
          resposta.status === 404
            ? "Evento não encontrado."
            : `Erro ao consultar o evento (HTTP ${resposta.status}).`
        );
      }

      const dados = await resposta.json();
      setEventoSelecionado(dados);
    } catch (error) {
      setErro(error.message);
    } finally {
      setBuscandoDetalhes(false);
    }
  }

  return (
    <div className="pagina">
      <header className="cabecalho">
        <h1>VIO WEB</h1>
        <p>Venda de Ingressos Online</p>
      </header>

      <main className="conteudo">
        <section className="card">
          <h2>Status da API</h2>

          <p>
            Back-end:{" "}
            {statusApi?.status ||
              (carregando ? "Consultando..." : "Indisponível")}
          </p>

          <p>{statusApi?.mensagem}</p>
        </section>

        {erro && (
          <p className="erro" role="alert">
            {erro}
          </p>
        )}

        <section className="card">
          <h2>Eventos disponíveis</h2>

          {carregando && <p>Carregando eventos...</p>}

          {!carregando && !erro && eventos.length === 0 && (
            <p>Nenhum evento cadastrado.</p>
          )}

          {eventos.map((evento) => (
            <div key={evento.id}>
              <h3>{evento.nome}</h3>
              <p>Local: {evento.local}</p>
              <p>Data: {evento.data}</p>
              <p>Preço: {moeda.format(evento.preco)}</p>

              <button
                type="button"
                onClick={() => buscarEvento(evento.id)}
                disabled={buscandoDetalhes}
              >
                Ver detalhes
              </button>

              <hr />
            </div>
          ))}
        </section>

        {buscandoDetalhes && (
          <p role="status">Carregando detalhes do evento...</p>
        )}

        {eventoSelecionado && (
          <section className="card">
            <h2>Detalhes do evento</h2>

            <h3>{eventoSelecionado.nome}</h3>
            <p>{eventoSelecionado.descricao}</p>
            <p>Local: {eventoSelecionado.local}</p>
            <p>Data: {eventoSelecionado.data}</p>
            <p>Preço: {moeda.format(eventoSelecionado.preco)}</p>
          </section>
        )}
      </main>
    </div>
  );
}

export default App;