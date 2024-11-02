'use client';

import Pagina2 from "@/app/components/Pagina2";
import Link from "next/link";
import { useEffect, useState } from 'react';
import { Row, Col, Card, Dropdown, Container } from 'react-bootstrap';

export default function Page() {
    const [produtos, setProdutos] = useState([]);
    const [marcas, setMarcas] = useState([]);
    const [tamanhos, setTamanhos] = useState([]);
    const [marcaSelecionada, setMarcaSelecionada] = useState(null);
    const [tamanhoSelecionado, setTamanhoSelecionado] = useState(null);
    const [ordemPreco, setOrdemPreco] = useState(null);

    useEffect(() => {
        const produtosLocal = JSON.parse(localStorage.getItem('produtos')) || [];
        const marcasLocal = [...new Set(produtosLocal.map(produto => produto.marca))];
        const tamanhosLocal = [...new Set(produtosLocal.map(produto => produto.tamanho))];
        const tamanhosUnico = [...tamanhosLocal, 'Tamanho único'.toUpperCase()];

        setProdutos(produtosLocal);
        setMarcas(marcasLocal);
        setTamanhos(tamanhosLocal);
        setTamanhos(tamanhosUnico);
    }, []);

    const filtrarProdutos = () => {
        let produtosFiltrados = JSON.parse(localStorage.getItem('produtos')) || [];

        if (marcaSelecionada) {
            produtosFiltrados = produtosFiltrados.filter(produto => produto.marca === marcaSelecionada);
        }

        if (tamanhoSelecionado) {
            produtosFiltrados = produtosFiltrados.filter(produto => produto.tamanho === tamanhoSelecionado);
        }

        if (ordemPreco) {
            produtosFiltrados.sort((a, b) => ordemPreco === 'maior' ? b.preco - a.preco : a.preco - b.preco);
        }

        setProdutos(produtosFiltrados);
    };

    useEffect(() => {
        filtrarProdutos();
    }, [marcaSelecionada, tamanhoSelecionado, ordemPreco]);

    return (
        <Pagina2 titulo='Produtos'>
            <Container fluid className="px-0">
                <h2 style={{
                    fontFamily: 'Montserrat, sans-serif', fontWeight: '900',
                    textAlign: 'center', fontSize: '35px', marginTop: '05px', marginBottom: '20px'
                }}>
                    Todos os Produtos
                </h2>

                {/* Row para os Dropdowns lado a lado */}
                <div style={{ display: 'flex', marginBottom: '20px', justifyContent: 'flex-start' }}>
                    <Dropdown style={{ marginRight: '10px' }}>
                        <Dropdown.Toggle style={{
                            fontFamily: 'Montserrat, sans-serif',
                            fontWeight: 'bold',
                            cursor: 'pointer',
                            border: 'none',
                            backgroundColor: 'black',
                            color: 'white',
                            width: '150px',
                        }} id="dropdown-basic">
                            {marcaSelecionada ? marcaSelecionada : 'Marca'}
                        </Dropdown.Toggle>
                        <Dropdown.Menu style={{ backgroundColor: 'black', color: 'white' }}>
                            <Dropdown.Item style={{ backgroundColor: 'black', color: 'white' }} onClick={() => { setMarcaSelecionada(null); setOrdemPreco(null); }}>Todas</Dropdown.Item>
                            {marcas.map(marca => (
                                <Dropdown.Item key={marca} style={{ backgroundColor: 'black', color: 'white' }} onClick={() => { setMarcaSelecionada(marca); setOrdemPreco(null); }}>
                                    {marca}
                                </Dropdown.Item>
                            ))}
                        </Dropdown.Menu>
                    </Dropdown>

                    <Dropdown style={{ marginRight: '10px' }}>
                        <Dropdown.Toggle style={{
                            fontFamily: 'Montserrat, sans-serif',
                            fontWeight: 'bold',
                            cursor: 'pointer',
                            border: 'none',
                            backgroundColor: 'black',
                            color: 'white',
                            width: '160px',
                        }} id="dropdown-tamanho">
                            {tamanhoSelecionado ? tamanhoSelecionado : 'Tamanho'}
                        </Dropdown.Toggle>
                        <Dropdown.Menu style={{ backgroundColor: 'black', color: 'white' }}>
                            <Dropdown.Item style={{ backgroundColor: 'black', color: 'white' }} onClick={() => { setTamanhoSelecionado(null); setOrdemPreco(null); }}>Todos</Dropdown.Item>
                            {tamanhos.map(tamanho => (
                                <Dropdown.Item key={tamanho} style={{ backgroundColor: 'black', color: 'white' }} onClick={() => { setTamanhoSelecionado(tamanho); setOrdemPreco(null); }}>
                                    {tamanho}
                                </Dropdown.Item>
                            ))}
                        </Dropdown.Menu>
                    </Dropdown>

                    <Dropdown>
                        <Dropdown.Toggle style={{
                            fontFamily: 'Montserrat, sans-serif',
                            fontWeight: 'bold',
                            cursor: 'pointer',
                            border: 'none',
                            backgroundColor: 'black',
                            color: 'white',
                            width: '160px',
                        }} id="dropdown-preco">
                            {ordemPreco ? (ordemPreco === 'maior' ? 'Maior Primeiro' : 'Menor Primeiro') : 'Preço'}
                        </Dropdown.Toggle>
                        <Dropdown.Menu style={{ backgroundColor: 'black', color: 'white' }}>
                            <Dropdown.Item style={{ backgroundColor: 'black', color: 'white' }} onClick={() => { setOrdemPreco(null); }}>Todos</Dropdown.Item>
                            <Dropdown.Item style={{ backgroundColor: 'black', color: 'white' }} onClick={() => setOrdemPreco('menor')}>Menor Preço</Dropdown.Item>
                            <Dropdown.Item style={{ backgroundColor: 'black', color: 'white' }} onClick={() => setOrdemPreco('maior')}>Maior Preço</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </div>

                <Row>
                    {produtos.map(produto => (
                        <Col md={2} key={produto.id} className="mb-4">
                            <Link href={`/paginas/produtos/${produto.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                <Card style={{ border: 'none', display: 'flex', flexDirection: 'column', height: '100%' }}>
                                    <Card.Img
                                        variant="top"
                                        src={produto.imagem}
                                        style={{ objectFit: 'contain', height: '300px', width: '100%', border: '2px solid black', borderRadius: '07px' }}
                                    />
                                    <Card.Body style={{ padding: '0', marginTop: '5px', flexGrow: 1 }}>
                                        <Card.Title style={{ margin: '0', fontFamily: 'Montserrat, sans-serif', fontWeight: '900', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '100%' }}>
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
