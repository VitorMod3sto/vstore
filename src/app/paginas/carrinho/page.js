'use client'
import { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap'; 
import Pagina2 from "@/app/components/Pagina2";  // Suponho que essa seja sua estrutura

export default function CarrinhoPage() {
    const [clienteLogado, setClienteLogado] = useState(null);
    const [carrinho, setCarrinho] = useState([]);
    const [mensagem, setMensagem] = useState("");

    // Verifica se o cliente está logado no localStorage
    useEffect(() => {
        const cliente = JSON.parse(localStorage.getItem('clienteLogado'));
        if (cliente) {
            setClienteLogado(cliente);
            carregarCarrinho(cliente.email);  // Carrega o carrinho do cliente logado
        } else {
            setMensagem("Você precisa fazer login para ver o carrinho.");
        }
    }, []);

    // Carrega o carrinho do cliente, se existir
    const carregarCarrinho = (email) => {
        const carrinhos = JSON.parse(localStorage.getItem('carrinhos')) || [];
        const carrinhoDoCliente = carrinhos.find(c => c.email === email);
        if (carrinhoDoCliente) {
            setCarrinho(carrinhoDoCliente.itens);
        } else {
            setCarrinho([]);
        }
    };

    // Atualiza a quantidade de um item no carrinho
    const atualizarQuantidade = (id, quantidade) => {
        const novoCarrinho = carrinho.map(item => {
            if (item.id === id) {
                return { ...item, quantidade };
            }
            return item;
        });

        // Atualiza no localStorage
        const carrinhos = JSON.parse(localStorage.getItem('carrinhos')) || [];
        const carrinhoDoCliente = carrinhos.find(c => c.email === clienteLogado.email);
        if (carrinhoDoCliente) {
            carrinhoDoCliente.itens = novoCarrinho;
            localStorage.setItem('carrinhos', JSON.stringify(carrinhos));
            setCarrinho(novoCarrinho);
        }
    };

    // Remove um item do carrinho
    const removerDoCarrinho = (id) => {
        const novoCarrinho = carrinho.filter(item => item.id !== id);

        // Atualiza no localStorage
        const carrinhos = JSON.parse(localStorage.getItem('carrinhos')) || [];
        const carrinhoDoCliente = carrinhos.find(c => c.email === clienteLogado.email);
        if (carrinhoDoCliente) {
            carrinhoDoCliente.itens = novoCarrinho;
            localStorage.setItem('carrinhos', JSON.stringify(carrinhos));
            setCarrinho(novoCarrinho);
        }
    };

    // Função para calcular o total do carrinho
    const calcularTotal = () => {
        return carrinho.reduce((total, item) => total + item.preco * item.quantidade, 0).toFixed(2);
    };

    return (
        <Pagina2 titulo="Carrinho de Compras">
            <div style={{ padding: '20px' }}>
                {mensagem && <p style={{ color: 'red' }}>{mensagem}</p>}
                {carrinho.length === 0 ? (
                    <p>Seu carrinho está vazio.</p>
                ) : (
                    <>
                        <h4>Itens no Carrinho</h4>
                        <ul style={{ listStyleType: 'none', padding: 0 }}>
                            {carrinho.map(item => (
                                <li key={item.id} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                                    <img src={item.imagem} alt={item.nome} style={{ width: '50px', height: '50px', objectFit: 'contain', marginRight: '10px' }} />
                                    <span style={{ flex: '1' }}>
                                        {item.nome} - R$ {item.preco.toFixed(2)} (x{item.quantidade})
                                    </span>
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <button
                                            onClick={() => atualizarQuantidade(item.id, item.quantidade - 1)}
                                            disabled={item.quantidade <= 1}
                                            style={{ padding: '5px 10px', marginRight: '5px' }}
                                        >
                                            - 
                                        </button>
                                        <button
                                            onClick={() => atualizarQuantidade(item.id, item.quantidade + 1)}
                                            style={{ padding: '5px 10px', marginRight: '5px' }}
                                        >
                                            + 
                                        </button>
                                        <button
                                            onClick={() => removerDoCarrinho(item.id)}
                                            style={{ padding: '5px 10px', backgroundColor: 'red', color: 'white' }}
                                        >
                                            Remover
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>

                        <h4>Total: R$ {calcularTotal()}</h4>

                        <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between' }}>
                            <Button variant="secondary" onClick={() => window.location.href = '/paginas/home'}>
                                Continuar Comprando
                            </Button>
                            <Button variant="primary" onClick={() => alert('Ir para a finalização da compra')}>
                                Finalizar Compra
                            </Button>
                        </div>
                    </>
                )}
            </div>
        </Pagina2>
    );
}

