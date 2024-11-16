'use client';

import Pagina2 from "@/app/components/Pagina2";
import Link from "next/link";
import { useEffect, useState } from 'react';
import { Row, Col, Card, Dropdown, Container, Offcanvas, Button } from 'react-bootstrap';
import { BiLogoVuejs } from "react-icons/bi";
import { FaSearchMinus, FaChevronLeft, FaHome, FaFilter } from "react-icons/fa";

export default function Page({ params }) {
    const [loading, setLoading] = useState(true);
    const [produtos, setProdutos] = useState([]);
    const [produtosFiltrados, setProdutosFiltrados] = useState([]);
    const [marcas, setMarcas] = useState([]);
    const [tamanhos, setTamanhos] = useState([]);
    const [marcaSelecionada, setMarcaSelecionada] = useState(null);
    const [tamanhoSelecionado, setTamanhoSelecionado] = useState(null);
    const [ordemPreco, setOrdemPreco] = useState(null);
    const [showFilters, setShowFilters] = useState(false);

    useEffect(() => {
        const produtosLocal = JSON.parse(localStorage.getItem('produtos')) || [];
        const categoriaNome = decodeURIComponent(params.nome);
        const produtosCategoria = produtosLocal.filter(produto => produto.categoria === categoriaNome);

        const marcasLocal = [...new Set(produtosCategoria.map(produto => produto.marca))];
        const tamanhosLocal = [...new Set(produtosCategoria.map(produto => produto.tamanho))];

        setProdutos(produtosCategoria);
        setProdutosFiltrados(produtosCategoria);
        setMarcas(marcasLocal);
        setTamanhos(tamanhosLocal);
        setLoading(false);
    }, [params.nome]);

    const filtrarProdutos = () => {
        let produtosAtualizados = [...produtos];

        if (marcaSelecionada) {
            produtosAtualizados = produtosAtualizados.filter(produto => produto.marca === marcaSelecionada);
        }

        if (tamanhoSelecionado) {
            produtosAtualizados = produtosAtualizados.filter(produto => produto.tamanho === tamanhoSelecionado);
        }

        if (ordemPreco) {
            produtosAtualizados.sort((a, b) => ordemPreco === 'maior' ? b.preco - a.preco : a.preco - b.preco);
        }

        setProdutosFiltrados(produtosAtualizados);
        setShowFilters(false);
    };

    const resetFiltros = () => {
        setMarcaSelecionada(null);
        setTamanhoSelecionado(null);
        setOrdemPreco(null);
        setProdutosFiltrados(produtos);
        setShowFilters(false);
    };

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
                    animation: 'pulse 1.5s ease-in-out infinite',
                }} />
            </div>
        );
    }

    return (
        <Pagina2 titulo={decodeURIComponent(params.nome)}>
            <Container fluid className="px-0" style={{ minHeight: '100vh' }}>

                {/* Botões de navegação */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '10px 20px',
                    borderBottom: '1px solid #e0e0e0',
                    backgroundColor: '#f8f9fa',
                }}>
                    <Button variant="link" style={{
                        textDecoration: 'none',
                        color: 'black',
                        fontSize: '18px',
                        fontFamily: 'Montserrat, sans-serif',
                        fontWeight: '900',
                    }} onClick={() => window.history.back()}>
                        <FaChevronLeft style={{ fontSize: '20px', marginBottom: '3px' }} /> Voltar
                    </Button>
                    <div style={{ textAlign: 'center', fontFamily: 'Poppins, sans-serif', fontWeight: '900', marginBottom: '6px' }}>
                        <Button style={{
                            fontSize: '20px',
                            backgroundColor: '#f8f9fa',
                            color: 'black',
                            border: 'none'
                        }} variant="dark" onClick={() => setShowFilters(true)}>
                            Filtrar <FaFilter style={{ fontSize: '17px' }} />
                        </Button>
                    </div>
                    <Link href="/paginas/home">
                        <Button variant="link" style={{
                            fontSize: '18px',
                            textDecoration: 'none',
                            color: 'black',
                            fontFamily: 'Montserrat, sans-serif',
                            fontWeight: '900'
                        }}>
                            Início <FaHome style={{ fontSize: '25px', marginBottom: '06px' }} />
                        </Button>
                    </Link>
                </div>

                 {/* TÍTULO DA PÁGINA */}
                 <h2 style={{
                    fontFamily: 'Montserrat, sans-serif', fontWeight: '900',
                    textAlign: 'center', fontSize: '35px', marginTop: '15px', marginBottom: '30px'
                }}>
                    {decodeURIComponent(params.nome)}
                </h2>

                {/* Filtros */}
                <Offcanvas show={showFilters} onHide={() => setShowFilters(false)} placement="start">
                    <Offcanvas.Header closeButton>
                        <Offcanvas.Title style={{ fontFamily: 'Poppins, sans-serif', fontWeight: '900' }}>Filtros</Offcanvas.Title>
                    </Offcanvas.Header>
                    <Offcanvas.Body>
                        {/* Filtro Marca */}
                        <Dropdown style={{ marginBottom: '10px' }}>
                            <Dropdown.Toggle style={{
                                fontFamily: 'Montserrat, sans-serif',
                                fontWeight: 'bold',
                                cursor: 'pointer',
                                border: 'none',
                                backgroundColor: 'black',
                                color: 'white',
                                width: '100%',
                            }}>
                                {marcaSelecionada ? marcaSelecionada : 'Marca'}
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                                <Dropdown.Item onClick={() => setMarcaSelecionada(null)}>Todas</Dropdown.Item>
                                {marcas.map(marca => (
                                    <Dropdown.Item key={marca} onClick={() => setMarcaSelecionada(marca)}>
                                        {marca}
                                    </Dropdown.Item>
                                ))}
                            </Dropdown.Menu>
                        </Dropdown>

                        {/* Filtro Tamanho */}
                        <Dropdown style={{ marginBottom: '10px' }}>
                            <Dropdown.Toggle style={{
                                fontFamily: 'Montserrat, sans-serif',
                                fontWeight: 'bold',
                                cursor: 'pointer',
                                border: 'none',
                                backgroundColor: 'black',
                                color: 'white',
                                width: '100%',
                            }}>
                                {tamanhoSelecionado ? tamanhoSelecionado : 'Tamanho'}
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                                <Dropdown.Item onClick={() => setTamanhoSelecionado(null)}>Todos</Dropdown.Item>
                                {tamanhos.map(tamanho => (
                                    <Dropdown.Item key={tamanho} onClick={() => setTamanhoSelecionado(tamanho)}>
                                        {tamanho}
                                    </Dropdown.Item>
                                ))}
                            </Dropdown.Menu>
                        </Dropdown>

                        {/* Filtro Preço */}
                        <Dropdown>
                            <Dropdown.Toggle style={{
                                fontFamily: 'Montserrat, sans-serif',
                                fontWeight: 'bold',
                                cursor: 'pointer',
                                border: 'none',
                                backgroundColor: 'black',
                                color: 'white',
                                width: '100%',
                            }}>
                                {ordemPreco ? (ordemPreco === 'maior' ? 'Maior Primeiro' : 'Menor Primeiro') : 'Preço'}
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                                <Dropdown.Item onClick={() => setOrdemPreco(null)}>Todos</Dropdown.Item>
                                <Dropdown.Item onClick={() => setOrdemPreco('menor')}>Menor Preço</Dropdown.Item>
                                <Dropdown.Item onClick={() => setOrdemPreco('maior')}>Maior Preço</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>

                        {/* Botões de Ação */}
                        <div style={{ marginTop: '30px' }}>
                            <Button onClick={filtrarProdutos} style={{ width: '100%', backgroundColor: 'black', color: 'white', border: 'none' }}>
                                Aplicar Filtros
                            </Button>
                            <Button onClick={resetFiltros} style={{
                                width: '100%',
                                marginTop: '10px',
                                border: '1px solid black',
                                backgroundColor: 'white',
                                color: 'black'
                            }}>
                                Resetar Filtros
                            </Button>
                        </div>
                    </Offcanvas.Body>
                </Offcanvas>

                {/* Lista de Produtos */}
                <Row>
                    {produtosFiltrados.length === 0 ? (
                        <div style={{
                            textAlign: 'center',
                            marginTop: '50px',
                            fontFamily: 'Poppins, sans-serif',
                            fontWeight: 'bold',
                            fontSize: '20px'
                        }}>
                            <p><FaSearchMinus style={{ marginBottom: '2px' }} /> Ops! Nenhum produto encontrado.</p>
                        </div>
                    ) : (
                        produtosFiltrados.map(produto => (
                            <Col md={3} sm={6} xs={12} key={produto.id} className="mb-4">
                                <Card
                                    style={{
                                        border: 'none',
                                        borderRadius: '10px',
                                        overflow: 'hidden',
                                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                                        backgroundColor: '#fff',
                                        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                                        cursor: 'pointer'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.transform = 'scale(1.05)';
                                        e.currentTarget.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.2)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.transform = 'scale(1)';
                                        e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
                                    }}
                                >
                                    <Link href={`/paginas/produtos/${produto.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                        <Card.Img
                                            variant="top"
                                            src={produto.imagem}
                                            style={{
                                                objectFit: 'contain',
                                                height: '250px',
                                                backgroundColor: '#fff',
                                                padding: '10px',
                                                borderBottom: '1px solid #e0e0e0'
                                            }}
                                        />
                                        <Card.Body style={{ textAlign: 'center', backgroundColor: '#f8f9fa' }}>
                                            <Card.Title style={{
                                                fontFamily: 'Montserrat, sans-serif',
                                                fontWeight: '700',
                                                fontSize: '18px',
                                                color: '#333'
                                            }}>
                                                {produto.nome}
                                            </Card.Title>
                                            <Card.Text style={{
                                                fontFamily: 'Poppins, sans-serif',
                                                fontWeight: '400',
                                                fontSize: '16px',
                                                color: '#555',
                                            }}>
                                                R$ {produto.preco.toFixed(2)}
                                            </Card.Text>
                                        </Card.Body>
                                    </Link>
                                    <Card.Body style={{ textAlign: 'center', backgroundColor: '#f8f9fa' }}>
                                        <Button
                                            variant="dark"
                                            style={{
                                                fontFamily: 'Poppins, sans-serif',
                                                fontWeight: '500',
                                                fontSize: '14px',
                                                borderRadius: '20px',
                                                padding: '8px 20px'
                                            }}
                                            onClick={() => {
                                                // Salvar o produto selecionado no localStorage
                                                localStorage.setItem('produtoSelecionado', JSON.stringify(produto));
                                                // Redirecionar para a página de checkout
                                                window.location.href = '/paginas/checkout/produto';
                                            }}
                                        >
                                            Comprar agora
                                        </Button>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))
                    )}
                </Row>
            </Container>
        </Pagina2>
    );
}
