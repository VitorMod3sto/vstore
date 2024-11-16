'use client';

import React, { useState, useEffect } from 'react';
import Pagina2 from "@/app/components/Pagina2";
import { Button, Col, Form, Row } from 'react-bootstrap';
import { FaShippingFast } from 'react-icons/fa';
import Link from 'next/link';
import { QRCodeSVG } from 'qrcode.react';
import apiLocalidade from '@/services/apiLocalidade';
import { buscarEnderecoPorCep } from '@/services/apiViaCep';

export default function Checkout() {
    const [produtoSelecionado, setProdutoSelecionado] = useState(null);
    const [total, setTotal] = useState(0);
    const [formularioAtivo, setFormularioAtivo] = useState('Cartão');
    const [mostrarEndereco, setMostrarEndereco] = useState(true);
    const [cep, setCep] = useState('');
    const [endereco, setEndereco] = useState('');
    const [bairro, setBairro] = useState('');
    const [numero, setNumero] = useState('');
    const [uf, setUf] = useState('');
    const [cidade, setCidade] = useState('');
    const [ufs, setUfs] = useState([]);
    const [cidades, setCidades] = useState([]);
    const [cupom, setCupom] = useState('');
    const [desconto, setDesconto] = useState(0);
    const [mensagemCupom, setMensagemCupom] = useState('');
    const [mostrarModalPG, setMostrarModalPG] = useState(false);
    const [dadosPedido, setDadosPedido] = useState(null);

    useEffect(() => {
        apiLocalidade.get('estados?orderBy=nome').then(resultado => {
            setUfs(resultado.data);
        });
    }, []);

    useEffect(() => {
        if (cep.length === 8) {
            buscarEnderecoPorCep(cep).then(endereco => {
                if (endereco && !endereco.erro) {
                    setEndereco(endereco.logradouro);
                    setBairro(endereco.bairro);
                    setCidade(endereco.localidade);
                    setUf(endereco.uf);
                } else {
                    console.warn("CEP não encontrado.");
                }
            });
        }
    }, [cep]);

    useEffect(() => {
        if (uf) {
            apiLocalidade.get(`estados/${uf}/municipios`).then(resultado => {
                setCidades(resultado.data);
                setCidade('');
            });
        }
    }, [uf]);

    useEffect(() => {
        const produto = JSON.parse(localStorage.getItem('produtoSelecionado'));
        const clienteLogado = JSON.parse(localStorage.getItem('clienteLogado'));

        if (produto) {
            setProdutoSelecionado(produto);
            setTotal(produto.preco);
        }

        if (clienteLogado) {
            setEndereco(clienteLogado.endereco || '');
            setBairro(clienteLogado.bairro || '');
            setNumero(clienteLogado.numero || '');
            setCep(clienteLogado.cep || '');
            setUf(clienteLogado.uf || '');
            setCidade(clienteLogado.cidade || '');
        }
    }, []);

    const avancarParaPagamento = () => {
        if (!endereco || !bairro || !numero || !cep || !cidade || !uf) {
            alert("Por favor, preencha todos os campos de endereço.");
            return;
        }

        const clienteLogado = JSON.parse(localStorage.getItem('clienteLogado'));
        const clienteAtualizado = {
            ...clienteLogado,
            endereco,
            bairro,
            numero,
            cep,
            uf,
            cidade,
        };

        localStorage.setItem('clienteLogado', JSON.stringify(clienteAtualizado));
        setMostrarEndereco(false);
    };

    const calcularFrete = () => {
        if (total >= 250) {
            return 0;
        }
        return 20;
    };

    const calcularTotalComFrete = () => {
        const frete = calcularFrete();
        const descontoValor = desconto > 0 ? (produtoSelecionado.preco * desconto) / 100 : 0;
        return (produtoSelecionado.preco - descontoValor + frete).toFixed(2);
    };

    const calcularSubtotalComDesconto = () => {
        if (produtoSelecionado) {
            const descontoValor = desconto > 0 ? (produtoSelecionado.preco * desconto) / 100 : 0;
            return (produtoSelecionado.preco - descontoValor).toFixed(2);
        }
        return "0.00";
    };

    const calcularTotal = () => {
        if (produtoSelecionado) {
            const subtotalComDesconto = parseFloat(calcularSubtotalComDesconto());
            const frete = calcularFrete();
            return (subtotalComDesconto + frete).toFixed(2);
        }
        return "0.00";
    };
    

    const aplicarCupom = () => {
        if (cupom === "BVSTORE") {
            setDesconto(10);
            setMensagemCupom("Cupom aplicado com sucesso!");
        } else {
            setDesconto(0);
            setMensagemCupom("Cupom inválido.");
        }
    };

    const finalizarPagamento = () => {
        const clienteLogado = JSON.parse(localStorage.getItem('clienteLogado'));
    
        if (!clienteLogado) {
            alert('Por favor, faça login para finalizar a compra.');
            return;
        }
    
        const pedidoProduto = { // Alterado para "pedidoProduto"
            id: Date.now(),
            cliente: clienteLogado.email,
            produto: produtoSelecionado,
            total: parseFloat(calcularTotalComFrete()),
            metodoPagamento: formularioAtivo,
            data: new Date().toLocaleString(),
        };
    
        const pedidosProdutos = JSON.parse(localStorage.getItem('pedidosProdutos')) || []; // Alterado para "pedidosProdutos"
        pedidosProdutos.push(pedidoProduto); // Alterado para "pedidoProduto"
        localStorage.setItem('pedidosProdutos', JSON.stringify(pedidosProdutos)); // Alterado para "pedidosProdutos"
    
        const clienteAtualizado = { ...clienteLogado, ultimoPedido: pedidoProduto.id };
        localStorage.setItem('clienteLogado', JSON.stringify(clienteAtualizado));
    
        setDadosPedido(pedidoProduto); // Alterado para "pedidoProduto"
        setMostrarModalPG(true);
    };
    

    const limparProdutoSelecionado = () => {
        setProdutoSelecionado(null);
        setMostrarModalPG(false);
    };

    return (
        <Pagina2 titulo="Checkout">
            
            <div style={{ display: 'flex', justifyContent: 'space-between', margin: '20px', position: 'relative', border: '1px solid black', borderRadius: '10px' }}>
                {/* Lado esquerdo - Endereço de Entrega ou Opções de Pagamento */}
                <div style={{
                    margin: '05px',
                    width: '60%',
                    padding: '20px',
                    backgroundColor: '#f8f9fa',
                    borderRadius: '8px',
                    display: 'flex',
                    flexDirection: 'column',
                    height: '600px', // Aumentei a altura para garantir que o formulário caiba
                    position: 'relative',
                    overflow: 'auto', // Garante que os campos não saiam da div
                }}>
                    {/* Se estiver mostrando o formulário de endereço */}
                    {mostrarEndereco ? (
                        <>
                            <h3>Endereço de Entrega</h3>

                            <div style={{ marginTop: '05px' }}>
                                <div style={{ display: 'flex' }}>
                                    <input
                                        type="text"
                                        value={cep}
                                        onChange={(e) => setCep(e.target.value)}
                                        placeholder="CEP"
                                        style={{
                                            width: '48%',
                                            padding: '12px',
                                            marginRight: '4%',
                                            borderRadius: '5px',
                                            border: '2px solid #333',
                                            boxSizing: 'border-box',
                                            fontSize: '16px'
                                        }}
                                    />
                                    <select
                                        value={uf}
                                        onChange={(e) => setUf(e.target.value)}
                                        style={{
                                            width: '48%',
                                            padding: '12px',
                                            borderRadius: '5px',
                                            border: '2px solid #333',
                                            boxSizing: 'border-box',
                                            fontSize: '16px'
                                        }}
                                    >
                                        <option value=''>UF</option>
                                        {ufs.map(uf => (
                                            <option key={uf.sigla} value={uf.sigla}>
                                                {uf.sigla}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <select
                                    value={cidade}
                                    onChange={(e) => setCidade(e.target.value)}
                                    style={{
                                        width: '100%',
                                        padding: '12px',
                                        marginTop: '15px',
                                        marginBottom: '15px',
                                        borderRadius: '5px',
                                        border: '2px solid #333',
                                        boxSizing: 'border-box',
                                        fontSize: '16px'
                                    }}
                                >
                                    <option value="">Selecione a cidade</option>
                                    {cidades.map((cidade) => (
                                        <option key={cidade.nome} value={cidade.nome}>
                                            {cidade.nome}
                                        </option>
                                    ))}
                                </select>

                                <input
                                    type="text"
                                    value={endereco}
                                    onChange={(e) => setEndereco(e.target.value)}
                                    placeholder="Endereço"
                                    style={{
                                        width: '100%',
                                        padding: '12px',
                                        marginBottom: '15px',
                                        borderRadius: '5px',
                                        border: '2px solid #333',
                                        boxSizing: 'border-box',
                                        fontSize: '16px'
                                    }}
                                />

                                <input
                                    type="text"
                                    value={bairro}
                                    onChange={(e) => setBairro(e.target.value)}
                                    placeholder="Bairro"
                                    style={{
                                        width: '100%',
                                        padding: '12px',
                                        marginBottom: '15px',
                                        borderRadius: '5px',
                                        border: '2px solid #333',
                                        boxSizing: 'border-box',
                                        fontSize: '16px'
                                    }}
                                />

                                <input
                                    type="number"
                                    value={numero}
                                    onChange={(e) => setNumero(e.target.value)}
                                    placeholder="Número"
                                    style={{
                                        width: '100%',
                                        padding: '12px',
                                        marginBottom: '15px',
                                        borderRadius: '5px',
                                        border: '2px solid #333',
                                        boxSizing: 'border-box',
                                        fontSize: '16px'
                                    }}
                                />

                                {/* Exibir o valor do frete */}
                                <div style={{ fontSize: '16px', marginTop: '10px' }}>
                                    <p><strong>FRETE:</strong> R$ {calcularFrete().toFixed(2)}</p>
                                </div>
                            </div>

                            {/* Botão de avançar para pagamento */}
                            <Button
                                style={{
                                    position: 'absolute',
                                    bottom: '17px',
                                    left: '20px',
                                    width: 'calc(100% - 40px)',
                                    backgroundColor: 'black',
                                    color: 'white',
                                    fontWeight: 'bold',
                                    border: 'none',
                                }}
                                onClick={avancarParaPagamento}
                            >
                                Avançar para Pagamento
                            </Button>
                        </>
                    ) : (
                        /* Lado esquerdo - Opções de Pagamento */
                        <>
                            {/* Botões para alternar entre Cartão de Crédito e Pix */}
                            <div style={{ marginBottom: '10px' }}>
                                <Button
                                    variant={formularioAtivo === 'Cartão' ? 'primary' : 'outline-primary'}
                                    style={{
                                        marginRight: '10px',
                                        backgroundColor: formularioAtivo === 'Cartão' ? 'black' : 'white',
                                        color: formularioAtivo === 'Cartão' ? 'white' : 'black',
                                        fontWeight: 'bold',
                                        border: formularioAtivo === 'Cartão' ? 'none' : '1px solid black'
                                    }}
                                    onClick={() => setFormularioAtivo('Cartão')}
                                >
                                    Cartão de Crédito
                                </Button>
                                <Button
                                    style={{
                                        backgroundColor: formularioAtivo === 'Pix' ? 'black' : 'white',
                                        color: formularioAtivo === 'Pix' ? 'white' : 'black',
                                        border: formularioAtivo === 'Pix' ? 'none' : '1px solid black',
                                        fontWeight: 'bold'
                                    }}
                                    variant={formularioAtivo === 'Pix' ? 'primary' : 'outline-primary'}
                                    onClick={() => setFormularioAtivo('Pix')}
                                >
                                    Pix
                                </Button>
                            </div>

                            {/* Formulário de Cartão de Crédito */}
                            {formularioAtivo === 'Cartão' && (
                                <Form>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Número do Cartão</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Digite o número do cartão"
                                            style={{ border: '1px solid black' }}
                                        />
                                    </Form.Group>

                                    <Form.Group className="mb-3">
                                        <Form.Label>Nome no Cartão</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Digite o nome no cartão"
                                            style={{ border: '1px solid black' }}
                                        />
                                    </Form.Group>

                                    <Form.Group className="mb-3">
                                        <Form.Label>Data de Vencimento</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="MM/AAAA"
                                            style={{ border: '1px solid black' }}
                                        />
                                    </Form.Group>

                                    <Form.Group className="mb-3">
                                        <Form.Label>CVV</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="XXX"
                                            style={{ border: '1px solid black' }}
                                        />
                                    </Form.Group>

                                    {/* Campo de Cupom */}
                                    <Form.Group className="mb-3">
                                        <Form.Label>Código do Cupom</Form.Label>
                                        <Row>
                                            <Col xs={9}>
                                                <Form.Control
                                                    type="text"
                                                    value={cupom}
                                                    onChange={(e) => setCupom(e.target.value)}
                                                    placeholder="Digite seu cupom de desconto"
                                                    style={{ border: '1px solid black' }}
                                                />
                                            </Col>
                                            <Col xs={3}>
                                                <Button
                                                    style={{
                                                        width: '100%',
                                                        backgroundColor: 'black',
                                                        color: 'white',
                                                        border: '1px solid black',
                                                        fontWeight: 'bold'
                                                    }}
                                                    onClick={() => aplicarCupom()}
                                                >
                                                    APLICAR
                                                </Button>
                                            </Col>
                                        </Row>
                                    </Form.Group>

                                    {/* Mensagem do cupom */}
                                    {mensagemCupom && (
                                        <p style={{ color: desconto > 0 ? 'green' : 'red', fontWeight: 'bold' }}>
                                            {mensagemCupom}
                                        </p>
                                    )}
                                </Form>
                            )}

                            {/* Formulário de Pix */}
                            {formularioAtivo === 'Pix' && (
                                <div style={{ marginTop: '20px', overflowX: 'hidden' }}>
                                    <QRCodeSVG value="https://seu-link-de-pix-aqui.com" size={256} />
                                    <p>Escaneie o QR Code para realizar o pagamento via Pix.</p>

                                    {/* Campo de Cupom no Pix */}
                                    <Form.Group className="mb-3" style={{ marginTop: '44px' }}>
                                        <Form.Label>Código do Cupom</Form.Label>
                                        <Row>
                                            <Col xs={9}>
                                                <Form.Control
                                                    type="text"
                                                    value={cupom}
                                                    onChange={(e) => setCupom(e.target.value)}
                                                    placeholder="Digite seu cupom de desconto"
                                                    style={{ border: '1px solid black' }}
                                                />
                                            </Col>
                                            <Col xs={3}>
                                                <Button
                                                    style={{
                                                        width: '100%',
                                                        backgroundColor: 'black',
                                                        color: 'white',
                                                        border: '1px solid black',
                                                        fontWeight: 'bold'
                                                    }}
                                                    onClick={() => aplicarCupom()}
                                                >
                                                    APLICAR
                                                </Button>
                                            </Col>
                                        </Row>
                                    </Form.Group>
                                </div>
                            )}

                            <Button
                                style={{
                                    position: 'absolute',
                                    bottom: '17px',
                                    left: '20px',
                                    width: 'calc(100% - 40px)',
                                    backgroundColor: 'green',
                                    color: 'white',
                                    fontWeight: 'bold',
                                    border: 'none',
                                }}
                                onClick={finalizarPagamento}
                            >
                                Finalizar Pagamento
                            </Button>

                        </>
                    )}
                </div>

                {/* Resumo do Produto */}
                <div style={{
                    width: '35%',
                    margin: '05px',
                    backgroundColor: 'black',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                    padding: '20px',
                    borderRadius: '8px',
                    color: 'white',
                    display: 'flex',
                    flexDirection: 'column',
                    height: '600px',
                    position: 'relative',
                    overflow: 'auto',
                }}>
                    <h4>Resumo do Produto</h4>
                    <hr />
                    <div style={{
                        flex: 1,
                        maxHeight: '365px',
                        overflowY: 'auto',
                        paddingRight: '10px',
                        paddingLeft: '10px',
                        scrollbarWidth: 'thin',
                        scrollbarColor: 'white black'
                    }}>
                        {!produtoSelecionado ? (
                            <p>Nenhum produto selecionado.</p>
                        ) : (
                            <div style={{
                                marginBottom: '10px',
                                display: 'flex',
                                alignItems: 'center',
                                borderBottom: '1px solid #ddd',
                                paddingBottom: '10px',
                                paddingTop: '10px',
                                backgroundColor: 'white',
                                color: 'black',
                                borderRadius: '8px',
                                paddingLeft: '10px',
                                paddingRight: '10px'
                            }}>
                                <img src={produtoSelecionado.imagem} alt={produtoSelecionado.nome} style={{ width: '50px', height: '50px', marginRight: '10px' }} />
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>
                                        {produtoSelecionado.nome}
                                    </div>
                                    <div style={{ fontSize: '12px', color: 'gray' }}>
                                        Quantidade: 1
                                    </div>
                                </div>
                                <div style={{ fontWeight: 'bold', marginLeft: '20px' }}>
                                    R$ {produtoSelecionado.preco.toFixed(2)}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Subtotal e Frete lado a lado, Total abaixo */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
                        <p style={{ fontWeight: 'bold', display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ color: desconto > 0 ? 'green' : 'white' }}>
                                <strong>
                                    {desconto > 0 ? `SUBTOTAL (-10%) : ` : `SUBTOTAL: `}
                                </strong>
                            </span>
                            <span style={{ color: 'white', marginLeft: '5px' }}> R$ {calcularSubtotalComDesconto()}
                            </span>
                        </p>
                        <div style={{ fontSize: '16px' }}>
                            {total >= 250 ? (
                                <p style={{ color: 'green' }}><strong>FRETE GRÁTIS!</strong></p>
                            ) : (
                                <p><strong>FRETE:</strong> R$ {calcularFrete().toFixed(2)}</p>
                            )}
                        </div>
                    </div>

                    <p style={{ fontWeight: 'bold', textAlign: 'center' }}>TOTAL: R$  {calcularTotal()}</p>

                    {/* Botão "Ver Produto" fixado no fundo */}
                    <Link href="/paginas/produto">
                        <Button
                            style={{
                                position: 'absolute',
                                bottom: '20px',
                                left: '20px',
                                right: '20px',
                                backgroundColor: 'white',
                                color: 'black',
                                fontWeight: 'bold',
                                border: 'none',
                            }}
                        >
                            Ver Produto
                        </Button>
                    </Link>
                </div>
                </div>

               {/* Frete Grátis */}
            <div style={{ marginTop: '30px', textAlign: 'center', fontSize: '18px' }}>
                <p>APROVEITE FRETE GRÁTIS ACIMA DE R$250,00! <FaShippingFast style={{ fontSize: '25px', color: 'black' }} /></p>
            </div>

                {/* Modal de Confirmação */}
                {mostrarModalPG && (
                    <div style={{
                        position: 'fixed',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        backgroundColor: '#f5f5f5',
                        padding: '30px 40px',
                        borderRadius: '12px',
                        border: '3px solid black',
                        textAlign: 'center',
                        zIndex: '1000',
                        boxShadow: '0 8px 16px rgba(0, 0, 0, 0.3)',
                        opacity: 1,
                        transition: 'opacity 1s ease-out',
                        animation: 'fadeIn 1s ease-out',
                        width: '80%',
                        maxWidth: '500px',
                        height: '80%',
                        maxHeight: '600px',
                        overflowY: 'auto',
                    }}>
                        <style>
                            {`
                ::-webkit-scrollbar {
                    width: 8px;
                    height: 8px;
                }
                ::-webkit-scrollbar-thumb {
                    background-color: #888;
                    border-radius: 10px;
                }
                ::-webkit-scrollbar-track {
                    background: transparent;
                    border-radius: 10px;
                }
            `}
                        </style>

                        <h2 style={{
                            color: '#333',
                            fontSize: '24px',
                            fontWeight: '700',
                            marginBottom: '20px',
                            fontFamily: 'Montserrat, sans-serif',
                            textTransform: 'uppercase',
                        }}>
                            Recibo de Compra
                        </h2>

                        <div style={{
                            backgroundColor: '#fff',
                            padding: '20px',
                            borderRadius: '8px',
                            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                            marginBottom: '20px',
                            textAlign: 'left',
                        }}>
                            <p style={{ fontSize: '16px', marginBottom: '10px' }}><strong>Cliente:</strong> {dadosPedido.cliente}</p>
                            <p style={{ fontSize: '16px', marginBottom: '10px' }}><strong>ID do Pedido:</strong> {dadosPedido.id}</p>
                            <p style={{ fontSize: '16px', marginBottom: '10px' }}><strong>Data:</strong> {dadosPedido.data}</p>
                        </div>

                        {/* Status */}
                        <div style={{
                            backgroundColor: '#fff',
                            padding: '15px',
                            borderRadius: '8px',
                            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                            marginBottom: '20px',
                            textAlign: 'left',
                        }}>
                            <p style={{ fontSize: '16px', marginBottom: '0', display: 'flex', alignItems: 'center' }}>
                                <span className="bolinha-verde"></span>
                                <strong style={{ marginRight: '05px' }}>Status:  </strong> Aguardando envio
                            </p>
                        </div>


                        {/* Itens do Pedido */}
                        <div style={{
                            backgroundColor: '#fff',
                            padding: '15px',
                            borderRadius: '8px',
                            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                            marginBottom: '20px',
                            textAlign: 'left',
                        }}>
                            <h3 style={{ fontSize: '20px', fontWeight: '900', marginBottom: '10px' }}>Itens do Pedido:</h3>
                            {produtoSelecionado ? (
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    borderBottom: '1px solid #eee',
                                    padding: '10px 0',
                                }}>
                                    <img src={produtoSelecionado.imagem} alt={produtoSelecionado.nome} style={{ width: '50px', height: '50px', marginRight: '10px', borderRadius: '5px' }} />
                                    <div style={{ flex: 1 }}>
                                        <p style={{ fontSize: '16px', margin: 0 }}><strong>{produtoSelecionado.nome}</strong></p>
                                        <p style={{ fontSize: '14px', margin: '5px 0' }}>Quantidade: 1</p>
                                    </div>
                                    <div style={{ fontSize: '16px', fontWeight: 'bold' }}>R$ {produtoSelecionado.preco.toFixed(2)}</div>
                                </div>
                            ) : (
                                <p>Nenhum produto selecionado.</p>
                            )}
                        </div>

                        {/* Subtotal, Desconto, Frete e Total */}
                        <div style={{
                            backgroundColor: '#fff',
                            padding: '15px',
                            borderRadius: '8px',
                            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                            marginBottom: '20px',
                            textAlign: 'left',
                        }}>
                            <p style={{ fontSize: '16px', marginBottom: '10px' }}>
                                <strong>Subtotal:</strong> R$ {produtoSelecionado ? produtoSelecionado.preco.toFixed(2) : '0.00'}
                            </p>
                            {desconto > 0 && (
                                <p style={{ fontSize: '16px', marginBottom: '10px', color: 'green' }}>
                                    <strong>Desconto (-{desconto}%):</strong> R$ {(produtoSelecionado.preco * (desconto / 100)).toFixed(2)}
                                </p>
                            )}
                            <p style={{ fontSize: '16px', marginBottom: '10px' }}>
                                <strong>Frete:</strong> R$ {calcularFrete().toFixed(2)}
                            </p>
                            <p style={{
                                fontSize: '20px',
                                fontWeight: 'bold',
                                marginBottom: '10px',
                            }}>
                                <strong>Total:</strong> R$ {calcularTotal()}
                            </p>
                        </div>

                        {/* Forma de Pagamento */}
                        <div style={{
                            backgroundColor: '#fff',
                            padding: '15px',
                            borderRadius: '8px',
                            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                            marginBottom: '0',
                            textAlign: 'left',
                        }}>
                            <p style={{ fontSize: '16px', marginBottom: '0' }}>
                                <strong>Forma de Pagamento:</strong> {formularioAtivo === 'Cartão' ? 'Cartão de Crédito' : 'Pix'}
                            </p>
                        </div>

                        {/* Botão de Fechar Modal */}
                        <Link href={`/paginas/home`}>
                            <button
                                onClick={() => setMostrarModalPG(false)}
                                style={{
                                    padding: '12px 20px',
                                    backgroundColor: 'black',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '5px',
                                    fontSize: '16px',
                                    fontWeight: 'bold',
                                    cursor: 'pointer',
                                    transition: 'background-color 0.3s',
                                    marginTop: '20px',
                                }}
                                onMouseEnter={(e) => e.target.style.backgroundColor = 'grey'}
                                onMouseLeave={(e) => e.target.style.backgroundColor = 'black'}
                            >
                                Fechar
                            </button>
                        </Link>

                    </div>
                )}
        </Pagina2 >
    );
}
