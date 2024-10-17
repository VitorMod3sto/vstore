'use client'

//Importações de componentes e hooks
import Pagina from "@/app/components/Pagina";
import Link from "next/link";
import { Card, Button, Row, Col, Form } from "react-bootstrap";
import { FaTrashAlt, FaPen, FaPlus, FaSearch } from "react-icons/fa";
import { useEffect, useState } from "react";
import { FaTruckLoading } from "react-icons/fa";


export default function Page() {
    const [produtos, setProdutos] = useState([]);
    // Estado para armazenar os produtos

    const [search, setSearch] = useState('');
    // Estado para armazenar o valor (texto) da busca na barra de pesquisa

    const [ProdutosFiltrados, setProdutosFiltrados] = useState([]);
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

    // Função para realizar a busca de produtos
    function buscarProdutos() {
        setProdutosFiltrados(
            // Atualizando estado dos produtos filtrados (iniciado com todos os produtos anteriormente)
            produtos.filter(item =>
                // Filtrando produtos com base no nome (criando um novo array com base na condição definida logo abaixo)
                item.nome.toLowerCase().includes(search.toLowerCase())
                // Definindo a condição para transformar o nome do produto em minúsculas (toLowerCase) para evitar conflitos entre maiúsculas e minúsculas
                // Aplicando o mesmo para o texto digitado na barra de pesquisa
                // E verificando se o nome digitado é igual ao de algum produto (includes), adicionando o produto no novo array (filter) caso seja igual.
            )
        );
    }

    // Função para excluir um produto com base no seu ID
    function excluir(id) {
        if (confirm('Deseja realmente excluir?')) {// Exibindo um alerta de confirmação antes de excluir o produto
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


    return (
        <Pagina titulo="Produtos">
            <div style={{ backgroundColor: '#003366', padding: '20px', borderRadius: '10px' }}>

                {/* TÍTULO DA PÁGINA  */}
                <h2 className="text-center mb-4" style={{ textShadow: '2.5px 2.5px 0 black, 2.5px -2.5px 0 black, -2.5px 2.5px 0 black, -2.5px -2.5px 0 black', color: 'white' }}>
                    Estoque de Produtos
                    <FaTruckLoading style={{ display: 'inline-block', filter: 'drop-shadow(1.5px 2px 0 black) drop-shadow(-2px -2px 0 black) drop-shadow(2px -2px 0 black) drop-shadow(-1.5px 2px 0 black)' }} /> {/* Ícone de caminhão */}
                </h2>

                {/* FORMULÁRIO DE BUSCA */}
                <Form className="mb-3 d-flex">
                    <Form.Group controlId="search" className="flex-grow-1">
                        <Form.Control
                            type="text"
                            // Definindo o tipo de entrada
                            placeholder="Pesquisar produto..."
                            // Definindo o placeholder
                            value={search}
                            // Definindo que o valor será controlado pelo estado search
                            onChange={(e) => setSearch(e.target.value)}
                            // Atualizando o estado search quando o valor mudar
                            style={{ borderRadius: '10px' }}
                        />
                    </Form.Group>

                    <Button variant="light" onClick={buscarProdutos} style={{ color: '#003366', fontWeight: 'bold', border: '2px solid white' }} className="ms-2"> {/* Botão de busca */}
                        <FaSearch style={{ marginBottom: '3px' }} /> Buscar 
                    </Button>
                     {/* Criando botão de pesquisar para usar a função buscarProdutos (com base em seu estado atual) */}

                </Form>

                {/* BOTÃO PARA ADICIONAR PRODUTO */}
                <Link href="/produtos/form" className="btn btn-light mb-2" style={{ fontWeight: 'bold', color: '#003366', border: '2px solid white' }}> {/* Link para adicionar um produto */}
                    <FaPlus style={{ marginBottom: '4px' }} /> Adicionar
                </Link>

                {/* DEFININDO EXIBIÇÃO DOS PRODUTOS (USANDO ROW, COL E  CARD) */}
                <Row xs={1} md={2} lg={6} className="g-3">
                    {ProdutosFiltrados.map(item => ( 
                        // Fazendo map dos produtos filtrados (colocando antes do que irá se repetir para cada produto)

                        <Col key={item.id}> 
                        {/* Definindo uma coluna para cada produto */}

                            <Card style={{ backgroundColor: '#003366', color: 'white', border: '1px solid white' }}> 
                                {/* Definindo um Card para cada produto */}

                                <Card.Img
                                    style={{ margin: '5px auto', width: '95%', height: '180px', borderRadius: '5px' }}
                                    variant="top" 
                                    src={item.imagem} 
                                />
                                 {/* Definindo imagem do Card */}

                                <Card.Body className="align-items-center" style={{ display: 'flex', flexDirection: 'column' }}>
                                     {/* Definindo corpo do Card */}

                                    <Card.Title>{item.nome}</Card.Title> 
                                    <Card.Text> 
                                        <strong>Preço:</strong> R$ {item.preco.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} <br /> {/* Preço formatado */}
                                        <strong>Quantidade:</strong> {item.quantidade}
                                    </Card.Text>

                                    <div className="d-flex justify-content-between align-items-center">
                                         {/* Separando uma div para os botões*/}
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
