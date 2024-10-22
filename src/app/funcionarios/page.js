'use client'

import Pagina from "@/app/components/Pagina";
import Link from "next/link";
import { Button, Card, Col, Form, Row } from "react-bootstrap";
import { FaTrashAlt, FaPen, FaPlus, FaSearch } from "react-icons/fa";
import { IoPerson, IoPersonCircle } from "react-icons/io5";
import { BsPersonFillCheck } from "react-icons/bs";


import { useEffect, useState } from "react";
import { IoMdPersonAdd } from "react-icons/io";


export default function Page() {

    const [funcionarios, setFuncionarios] = useState([]);
    // Estado para armazenar todos os funcionários

    const [search, setSearch] = useState('');
    // Estado para armazenar o valor (texto) da busca na barra de pesquisa

    const [funcionariosFiltrados, setFuncionariosFiltrados] = useState([]);
    // Estado para armazenar os funcionários filtrados

    useEffect(() => {
        // useEffect para carregar os funcionários do localStorage ao montar o componente
        const dados = JSON.parse(localStorage.getItem('funcionarios')) || [];
        // Carregando os funcionários do localStorage
        setFuncionarios(dados);
        // Atualizando o estado dos funcionários 
        setFuncionariosFiltrados(dados);
        // Inicializando os funcionários filtrados com todos os funcionários 
    }, []);

    // Função para realizar a busca dos funcionários 
    function buscarFuncionario() {
        setFuncionariosFiltrados(
            // Atualizando estado dos funcionários filtrados
            funcionarios.filter(item =>
                // Filtrando os funcionários com base no nome ou cargo
                item.nome.toLowerCase().includes(search.toLowerCase()) ||
                item.cargo.toLowerCase().includes(search.toLowerCase())
                // Transformando o nome, cargo e a busca em minúsculas para evitar conflitos
            )
        );
    }

    function excluir(id) {
        if (confirm('Deseja realmente excluir?')) {
            const dados = funcionarios.filter(item => item.id !== id);
            localStorage.setItem('funcionarios', JSON.stringify(dados));
            setFuncionarios(dados);
            setFuncionariosFiltrados(dados);
        }
    }

    return (
        <Pagina titulo="Funcionários">
            <div style={{ backgroundColor: '#003366', padding: '20px', borderRadius: '10px' }}>

                <h2 className="text-center mb-3" style={{ textShadow: '2.5px 2.5px 0 black, 2.5px -2.5px 0 black, -2.5px 2.5px 0 black, -2.5px -2.5px 0 black', color: 'white' }}>
                    Funcionários
                    <IoPersonCircle className="ms-2" style={{ display: 'inline-block', filter: 'drop-shadow(1.5px 2px 0 black) drop-shadow(-2px -2px 0 black) drop-shadow(2px -2px 0 black) drop-shadow(-1.5px 2px 0 black)' }} />
                </h2>

                {/* FORMULÁRIO DE BUSCA */}
                <Form className="mb-2 d-flex">
                    <Form.Group controlId="search" className="flex-grow-1">
                        <Form.Control
                            type="text"
                            placeholder="Pesquisar funcionário..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            style={{ borderRadius: '10px' }}
                        />
                    </Form.Group>

                    <Button variant="light" onClick={buscarFuncionario} style={{ color: '#003366', fontWeight: 'bold', border: '2px solid white' }} className="ms-2">
                        <FaSearch style={{ marginBottom: '3px' }} /> Buscar
                    </Button>
                </Form>

                {/* BOTÃO PARA ADICIONAR FUNCIONÁRIO */}
                <div className="d-flex justify-content-start mb-1">
                    <Link href="/funcionarios/form" className="btn btn-light mb-1" style={{ fontWeight: 'bold', color: '#003366', border: '2px solid white' }}>
                        <IoMdPersonAdd style={{ marginBottom: '4px' }} /> Adicionar
                    </Link>
                </div>

                {/* DEFININDO EXIBIÇÃO DOS FUNCIONÁRIOS (USANDO ROW, COL E CARD) */}
                <Row className="g-3">
    {funcionariosFiltrados.map(item => (
        <Col key={item.id} xs={12} sm={6} md={4} lg={3}>
            <Card style={{
                width: '100%',
                height: 'auto', // Ajustar para auto para permitir o crescimento do card
                border: 'none', // Remover borda
                borderRadius: '15px', // Bordas arredondadas
                backgroundColor: '#ffffff', // Fundo branco para contraste
                color: '#003366',
                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)', // Sombra suave
                padding: '10px', // Padding interno
            }}>
                <Card.Header style={{
                    backgroundColor: '#003366',
                    color: 'white',
                    textAlign: 'center',
                    borderRadius: '15px 15px 0 0' // Arredondar apenas o topo
                }}>
                    <strong>{item.nome} <BsPersonFillCheck  style={{ marginBottom: '4px' }}/></strong>
                </Card.Header>

                <Card.Body className="d-flex flex-column" style={{ padding: '10px' }}>
                    <Card.Text className="flex-grow-1 text-center" style={{ marginBottom: '10px' }}>
                        <strong>Cargo:</strong> {item.cargo}<br />
                        <strong>E-mail:</strong> {item.email}<br />
                        <strong>Telefone:</strong> {item.telefone}<br />
                        <strong>Endereço:</strong> {item.endereco.replace(/Quadra/gi, '').trim().slice(0, 22) + (item.endereco.length > 20 ? '...' : '')}

                    </Card.Text>

                    <div className="d-flex justify-content-center" style={{ marginTop: 'auto' }}>
                        <Link
                            href={`/funcionarios/form/${item.id}`}
                            className="btn btn-primary btn-sm me-2"
                            style={{
                                backgroundColor: '#003366',
                                color: 'white',
                                fontWeight: 'bold',
                                borderRadius: '5px',
                                padding: '5px 10px'
                            }}
                        >
                            <FaPen style={{ marginBottom: '3px' }} /> Editar
                        </Link>

                        <Button
                            variant="danger"
                            style={{
                                fontWeight: 'bold',
                                marginBottom: '0',
                                borderRadius: '5px',
                                padding: '3px 10px'
                            }}
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
