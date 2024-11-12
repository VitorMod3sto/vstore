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

    // Função para calcular o total do carrinho com o frete
    const calcularTotal = () => {
        const totalCarrinho = carrinho.reduce((total, item) => total + (item.preco * item.quantidade), 0);
        const frete = 20.00; // Defina o valor do frete fixo ou dinâmica
        const totalComFrete = totalCarrinho + frete;
        return totalComFrete.toFixed(2); // Arredondando para duas casas decimais
    };

    // Atualizando o estado do total
    useEffect(() => {
        setTotal(calcularTotal());
    }, [carrinho]);  // Sempre que o carrinho mudar, recalcular o total

    

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
                        <p><strong>Subtotal:</strong> R$ {calcularTotal()}</p>
                        <p><strong>Frete:</strong> R$ 20,00</p>
                    </div>
                    <p style={{ fontWeight: 'bold', textAlign: 'center' }}>Total: R$ {total}</p>

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
                <p>APROVEITE FRETE GRÁTIS ACIMA DE R$200,00! <FaShippingFast style={{ fontSize: '25px', color: 'black' }} /></p>
            </div>
        </Pagina2 >
    );
}