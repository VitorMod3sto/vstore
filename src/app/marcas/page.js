'use client'

import Pagina from "@/app/components/Pagina";
import Link from "next/link";
import { Button, Card, Col, Form, Row } from "react-bootstrap";
import { FaTrashAlt, FaPen, FaPlus, FaSearch } from "react-icons/fa";
import { BiLogoCreativeCommons } from "react-icons/bi";


import { useEffect, useState } from "react";

export default function Page() {

    const [marcas, setMarcas] = useState([]);
    // Estado para armazenar todas as marcas

    const [search, setSearch] = useState('');
    // Estado para armazenar o valor (texto) da busca na barra de pesquisa

    const [marcasFiltradas, setMarcasFiltradas] = useState([]);
    // Estado para armazenar as marcas filtrada

    useEffect(() => {
        // useEffect para carregar as marcas do localStorage ao montar o componente
        const dados = JSON.parse(localStorage.getItem('marcas')) || [];
        // Carregando as marcas do localStorage (usando JSON parse para converter de string para objeto JavaScript)
        setMarcas(dados);
        // Atualizando o estado das marcas 
        setMarcasFiltradas(dados);
        // Inicializando as marcas filtrados com todas as marcas 
    }, []);

    // Função para realizar a busca das marcas 
    function buscarMarca() {
        setMarcasFiltradas(
            // Atualizando estado das marcas filtrados (iniciado com todos as marcas anteriormente)
            marcas.filter(item =>
                // Filtrando as marcas com base no nome
                item.nome.toLowerCase().includes(search.toLowerCase())
                // Transformando o nome e a busca em minúsculas para evitar conflitos
            )
        );
    }
    function excluir(id) {
        if (confirm('Deseja realmente excluir?')) {
            const dados = marcas.filter(item => item.id !== id);
            localStorage.setItem('marcas', JSON.stringify(dados));
            setMarcas(dados);
            setMarcasFiltradas(dados);
        }
    }

    return (
        <Pagina titulo="Marcas">
            <div style={{ backgroundColor: '#003366', padding: '20px', borderRadius: '10px' }}>

                <h2 className="text-center mb-3" style={{ textShadow: '2.5px 2.5px 0 black, 2.5px -2.5px 0 black, -2.5px 2.5px 0 black, -2.5px -2.5px 0 black', color: 'white' }}>
                    {/* TÍTULO DA PÁGINA  */}
                    Marcas de Produtos
                    <BiLogoCreativeCommons className="ms-2" style={{ display: 'inline-block', filter: 'drop-shadow(1.5px 2px 0 black) drop-shadow(-2px -2px 0 black) drop-shadow(2px -2px 0 black) drop-shadow(-1.5px 2px 0 black)' }} />
                </h2>

                {/* FORMULÁRIO DE BUSCA */}
                <Form className="mb-2 d-flex">
                    <Form.Group controlId="search" className="flex-grow-1">
                        <Form.Control
                            type="text"
                            placeholder="Pesquisar produto..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            style={{ borderRadius: '10px' }}
                        />
                    </Form.Group>

                    <Button variant="light" onClick={buscarMarca} style={{ color: '#003366', fontWeight: 'bold', border: '2px solid white' }} className="ms-2">
                        <FaSearch style={{ marginBottom: '3px' }} /> Buscar
                    </Button>
                </Form>

                {/* BOTÃO PARA ADICIONAR MARCA */}
                <div className="d-flex justify-content-start mb-1">
                    <Link href="/marcas/form" className="btn btn-light mb-1" style={{ fontWeight: 'bold', color: '#003366', border: '2px solid white' }}>
                        <FaPlus style={{ marginBottom: '4px' }} /> Adicionar
                    </Link>
                </div>

                {/* DEFININDO EXIBIÇÃO DAS MARCAS (USANDO ROW, COL E CARD) */}
                <Row className="g-3">
                    {marcasFiltradas.map(item => (
                        <Col key={item.id} xs={12} sm={6} md={2.4} lg={3} xl={3}>
                            <Card style={{ width: '100%', height: '190px', border: '2px solid white', backgroundColor: '#003366', color: 'white', }}>
                                
                                <Card.Header style={{ borderBottom: '2px solid white', backgroundColor: 'white', color: '#003366' }} className="text-center">
                                    <strong>{item.nome}</strong>
                                    </Card.Header>

                                <Card.Body className="d-flex flex-column" style={{ paddingBottom: '3px' }}>
                                    <Card.Text className="flex-grow-1 text-center">
                                        {item.descricao.length > 95 ? `${item.descricao.substring(0, 95)}...` : item.descricao}
                                    </Card.Text>

                                    <div className="d-flex justify-content-center align-items-end" style={{ marginTop: 'auto' }}>
                                        <Link
                                            href={`/marcas/form/${item.id}`}
                                            className="btn btn-primary btn-sm me-2"
                                            style={{ backgroundColor: 'white', color: '#003366', fontWeight: 'bold' }}
                                        >
                                            <FaPen style={{ marginBottom: '3px' }} /> Editar
                                        </Link>

                                        <Button
                                            variant="danger"
                                            style={{ fontWeight: 'bold', marginBottom: '0' }}
                                            className="ms-1"
                                            size="sm"
                                            onClick={() => excluir(item.id)}
                                        >
                                            <FaTrashAlt style={{ marginBottom: '3px' }} /> Excluir
                                        </Button>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </div>
        </Pagina>
    );
}
