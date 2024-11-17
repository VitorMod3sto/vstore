'use client'

import Pagina from "@/app/components/Pagina";
import Link from "next/link";
import { Button, Card, Col, Form, Row } from "react-bootstrap";
import { FaTrashAlt, FaPen, FaPlus, FaSearch } from "react-icons/fa";
import { MdFormatListBulletedAdd } from "react-icons/md";
import { useEffect, useState } from "react";
import { MdOutlineWysiwyg } from "react-icons/md";

export default function Page() {

    const [categorias, setCategorias] = useState([]);
    const [search, setSearch] = useState('');
    const [categoriaFiltrada, setCategoriaFiltrada] = useState([]);

    useEffect(() => {
        const dados = JSON.parse(localStorage.getItem('categorias')) || [];
        setCategorias(dados);
        setCategoriaFiltrada(dados);
    }, []);

    function buscarCategoria() {
        setCategoriaFiltrada(
            categorias.filter(item =>
                item.nome.toLowerCase().includes(search.toLowerCase())
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
            <div style={{ backgroundColor: '#000', padding: '20px', borderRadius: '10px' }}>
                
                <h2 className="text-center mb-3" style={{ color: 'white' }}>
                    Categorias de produtos
                    <MdOutlineWysiwyg className="ms-2" style={{ display: 'inline-block' }} />
                </h2>

                <Form className="mb-2 d-flex">
                    <Form.Group controlId="search" className="flex-grow-1">
                        <Form.Control
                            type="text"
                            placeholder="Pesquisar categoria..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            style={{ borderRadius: '10px', backgroundColor: 'white', color: 'black' }}
                        />
                    </Form.Group>

                    <Button variant="light" onClick={buscarCategoria} style={{ color: 'black', fontWeight: 'bold', border: '2px solid white' }} className="ms-2">
                        <FaSearch style={{ marginBottom: '3px' }} /> Buscar
                    </Button>
                </Form>

                <div className="d-flex justify-content-start mb-1">
                    <Link href="/categorias/form" className="btn btn-light mb-1" style={{ fontWeight: 'bold', color: 'black', border: '2px solid white' }}>
                        <MdFormatListBulletedAdd style={{ marginBottom: '4px', fontSize: '20px' }} /> Adicionar
                    </Link>
                </div>

                <Row className="g-3">
                    {categoriaFiltrada.map(item => (
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
                                            href={`/categorias/form/${item.id}`}
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
