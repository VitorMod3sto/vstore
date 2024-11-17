'use client';

import { useState, useEffect } from 'react';
import Pagina2 from "@/app/components/Pagina2";
import { Row, Col, Card, Button, Carousel, Modal, Dropdown } from 'react-bootstrap';
import Link from 'next/link';
import { FaCheckCircle, FaChevronLeft, FaChevronRight, FaEdgeLegacy, FaExclamationCircle, FaShoppingCart } from 'react-icons/fa';
import { RiMastercardFill } from "react-icons/ri";
import { RiVisaFill } from "react-icons/ri";
import { BiLogoVuejs, BiSolidPurchaseTagAlt } from 'react-icons/bi';


export default function Page({ params }) {
    const [loading, setLoading] = useState(true);

    const [corMensagem, setCorMensagem] = useState(''); // Para controlar a cor da mensagem

    const [produto, setProduto] = useState({});
    // Estado para armazenar os produtos

    const [showModal, setShowModal] = useState(false);
    // Estado para controlar a abertura da Modal

    const [tamanhoSelecionado, setTamanhoSelecionado] = useState('');
    // Estado pra armazenar o tamanho selecionado

    const [tamanhoChecked, setTamanhoChecked] = useState(false);
    // Controla se o tamanho está selecionado (Iniciando como false)

    const [produtosCategoria, setProdutosCategoria] = useState([]);
    // Estado pra armazenar os produtos da mesma categoria

    const [indexGrupo, setIndexGrupo] = useState(0);
    // Estado para armazenar o índice do grupo de produtos no array de grupos de produtos (iniciado em 0)

    const produtosPorGrupo = 8;
    // Definindo que devem ser exibidos 8 produtos no Carrossel na variável produtosPorGrupo

    const [itensCarrinho, setItensCarrinho] = useState([]);  // Estado para armazenar os itens do carrinho


    useEffect(() => {
        // useEffect para carregar os produtos do localStorage ao montar o componente
        const produtos = JSON.parse(localStorage.getItem('produtos'));
        // Armazenando em produtos, todos os produtos do LocalStorage
        const dados = produtos.find(produto => produto.id === params.id);
        // Carregando produtos do localStorage (usando JSON parse para converter de string para objeto JavaScript)
        setProduto(dados);
        // Atualizando o estado dos produtos

        const produtosDaMesmaCategoria = produtos.filter(p => p.categoria === dados.categoria && p.id !== dados.id);
        // Armazenando os produtos filtrados pela mesma categoria do produto atual
        setProdutosCategoria(produtosDaMesmaCategoria);
        // Atualiza o estado com produtos da mesma categoria

        setLoading(false);
    }, [params.id]);
    // Definindo que o useEffect será chamado sempre que o id mudar (params) mudar



    const produtosRepetidos = produtosCategoria.length > 0
        // Criando um array que repete os produtos da mesma categoria até completar 100 produtos
        // Verificando se há produtos no array de produtos de mesma categoria
        ? Array.from({ length: Math.ceil(100 / produtosCategoria.length) }, () => produtosCategoria).flat()
        // Criando um novo array (Array.from) a partir dos argumentos a frente, lenght: é o argumento pra definir o tamanho do array
        // Math.ceil(100 / produtosCategoria.length) calcula o número de vezes que queremos repetir produtosCategoria até que o 
        // total chegue a pelo menos 100. produtosCategoria.length é o número de produtos na categoria atual.
        // A divisão 100 / produtosCategoria.length determina quantos grupos de produtosCategoria são necessários para atingir 
        // ou ultrapassar 100. Math.ceil arredonda o resultado para cima, garantindo que, mesmo que a divisão não seja um número 
        // inteiro, sempre tenha produtos suficientes.
        // () => faz com que sempre for adicionado um novo elemento, a função retorna a referência ao array produtosCategoria
        // Resumindo, a função de Array.from cria um array com tamanho de 100 divido pelo array de produtos de mesma categoria
        // O math.ceil arredonda o resultado da divisão pra o numero inteiro acima mais próximo.
        // Ex: A divisão é 100/3 = 33.33 , então o Math,ceil arredonda pra 34. Sendo criado o array com 34 elementos.
        // Cada vez que se conta os produtos atuais, eles ficam em um array, então se cria outro repetindo eles 34x (array de array)
        // .Flat() junta esses arrays em um só array com os mesmos produtos sendo repetidos
        : [];
    // Senão cria um array vazio

    const gruposDeProdutos = [];
    // Criando variável pra armazenar os grupos de produtos
    for (let i = 0; i < produtosRepetidos.length; i += produtosPorGrupo) {
        //Iterando todos os produtos em incrementos de 8 (definidos em produtosPorGrupo)
        gruposDeProdutos.push(produtosRepetidos.slice(i, i + produtosPorGrupo));
        // Adicionando ao gruposDeProdutos e irá lhe iterar os produtos do array produtosRepetidos até completar 8 produtos
    }

    const totalGrupos = gruposDeProdutos.length;
    // Armazenando o total de grupos que foi criado

    const handlePrev = () => {
        // Criando função que atualiza o setIndexGrupo pra exibir o grupo de produtos anterior (a partir do índice no array de grupos)
        setIndexGrupo((prev) => (prev === 0 ? totalGrupos - 1 : prev - 1));
        // Definindo que caso já esteja no primeiro grupo, volte pro último
    };

    const handleNext = () => {
        // Criando função que atualiza o setIndexGrupo pra exibir o próximo grupo de produtos
        setIndexGrupo((prev) => (prev === totalGrupos - 1 ? 0 : prev + 1));
        // Definindo que caso já esteja no último grupo, volte pro primeiro
    };


    const handleShow = () => setShowModal(true);
    // Função para exibir a Modal (tornando o estado da abertura pra true) 
    const handleClose = () => {
        // Função para fechar a Modal (tornando o estado da abertura e o tamanho selecionado pra false)
        setTamanhoChecked(false);
        setShowModal(false);
    };

    const selecionarTamanho = () => {
        // Criando função para armazenar o tamanho selecionado
        if (tamanhoChecked) {
            // Verificando se o usuário selecionou alguma opção (se if = true é porque selecionou)
            setTamanhoSelecionado(`${produto.tamanho} selecionado`);
        } else {
            // Senão limpa o tamanho selecionado pra nenhum
            setTamanhoSelecionado('');
        }
        handleClose();
        // Chama a função de fechar a Modal
    };

    const [clienteLogado, setClienteLogado] = useState(null);
    const [carrinho, setCarrinho] = useState([]);
    const [exibirModalResumo, setExibirModalResumo] = useState(false); // Estado para exibir o resumo do carrinho
    const [showModalLogin, setShowModalLogin] = useState(false);

    useEffect(() => {
        const cliente = JSON.parse(localStorage.getItem('clienteLogado'));
        if (cliente) {
            setClienteLogado(cliente);
            carregarCarrinho(cliente.email);
        }
    }, []);

    const carregarCarrinho = (email) => {
        const carrinhos = JSON.parse(localStorage.getItem('carrinhos')) || [];
        const carrinhoDoCliente = carrinhos.find(c => c.email === email);
        if (carrinhoDoCliente) {
            setCarrinho(carrinhoDoCliente.itens);
        } else {
            setCarrinho([]);
        }
    };

    // Função para abrir a modal de login
    const handleOpenModalLogin = () => setShowModalLogin(true);
    const handleCloseModalLogin = () => setShowModalLogin(false);

    const adicionarAoCarrinho = (produto) => {
        // Recarregar o cliente logado sempre que a função for chamada
        const clienteLogado = JSON.parse(localStorage.getItem('clienteLogado'));

        if (!clienteLogado) {
            handleOpenModalLogin();  // Exibe a modal de login
            return;  // Sai da função caso não esteja logado
        }


        // Lógica para adicionar o produto ao carrinho se o cliente estiver logado
        const carrinhos = JSON.parse(localStorage.getItem('carrinhos')) || [];
        let carrinhoDoCliente = carrinhos.find(c => c.email === clienteLogado.email);

        if (!carrinhoDoCliente) {
            // Se não houver carrinho, cria um novo
            carrinhoDoCliente = { email: clienteLogado.email, itens: [] };
            carrinhos.push(carrinhoDoCliente);
        }

        // Verifica se o produto já está no carrinho
        const itemExistente = carrinhoDoCliente.itens.find(item => item.id === produto.id);
        if (itemExistente) {
            // Caso exista, apenas incrementa a quantidade
            itemExistente.quantidade += 1;
        } else {
            // Caso não exista, adiciona o produto ao carrinho
            carrinhoDoCliente.itens.push({ ...produto, quantidade: 1 });
        }

        // Atualiza o localStorage com o carrinho
        localStorage.setItem('carrinhos', JSON.stringify(carrinhos));

        // Atualiza o estado do carrinho
        setCarrinho(carrinhoDoCliente.itens);

        // Exibe o modal de resumo
        setExibirModalResumo(true);
    };

    const handleCloseModalResumo = () => setExibirModalResumo(false);

    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [mensagem, setMensagem] = useState('');
    const [showLoginForm, setShowLoginForm] = useState(false);  // Estado para alternar entre login e opções de login

    // Função de login
    const loginCliente = () => {
        const clientes = JSON.parse(localStorage.getItem('clientes')) || [];
        const cliente = clientes.find(cliente => cliente.email === email);

        if (!cliente) {
            setMensagem('E-mail não encontrado!');
            setCorMensagem('red'); // Cor vermelha para erro
            return;
        }

        if (cliente.senha !== senha) {
            setMensagem('Senha incorreta!');
            setCorMensagem('red'); // Cor vermelha para erro
            return;
        }

        // Salvando o cliente logado no localStorage
        localStorage.setItem('clienteLogado', JSON.stringify(cliente));
        setMensagem('Login bem-sucedido!');
        setCorMensagem('green'); // Cor verde para sucesso

        // Fechar a modal
        handleCloseModalLogin();
    };

    
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
        <Pagina2 titulo="Detalhe do Produto">

            {/* EXIBINDO DETALHES DO PRODUTO */}

            <Row className="align-items-start">

                {/* CARROSSEL DE IMAGEM DO PRODUTO*/}
                <Col md={7} style={{ marginLeft: '67px' }}>
                    <Card style={{ border: "3px solid black" }}>
                        <Card.Body style={{ padding: 0 }}>

                            <Carousel
                                prevIcon={<FaChevronLeft style={{ fontSize: '24px', color: 'black' }} />}
                                nextIcon={<FaChevronRight style={{ fontSize: '24px', color: 'black' }} />}
                                interval={2000} indicators={false}
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


                {/* Exibindo informações de produto */}
                <Col md={5} style={{ width: '500px', marginLeft: '-15px' }}>

                    <Card style={{ border: 'none' }}>
                        <Card.Body>
                            <h1 style={{ minHeight: '70px', fontFamily: 'Montserrat, sans-serif', fontWeight: '900', fontSize: '28px', marginBottom: '0' }}>
                                {produto.nome}
                            </h1>

                            <p style={{ fontFamily: 'Poppins, sans-serif', fontSize: '28px', fontWeight: 'bold', marginBottom: '0' }}>
                                R$ {produto.preco.toFixed(2)}
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
                                    <div style={{ marginTop: '5px' }}>
                                        {tamanhoSelecionado || `${produto.tamanho} disponível`}
                                    </div>
                                </div>
                                <span style={{ marginLeft: '5px', marginRight: '15px', fontSize: '18px', color: 'black', marginTop: '10px', fontSize: '25px' }}>➔</span>
                            </div>

                            <div style={{ borderBottom: '1px solid #ccc', margin: '10px 0' }} />

                            <button
                                onClick={() => adicionarAoCarrinho(produto)}
                                style={{
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
                                    marginTop: '80px',
                                    marginBottom: '0'
                                }}
                            >
                                Adicionar ao carrinho <FaShoppingCart style={{ fontSize: '20px' }} />
                            </button>




                            <button
                             onClick={() => {
                                // Salvar o produto selecionado no localStorage
                                localStorage.setItem('produtoSelecionado', JSON.stringify(produto));
                                // Redirecionar para a página de checkout
                                window.location.href = '/paginas/checkout/produto';
                            }}
                             style={{
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
                                marginTop: '10px'
                            }}>
                                Comprar
                            </button>


                        </Card.Body>
                    </Card>

                </Col>
            </Row>

            {/* SEGUNDO CARROSSEL (PRODUTOS DE MESMA CATEGORIA) */}
            <div style={{ margin: '0 15px', marginTop: '30px' }}>
                <h2 style={{
                    textAlign: 'center',
                    fontFamily: 'Montserrat, sans-serif',
                    fontWeight: '900',
                    margin: '0',
                }}>
                    MAIS {produto.categoria ? produto.categoria.toUpperCase() : '...'}
                </h2>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

                <Carousel data-bs-theme="dark" style={{ width: '100%', height: '220px', marginTop: '0', marginBottom: '0' }}
                    interval={null} indicators={false}

                    prevIcon={
                        <div style={{
                            backgroundColor: 'black',
                            borderRadius: '50%',
                            padding: '10px',
                            boxShadow: '0 2px 5px rgba(0, 0, 0, 0.3)',
                        }} onClick={handlePrev}>
                            <FaChevronLeft style={{ color: 'white', fontSize: '24px' }} />
                        </div>
                    }

                    nextIcon={
                        <div style={{
                            backgroundColor: 'black',
                            borderRadius: '50%',
                            padding: '10px',
                            boxShadow: '0 2px 5px  rgba(0, 0, 0, 0.3)',
                        }} onClick={handleNext}>
                            <FaChevronRight style={{ color: 'white', fontSize: '24px' }} />
                        </div>
                    }
                >

                    {gruposDeProdutos.map((grupo, index) => (
                        <Carousel.Item key={index} active={index === indexGrupo}>
                            <div style={{ display: 'flex', justifyContent: 'space-around', padding: '10px' }}>
                                {grupo.map(produto => (

                                    <Link key={produto.id} href={`/paginas/produtos/${produto.id}`}>
                                        <div style={{
                                            border: '3px solid black',
                                            borderRadius: '8px',
                                            padding: '10px',
                                            textAlign: 'center',
                                            flex: '0 0 auto',
                                            margin: '5px'
                                        }}>
                                            <img
                                                src={produto.imagem}
                                                alt={produto.nome}
                                                style={{
                                                    objectFit: 'contain',
                                                    height: '150px',
                                                    width: '100%',
                                                    borderRadius: '5px',
                                                }}
                                            />
                                        </div>
                                    </Link>

                                ))}
                            </div>
                        </Carousel.Item>
                    ))}

                </Carousel>
            </div>

            {/* BOTÕES DE NAVEGAÇÃO NA PARTE INFERIOR */}
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px', marginBottom: '20px' }}>
                <Link href={`/paginas/home`}>
                    <button style={{
                        fontFamily: 'Montserrat, sans-serif',
                        fontWeight: 'bold',
                        backgroundColor: 'black',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        padding: '8px 16px',
                        cursor: 'pointer',
                        height: '50px',
                        margin: '0 10px'
                    }}>
                        INÍCIO
                    </button>
                </Link>
                <Link href={`/paginas/home`}>
                    <button style={{
                        fontFamily: 'Montserrat, sans-serif',
                        fontWeight: 'bold',
                        backgroundColor: 'black',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        padding: '8px 16px',
                        cursor: 'pointer',
                        height: '50px',
                        margin: '0 10px'
                    }}>
                        PRODUTOS
                    </button>
                </Link>
                <Link href={`/paginas/home`}>
                    <button style={{
                        fontFamily: 'Montserrat, sans-serif',
                        fontWeight: 'bold',
                        backgroundColor: 'black',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        padding: '8px 16px',
                        cursor: 'pointer',
                        height: '50px',
                        margin: '0 10px'
                    }}>
                        SOBRE NÓS
                    </button>
                </Link>
            </div>

            {/* MODAL DE TAMANHO DO PRODUTO */}
            <Modal show={showModal} onHide={handleClose}>

                <Modal.Header>
                    <Modal.Title style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 'bold', fontWeight: '900' }}>
                        SELECIONE O TAMANHO
                    </Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <p style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 'bold', fontWeight: '900', marginLeft: '15px' }}>
                        Escolha o tamanho:</p>
                    <label style={{ marginLeft: '15px', cursor: 'pointer' }}>
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

            {/* Modal de Resumo do Carrinho */}
            <Modal show={exibirModalResumo} onHide={handleCloseModalResumo} centered>
                <Modal.Body style={{
                    padding: '10px',
                    backgroundColor: '#fff',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                    borderRadius: '8px',
                    maxHeight: '400px',
                    overflowY: 'auto',
                }}>
                    <h5>Itens no Carrinho</h5>
                    <hr style={{ border: '2px solid #ddd', marginBottom: '10px' }} />

                    <div style={{
                        flex: 1,
                        overflowY: 'auto',  // Permitir scroll vertical nos itens
                        maxHeight: '300px', // Limitar altura dos itens
                        marginBottom: '10px',
                    }}>
                        {carrinho.length === 0 ? (
                            <p>Seu carrinho está vazio.</p>
                        ) : (
                            carrinho.map((item) => (
                                <div
                                    key={item.id}
                                    style={{
                                        marginBottom: '10px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        borderBottom: '1px solid #ddd',
                                        paddingBottom: '10px',
                                        paddingTop: '10px',
                                    }}
                                >
                                    <img
                                        src={item.imagem}
                                        alt={item.nome}
                                        style={{
                                            width: '50px',
                                            height: '50px',
                                            marginRight: '10px',
                                        }}
                                    />
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>
                                            {item.nome}
                                        </div>
                                        <div style={{ fontSize: '12px', color: 'gray' }}>
                                            Quantidade: {item.quantidade}
                                        </div>
                                    </div>
                                    <div style={{ fontWeight: 'bold', marginLeft: '20px' }}>
                                        R$ {item.preco.toFixed(2)}
                                    </div>
                                </div>
                            ))
                        )}
                        <Link href={`/paginas/checkout`}>
                    <Button
                        variant="primary"
                        style={{
                            backgroundColor: 'black',
                            color: 'white',
                            border: 'none',
                            width: '100%',
                        }}
                    >
                        Finalizar Compra
                    </Button>
                    </Link>
                    </div>
                    
                </Modal.Body>
            </Modal>



            <Modal style={{ marginTop: '100px' }} show={showModalLogin} onHide={handleCloseModalLogin}>
                {/* Exibe somente o título quando showLoginForm for falso */}
                {!showLoginForm && (
                    <Modal.Header style={{
                        backgroundColor: 'black',  // Fundo claro para destacar a informação
                        borderBottom: '2px solid #ddd',  // Linha sutil na parte inferior
                        padding: '20px 40px',  // Mais espaço interno
                        textAlign: 'center',
                        color: '#343a40',  // Cor do texto escura para contraste
                        fontFamily: 'Montserrat, sans-serif',  // Fonte moderna
                        fontWeight: '600',
                        border: '1px solid white'
                    }}>
                        <Modal.Title style={{
                            fontSize: '24px',
                            fontWeight: '700',
                            color: 'white'
                        }}>
                            JÁ TEM UMA CONTA? <BiLogoVuejs style={{ fontSize: '30px', marginBottom: '05px' }} />
                        </Modal.Title>
                        <p style={{
                            fontSize: '16px',
                            color: 'white',  // Cor mais suave para o subtítulo
                            fontWeight: '400',
                            lineHeight: '1.6',
                            margin: '0',
                            marginLeft: '08px'
                        }}>
                            Para acessar o carrinho, por favor, entre ou crie uma conta.
                        </p>
                    </Modal.Header>

                )}

                <Modal.Body style={{ backgroundColor: 'black', border: '1px solid white', borderRadius: '5px' }}>
                    {showLoginForm ? (
                        // Formulário de login
                        <div style={{
                            padding: '40px',
                            width: '100%',
                            height: '100%',
                            backgroundColor: 'black',
                            borderRadius: '8px',
                            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                            color: 'white',
                            textAlign: 'center'
                        }}>
                            <h2 style={{
                                fontFamily: 'Montserrat, sans-serif',
                                fontWeight: '700',
                                fontSize: '24px',
                                marginBottom: '30px',
                                color: 'white'
                            }}>
                                BEM VINDO DE VOLTA <BiLogoVuejs style={{ fontSize: '45px' }} />
                            </h2>

                            <div style={{ marginBottom: '20px' }}>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="E-mail"
                                    style={{
                                        width: '100%',
                                        padding: '12px',
                                        marginBottom: '15px',
                                        borderRadius: '5px',
                                        border: '2px solid #333',
                                        boxSizing: 'border-box',
                                        fontSize: '16px'
                                    }}
                                />
                                <input
                                    type="password"
                                    value={senha}
                                    onChange={(e) => setSenha(e.target.value)}
                                    placeholder="Senha"
                                    style={{
                                        width: '100%',
                                        padding: '12px',
                                        marginBottom: '20px',
                                        borderRadius: '5px',
                                        border: '2px solid #333',
                                        boxSizing: 'border-box',
                                        fontSize: '16px'
                                    }}
                                />
                            </div>

                            <div style={{ minHeight: '30px' }}>
                                {mensagem && (
                                    <p style={{
                                        textAlign: 'center',
                                        color: corMensagem,
                                        marginTop: '15px',
                                        fontSize: '14px',
                                        fontWeight: 'bold'
                                    }}>
                                        {mensagem}
                                    </p>
                                )}
                            </div>

                            <button
                                onClick={loginCliente}
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    backgroundColor: '#007bff',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '5px',
                                    cursor: 'pointer',
                                    fontSize: '16px',
                                    fontWeight: 'bold',
                                    transition: 'background-color 0.3s ease'
                                }}
                            >
                                ENTRAR
                            </button>

                            <div style={{ marginTop: '20px' }}>
                                <p style={{ fontSize: '14px', color: 'white' }}>
                                    Não tem conta?
                                    <Link href="/paginas/cadastros" style={{
                                        color: '#28a745',
                                        textDecoration: 'none',
                                        fontWeight: 'bold'
                                    }}> Cadastre-se
                                    </Link>
                                </p>
                            </div>
                        </div>
                    ) : (
                        // Exibe as opções de Login e Cadastro
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <button
                                onClick={() => setShowLoginForm(true)}  // Exibe o formulário de login
                                style={{
                                    fontFamily: 'Montserrat, sans-serif',
                                    fontWeight: 'bold',
                                    backgroundColor: 'white',
                                    color: 'black',
                                    border: 'none',
                                    borderRadius: '5px',
                                    padding: '10px 20px',
                                    cursor: 'pointer',
                                    width: '48%'
                                }}
                            >
                                Login
                            </button>
                            <button
                                style={{
                                    fontFamily: 'Montserrat, sans-serif',
                                    fontWeight: 'bold',
                                    backgroundColor: 'black',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '5px',
                                    padding: '10px 20px',
                                    cursor: 'pointer',
                                    width: '48%'
                                }}
                                onClick={() => window.location.href = '/paginas/cadastros'}  // Redirecionando para a página de cadastro
                            >
                                Cadastrar-se
                            </button>
                        </div>
                    )}
                </Modal.Body>
            </Modal>

        </Pagina2>
    );
}