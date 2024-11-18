'use client'
import Pagina from "@/app/components/Pagina";
import Link from "next/link";
import { Card, Button, Row, Col, Form, Modal } from "react-bootstrap";
import { FaTrashAlt, FaPen, FaSearch, FaInfoCircle } from "react-icons/fa";
import { useEffect, useState } from "react";
import { FaTruckLoading } from "react-icons/fa";
import { IoIosClose } from "react-icons/io";
import { LuPackagePlus } from "react-icons/lu";


export default function Page() {
    const [produtos, setProdutos] = useState([]);
    const [search, setSearch] = useState('');
    const [produtosFiltrados, setProdutosFiltrados] = useState([]);

    useEffect(() => {
        const dados = JSON.parse(localStorage.getItem('produtos')) || [];
        setProdutos(dados);
        setProdutosFiltrados(dados);
    }, []);

    const [showModal, setShowModal] = useState(false);
    const [produtoSelecionado, setProdutoSelecionado] = useState(null);

    function buscarProdutos() {
        setProdutosFiltrados(
            produtos.filter(item =>
                item.nome.toLowerCase().includes(search.toLowerCase())
            )
        );
    }

    function excluir(id) {
        if (confirm('Deseja realmente excluir?')) {
            const dados = produtos.filter(item => item.id !== id);
            localStorage.setItem('produtos', JSON.stringify(dados));
            setProdutos(dados);
            setProdutosFiltrados(dados);
        }
    }

    function abrirModal(produto) {
        setProdutoSelecionado(produto);
        setShowModal(true);
    }

    function fecharModal() {
        setShowModal(false);
        setProdutoSelecionado(null);
    }

    return (
        <Pagina titulo="Produtos">
            <div style={{ backgroundColor: '#000', padding: '20px', borderRadius: '10px' }}>
                <h2 className="text-center mb-3" style={{ color: 'white' }}>
                    Estoque de Produtos
                    <FaTruckLoading className="ms-2" style={{ display: 'inline-block' }} />
                </h2>

                <Form className="mb-2 d-flex">
                    <Form.Group controlId="search" className="flex-grow-1">
                        <Form.Control
                            type="text"
                            placeholder="Pesquisar produto..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            style={{ borderRadius: '10px', backgroundColor: 'white', color: 'black' }}
                        />
                    </Form.Group>
                    <Button variant="light" onClick={buscarProdutos} style={{ color: 'black', fontWeight: 'bold', border: '2px solid white' }} className="ms-2">
                        <FaSearch style={{ marginBottom: '3px' }} /> Buscar
                    </Button>
                </Form>

                <Link href="/produtos/form" className="btn btn-light mb-2" style={{ fontWeight: 'bold', color: 'black', border: '2px solid white' }}>
                    <LuPackagePlus style={{ marginBottom: '4px' }} /> Adicionar
                </Link>

                <Row xs={1} md={2} lg={4} className="g-3">
                    {produtosFiltrados.map(item => (
                        <Col key={item.id}>
                            <Card style={{ backgroundColor: 'black', color: 'white', border: '1px solid white', height: '410px' }}>
                                <Card.Img
                                    style={{ margin: '5px auto', width: '95%', height: '200px', borderRadius: '5px' }}
                                    variant="top"
                                    src={item.imagem}
                                />
                                <Card.Body className="d-flex flex-column text-center" style={{ height: '100%' }}>
                                    <div className="flex-grow-1">
                                        <Card.Title style={{
                                            width: '200px',
                                            whiteSpace: 'nowrap',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            textAlign: 'center'
                                        }}>
                                            <b>{item.nome}</b>
                                        </Card.Title>
                                        <Card.Text>
                                            <strong>Tamanho: </strong>{item.tamanho} <br />
                                            <strong>Quantidade:</strong> {item.quantidade}<br />
                                            <strong>Cor:</strong> {item.cor}
                                        </Card.Text>
                                    </div>

                                    <div className="d-flex justify-content-between align-items-center mt-auto">
                                        <Link
                                            href={`/produtos/form/${item.id}`}
                                            className="btn btn-primary btn-sm"
                                            style={{ backgroundColor: 'white', color: 'black', fontWeight: 'bold' }}
                                        >
                                            <FaPen style={{ marginBottom: '2px' }} /> Editar
                                        </Link>

                                        <Button
                                            variant="danger"
                                            style={{ backgroundColor: 'white', color: 'black', fontWeight: 'bold' }}
                                            className="ms-1"
                                            size="sm"
                                            onClick={() => excluir(item.id)}
                                        >
                                            <FaTrashAlt style={{ marginBottom: '2px' }} /> Excluir
                                        </Button>

                                        <Button
                                            variant="info"
                                            className="ms-1"
                                            size="sm"
                                            onClick={() => abrirModal(item)}
                                            style={{
                                                backgroundColor: 'white',
                                                color: 'black',
                                                fontWeight: 'bold',
                                                borderRadius: '50%', // Botão redondo
                                                width: '30px', // Diminuir largura
                                                height: '30px', // Diminuir altura
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }}
                                        >
                                            <FaInfoCircle />
                                        </Button>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>

                <Modal show={showModal} onHide={fecharModal}>
                    <Modal.Header style={{ backgroundColor: 'black', color: 'white' }}>
                        <Modal.Title><b>{produtoSelecionado?.nome}</b></Modal.Title>
                    </Modal.Header>
                    <Modal.Body style={{ backgroundColor: 'black', color: 'white' }}>
                        <p><strong>Descrição:</strong> {produtoSelecionado?.descricao || 'Sem descrição'}</p>
                        <p><strong>Preço:</strong> R$ {produtoSelecionado?.preco.toFixed(2)}</p>
                        <p><strong>Quantidade: </strong> {produtoSelecionado?.quantidade}</p>
                        <p><strong>Tamanho: </strong> {produtoSelecionado?.tamanho}</p>
                        <p><strong>Cor: </strong> {produtoSelecionado?.cor}</p>
                        <p><strong>Marca: </strong> {produtoSelecionado?.marca}</p>
                        <p><strong>Gênero: </strong> {produtoSelecionado?.genero}</p>
                        <img src={produtoSelecionado?.imagem} alt={produtoSelecionado?.nome} style={{ width: '170px', borderRadius: '5px', display: 'block', margin: '0 auto' }} />
                    </Modal.Body>
                    <Modal.Footer style={{ backgroundColor: 'black', color: 'white' }}>
                        <Link
                            href={`/produtos/form/${produtoSelecionado?.id}`}
                            className="btn btn-primary btn-sm"
                            style={{ backgroundColor: 'white', color: 'black', fontWeight: 'bold' }}
                        >
                            <FaPen style={{ marginBottom: '2px' }} /> Editar
                        </Link>
                        <Button
                            style={{
                                backgroundColor: 'white',
                                color: 'black',
                                fontWeight: 'bold',
                                fontSize: '14px', // Ajustado para o mesmo tamanho do botão Editar
                                padding: '5px 15px'
                            }}
                            onClick={fecharModal}
                        >
                            <IoIosClose style={{ marginTop: '-2px' }} /> Fechar
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        </Pagina>
    );
}
