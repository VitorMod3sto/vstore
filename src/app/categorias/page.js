'use client'

import Pagina from "@/app/components/Pagina";
import Link from "next/link";
import { Button, Card, Col, Form, Row } from "react-bootstrap";
import { FaTrashAlt, FaPen, FaPlus, FaSearch } from "react-icons/fa";
import { MdFormatListBulletedAdd } from "react-icons/md";


import { useEffect, useState } from "react";
import {  MdOutlineWysiwyg } from "react-icons/md";

export default function Page() {

    const [categorias, setCategorias] = useState([]);
    //Estado para armazenar todas as categorias

    const [search, setSearch] = useState('');
    // Estado para armazenar o valor (texto) da busca na barra de pesquisa

    const [categoriaFiltrada, setCategoriaFiltrada] = useState([]);
    // Estado para armazenar a categoria filtrada


    useEffect(() => {
        // useEffect para carregar as categorias do localStorage ao montar o componente
        const dados = JSON.parse(localStorage.getItem('categorias')) || [];
        // Carregando categorias do localStorage (usando JSON parse para converter de string para objeto JavaScript)
        setCategorias(dados);
        // Atualizando o estado das categorias
        setCategoriaFiltrada(dados);
        // Inicializando os produtos filtrados com todas as categorias
    }, []);

    // Criando função para realizar a busca das categorias
    function buscarCategoria() {
        setCategoriaFiltrada(
            // Atualizando estado das categorias filtradas (iniciado com todas as categorias anteriormente)
            categorias.filter(item =>
                // Filtrando as categorias com base no nome
                item.nome.toLowerCase().includes(search.toLowerCase())
                // Transformando o nome e a busca em minúsculas para evitar conflitos
            )
        );
    }
    function excluir(id) {
        if (confirm('Deseja realmente excluir?')) {
            const dados = categorias.filter(item => item.id !== id);
            localStorage.setItem('categorias', JSON.stringify(dados));
            setCategorias(dados);
            setCategoriaFiltrada(dados);
        }
    }

    return (
        <Pagina titulo="Categorias">
            <div style={{ backgroundColor: '#003366', padding: '20px', borderRadius: '10px' }}>
                
                <h2 className="text-center mb-3" style={{ textShadow: '2.5px 2.5px 0 black, 2.5px -2.5px 0 black, -2.5px 2.5px 0 black, -2.5px -2.5px 0 black', color: 'white' }}>
                    {/* TÍTULO DA PÁGINA  */}
                    Categorias de produtos
                    < MdOutlineWysiwyg className="ms-2" style={{ display: 'inline-block', filter: 'drop-shadow(1.5px 2px 0 black) drop-shadow(-2px -2px 0 black) drop-shadow(2px -2px 0 black) drop-shadow(-1.5px 2px 0 black)' }} />

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

                    <Button variant="light" onClick={buscarCategoria} style={{ color: '#003366', fontWeight: 'bold', border: '2px solid white' }} className="ms-2">
                        <FaSearch style={{ marginBottom: '3px' }} /> Buscar
                    </Button>
                </Form>

                {/* BOTÃO PARA ADICIONAR CATEGORIA */}
                <div className="d-flex justify-content-start mb-1">
                    <Link href="/categorias/form" className="btn btn-light mb-1" style={{ fontWeight: 'bold', color: '#003366', border: '2px solid white' }}>
                    <MdFormatListBulletedAdd style={{ marginBottom: '4px', fontSize: '20px' }} /> Adicionar
                    </Link>
                </div>

                {/* DEFININDO EXIBIÇÃO DAS CATEGORIAS (USANDO ROW, COL E CARD) */}
                <Row className="g-3">
                    {categoriaFiltrada.map(item => (
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
                                            href={`/categorias/form/${item.id}`}
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
