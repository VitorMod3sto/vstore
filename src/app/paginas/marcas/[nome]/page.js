'use client';

import Pagina2 from "@/app/components/Pagina2";
import Link from "next/link";
import { useEffect, useState } from 'react';
import { Row, Col, Card, Dropdown, Container, Modal, Button } from 'react-bootstrap';
import { BiLogoVuejs } from "react-icons/bi";

export default function Page({ params }) {
    const [loading, setLoading] = useState(true);
    const [produtos, setProdutos] = useState([]);
    const [produtosFiltrados, setProdutosFiltrados] = useState([]); // Estado para armazenar os produtos filtrados
    const [marcas, setMarcas] = useState([]);
    const [tamanhos, setTamanhos] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [marcaSelecionada, setMarcaSelecionada] = useState(null);
    const [tamanhoSelecionado, setTamanhoSelecionado] = useState(null);
    const [categoriaSelecionada, setCategoriaSelecionada] = useState(null);
    const [ordemPreco, setOrdemPreco] = useState(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        const produtosLocal = JSON.parse(localStorage.getItem('produtos')) || [];
        const marcaNome = decodeURIComponent(params.nome.toLowerCase());
        const produtosMarca = produtosLocal.filter(produto => produto.marca.toLowerCase() === marcaNome);
        setProdutos(produtosMarca);
        setProdutosFiltrados(produtosMarca); // Inicializa com todos os produtos filtrados (sem filtros)

        const marcasLocal = JSON.parse(localStorage.getItem('marcas')) || [];
        const tamanhosLocal = [...new Set(produtosMarca.map(produto => produto.tamanho))];
        const categoriasLocal = JSON.parse(localStorage.getItem('categorias')) || [];

        setMarcas(marcasLocal);
        setTamanhos(tamanhosLocal);
        setCategorias(categoriasLocal);
        setLoading(false);
    }, []);

    const filtrarProdutos = () => {
        let produtosFiltradosTemp = [...produtos]; // Copia os produtos

        if (tamanhoSelecionado) {
            produtosFiltradosTemp = produtosFiltradosTemp.filter(produto => produto.tamanho === tamanhoSelecionado);
        }

        if (categoriaSelecionada) {
            produtosFiltradosTemp = produtosFiltradosTemp.filter(produto => produto.categoria === categoriaSelecionada);
        }

        if (ordemPreco) {
            produtosFiltradosTemp.sort((a, b) => ordemPreco === 'maior' ? b.preco - a.preco : a.preco - b.preco);
        }

        setProdutosFiltrados(produtosFiltradosTemp); // Atualiza os produtos filtrados
    };

    const handleFiltrarClick = () => {
        filtrarProdutos(); // Aplica os filtros
        setShowModal(false); // Fecha a modal
    };

    const resetFiltros = () => {
        setTamanhoSelecionado(null);
        setCategoriaSelecionada(null);
        setOrdemPreco(null);
        setProdutosFiltrados(produtos); // Restaura os produtos originais sem filtros
        setShowModal(false);
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
                    transformOrigin: 'center center',
                }} />
                <style>
                    {`
                    @keyframes pulse {
                        0% {
                            transform: scale(1); 
                        }
                        50% {
                            transform: scale(1.2);
                        }
                        100% {
                            transform: scale(1);
                        }
                    }
                    `}
                </style>
            </div>
        );
    }

    return (
        <Pagina2 titulo='Marca'>
            <Container fluid className="px-0">

                {/* TÍTULO DA PÁGINA COM A MARCA */}
                <h2 style={{
                    fontFamily: 'Montserrat, sans-serif', fontWeight: '900',
                    textAlign: 'center', fontSize: '35px', marginTop: '05px', marginBottom: '20px'
                }}>
                    {decodeURIComponent(params.nome)}
                </h2>

                {/* BOTÃO FILTRAR */}
                <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                    <Button variant="dark" onClick={() => setShowModal(true)}>
                        Filtrar
                    </Button>
                </div>

                {/* MODAL DE FILTROS */}
                <Modal show={showModal} onHide={() => setShowModal(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title style={{ fontFamily: 'Poppins, sans-serif', fontWeight: '900' }}>FILTROS</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
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
                            }} id="dropdown-tamanho">
                                {tamanhoSelecionado ? tamanhoSelecionado : 'Tamanho'}
                            </Dropdown.Toggle>

                            <Dropdown.Menu style={{ backgroundColor: 'black', color: 'white' }}>
                                <Dropdown.Item style={{ backgroundColor: 'black', color: 'white' }} onClick={() => { setTamanhoSelecionado(null); }}>Todos</Dropdown.Item>
                                {tamanhos.map(tamanho => (
                                    <Dropdown.Item key={tamanho} style={{ backgroundColor: 'black', color: 'white' }} onClick={() => { setTamanhoSelecionado(tamanho); }}>
                                        {tamanho}
                                    </Dropdown.Item>
                                ))}
                            </Dropdown.Menu>
                        </Dropdown>

                        {/* Filtro Categoria */}
                        <Dropdown style={{ marginBottom: '10px' }}>
                            <Dropdown.Toggle style={{
                                fontFamily: 'Montserrat, sans-serif',
                                fontWeight: 'bold',
                                cursor: 'pointer',
                                border: 'none',
                                backgroundColor: 'black',
                                color: 'white',
                                width: '100%',
                            }} id="dropdown-categoria">
                                {categoriaSelecionada ? categoriaSelecionada : 'Categoria'}
                            </Dropdown.Toggle>

                            <Dropdown.Menu style={{ backgroundColor: 'black', color: 'white' }}>
                                <Dropdown.Item style={{ backgroundColor: 'black', color: 'white' }} onClick={() => { setCategoriaSelecionada(null); }}>Todas</Dropdown.Item>
                                {categorias.map(categoria => (
                                    <Dropdown.Item key={categoria.id} style={{ backgroundColor: 'black', color: 'white' }} onClick={() => { setCategoriaSelecionada(categoria.nome); }}>
                                        {categoria.nome}
                                    </Dropdown.Item>
                                ))}
                            </Dropdown.Menu>
                        </Dropdown>

                        {/* Filtro Preço */}
                        <Dropdown style={{ marginBottom: '10px' }}>
                            <Dropdown.Toggle style={{
                                fontFamily: 'Montserrat, sans-serif',
                                fontWeight: 'bold',
                                cursor: 'pointer',
                                border: 'none',
                                backgroundColor: 'black',
                                color: 'white',
                                width: '100%',
                            }} id="dropdown-preco">
                                {ordemPreco ? (ordemPreco === 'maior' ? 'Maior Primeiro' : 'Menor Primeiro') : 'Preço'}
                            </Dropdown.Toggle>

                            <Dropdown.Menu style={{ backgroundColor: 'black', color: 'white' }}>
                                <Dropdown.Item style={{ backgroundColor: 'black', color: 'white' }} onClick={() => { setOrdemPreco(null); }}>Todos</Dropdown.Item>
                                <Dropdown.Item style={{ backgroundColor: 'black', color: 'white' }} onClick={() => setOrdemPreco('menor')}>Menor Preço</Dropdown.Item>
                                <Dropdown.Item style={{ backgroundColor: 'black', color: 'white' }} onClick={() => setOrdemPreco('maior')}>Maior Preço</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={resetFiltros}>
                            Resetar Filtros
                        </Button>
                        <Button variant="dark" onClick={handleFiltrarClick}>
                            Aplicar Filtros
                        </Button>
                    </Modal.Footer>
                </Modal>

                {/* CARDS DOS PRODUTOS */}
                <Row>
                    {produtosFiltrados.map(produto => (
                        <Col md={2} key={produto.id} className="mb-4">
                            <Link href={`/paginas/produtos/${produto.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                <Card style={{ border: 'none', display: 'flex', flexDirection: 'column', height: '100%' }}>
                                    <Card.Img
                                        variant="top"
                                        src={produto.imagem}
                                        style={{ objectFit: 'contain', height: '300px', width: '100%', border: '2px solid black', borderRadius: '07px' }}
                                    />
                                    <Card.Body style={{ padding: '0', marginTop: '5px', flexGrow: 1 }}>
                                        <Card.Title style={{
                                            margin: '0', fontFamily: 'Montserrat, sans-serif', fontWeight: '900',
                                            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '100%'
                                        }}>
                                            {produto.nome.length > 23 ? `${produto.nome.slice(0, 23)}...` : produto.nome}
                                        </Card.Title>
                                        <Card.Text style={{ margin: '0', fontFamily: 'Montserrat, sans-serif', marginTop: 'auto' }}>
                                            R$ {produto.preco.toFixed(2)}
                                        </Card.Text>
                                    </Card.Body>
                                </Card>
                            </Link>
                        </Col>
                    ))}
                </Row>
            </Container>
        </Pagina2>
    );
}
