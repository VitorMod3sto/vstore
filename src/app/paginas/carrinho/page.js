'use client'

import { useState, useEffect } from 'react';
import Pagina2 from "@/app/components/Pagina2";
import { FaTrashAlt, FaMinus, FaPlus } from 'react-icons/fa'; // Ícones para aumentar/diminuir/remover
import Link from 'next/link';

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
            setMensagem("Você precisa estar logado para acessar o carrinho.");
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
            <div style={{ padding: '10px' }}>
                {mensagem && (
                    <div 
                        style={{
                            backgroundColor: 'black',
                            color: 'white',
                            border: '1px solid #f5c6cb',
                            borderRadius: '8px',
                            padding: '20px',
                            marginBottom: '30px',
                            textAlign: 'center',
                            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                        }}
                    >
                        <p style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '20px' }}>
                            {mensagem}
                        </p>
                        <div>
                            <Link href="/paginas/login">
                                <button
                                    style={{
                                        backgroundColor: '#007bff',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '5px',
                                        padding: '12px 20px',
                                        cursor: 'pointer',
                                        fontSize: '16px',
                                        fontWeight: 'bold',
                                        marginRight: '15px',
                                        transition: 'background-color 0.3s',
                                    }}
                                    onMouseOver={(e) => e.target.style.backgroundColor = '#0056b3'}
                                    onMouseOut={(e) => e.target.style.backgroundColor = '#007bff'}
                                >
                                    Fazer Login
                                </button>
                            </Link>
                            <Link href="/paginas/cadastros">
                                <button
                                    style={{
                                        backgroundColor: '#28a745',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '5px',
                                        padding: '12px 20px',
                                        cursor: 'pointer',
                                        fontSize: '16px',
                                        fontWeight: 'bold',
                                        marginLeft: '15px',
                                        transition: 'background-color 0.3s',
                                    }}
                                    onMouseOver={(e) => e.target.style.backgroundColor = '#218838'}
                                    onMouseOut={(e) => e.target.style.backgroundColor = '#28a745'}
                                >
                                    Cadastre-se
                                </button>
                            </Link>
                        </div>
                    </div>
                )}

                {clienteLogado && carrinho.length === 0 && (
                    <p style={{ textAlign: 'center', fontSize: '18px' }}>O carrinho está vazio.</p>
                )}

                {clienteLogado && carrinho.length > 0 && (
                    <>
                        <h2 style={{ textAlign: 'center', fontFamily: 'Montserrat, sans-serif', fontWeight: '900' }}>
                            Carrinho de Compras
                        </h2>
                        <ul style={{ listStyleType: 'none', padding: 0 }}>
                            {carrinho.map(item => (
                                <li key={item.id} style={{ borderBottom: '1px solid #ddd', padding: '15px 0', display: 'flex', justifyContent: 'space-between' }}>
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <img src={item.imagem} alt={item.nome} style={{ width: '70px', height: '70px', objectFit: 'contain', marginRight: '15px' }} />
                                        <div>
                                            <h5 style={{ margin: '0', fontSize: '18px', fontWeight: 'bold' }}>{item.nome}</h5>
                                            <p style={{ margin: '5px 0', fontSize: '16px' }}>R$ {item.preco.toFixed(2)}</p>
                                            <p style={{ margin: '0', fontSize: '16px' }}>Quantidade: {item.quantidade}</p>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <button
                                            onClick={() => atualizarQuantidade(item.id, item.quantidade - 1)}
                                            disabled={item.quantidade <= 1}
                                            style={{ backgroundColor: 'black', color: 'white', border: 'none', borderRadius: '5px', padding: '8px 12px', cursor: 'pointer', marginLeft: '10px', fontSize: '16px' }}
                                        >
                                            <FaMinus />
                                        </button>
                                        <button
                                            onClick={() => atualizarQuantidade(item.id, item.quantidade + 1)}
                                            style={{ backgroundColor: 'black', color: 'white', border: 'none', borderRadius: '5px', padding: '8px 12px', cursor: 'pointer', marginLeft: '10px', fontSize: '16px' }}
                                        >
                                            <FaPlus />
                                        </button>
                                        <button
                                            onClick={() => removerDoCarrinho(item.id)}
                                            style={{ backgroundColor: 'black', color: 'white', border: 'none', borderRadius: '5px', padding: '8px 12px', cursor: 'pointer', marginLeft: '10px', fontSize: '16px' }}
                                        >
                                            <FaTrashAlt />
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>

                        <h4 style={{ textAlign: 'center', fontSize: '20px', marginTop: '20px' }}>Total: R$ {calcularTotal()}</h4>

                        <div style={{ textAlign: 'center', marginTop: '30px' }}>
                            <Link href="/paginas/checkout">
                                <button
                                    style={{
                                        backgroundColor: '#28a745',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '5px',
                                        padding: '15px 30px',
                                        cursor: 'pointer',
                                        fontSize: '18px',
                                        fontWeight: 'bold',
                                    }}
                                >
                                    Finalizar Compra
                                </button>
                            </Link>
                        </div>
                    </>
                )}
            </div>
        </Pagina2>
    );
}