'use client';

import React, { useState, useEffect } from 'react';
import Pagina2 from "@/app/components/Pagina2";
import { Button, Col, Form, Row } from 'react-bootstrap';
import { FaShippingFast } from 'react-icons/fa';
import Link from 'next/link';
import { QRCodeSVG } from 'qrcode.react';
import axios from 'axios'; // Certifique-se de instalar o axios ou use fetch
import apiLocalidade from '@/services/apiLocalidade';
import { buscarEnderecoPorCep } from '@/services/apiViaCep';
import { BiLogoVuejs } from 'react-icons/bi';
import { GiPartyPopper } from 'react-icons/gi';

export default function Checkout() {
    const [carrinho, setCarrinho] = useState([]);
    const [total, setTotal] = useState(0);
    const [formularioAtivo, setFormularioAtivo] = useState('cartao');
    const [mostrarEndereco, setMostrarEndereco] = useState(true); // Controle para mostrar o formulário de endereço
    const [cep, setCep] = useState('');
    const [endereco, setEndereco] = useState('');
    const [bairro, setBairro] = useState('');
    const [numero, setNumero] = useState('');
    const [uf, setUf] = useState('');
    const [cidade, setCidade] = useState('');
    const [ufs, setUfs] = useState([]); // Estado para armazenar as UFs
    const [cidades, setCidades] = useState([]); // Estado para armazenar as cidades
    const [cupom, setCupom] = useState(''); // Novo estado para o cupom
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

    // Carregar o carrinho e os dados do cliente do localStorage
    useEffect(() => {
        const carrinhoStorage = JSON.parse(localStorage.getItem('carrinhos')) || [];
        const clienteLogado = JSON.parse(localStorage.getItem('clienteLogado'));

        if (clienteLogado) {
            const carrinhoCliente = carrinhoStorage.find(c => c.email === clienteLogado.email);
            if (carrinhoCliente) {
                setCarrinho(carrinhoCliente.itens);
            }

            // Carregar dados de endereço salvo
            const enderecoCliente = clienteLogado.endereco;
            if (enderecoCliente) {
                setEndereco(enderecoCliente);
                setBairro(clienteLogado.bairro);
                setNumero(clienteLogado.numero);
                setCep(clienteLogado.cep);
                setUf(clienteLogado.uf);
                setCidade(clienteLogado.cidade);
            }
        }
    }, []);



    // Função para avançar para o pagamento
    const avancarParaPagamento = () => {
        if (!endereco || !bairro || !numero || !cep || !cidade || !uf) {
            alert("Por favor, preencha todos os campos de endereço.");
            return;
        }

        // Atualiza o estado do endereço no localStorage
        const clienteLogado = JSON.parse(localStorage.getItem('clienteLogado'));
        clienteLogado.endereco = endereco;
        clienteLogado.bairro = bairro;
        clienteLogado.numero = numero;
        clienteLogado.cep = cep;
        clienteLogado.uf = uf;
        clienteLogado.cidade = cidade;

        localStorage.setItem('clienteLogado', JSON.stringify(clienteLogado));

        // Depois de preencher o endereço, mostramos as opções de pagamento
        setMostrarEndereco(false);
    };

    // Função para calcular o valor do frete
    const calcularFrete = () => {
        if (total >= 250) {
            // Frete grátis se o valor do carrinho for superior a R$250,00
            return 0;
        }

        // Lógica de frete baseada no estado (uf) do cliente
        switch (uf) {
            case 'AC':
            case 'AP':
            case 'AM':
            case 'PA':
            case 'RO':
            case 'RR':
            case 'TO':
                return 30.00; // Região Norte

            case 'PR':
            case 'SC':
            case 'RS':
                return 30.00; // Região Sul

            case 'GO':
            case 'MT':
            case 'MS':
            case 'SP':
            case 'RJ':
            case 'ES':
            case 'MG':
            case 'DF':
            case 'BA':
            case 'SE':
            case 'PI':
            case 'PE':
            case 'AL':
            case 'RN':
            case 'PB':
            case 'CE':
            case 'MA':
            case 'PI':
                return 20.00; // Região Centro-Oeste, Sudeste e Nordeste

            default:
                return 20.00; // Caso o estado não esteja listado, assume o valor de frete padrão de 20
        }
    };

    // Função para calcular o total incluindo o frete
    const calcularTotal = () => {
        const totalCarrinho = carrinho.reduce((total, item) => total + (item.preco * item.quantidade), 0);
        const frete = calcularFrete(); // Calcula o frete
        const totalComFrete = totalCarrinho + frete;
        return totalComFrete.toFixed(2); // Arredondando para duas casas decimais
    };




    // Atualizando o estado do total
    useEffect(() => {
        setTotal(calcularTotal());
    }, [carrinho]);  // Sempre que o carrinho mudar, recalcular o total

    // Função para aplicar o cupom
    const aplicarCupom = () => {
        if (cupom === "BVSTORE") {
            // Desconto de 10% no subtotal
            const subtotalComDesconto = (total * 0.9).toFixed(2);
            setDesconto(10);  // Salva o valor do desconto (10%)
            setMensagemCupom("Cupom aplicado com sucesso!");
            setTotal(subtotalComDesconto);
        } else {
            setDesconto(0); // Se o cupom não for válido, nenhum desconto é aplicado
            setMensagemCupom("Cupom inválido.");
        }
    };

    // Alteração no cálculo do total, considerando o desconto
    // Função para calcular o subtotal com desconto (aplicando 10% de desconto)
    const calcularSubtotalComDesconto = () => {
        const subtotal = carrinho.reduce((total, item) => total + (item.preco * item.quantidade), 0);
        // Se o cupom de desconto estiver aplicado, aplica o desconto de 10% no subtotal
        if (desconto > 0) {
            return (subtotal * 0.9).toFixed(2);  // Aplica o desconto de 10%
        }
        return subtotal.toFixed(2);  // Se não houver desconto, retorna o subtotal normal
    };



    // Atualiza o estado do total
    useEffect(() => {
        setTotal(calcularSubtotalComDesconto());
    }, [carrinho, desconto]); // Recalcula o total quando o carrinho ou o desconto mudarem

    const abrirModalPG = (pedido) => {
        // Aqui você está passando o pedido para a modal
        setDadosPedido(pedido); // Armazenando os dados do pedido no estado
        setMostrarModalPG(true); // Exibindo a modal
    };

    const finalizarPagamento = () => {
        // Verifique se o cliente está logado
        const clienteLogado = JSON.parse(localStorage.getItem('clienteLogado'));

        if (!clienteLogado) {
            alert('Por favor, faça login para finalizar a compra.');
            return;
        }

        // Coletando os dados do pedido
        const pedido = {
            id: Date.now(), // Gerando um ID único para o pedido com base no timestamp
            cliente: clienteLogado.email, // Associando o pedido ao e-mail do cliente
            itens: carrinho.map(item => ({
                nome: item.nome,
                quantidade: item.quantidade,
                preco: item.preco,
                imagem: item.imagem
            })),
            total: parseFloat(calcularTotal()), // Garantir que o total seja um número
            metodoPagamento: formularioAtivo, // 'cartao' ou 'pix'
            data: new Date().toLocaleString(), // Data de finalização do pedido
        };

        // Recupera os pedidos do cliente no localStorage (se houver)
        const pedidos = JSON.parse(localStorage.getItem('pedidos')) || [];

        // Adiciona o novo pedido à lista de pedidos
        pedidos.push(pedido);

        // Atualiza os pedidos no localStorage
        localStorage.setItem('pedidos', JSON.stringify(pedidos));

        // Atualiza o estado do cliente no localStorage, caso queira salvar mais informações
        const clienteAtualizado = { ...clienteLogado, ultimoPedido: pedido.id };
        localStorage.setItem('clienteLogado', JSON.stringify(clienteAtualizado));

        // Agora chamamos a função que abre a modal com os dados do pedido
        abrirModalPG(pedido);
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
                                    <p><strong>FRETE:</strong> R$ 20,00</p>
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
                                    variant={formularioAtivo === 'cartao' ? 'primary' : 'outline-primary'}
                                    style={{
                                        marginRight: '10px',
                                        backgroundColor: formularioAtivo === 'cartao' ? 'black' : 'white', // Fundo preto se ativo, branco se não
                                        color: formularioAtivo === 'cartao' ? 'white' : 'black', // Texto branco se ativo, preto se não
                                        fontWeight: 'bold',
                                        border: formularioAtivo === 'cartao' ? 'none' : '1px solid black' // Remover borda se ativo, adicionar borda se não
                                    }}
                                    onClick={() => setFormularioAtivo('cartao')}
                                >
                                    Cartão de Crédito
                                </Button>
                                <Button
                                    style={{
                                        backgroundColor: formularioAtivo === 'pix' ? 'black' : 'white', // Fundo preto se ativo, branco se não
                                        color: formularioAtivo === 'pix' ? 'white' : 'black', // Texto branco se ativo, preto se não
                                        border: formularioAtivo === 'pix' ? 'none' : '1px solid black', // Remover borda se ativo, adicionar borda se não
                                        fontWeight: 'bold'
                                    }}
                                    variant={formularioAtivo === 'pix' ? 'primary' : 'outline-primary'}
                                    onClick={() => setFormularioAtivo('pix')}
                                >
                                    Pix
                                </Button>
                            </div>

                            {/* Formulário de Cartão de Crédito */}
                            {formularioAtivo === 'cartao' && (
                                <Form>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Número do Cartão</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Digite o número do cartão"
                                            style={{ border: '1px solid black' }} // Borda fina preta
                                        />
                                    </Form.Group>

                                    <Form.Group className="mb-3">
                                        <Form.Label>Nome no Cartão</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Digite o nome no cartão"
                                            style={{ border: '1px solid black' }} // Borda fina preta
                                        />
                                    </Form.Group>

                                    <Form.Group className="mb-3">
                                        <Form.Label>Data de Vencimento</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="MM/AAAA"
                                            style={{ border: '1px solid black' }} // Borda fina preta
                                        />
                                    </Form.Group>

                                    <Form.Group className="mb-3">
                                        <Form.Label>CVV</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="XXX"
                                            style={{ border: '1px solid black' }} // Borda fina preta
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
                                                    style={{ border: '1px solid black' }} // Borda fina preta
                                                />
                                            </Col>
                                            <Col xs={3}>
                                                <Button
                                                    style={{
                                                        width: '100%',
                                                        backgroundColor: 'black',
                                                        color: 'white',
                                                        border: '1px solid black', // Borda preta fina no botão
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
                            {formularioAtivo === 'pix' && (
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
                                                    style={{ border: '1px solid black' }} // Borda fina preta
                                                />
                                            </Col>
                                            <Col xs={3}>
                                                <Button
                                                    style={{
                                                        width: '100%',
                                                        backgroundColor: 'black',
                                                        color: 'white',
                                                        border: '1px solid black', // Borda preta fina no botão
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
                    height: '600px', // A altura da div
                    position: 'relative', // Tornando a div o contexto para o botão
                    overflow: 'auto',
                }}>
                    <h4>Resumo do Carrinho</h4>
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
                        {carrinho.length === 0 ? (
                            <p>Seu carrinho está vazio.</p>
                        ) : (
                            carrinho.map((item) => (
                                <div key={item.id} style={{
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
                                    <img src={item.imagem} alt={item.nome} style={{ width: '50px', height: '50px', marginRight: '10px' }} />
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>
                                            {item.nome}
                                        </div>
                                        <div style={{ fontSize: '12px', color: 'gray' }}>
                                            Quantidade: {item.quantidade}
                                        </div>
                                    </div>
                                    <div style={{ fontWeight: 'bold', marginLeft: '20px' }}>
                                        R$ {item.preco.toFixed(2)}
                                    </div>
                                </div>
                            ))
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

                    {/* Botão "Ver Carrinho" fixado no fundo */}
                    <Link href="/paginas/carrinho">
                        <Button
                            style={{
                                position: 'absolute',
                                bottom: '20px', // Distância do fundo da div
                                left: '20px',
                                right: '20px',
                                backgroundColor: 'white',
                                color: 'black',
                                fontWeight: 'bold',
                                border: 'none',
                            }}
                        >
                            Ver Carrinho
                        </Button>
                    </Link>
                </div>

            </div>

            {/* Frete Grátis */}
            <div style={{ marginTop: '30px', textAlign: 'center', fontSize: '18px' }}>
                <p>APROVEITE FRETE GRÁTIS ACIMA DE R$250,00! <FaShippingFast style={{ fontSize: '25px', color: 'black' }} /></p>
            </div>

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
        height: '80%', // Definindo altura da modal
        maxHeight: '600px', // Definindo altura máxima
        overflowY: 'auto', // Habilitando rolagem vertical
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
            <p style={{ fontSize: '16px', marginBottom: '10px' }}><strong>Nome do Cliente:</strong> {dadosPedido.cliente}</p>
            <p style={{ fontSize: '16px', marginBottom: '10px' }}><strong>ID do Pedido:</strong> {dadosPedido.id}</p>
            <p style={{ fontSize: '16px', marginBottom: '10px' }}><strong>Data:</strong> {dadosPedido.data}</p>
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
            <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '10px' }}>Itens do Pedido:</h3>
            {dadosPedido.itens.map((item, index) => (
                <div key={index} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderBottom: '1px solid #eee',
                    padding: '10px 0',
                }}>
                    <img src={item.imagem} alt={item.nome} style={{ width: '50px', height: '50px', marginRight: '10px', borderRadius: '5px' }} />
                    <div style={{ flex: 1 }}>
                        <p style={{ fontSize: '16px', margin: 0 }}><strong>{item.nome}</strong></p>
                        <p style={{ fontSize: '14px', margin: '5px 0' }}>Quantidade: {item.quantidade}</p>
                    </div>
                    <div style={{ fontSize: '16px', fontWeight: 'bold' }}>R$ {item.preco.toFixed(2)}</div>
                </div>
            ))}
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
            <p style={{ fontSize: '16px', marginBottom: '10px' }}><strong>Subtotal:</strong> R$ {Number(dadosPedido.total).toFixed(2)}</p>
            {desconto > 0 && (
                <p style={{ fontSize: '16px', marginBottom: '10px', color: 'green' }}><strong>Desconto (-{desconto}%):</strong> R$ {(dadosPedido.total * (desconto / 100)).toFixed(2)}</p>
            )}
            <p style={{ fontSize: '16px', marginBottom: '10px' }}><strong>Frete:</strong> R$ {calcularFrete().toFixed(2)}</p>
            <p style={{
                fontSize: '20px',   /* Aumentei o tamanho da fonte */
                fontWeight: 'bold', /* Deixei em negrito */
                marginBottom: '10px'
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
            marginBottom: '20px',
            textAlign: 'left',
        }}>
            <p style={{ fontSize: '16px' }}><strong>Forma de Pagamento:</strong> {formularioAtivo === 'cartao' ? 'Cartão de Crédito' : 'Pix'}</p>
        </div>

        {/* Botão de Fechar Modal */}
        <button
            onClick={() => setMostrarModalPG(false)}
            style={{
                padding: '12px 20px',
                backgroundColor: '#f0a500',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'background-color 0.3s',
                marginTop: '20px',
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#f58d42'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#f0a500'}
        >
            Fechar
        </button>
    </div>
)}




        </Pagina2 >
    );
}
