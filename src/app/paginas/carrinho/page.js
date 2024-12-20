'use client';

import { useState, useEffect } from 'react';
import Pagina2 from "@/app/components/Pagina2";
import { FaTrashAlt, FaShippingFast } from 'react-icons/fa'; // Ícones para aumentar/diminuir/remover
import Link from 'next/link';
import { FaCcMastercard, FaCcVisa } from 'react-icons/fa'; // Mastercard e Visa
import { FaPix } from 'react-icons/fa6'; // Ícone de Pix
import { BiLogoVuejs } from 'react-icons/bi';
import { Button } from 'react-bootstrap';

export default function CarrinhoPage() {
    const [clienteLogado, setClienteLogado] = useState(null);
    const [carrinho, setCarrinho] = useState([]);
    const [mensagem, setMensagem] = useState("");
    const [showLoginModal, setShowLoginModal] = useState(false); // Controla a exibição da modal de login ou cadastro
    const [showLoginForm, setShowLoginForm] = useState(false); // Controla a exibição do formulário de login
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [loginMensagem, setLoginMensagem] = useState('');
    const [loading, setLoading] = useState(true); // Estado de carregamento

    // Verifica se o cliente está logado no localStorage
    useEffect(() => {
        const cliente = JSON.parse(localStorage.getItem('clienteLogado'));
        if (cliente) {
            setClienteLogado(cliente);  // Carrega os dados do cliente se estiver logado
            carregarCarrinho(cliente.email);  // Carrega o carrinho do cliente logado
        } else {
            setMensagem("Você precisa estar logado para acessar o carrinho.");
            setShowLoginModal(true); // Exibe a modal de login se não estiver logado
        }
        setLoading(false); // Atualiza o estado de carregamento para falso após a verificação
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

    // Função de login
    const loginCliente = () => {
        const clientes = JSON.parse(localStorage.getItem('clientes')) || [];
        const cliente = clientes.find(cliente => cliente.email === email);

        // Verifica se o cliente foi encontrado
        if (!cliente) {
            setLoginMensagem('E-mail não encontrado!');
            return;
        }

        // Verifica se a senha está correta
        if (cliente.senha !== senha) {
            setLoginMensagem('Senha incorreta!');
            return;
        }

        // Se o login for bem-sucedido
        localStorage.setItem('clienteLogado', JSON.stringify(cliente));
        setLoginMensagem('Login bem-sucedido!');

        // Atualiza o estado
        setClienteLogado(cliente);
        setShowLoginForm(false); // Fecha o formulário de login
        setShowLoginModal(false); // Fecha a modal de mensagem
        carregarCarrinho(cliente.email); // Carrega o carrinho do cliente logado
    };

    // Função para abrir a modal de login
    const abrirModalLogin = () => {
        setShowLoginModal(false); // Fecha a modal de mensagem
        setShowLoginForm(true); // Abre o formulário de login
    };

    // Se estiver carregando, não renderiza nada ainda
    if (loading) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '100vh',
                backgroundColor: 'white',
            }}>
                <BiLogoVuejs style={{
                    fontSize: '50px',
                    color: 'black',
                    animation: 'pulse 1.5s ease-in-out infinite', // Aplique a animação de pulsação inline
                    transformOrigin: 'center center',
                    animation: 'pulse 1.5s ease-in-out infinite',
                }} />
                <style>
                    {`
                    @keyframes pulse {
                        0% {
                            transform: scale(1); /* Tamanho original */
                        }
                        50% {
                            transform: scale(1.2); /* Aumenta o tamanho */
                        }
                        100% {
                            transform: scale(1); /* Retorna ao tamanho original */
                        }
                    }
                    `}
                </style>
            </div>
        );
    }

    return (
        <Pagina2 titulo="Carrinho de Compras">
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                minHeight: '100vh',
                paddingBottom: '50px',
            }}>
                <div style={{
                    display: 'flex',
                    flex: 1,
                    padding: '20px',
                    justifyContent: 'space-between',
                    minHeight: '700px',
                }}>
                    {/* Modal de Login ou Cadastro */}
                    {!clienteLogado && !showLoginForm && (
                        <div style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            backgroundColor: 'rgba(0, 0, 0, 0.6)',
                            zIndex: 1000,
                            minHeight: '100vh',
                        }}>
                            <div style={{
                                border: '1px solid white',
                                padding: '40px',
                                width: '400px',
                                margin: '50px auto', // Margem superior e inferior
                                backgroundColor: 'black',
                                borderRadius: '8px',
                                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                                color: 'white', // Para garantir que o texto seja visível
                                textAlign: 'center',
                            }}>
                                {/* Título */}
                                <h2 style={{
                                    fontFamily: 'Montserrat, sans-serif',
                                    fontWeight: '700',
                                    fontSize: '24px',
                                    marginBottom: '30px',
                                    color: 'white',
                                }}>
                                    BEM VINDO A VSTORE <BiLogoVuejs style={{ fontSize: '45px' }} />
                                </h2>

                                {/* Mensagem */}
                                <p style={{
                                    fontSize: '18px',
                                    fontWeight: 'bold',
                                    marginBottom: '20px',
                                }}>
                                    {mensagem}
                                </p>

                                {/* Botões */}
                                <div>
                                    {/* Botão de Login */}
                                    <button
                                        onClick={abrirModalLogin}
                                        style={{
                                            width: '100%',
                                            padding: '12px',
                                            backgroundColor: 'white',
                                            color: 'black',
                                            border: 'none',
                                            borderRadius: '5px',
                                            cursor: 'pointer',
                                            fontSize: '16px',
                                            fontWeight: 'bold',
                                            transition: 'background-color 0.3s ease',
                                            marginBottom: '15px',
                                        }}
                                    >
                                        FAZER LOGIN
                                    </button>

                                    {/* Botão de Cadastro */}
                                    <Link href="/paginas/cadastros">
                                        <button
                                            style={{
                                                width: '100%',
                                                padding: '12px',
                                                backgroundColor: 'black',
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: '5px',
                                                cursor: 'pointer',
                                                fontSize: '16px',
                                                fontWeight: 'bold',
                                                transition: 'background-color 0.3s ease',
                                            }}
                                        >
                                            Cadastre-se
                                        </button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    )}


                    {/* Modal de Login */}
                    {showLoginForm && (
                        <div style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            backgroundColor: 'rgba(0, 0, 0, 0.6)', // Fundo escuro para a modal
                            zIndex: 1000,
                            minHeight: '100vh', // Garantir que a modal ocupe toda a altura da tela
                        }}>
                            <div style={{
                                border: '1px solid white',
                                padding: '40px',
                                width: '400px',
                                margin: '50px auto', // Margem superior e inferior
                                backgroundColor: 'black',
                                borderRadius: '8px',
                                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                                color: 'white',
                                textAlign: 'center',
                                minHeight: 'auto',  // Ajuste a altura para se ajustar ao conteúdo
                            }}>
                                <h2 style={{
                                    fontFamily: 'Montserrat, sans-serif',
                                    fontWeight: '700',
                                    fontSize: '24px',
                                    marginBottom: '30px',
                                    color: 'white',
                                }}>
                                    BEM VINDO DE VOLTA <BiLogoVuejs style={{ fontSize: '45px' }} />
                                </h2>

                                <div style={{ marginBottom: '20px' }}>
                                    {/* Campo de Email */}
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="E-mail"
                                        style={{
                                            width: '100%',
                                            padding: '12px',
                                            marginBottom: '15px',
                                            borderRadius: '5px',
                                            border: '2px solid #333',
                                            boxSizing: 'border-box', // Para garantir que a largura fique certa
                                            fontSize: '16px'
                                        }}
                                    />
                                    {/* Campo de Senha */}
                                    <input
                                        type="password"
                                        value={senha}
                                        onChange={(e) => setSenha(e.target.value)}
                                        placeholder="Senha"
                                        style={{
                                            width: '100%',
                                            padding: '12px',
                                            marginBottom: '20px',
                                            borderRadius: '5px',
                                            border: '2px solid #333',
                                            boxSizing: 'border-box',
                                            fontSize: '16px'
                                        }}
                                    />
                                </div>

                                {/* Mensagem de erro ou sucesso */}
                                <div style={{ minHeight: '30px' }}>
                                    {loginMensagem && ( // Verifique o valor da variável de estado loginMensagem
                                        <p style={{
                                            textAlign: 'center',
                                            color: 'red',
                                            marginTop: '15px',
                                            fontSize: '14px',
                                            fontWeight: 'bold'
                                        }}>
                                            {loginMensagem}  {/* Exibe a mensagem */}
                                        </p>
                                    )}
                                </div>

                                {/* Botão de Login */}
                                <button
                                    onClick={loginCliente}
                                    style={{
                                        width: '100%',
                                        padding: '12px',
                                        backgroundColor: '#007bff',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '5px',
                                        cursor: 'pointer',
                                        fontSize: '16px',
                                        fontWeight: 'bold',
                                        transition: 'background-color 0.3s ease'
                                    }}
                                >
                                    ENTRAR
                                </button>

                                {/* Botão de Cadastro */}
                                <div style={{ marginTop: '20px' }}>
                                    <p style={{ fontSize: '14px', color: 'white' }}>
                                        Não tem conta?
                                        <Link href="/paginas/cadastros" style={{
                                            color: '#28a745',
                                            textDecoration: 'none',
                                            fontWeight: 'bold'
                                        }}> Cadastre-se
                                        </Link>
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}


                    {/* Lado esquerdo - Itens do Carrinho */}
                    {clienteLogado && (
                        <div style={{
                            width: '60%',
                            marginLeft: '5%',
                            minHeight: '700px',
                            backgroundColor: '#f5f5f5',  // Fundo cinza
                            padding: '20px',  // Adicionando algum espaçamento interno
                            borderRadius: '8px',
                            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',  // Sombra para dar um destaque
                        }}>
                            <h1 style={{
                                fontFamily: 'Poppins, sans-serif',
                                fontWeight: '900',
                                fontSize: '30px',
                                marginBottom: '35px',
                                marginLeft: '0'  // Alinhando o título à esquerda
                            }}>
                                CARRINHO
                            </h1>

                            {/* Mensagem de carrinho vazio */}
                            {carrinho.length === 0 ? (
                                <>
                                    <h1 style={{
                                        fontFamily: 'Poppins, sans-serif',
                                        fontWeight: '900',
                                        fontSize: '28px',
                                        marginBottom: '5px',
                                        marginLeft: '0'  // Alinhando o título à esquerda
                                    }}>
                                        SEU CARRINHO ESTÁ VAZIO!
                                    </h1>
                                    <p style={{ fontSize: '16px', color: 'BLACK', marginLeft: '0' }}>  {/* Ajustando o texto à esquerda */}
                                        Mas veja, ainda dá tempo de corrigir isso.
                                    </p>
                                    <Button
                                        href="/paginas/produtos"
                                        style={{
                                            padding: '10px 20px',
                                            fontSize: '16px',
                                            backgroundColor: '#000',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '5px',
                                            cursor: 'pointer',
                                            fontWeight: 'bold',
                                            textDecoration: 'none',
                                            marginLeft: '0'  // Alinhando o botão à esquerda
                                        }}
                                    >
                                        Ver produtos
                                    </Button>
                                </>
                            ) : (
                                <ul style={{ listStyleType: 'none', padding: 0 }}>
                                    {carrinho.map(item => (
                                        <li key={item.id}
                                            style={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                border: '1px solid black',
                                                padding: '20px',
                                                marginBottom: '20px',
                                                borderRadius: '8px',
                                                minHeight: '120px',
                                                alignItems: 'center',
                                                backgroundColor:'white'
                                            }}
                                        >
                                            <div style={{ display: 'flex', alignItems: 'center', width: '70%' }}>
                                                <img src={item.imagem} alt={item.nome} style={{
                                                    width: '80px', height: '80px', objectFit: 'contain', marginRight: '15px'
                                                }} />
                                                <div>
                                                    <h5 style={{
                                                        margin: '0', fontSize: '18px', fontWeight: 'bold', marginBottom: '5px'
                                                    }}>
                                                        {item.nome}
                                                    </h5>

                                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                                        <select
                                                            value={item.quantidade}
                                                            onChange={(e) => atualizarQuantidade(item.id, parseInt(e.target.value))}
                                                            style={{
                                                                padding: '7px',
                                                                fontSize: '14px',
                                                                marginRight: '10px'
                                                            }}
                                                        >
                                                            {[...Array(100)].map((_, idx) => (
                                                                <option key={idx + 1} value={idx + 1}>{idx + 1}</option>
                                                            ))}
                                                        </select>

                                                        <button
                                                            onClick={() => removerDoCarrinho(item.id)}
                                                            style={{
                                                                backgroundColor: 'white',
                                                                color: 'black',
                                                                border: '1px solid black',
                                                                borderRadius: '5px',
                                                                padding: '6px 12px',
                                                                cursor: 'pointer'
                                                            }}
                                                        >
                                                            <FaTrashAlt style={{ marginBottom: '4px' }} />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>

                                            <div style={{ fontSize: '18px', fontWeight: 'bold' }}>
                                                R$ {(item.preco).toFixed(2)}
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    )}


                    {/* Lado direito - Resumo e Finalizar Compra */}
                    {clienteLogado && (
                        <div style={{
                            marginTop: '20px',
                            width: '28%',
                            backgroundColor: 'black',
                            padding: '20px',
                            borderRadius: '8px',
                            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                        }}>
                            {/* Quadrado do Total */}
                            <div style={{
                                backgroundColor: '#f8f9fa',
                                padding: '20px',
                                borderRadius: '8px',
                                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                            }}>
                                <h4 style={{ textAlign: 'center', fontSize: '20px', marginBottom: '10px' }}>
                                    TOTAL DO CARRINHO
                                </h4>
                                {/* Verifica se o carrinho está vazio */}
                                {carrinho.length > 0 ? (
                                    <div style={{ fontSize: '22px', fontWeight: 'bold', textAlign: 'center' }}>
                                        R$ {calcularTotal()}
                                    </div>
                                ) : (
                                    <div style={{ fontSize: '18px', textAlign: 'center', color: '#888' }}>
                                        Seu carrinho está vazio
                                    </div>
                                )}
                                <div style={{ marginTop: '20px', textAlign: 'center' }}>
                                    {carrinho.length > 0 ? (
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
                                    ) : (
                                        <button
                                            disabled
                                            style={{
                                                backgroundColor: '#ddd',
                                                color: '#888',
                                                border: 'none',
                                                borderRadius: '5px',
                                                padding: '15px 30px',
                                                cursor: 'not-allowed',
                                                fontSize: '18px',
                                                fontWeight: 'bold',
                                            }}
                                        >
                                            Finalizar Compra
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Novo Quadrado - Opções de Pagamento */}
                            <div style={{
                                backgroundColor: '#f8f9fa',
                                padding: '20px',
                                borderRadius: '8px',
                                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                                marginTop: '20px',
                            }}>
                                <h4 style={{ textAlign: 'center', fontSize: '20px', marginBottom: '20px' }}>
                                    Opções de Pagamento
                                </h4>

                                <div style={{ display: 'flex', justifyContent: 'center', gap: '15px' }}>
                                    {/* Ícones dos Cartões e Pix */}
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <FaCcMastercard style={{ fontSize: '40px', color: 'black' }} />
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <FaCcVisa style={{ fontSize: '40px', color: 'black' }} />
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <img
                                            src="https://clipground.com/images/elo-png-4.png"
                                            alt="Elo"
                                            style={{ width: '50px', height: '30px' }}
                                        />
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <FaPix style={{ fontSize: '35px', color: 'black' }} />
                                    </div>
                                </div>
                            </div>

                            {/* Novo Quadrado - Frete Grátis */}
                            <div style={{
                                backgroundColor: '#f8f9fa',
                                padding: '20px',
                                borderRadius: '8px',
                                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                                marginTop: '20px',
                            }}>
                                <h4 style={{ textAlign: 'center', fontSize: '20px', marginBottom: '20px' }}>
                                    FRETE GRÁTIS
                                </h4>
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    fontSize: '18px',
                                }}>
                                    <p style={{
                                        marginLeft: '10px',
                                        fontSize: '18px',
                                    }}>
                                        APROVEITE FRETE GRÁTIS ACIMA DE R$200,00!  <FaShippingFast style={{ fontSize: '25px', color: 'black' }} />
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </Pagina2>
    );
}
