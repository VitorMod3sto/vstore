'use client'
import Pagina from "@/app/components/Pagina";
import Link from "next/link";
import { Card, Button, Row, Col, Form, Modal } from "react-bootstrap";
import { FaTrashAlt, FaPen, FaPlus, FaSearch, FaInfoCircle } from "react-icons/fa";
import { useEffect, useState } from "react";
import { FaTruckLoading } from "react-icons/fa";
import { IoIosClose } from "react-icons/io";
import { LuPackagePlus } from "react-icons/lu";


export default function Page() {
    const [produtos, setProdutos] = useState([]);
    // Estado para armazenar os produtos

    const [search, setSearch] = useState('');
    // Estado para armazenar o valor (texto) da busca na barra de pesquisa

    const [produtosFiltrados, setProdutosFiltrados] = useState([]);
    // Estado para armazenar produtos filtrados pela busca

    useEffect(() => {
        // useEffect para carregar os produtos do localStorage ao montar o componente
        const dados = JSON.parse(localStorage.getItem('produtos')) || [];
        // Carregando produtos do localStorage (usando JSON parse para converter de string para objeto JavaScript)
        setProdutos(dados);
        // Atualizando o estado dos produtos
        setProdutosFiltrados(dados);
        // Inicializando os produtos filtrados com todos os produtos
    }, []);

    const [showModal, setShowModal] = useState(false);
    // Estado para controlar a visibilidade do modal
    // Definindo false para não exibir a modal (inicia nesse estado)

    const [produtoSelecionado, setProdutoSelecionado] = useState(null);
    // Estado para armazenar o produto selecionado para exibição no modal



    // Função para realizar a busca de produtos
    function buscarProdutos() {
        setProdutosFiltrados(
            // Atualizando estado dos produtos filtrados (iniciado com todos os produtos anteriormente)
            produtos.filter(item =>
                // Filtrando produtos com base no nome
                item.nome.toLowerCase().includes(search.toLowerCase())
                // Transformando o nome do produto e a busca em minúsculas para evitar conflitos
            )
        );
    }

    // Função para excluir um produto com base no seu ID
    function excluir(id) {
        if (confirm('Deseja realmente excluir?')) { // Alerta de confirmação antes de excluir
            const dados = produtos.filter(item => item.id !== id);
            // Filtrando o produto a ser excluído através do id
            localStorage.setItem('produtos', JSON.stringify(dados));
            // Atualizando o localStorage com os produtos atuais após exclusão
            setProdutos(dados);
            // Atualizando o estado dos produtos (com os produtos atualizados)
            setProdutosFiltrados(dados);
            // Atualizando o estado dos produtos filtrados (com os produtos atualizados)
        }
    }

    // Função para abrir o modal com detalhes do produto
    function abrirModal(produto) {
        setProdutoSelecionado(produto);
        setShowModal(true);
        // Mudando o estado da modal pra true e exibindo a modal

    }

    // Função para fechar o modal
    function fecharModal() {
        setShowModal(false);
        // Novamente tornando a modal false para escondê-la
        setProdutoSelecionado(null);
        // Limpando o produto selecionado pra null (para que ao abrir nova modal não repita o mesmo produto)
    }

    return (
        <Pagina titulo="Produtos">
            <div style={{ backgroundColor: '#003366', padding: '20px', borderRadius: '10px' }}>
                {/* TÍTULO DA PÁGINA */}
                <h2 className="text-center mb-3" style={{ textShadow: '2.5px 2.5px 0 black, 2.5px -2.5px 0 black, -2.5px 2.5px 0 black, -2.5px -2.5px 0 black', color: 'white' }}>
                    Estoque de Produtos
                    <FaTruckLoading className="ms-2" style={{ display: 'inline-block', filter: 'drop-shadow(1.5px 2px 0 black) drop-shadow(-2px -2px 0 black) drop-shadow(2px -2px 0 black) drop-shadow(-1.5px 2px 0 black)' }} />
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

                    <Button variant="light" onClick={buscarProdutos} style={{ color: '#003366', fontWeight: 'bold', border: '2px solid white' }} className="ms-2">
                        <FaSearch style={{ marginBottom: '3px' }} /> Buscar
                    </Button>
                </Form>

                {/* BOTÃO PARA ADICIONAR PRODUTO */}
                <Link href="/produtos/form" className="btn btn-light mb-2" style={{ fontWeight: 'bold', color: '#003366', border: '2px solid white' }}>
                    <LuPackagePlus style={{ marginBottom: '4px' }} /> Adicionar
                </Link>

                {/* DEFININDO EXIBIÇÃO DOS PRODUTOS (USANDO ROW, COL E CARD) */}
                <Row xs={1} md={2} lg={4} className="g-3">
                    {produtosFiltrados.map(item => (
                        <Col key={item.id}>
                            <Card style={{ backgroundColor: '#003366', color: 'white', border: '1px solid white', height: '410px' }}>

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
                                            <strong>Tamanho: </strong>{item.tamanho.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} <br />
                                            <strong>Quantidade:</strong> {item.quantidade}<br />
                                            <strong>Cor:</strong> {item.cor}
                                        </Card.Text>
                                    </div>

                                    <div className="d-flex justify-content-between align-items-center mt-auto">
                                        <Link
                                            href={`/produtos/form/${item.id}`}
                                            className="btn btn-primary btn-sm"
                                            style={{ backgroundColor: 'white', color: '#003366', fontWeight: 'bold' }}
                                        >
                                            <FaPen style={{ marginBottom: '2px' }} /> Editar
                                        </Link>

                                        <Button
                                            variant="danger"
                                            style={{ fontWeight: 'bold' }}
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
                                            style={{ borderRadius: '50%' }} // Botão redondo
                                        >
                                            <FaInfoCircle style={{ marginBottom: '2px' }} />
                                        </Button>
                                    </div>
                                </Card.Body>

                            </Card>
                        </Col>
                    ))}
                </Row>

                {/* Modal de Detalhes do Produto */}
                <Modal show={showModal} onHide={fecharModal}>
                    {/* Controlando visibilidade da Modal (show e fecharModal)  */}
                    <Modal.Header style={{ backgroundColor: '#003366', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Modal.Title style={{ color: "white" }}><b>{produtoSelecionado?.nome}</b></Modal.Title>
                    </Modal.Header>

                    <Modal.Body style={{ textAlign: 'left', backgroundColor: '#003366', color: 'white' }}>
                        <p><strong>Descrição:</strong> {produtoSelecionado?.descricao || 'Sem descrição'}</p>
                        <p><strong>Preço:</strong> R$ {produtoSelecionado?.preco?.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                        <p><strong>Quantidade: </strong> {produtoSelecionado?.quantidade}</p>
                        <p><strong>Tamanho: </strong> {produtoSelecionado?.tamanho}</p>
                        <p><strong>Cor: </strong> {produtoSelecionado?.cor}</p>
                        <p><strong>Marca: </strong> {produtoSelecionado?.marca}</p>
                        <p><strong>Gênero: </strong> {produtoSelecionado?.genero}</p>
                        <img src={produtoSelecionado?.imagem} alt={produtoSelecionado?.nome} style={{ width: '170px', borderRadius: '5px', display: 'block', margin: '0 auto' }} />
                    </Modal.Body>

                    <Modal.Footer style={{ backgroundColor: '#003366', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Link
                            href={`/produtos/form/${produtoSelecionado?.id}`}
                            className="btn btn-primary btn-sm"
                            style={{ backgroundColor: 'white', padding: '8px 15px', color: '#003366', fontWeight: 'bold', marginRight: '10px' }}
                        >
                            <FaPen style={{ marginBottom: '2px' }} /> Editar
                        </Link>

                        <Button style={{ backgroundColor: 'white', color: '#003366', fontWeight: 'bold' }} onClick={fecharModal}>
                            <IoIosClose style={{ marginTop: '-2px' }} />Fechar
                        </Button>
                    </Modal.Footer>

                </Modal>
            </div>
        </Pagina>
    );
}
