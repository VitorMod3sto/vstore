'use client';

import { useState, useEffect } from 'react';
import Pagina2 from "@/app/components/Pagina2";
import { Button } from 'react-bootstrap';
import { BiLogoVuejs } from 'react-icons/bi';
import Link from 'next/link';

export default function Compras() {
    const [pedidos, setPedidos] = useState([]);
    const [pedidoSelecionado, setPedidoSelecionado] = useState(null);
    const [desconto, setDesconto] = useState(0);
    const [clienteLogado, setClienteLogado] = useState(null);
    const [mensagem, setMensagem] = useState("");
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [showLoginForm, setShowLoginForm] = useState(false);
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [loginMensagem, setLoginMensagem] = useState('');
    const [loading, setLoading] = useState(true); // Estado de carregamento


    useEffect(() => {
        const clienteLogado = JSON.parse(localStorage.getItem('clienteLogado'));
        const pedidosCliente = JSON.parse(localStorage.getItem('pedidos')) || [];
        const pedidosProdutos = JSON.parse(localStorage.getItem('pedidosProdutos')) || []; // Adicionado

        if (clienteLogado) {
            const pedidosDoCliente = pedidosCliente.filter(pedido => pedido.cliente === clienteLogado.email);
            const produtosDoCliente = pedidosProdutos.filter(pedido => pedido.cliente === clienteLogado.email); // Filtrar por cliente
            setPedidos([...pedidosDoCliente, ...produtosDoCliente]); // Combinar listas
            setClienteLogado(clienteLogado);
            setLoading(false);
        } else {
            setMensagem("Você precisa estar logado para acessar os pedidos.");
            setShowLoginModal(true);
            setLoading(false);
        }
    }, []);


    const verDetalhesPedido = (pedido) => {
        if (pedido.itens) {
            // Pedido normal com múltiplos itens
            setPedidoSelecionado(pedido);
        } else {
            // Pedido único de `pedidosProdutos`
            const pedidoProduto = {
                id: pedido.id,
                cliente: pedido.cliente,
                itens: [{
                    nome: pedido.produto.nome,
                    preco: pedido.produto.preco,
                    imagem: pedido.produto.imagem,
                    quantidade: 1,
                }],
                total: pedido.total,
                data: pedido.data,
                metodoPagamento: pedido.metodoPagamento,
                parcelas: pedido.parcelas || 1, // Adiciona o número de parcelas ao objeto
            };
            setPedidoSelecionado(pedidoProduto);
        }
    };
    


    const calcularTotal = () => {
        if (!pedidoSelecionado) return 0;
        let total = parseFloat(pedidoSelecionado.total);
        if (desconto > 0) {
            total = total - (total * (desconto / 100));
        }
        return total + calcularFrete();
    };

    const calcularFrete = () => {
        return pedidoSelecionado && parseFloat(pedidoSelecionado.total) >= 250 ? 0 : 20.00;
    };

    const loginCliente = () => {
        const clientes = JSON.parse(localStorage.getItem('clientes')) || [];
        const cliente = clientes.find(cliente => cliente.email === email);

        if (!cliente) {
            setLoginMensagem('E-mail não encontrado!');
            return;
        }

        if (cliente.senha !== senha) {
            setLoginMensagem('Senha incorreta!');
            return;
        }

        localStorage.setItem('clienteLogado', JSON.stringify(cliente));
        setLoginMensagem('Login bem-sucedido!');
        setClienteLogado(cliente);
        setShowLoginForm(false);
        setShowLoginModal(false);
    };

    const abrirModalLogin = () => {
        setShowLoginModal(false);
        setShowLoginForm(true);
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
        <Pagina2 titulo="Meus Pedidos">
            {/* Define a altura mínima para o conteúdo da página */}
            <div style={{
                minHeight: showLoginModal || showLoginForm ? 'calc(100vh - 80px)' : 'auto', // Se a modal estiver aberta, define a altura mínima
                transition: 'min-height 0.3s ease-in-out', // Animação suave para a mudança de altura
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
                                BEM VINDO A VSTORE <BiLogoVuejs style={{ fontSize: '45px' }} />
                            </h2>

                            <p style={{
                                fontSize: '18px',
                                fontWeight: 'bold',
                                marginBottom: '20px',
                            }}>
                                {mensagem}
                            </p>

                            <div>
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

                {/* Conteúdo da página apenas se o cliente estiver logado */}
                {clienteLogado && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '20px' }}>
                        <div style={{
                            width: '60%',
                            padding: '15px',
                            backgroundColor: '#f5f5f5',
                            borderRadius: '8px',
                            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                            margin: '0 auto',
                            maxWidth: '800px',
                        }}>
                            <h3 style={{
                                fontFamily: 'Poppins, sans-serif',
                                fontWeight: '900',
                                fontSize: '28px',
                                marginBottom: '5px',
                                marginTop: '-10px',
                                marginLeft: '30px'
                            }}>
                                MEUS PEDIDOS
                            </h3>

                            {pedidos.length === 0 ? (
                                <div style={{ padding: '20px', textAlign: 'left' }}>
                                    <h1 style={{
                                        fontFamily: 'Poppins, sans-serif',
                                        fontWeight: '900',
                                        fontSize: '28px',
                                        marginBottom: '5px',
                                        marginLeft: '25px',
                                        marginTop: '05px',
                                    }}>
                                        VOCÊ AINDA NÃO FEZ NENHUM PEDIDO!
                                    </h1>
                                    <p style={{ fontSize: '16px', color: 'BLACK', marginLeft: '25px' }}>
                                        Mas não se preocupe, ainda dá tempo de corrigir isso.
                                    </p>
                                    <Button
                                        href="/paginas/carrinho"
                                        style={{
                                            marginTop: '20px',
                                            padding: '10px 20px',
                                            fontSize: '16px',
                                            backgroundColor: '#000',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '5px',
                                            cursor: 'pointer',
                                            fontWeight: 'bold',
                                            textDecoration: 'none',
                                            marginLeft: '25px'
                                        }}
                                    >
                                        Ir para o Carrinho
                                    </Button>
                                </div>
                            ) : (
                                pedidos.map((pedido) => (
                                    <div key={pedido.id} style={{
                                        marginBottom: '25px',
                                        padding: '10px',
                                        border: '3px solid #ddd',
                                        borderRadius: '8px',
                                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                                        margin: '0 auto',
                                        maxWidth: '720px',
                                        backgroundColor: 'white'
                                    }}>
                                        <h5>ID do Pedido: {pedido.id}</h5>
                                        <p><strong>Data:</strong> {pedido.data}</p>
                                        <p><strong>Total:</strong> R$ {parseFloat(pedido.total).toFixed(2)}</p>
                                        <Button
                                            onClick={() => verDetalhesPedido(pedido)}
                                            style={{
                                                backgroundColor: 'black',
                                                color: 'white',
                                                border: 'none',
                                                padding: '10px 20px',
                                                borderRadius: '5px',
                                                cursor: 'pointer',
                                            }}
                                        >
                                            Ver Detalhes
                                        </Button>
                                    </div>
                                ))
                            )}

                        </div>

                        <div style={{
                            width: '35%',
                            padding: '20px',
                            backgroundColor: 'black',
                            color: 'white',
                            borderRadius: '8px',
                            height: '570px',
                            position: 'relative',
                            overflow: 'auto',
                            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                        }}>
                            <h4 style={{
                                fontFamily: 'Poppins, sans-serif',
                                fontWeight: '900',
                                fontSize: '28px',
                                position: 'sticky',
                                top: '0',
                                backgroundColor: 'black',
                                paddingRight: '10px',
                                zIndex: 1,
                            }}>RESUMO DO PEDIDO</h4>
                            {pedidoSelecionado && (
                                <div style={{
                                    overflowY: 'auto',
                                    maxHeight: 'calc(100% - 50px)',
                                }}>
                                    <div style={{ marginBottom: '15px' }}>
                                        <p><strong>ID do Pedido:</strong> {pedidoSelecionado.id}</p>
                                        <p><strong>Data:</strong> {pedidoSelecionado.data}</p>
                                        <p><strong>Total:</strong> R$ {parseFloat(pedidoSelecionado.total).toFixed(2)}</p>
                                    </div>
                                    <h5>Itens do Pedido:</h5>
                                    <div style={{
                                        marginBottom: '15px',
                                        paddingLeft: '20px',
                                    }}>
                                        {pedidoSelecionado.itens.map((item, index) => (
                                            <div key={index} style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                marginBottom: '10px',
                                                borderBottom: '1px solid #ddd',
                                                paddingBottom: '10px',
                                            }}>
                                                <img
                                                    src={item.imagem || 'https://via.placeholder.com/50'}
                                                    alt={item.nome}
                                                    style={{
                                                        width: '50px',
                                                        height: '50px',
                                                        borderRadius: '5px',
                                                        marginRight: '10px',
                                                    }}
                                                />
                                                <div style={{ flex: 1 }}>
                                                    <p style={{ margin: 0, fontWeight: 'bold' }}>{item.nome}</p>
                                                    <p style={{ fontSize: '12px', color: '#ccc', margin: '5px 0' }}>Quantidade: {item.quantidade}</p>
                                                </div>
                                                <p style={{ fontWeight: 'bold', marginRight: '05px', marginTop: '15px' }}>R$ {item.preco.toFixed(2)}</p>
                                            </div>
                                        ))}
                                    </div>

                                    <div style={{ marginTop: '20px' }}>
                                        <p><strong>Frete:</strong> R$ {calcularFrete().toFixed(2)}</p>
                                        <p><strong>Total:</strong> R$ {calcularTotal().toFixed(2)}</p>
                                        <p><strong>Forma de Pagamento:</strong> {pedidoSelecionado.metodoPagamento}</p>

                                        {/* Exibir informações de parcelamento, se aplicável */}
                                        {pedidoSelecionado.metodoPagamento === 'Cartão' && pedidoSelecionado.parcelas > 1 && (
                                            <p style={{ fontSize: '16px', fontWeight: 'bold', marginTop: '10px', color: '#555' }}>
                                                Parcelado em {pedidoSelecionado.parcelas}x de R$ {(pedidoSelecionado.total / pedidoSelecionado.parcelas).toFixed(2)}
                                            </p>
                                        )}

                                        <div style={{ display: 'flex', alignItems: 'center', marginTop: '15px' }}>
                                            <span style={{
                                                width: '10px',
                                                height: '10px',
                                                marginBottom:'15px'
,                                                backgroundColor: 'green',
                                                borderRadius: '50%',
                                                marginRight: '5px',
                                                animation: 'pulse 1.5s infinite',
                                            }}></span>
                                            <p><strong>Status:</strong> {pedidoSelecionado.status || 'Aguardando para envio'}</p>
                                        </div>
                                    </div>

                                </div>
                            )}
                        </div>

                        <style jsx>{`
    /* Estilizando a barra de rolagem para navegadores WebKit */
    div::-webkit-scrollbar {
        width: 8px;  /* Largura da barra de rolagem */
    }
    
    div::-webkit-scrollbar-thumb {
        background-color: white;  /* Cor branca para a parte deslizante */
        border-radius: 4px;       /* Bordas arredondadas */
    }

    div::-webkit-scrollbar-track {
        background: transparent; /* Cor de fundo da trilha da barra */
    }

    /* Para Firefox */
    div {
        scrollbar-width: thin;
        scrollbar-color: white transparent;
    }
`}</style>

                    </div>
                )}

                <style>
                    {`
        @keyframes pulse {
            0% {
                transform: scale(1);
                opacity: 1;
            }
            50% {
                transform: scale(1.2);
                opacity: 0.7;
            }
            100% {
                transform: scale(1);
                opacity: 1;
            }
        }
    `}
                </style>

            </div>
        </Pagina2>
    );
}
