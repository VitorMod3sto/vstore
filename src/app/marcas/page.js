'use client'

import Pagina from "@/app/components/Pagina";
import Link from "next/link";
import { Button, Card, Col, Form, Row } from "react-bootstrap";
import { FaTrashAlt, FaPen, FaPlus, FaSearch } from "react-icons/fa";
import { BiLogoCreativeCommons } from "react-icons/bi";

import { useEffect, useState } from "react";

export default function Page() {

    const [marcas, setMarcas] = useState([]);
    const [search, setSearch] = useState('');
    const [marcasFiltradas, setMarcasFiltradas] = useState([]);

    useEffect(() => {
        const dados = JSON.parse(localStorage.getItem('marcas')) || [];
        setMarcas(dados);
        setMarcasFiltradas(dados);
    }, []);

    function buscarMarca() {
        setMarcasFiltradas(
            marcas.filter(item =>
                item.nome.toLowerCase().includes(search.toLowerCase())
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
            <div style={{ backgroundColor: '#000', padding: '20px', borderRadius: '10px' }}>

                <h2 className="text-center mb-3" style={{  color: 'white' }}>
                    Marcas de Produtos
                    <BiLogoCreativeCommons className="ms-2" style={{ display: 'inline-block' }} />
                </h2>

                <Form className="mb-2 d-flex">
                    <Form.Group controlId="search" className="flex-grow-1">
                        <Form.Control
                            type="text"
                            placeholder="Pesquisar marca..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            style={{ borderRadius: '10px', backgroundColor: 'white', color: 'black' }}
                        />
                    </Form.Group>

                    <Button variant="light" onClick={buscarMarca} style={{ color: 'black', fontWeight: 'bold', border: '2px solid white' }} className="ms-2">
                        <FaSearch style={{ marginBottom: '3px' }} /> Buscar
                    </Button>
                </Form>

                <div className="d-flex justify-content-start mb-1">
                    <Link href="/marcas/form" className="btn btn-light mb-1" style={{ fontWeight: 'bold', color: 'black', border: '2px solid white' }}>
                        <FaPlus style={{ marginBottom: '4px' }} /> Adicionar
                    </Link>
                </div>

                <Row className="g-3">
                    {marcasFiltradas.map(item => (
                        <Col key={item.id} xs={12} sm={6} md={4} lg={3}>
                            <Card style={{ width: '100%', height: '190px', border: '1px solid white', backgroundColor: 'black', color: 'white' }}>
                                <Card.Header style={{ borderBottom: '1px solid white', backgroundColor: 'white', color: 'black' }} className="text-center">
                                    <strong>{item.nome}</strong>
                                </Card.Header>

                                <Card.Body className="d-flex flex-column">
                                    <Card.Text className="flex-grow-1 text-center">
                                        {item.descricao.length > 95 ? `${item.descricao.substring(0, 95)}...` : item.descricao}
                                    </Card.Text>

                                    <div className="d-flex justify-content-center align-items-end mt-auto">
                                        <Link
                                            href={`/marcas/form/${item.id}`}
                                            className="btn btn-primary btn-sm me-2"
                                            style={{ backgroundColor: 'white', color: 'black', fontWeight: 'bold' }}
                                        >
                                            <FaPen style={{ marginBottom: '3px' }} /> Editar
                                        </Link>

                                        <Button
                                            variant="danger"
                                            style={{ backgroundColor: 'white', color: 'black', fontWeight: 'bold' }}
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
