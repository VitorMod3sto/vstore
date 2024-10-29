'use client';

import { useState, useEffect } from 'react';
import Pagina2 from "@/app/components/Pagina2";
import { Row, Col, Card, Button, Carousel, Modal } from 'react-bootstrap';
import Link from 'next/link';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

export default function Page({ params }) {
    const [produto, setProduto] = useState({});
    const [showModal, setShowModal] = useState(false);
    const [tamanhoSelecionado, setTamanhoSelecionado] = useState('');
    const [tamanhoChecked, setTamanhoChecked] = useState(false);

    useEffect(() => {
        const produtos = JSON.parse(localStorage.getItem('produtos'));
        const dados = produtos.find(produto => produto.id === params.id);
        setProduto(dados);
    }, [params.id]);

    const precoParcelado = produto.preco ? (produto.preco / 10).toFixed(2) : '0.00';

    const handleShow = () => setShowModal(true);
    const handleClose = () => {
        setTamanhoChecked(false); // Limpa a checkbox ao fechar
        setShowModal(false);
    };

    const selecionarTamanho = () => {
        if (tamanhoChecked) {
            setTamanhoSelecionado(`${produto.tamanho} selecionado`);
        } else {
            setTamanhoSelecionado('');
        }
        handleClose(); // Fecha a modal após a seleção
    };

    return (
        <Pagina2 titulo="Detalhe do Produto">
            <Row className="align-items-start">
                <Col md={7} style={{ marginLeft: '67px' }}>
                    <Card style={{ border: "3px solid black" }}>
                        <Card.Body style={{ padding: 0 }}>
                            <Carousel
                                prevIcon={<FaChevronLeft style={{ fontSize: '24px', color: 'black' }} />}
                                nextIcon={<FaChevronRight style={{ fontSize: '24px', color: 'black' }} />}
                                interval={2000}
                            >
                                <Carousel.Item>
                                    <img
                                        src={produto.imagem}
                                        alt={produto.nome}
                                        style={{ width: '100%', height: '550px', objectFit: 'contain' }}
                                    />
                                </Carousel.Item>
                                <Carousel.Item>
                                    <img
                                        src={produto.imagem}
                                        alt={produto.nome}
                                        style={{ width: '100%', height: '550px', objectFit: 'contain' }}
                                    />
                                </Carousel.Item>
                            </Carousel>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={5} style={{ width: '500px', marginLeft: '-15px' }}>
                    <Card style={{ border: 'none' }}>
                        <Card.Body>
                            <h1 style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: '900', fontSize: '28px', marginBottom: '0' }}>{produto.nome}</h1>
                            <p style={{ fontFamily: 'Poppins, sans-serif', fontSize: '28px', fontWeight: 'bold', marginBottom: '0' }}>
                                R$ {produto.preco}
                            </p>
                            <p style={{ fontFamily: 'Poppins, sans-serif', marginTop: '-5px' }}>
                                ou em até 10x de: <b> R$ {(produto.preco / 10).toFixed(2)}</b>
                            </p>
                            <div style={{ borderBottom: '1px solid #ccc', margin: '10px 0' }} />

                            <div style={{ fontFamily: 'Montserrat, sans-serif', marginTop: '5px', marginBottom: '2px' }}>
                                <span style={{ display: 'flex', flexDirection: 'column' }}>
                                    <span style={{ cursor: 'pointer' }}>
                                        <img
                                            src={produto.imagem}
                                            alt={produto.cor}
                                            style={{
                                                width: '70px',
                                                height: '70px',
                                                marginBottom: '5px',
                                                border: '2px solid grey'
                                            }}
                                        />
                                    </span>
                                    <span>
                                        <b>Cores (1): </b>{produto.cor}
                                    </span>
                                </span>
                            </div>

                            <div style={{ borderBottom: '1px solid #ccc', margin: '10px 0' }} />
                            <div style={{ fontFamily: 'Montserrat, sans-serif', marginTop: '3px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} onClick={handleShow}>
                                <div>
                                    <b>Tamanho:</b>
                                    <div style={{ marginTop: '5px' }}  >
                                        {tamanhoSelecionado || `${produto.tamanho} disponível`}
                                    </div>
                                </div>
                                <span style={{ marginLeft: '5px', marginRight: '15px', fontSize: '18px', color: 'black', marginTop: '10px', fontSize: '25px' }}>➔</span>
                            </div>
                            <div style={{ borderBottom: '1px solid #ccc', margin: '10px 0' }} />

                            <Link href={`/`}>
                                <button style={{
                                    fontFamily: 'Montserrat, sans-serif',
                                    fontWeight: 'bold',
                                    backgroundColor: 'black',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '5px',
                                    padding: '10px 20px',
                                    cursor: 'pointer',
                                    width: '100%',
                                    height: '50px',
                                    marginTop: '170px'
                                }}>
                                    Comprar
                                </button>
                            </Link>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Modal para seleção de tamanho */}

            <Modal show={showModal} onHide={handleClose}>
                <Modal.Header>
                    <Modal.Title style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 'bold', fontWeight: '900' }}>
                        SELECIONE O TAMANHO
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 'bold', fontWeight: '900', marginLeft: '15px' }}>
                        Escolha o tamanho:</p>
                    <label style={{ marginLeft: '15px' }}>
                        <input
                            type="checkbox"
                            checked={tamanhoChecked}
                            onChange={() => setTamanhoChecked(!tamanhoChecked)}
                        /> {produto.tamanho}
                    </label>
                </Modal.Body>
                <Modal.Footer style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                    <Button variant="secondary" onClick={handleClose} style={{
                        fontFamily: 'Montserrat, sans-serif',
                        fontWeight: 'bold',
                        backgroundColor: 'black',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        padding: '8px 16px',
                        cursor: 'pointer',
                        height: '40px',
                        marginBottom: '5px'
                    }}>
                        Fechar
                    </Button>
                    <Button variant="primary" onClick={selecionarTamanho} style={{
                        fontFamily: 'Montserrat, sans-serif',
                        fontWeight: 'bold',
                        backgroundColor: 'black',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        padding: '8px 16px',
                        cursor: 'pointer',
                        height: '40px',
                        marginBottom: '5px'
                    }}>
                        Selecionar
                    </Button>
                </Modal.Footer>

            </Modal>

        </Pagina2>
    );
}
