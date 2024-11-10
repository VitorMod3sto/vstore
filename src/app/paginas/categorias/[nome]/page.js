'use client';

import Pagina2 from "@/app/components/Pagina2";
import Link from "next/link";
import { useEffect, useState } from 'react';
import { Row, Col, Card, Dropdown, Container } from 'react-bootstrap';
import { BiLogoVuejs } from "react-icons/bi";

export default function Page({ params }) {
    const [loading, setLoading] = useState(true);

    const [produtos, setProdutos] = useState([]);
    // Estado para armazenar todos os produtos

    const [marcas, setMarcas] = useState([]);
    // Estado para armazenar as marcas

    const [tamanhos, setTamanhos] = useState([]);
    // Estado para armazenar os tamanhos

    const [marcaSelecionada, setMarcaSelecionada] = useState(null);
    // Estado para armazenar a marca selecionada (iniciada como null)

    const [tamanhoSelecionado, setTamanhoSelecionado] = useState(null);
    // Estado para armazenar o tamanho selecionado (iniciado como null)

    const [ordemPreco, setOrdemPreco] = useState(null);
    // Estado para armazenar a ordem de exibição dos produtos por preço

    useEffect(() => {
        // useEffect para executar as linhas abaixo ao montar o componente (sempre que atualizar da url também)
        const produtosLocal = JSON.parse(localStorage.getItem('produtos')) || [];
        //Armazenando todos os produtos salvos
        const categoriaNome = decodeURIComponent(params.nome);
        // Armazenando o nome da categoria através da url
        const produtosCategoria = produtosLocal.filter(produto => produto.categoria === categoriaNome);
        // Armazenando os produtos que o atributo produto.categoria = mesmo nome do params
        setProdutos(produtosCategoria);
        // Atualizando os produtos com os produtos da categoria atual

        const marcasLocal = JSON.parse(localStorage.getItem('marcas')) || [];
        // Armazenando todas as marcas salvas

        const tamanhosLocal = [...new Set(produtosCategoria.map(produto => produto.tamanho))];
        // Armazenando apenas os tamanhos de produtos dos produtos da categoria atual
        setMarcas(marcasLocal);
        // Atualizando as marcas com as marcas salvas no LocalStorage
        setTamanhos(tamanhosLocal);
        // Atualizando os tamanhos com os tamanhos dos produtos da categoria
        setLoading(false);
    }, []);

    const filtrarProdutos = () => {
        // Criando função pra filtrar os produtos
        const produtosLocal = JSON.parse(localStorage.getItem('produtos')) || [];
        //Armazenando todos os produtos salvos

        const categoriaNome = decodeURIComponent(params.nome);
        // Armazenando o nome da categoria através da url

        let produtosFiltrados = produtosLocal.filter(produto => produto.categoria === categoriaNome);
        // Armazenando apenas os produtos da categoria atual(do params)

        if (marcaSelecionada) {
            produtosFiltrados = produtosFiltrados.filter(produto => produto.marca === marcaSelecionada);
        }

        if (tamanhoSelecionado) {
            produtosFiltrados = produtosFiltrados.filter(produto => produto.tamanho === tamanhoSelecionado);
        }

        if (ordemPreco) {
            produtosFiltrados.sort((a, b) => ordemPreco === 'maior' ? b.preco - a.preco : a.preco - b.preco);
        }
        // Verfica acima se foi alterado o valor de marcaSelecionada, tamanho e ordemPreço
        setProdutos(produtosFiltrados);     
            // Atualiza os produtos com apenas os filtrados
    };

    useEffect(() => {
        // Definindo o useEffect pra função de filtro pra ela ser chamada sempre que os filtros mudarem
        filtrarProdutos();
    }, [marcaSelecionada, tamanhoSelecionado, ordemPreco]);

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
        <Pagina2 titulo='Categoria'>
            <Container fluid className="px-0">

          {/* TÍTULO DA PÁGINA COM A CATEGORIA */}
                <h2 style={{
                    fontFamily: 'Montserrat, sans-serif', fontWeight: '900',
                    textAlign: 'center', fontSize: '35px', marginTop: '05px', marginBottom: '20px'
                }}>
                    {decodeURIComponent(params.nome)}
                </h2>

                {/* FILTROS  */}
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
                                <Dropdown.Item key={marca.id} style={{ backgroundColor: 'black', color: 'white' }} onClick={() => { setMarcaSelecionada(marca.nome); setOrdemPreco(null); }}>
                                    {marca.nome}
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
                            <Dropdown.Item style={{ backgroundColor: 'black', color: 'white' }} onClick={() => { setOrdemPreco(null); setOrdemPreco(null); }}>Todos</Dropdown.Item>
                            <Dropdown.Item style={{ backgroundColor: 'black', color: 'white' }} onClick={() => setOrdemPreco('menor')}>Menor Preço</Dropdown.Item>
                            <Dropdown.Item style={{ backgroundColor: 'black', color: 'white' }} onClick={() => setOrdemPreco('maior')}>Maior Preço</Dropdown.Item>
                        </Dropdown.Menu>

                    </Dropdown>
                </div>

          {/* CARDS DOS PRODUTOS */}
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
