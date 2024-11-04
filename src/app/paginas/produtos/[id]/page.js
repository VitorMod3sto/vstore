'use client';

import { useState, useEffect } from 'react';
import Pagina2 from "@/app/components/Pagina2";
import { Row, Col, Card, Button, Carousel, Modal, Dropdown } from 'react-bootstrap';
import Link from 'next/link';
import { FaCheckCircle, FaChevronLeft, FaChevronRight, FaEdgeLegacy, FaExclamationCircle, FaShoppingCart } from 'react-icons/fa';
import { RiMastercardFill } from "react-icons/ri";
import { RiVisaFill } from "react-icons/ri";
import { BiSolidPurchaseTagAlt } from 'react-icons/bi';


export default function Page({ params }) {
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

    const [ModalPagamento, setModalPagamento] = useState(false);
    // Estado pra controlar a Modal (iniciando com ela fechada = false)

    const [dadosCartao, setdadosCartao] = useState({ number: '', expiry: '', cvv: '', namecard: '', brand: '' });
    // Estado pra armazenar os dados do cartão (número, data de vencimento, cvv, nome do cartao e bandeira)

    const [mensagem, setMensagem] = useState('');
    // Estado para armazenar a mensagem de compra autorizada ou negado

    const [mensagemTipo, setmensagemTipo] = useState('');
    // Estado para armazenar o tipo de mensagem (se foi aprovado ou negado)

    const [bandeira, setBandeira] = useState('');
    // Estado para armazenar a bandeira do cartão

    const handlePaymentModal = () => {
        setModalPagamento(true);
    };
    // Atualizando estado da Modal de pagamento para true (fazendo ela aparecer)

    const handlePaymentClose = () => {
        setModalPagamento(false);
        setdadosCartao({ number: '', expiry: '', cvv: '', name: '', brand: 'Selecione a bandeira', });
        setBandeira('');
        setMensagem('');
        setmensagemTipo('');
    };
    // Atualizando estado da Modal pra false (fechando) e resetando os campos digitados

    const handleCardDetailChange = (e) => {
        const { name, value } = e.target;
        // Extraindo o campo nome de dadosCartao 
        setdadosCartao(prev => ({ ...prev, [name]: value }));
    };
    //  Atualizando os dados do cartão sempre que alterar algum valor do campo nome
    // Na qual atualiza o campo alterado e copia os demais inalterados (com base nos valores salvos pela última vez nos dadosCartao)

    const validateCard = () => {
        const { number, brand } = dadosCartao;
        // Extraindo o campo numero e bandeira de dadosCartao 
        const brandMapping = {
            visa: /^4/,
            master: /^[25]/
        };
        // Definindo um objeto que guarda o numero inicial do cartão, e define que Master = 5 ou 2 e Visa = 4
        // Usado logo abaixo pra testar se o numero do cartao corresponde a sua devida bandeira

        const isValid = brandMapping[brand] ? brandMapping[brand].test(number) : false;
        // Armazenando se o teste da bandeira selecionada corresponde a Master ou Visa (true ou false) e se sim, testa o numero do cartao
        // com a função de sua bandeira correspondente

        // Se a bandeira corresponder o isValid = true, senão isValid = false
        if (!isValid) {
            // Se for false = Dados incorretos (não passou na função de teste como true)
            setMensagem('Dados incorretos, verifique e tente novamente');
            setmensagemTipo('error');
            // Exibe a mensagem de erro (criada separado de sucess para estilizar mais a frente no código)
        } else {
            // Se for true = Dados corretos (passou na validação)
            setMensagem('Compra efetuada com sucesso, verifique seu email');
            setmensagemTipo('success');
            // Exibe a mensagem de sucesso
            setTimeout(() => {
                handlePaymentClose();
            }, 3000);
            // Definindo que após sucesso, exibe a mensagem e fecha a modal (puxando a função handlePaymentClose) após 3s
        }
    };

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
                                    <div style={{ marginTop: '5px' }}>
                                        {tamanhoSelecionado || `${produto.tamanho} disponível`}
                                    </div>
                                </div>
                                <span style={{ marginLeft: '5px', marginRight: '15px', fontSize: '18px', color: 'black', marginTop: '10px', fontSize: '25px' }}>➔</span>
                            </div>

                            <div style={{ borderBottom: '1px solid #ccc', margin: '10px 0' }} />

                            <button  style={{
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
                            }}>
                                Adicionar ao carrinho <FaShoppingCart
                                    style={{ fontSize: '20px' }} />
                            </button>



                            <button onClick={handlePaymentModal} style={{
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

            {/* MODAL DE PAGAMENTO */}
            <Modal show={ModalPagamento} onHide={handlePaymentClose} dialogClassName="custom-modal">

                <Modal.Header style={{ color: 'white', backgroundColor: 'black' }} closeButton>
                    <Modal.Title>CONFIRMAR COMPRA <BiSolidPurchaseTagAlt /></Modal.Title>
                </Modal.Header>

                <Modal.Body style={{ backgroundColor: 'black', color: 'white' }}>
                    <h5>Escolha a forma de pagamento:</h5>

                    <div style={{ marginBottom: '20px' }}>
                        <Dropdown>
                            <Dropdown.Toggle
                                variant="secondary"
                                id="dropdown-basic"
                                style={{
                                    width: '100%',
                                    borderRadius: '5px',
                                    backgroundColor: bandeira === 'Visa' ? 'darkblue' :
                                        bandeira === 'MasterCard' ? 'orange' :
                                            bandeira === 'Elo' ? 'lightgrey' : 'white',
                                    color: bandeira ? 'white' : 'black'

                                }}
                            >
                                {bandeira ? bandeira : "Selecione a bandeira"}
                                {/* Verificando qual a bandeira do cartão e definindo cor de fundo para cada uma, se nenhuma for 
                                selecionada, fica preto e branco. Se nenhuma bandeira for selecionada, exibe a mensagem acima*/}
                            </Dropdown.Toggle>

                            <Dropdown.Menu>

                                <Dropdown.Item
                                    onClick={() => {
                                        setBandeira('Visa');
                                        setdadosCartao(prev => ({ ...prev, brand: 'visa' }));
                                    }}
                                    style={{ backgroundColor: 'white', color: 'black' }}
                                >
                                    <RiVisaFill style={{ marginRight: '5px', color: 'black' }} /> Visa
                                </Dropdown.Item>

                                <Dropdown.Item
                                    onClick={() => {
                                        setBandeira('MasterCard');
                                        setdadosCartao(prev => ({ ...prev, brand: 'master' }));
                                    }}
                                    style={{ backgroundColor: 'white', color: 'black' }}
                                >
                                    <RiMastercardFill style={{ marginRight: '5px' }} /> MasterCard
                                </Dropdown.Item>

                                <Dropdown.Item
                                    onClick={() => {
                                        setBandeira('Elo');
                                        setdadosCartao(prev => ({ ...prev, brand: 'elo' }));
                                    }}
                                    style={{ backgroundColor: 'white', color: 'black' }}
                                >
                                    <FaEdgeLegacy style={{ marginRight: '5px', color: 'black' }} /> Elo
                                </Dropdown.Item>

                            </Dropdown.Menu>
                        </Dropdown>
                    </div>

                    <div style={{ marginTop: '20px' }}>
                        <input
                            type="text"
                            name="number"
                            placeholder="Número do Cartão"
                            value={dadosCartao.number}
                            onChange={handleCardDetailChange}
                            style={{ marginBottom: '10px', width: '100%', borderRadius: '5px', padding: '10px' }}
                        />
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <input
                                type="text"
                                name="expiry"
                                placeholder="Data de Vencimento (MM/AA)"
                                value={dadosCartao.expiry}
                                onChange={handleCardDetailChange}
                                style={{ marginBottom: '10px', width: '48%', borderRadius: '5px', padding: '10px' }}
                            />
                            <input
                                type="text"
                                name="cvv"
                                placeholder="CVV"
                                value={dadosCartao.cvv}
                                onChange={handleCardDetailChange}
                                style={{ marginBottom: '10px', width: '48%', borderRadius: '5px', padding: '10px' }}
                            />
                        </div>
                        <input
                            type="text"
                            name="namecard"
                            placeholder="Nome no Cartão"
                            value={dadosCartao.namecard}
                            onChange={handleCardDetailChange}
                            style={{ marginBottom: '10px', width: '100%', borderRadius: '5px', padding: '10px' }}
                        />
                    </div>
                    {mensagem && (
                        <div style={{
                            marginTop: '20px',
                            color: mensagemTipo === 'success' ? 'green' : 'red',
                            display: 'flex',
                            alignItems: 'center',
                        }}>
                            {mensagemTipo === 'success' ? (
                                <FaCheckCircle style={{ marginRight: '10px', fontSize: '20px' }} />
                            ) : (
                                <FaExclamationCircle style={{ marginRight: '10px', fontSize: '20px' }} />
                            )}
                            <span>{mensagem}</span>
                        </div>
                    )}
                    {/* Verifica se há alguma mensagem a ser exibida, se for true, verifica qual tipo de mensagem 
                    e a exibe em uma div (cada mensagem tem um estilo) */}
                </Modal.Body>

                <Modal.Footer style={{ backgroundColor: 'black' }}>

                    <Button style={{ backgroundColor: 'black', color: 'white', border: '1px solid white' }} onClick={handlePaymentClose}>
                        Fechar
                    </Button>

                    <Button style={{ border: '1px solid white', backgroundColor: '#1e7e34' }} onClick={validateCard}>
                        Confirmar Pagamento
                    </Button>

                </Modal.Footer>
            </Modal>

        </Pagina2>
    );
}