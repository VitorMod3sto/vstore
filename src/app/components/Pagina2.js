import { useState, useEffect } from "react";
import { Navbar, Container, Nav, Dropdown, Form, Button, Modal, } from "react-bootstrap";
import { BiListCheck, BiLogoVuejs } from "react-icons/bi";
import { IoPerson } from "react-icons/io5";
import { IoMdMenu } from "react-icons/io";
import { FaBoxOpen, FaShoppingCart } from "react-icons/fa";
import { FaSearch } from "react-icons/fa";
import Footer from "./Footer";
import { FaTruckFast } from "react-icons/fa6";
import { IoPersonCircleOutline } from "react-icons/io5";
import { AiFillHome } from "react-icons/ai";
import { MdLocalGroceryStore } from "react-icons/md";
import Link from "next/link";

export default function Pagina2(props) {
    const [search, setSearch] = useState("");
    // Estado para armazenar o valor (texto) da busca na barra de pesquisa

    const [abrirModal, setAbrirModal] = useState(false);
    // Estado para controlar a abertura da Modal

    const [sugestoes, setSugestoes] = useState([]);
    // Estado para armazenar as sugestões

    const fecharModal = () => setAbrirModal(false);
    // Função para fechar a Modal (tornando o estado da abertura pra false)
    const exibirModal = () => setAbrirModal(true);
    // Função para exibir a Modal (tornando o estado da abertura pra true)

    useEffect(() => {
        // // useEffect para carregar os produtos do localStorage ao pesquisar produto
        if (search.length > 0) {
            // Verificando se a pesquisa possui algum valor (se não está vazia)
            const produtosEstoque = JSON.parse(localStorage.getItem("produtos")) || [];
            // Armazenando os produtos na variável (Array) produtosEstoque, caso não tenha produtos, inicia um Array vazio
            const FiltroSugestao = produtosEstoque.filter((produto) =>
                // Armazenando o nome do produto como filtro de Busca (virando a sugestão que será exibida)
                produto.nome.toLowerCase().includes(search.toLowerCase())
                // Verificando se o nome de algum produto correponde ao nome digitado como pesquisa
                // (includes = verificar se o nome do produto inclui o nome digitado salvo em 'search')

            );
            setSugestoes(FiltroSugestao);
            //Alterando a sugestão de produtos com o Filtro criado (nome digitado e os produtos correspondentes)
        } else {
            setSugestoes([]);
            // Senão (caso não tenha sido digitado nenhum valor) atualiza o estado das sugestões pra uma Array vazio
        }
    }, [search]);
    // Definindo que o useEffect será chamado sempre que o valor da pesquisa (search) mudar



    const [itensCarrinho, setItensCarrinho] = useState([]);  // Estado para armazenar os itens do carrinho
    const [quantidadeCarrinho, setQuantidadeCarrinho] = useState(0); // Quantidade total de itens
    const [carrinhoVisivel, setCarrinhoVisivel] = useState(false); // Estado para controlar a visibilidade do resumo do carrinho
    const [clienteLogado, setClienteLogado] = useState(null);
    // Função para carregar os itens do carrinho e atualizar o contador
    const carregarCarrinho = () => {
        const cliente = JSON.parse(localStorage.getItem('clienteLogado')); // Recupera os dados do cliente logado
        if (cliente) {
            setClienteLogado(cliente);  // Carrega os dados do cliente logado
            const carrinhos = JSON.parse(localStorage.getItem('carrinhos')) || []; // Recupera os carrinhos do localStorage
            const carrinhoDoCliente = carrinhos.find(c => c.email === cliente.email);
            if (carrinhoDoCliente) {
                setItensCarrinho(carrinhoDoCliente.itens);  // Atualiza os itens do carrinho
                // Atualiza o contador de itens
                setQuantidadeCarrinho(carrinhoDoCliente.itens.reduce((total, item) => total + item.quantidade, 0));
            }
        }
    };

    // Efeito para carregar o carrinho ao montar o componente ou quando o cliente logado mudar
    useEffect(() => {
        carregarCarrinho();
    }, []);

    // Função para monitorar mudanças no localStorage
    useEffect(() => {
        const handleStorageChange = (e) => {
            if (e.key === 'carrinhos') {
                carregarCarrinho(); // Atualiza os itens e a quantidade do carrinho quando o localStorage mudar
            }
        };

        // Escuta mudanças no localStorage
        window.addEventListener('storage', handleStorageChange);

        // Limpar o ouvinte de evento quando o componente for desmontado
        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

    // Função para alternar a visibilidade do resumo do carrinho
    const toggleCarrinho = () => {
        setCarrinhoVisivel(!carrinhoVisivel);
        carregarCarrinho();  // Ao abrir o carrinho, atualiza os itens e a quantidade
    };

    // Função para calcular o total do carrinho
    const calcularTotal = () => {
        return itensCarrinho.reduce((total, item) => total + item.preco * item.quantidade, 0).toFixed(2);
    };

    // Função para logout
    const logout = () => {
        // Limpar o cliente logado no localStorage
        localStorage.removeItem('clienteLogado');
        // Limpar o estado de clienteLogado
        setClienteLogado(null);
        // Pode redirecionar para a página inicial ou para o login após o logout
        window.location.reload(); // ou usar `router.push('/home')` se estiver usando `next/router`
    };

    return (
        // Começando componente de Página (Menu + Footer)
        <>

            {/* CRIANDO FAIXA DE FRETE GRÁTIS*/}
            <div
                style={{
                    backgroundColor: "white",
                    color: "black",
                    textAlign: "center",
                    padding: "05px 0",
                    fontWeight: "bold",
                }}
            >
                Frete grátis acima de R$250,00! <FaTruckFast style={{ fontSize: "20px", marginBottom: "02px" }} />
            </div>

            {/* CRIANDO MENU NAVBAR*/}
            <Navbar style={{ backgroundColor: "black" }} variant="dark">
                <Container>

                    {/* Criando as opções de Menu */}

                    <IoMdMenu
                        style={{ color: "#ffffff", fontSize: "30px", cursor: "pointer" }}
                        onClick={exibirModal}
                    />
                    {/* Criando ícone de opções e definindo que ao clicar, irá chamar a função abrirModal ( onClick={exibirModal} ) */}


                    {/* Criando ícone da Loja */}
                    <Navbar.Brand href="/paginas/home">
                        <BiLogoVuejs style={{ fontSize: "40px", marginLeft: "20" }} />
                    </Navbar.Brand>

                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <div style={{ flexGrow: 1, marginLeft: "220px" }}>

                            {/* Criando barra de pesquisa */}

                            <Form className="d-flex" style={{ maxWidth: "600px" }}>

                                <Form.Group controlId="search" className="flex-grow-1">
                                    <Form.Control
                                        type="text"
                                        placeholder="Pesquisar produto..."
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        style={{ borderRadius: "10px", position: "relative", color: "black", fontWeight: 'bold' }}
                                    />
                                    {/* Alterando estado da pesquisa (search) ao digitar (mudar o valor) */}

                                    {sugestoes.length > 0 && (
                                        <div
                                            style={{
                                                position: "absolute",
                                                zIndex: 1000,
                                                backgroundColor: "white",
                                                border: "1px solid #ddd",
                                                borderRadius: "5px",
                                                maxHeight: "200px",
                                                overflowY: "auto",
                                                width: "100%",
                                                fontFamily: 'Montserrat, sans-serif',
                                            }}
                                        >
                                            {/* Se houver sugestão de produto irá exibir a div de sugestões  */}

                                            {sugestoes.map(produto => (
                                                <Link key={produto.id} href={`/paginas/produtos/${produto.id}`}
                                                    style={{ textDecoration: 'none', color: 'black' }}>
                                                    <div
                                                        style={{
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            padding: "10px",
                                                            cursor: "pointer",
                                                        }}
                                                    >
                                                        {/* Fazendo Map de produtos na qual se tiver sugestão com os valores digitados,
                                                         irá exibir o nome e a imagem do produto, na qual defini o Link para
                                                         redirecionar para a página de detalhe do produto específico selecionado */}

                                                        {produto.imagem && (
                                                            <img
                                                                src={produto.imagem}
                                                                alt={produto.nome}
                                                                style={{ width: '40px', height: '40px', borderRadius: '5px', marginRight: '10px' }} // Estilo da imagem
                                                            />
                                                        )}
                                                        <span>{produto.nome}</span>
                                                    </div>
                                                </Link>
                                            ))}
                                        </div>
                                    )}
                                </Form.Group>

                                {/* Criando botão de buscar ao lado da barra
                                OBS: o botão está meramente como visual já que na função de buscar produto (search),
                                já busca as sugestão de produtos com mesmo valor (nome) */}
                                <Button
                                    variant="light"
                                    style={{
                                        color: "black",
                                        fontWeight: "bold",
                                        border: "2px solid white",
                                    }}
                                    className="ms-2"
                                >
                                    <FaSearch style={{ marginBottom: "3px" }} /> Buscar
                                </Button>

                            </Form>
                        </div>

                        {/* Criando botão de Carrinho de compras */}
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                width: "40px",
                                height: "40px",
                                borderRadius: "50%",
                                backgroundColor: "white",
                                marginLeft: "10px",
                                marginTop: "5px",
                                position: "relative",
                                cursor: 'pointer',
                            }}
                            onClick={toggleCarrinho}
                        >
                            <FaShoppingCart
                                style={{
                                    color: "black",
                                    fontSize: "20px",
                                }}
                            />
                            {quantidadeCarrinho > 0 && (
                                <span
                                    style={{
                                        position: "absolute",
                                        top: "-5px",
                                        right: "-5px",
                                        backgroundColor: "red",
                                        color: "white",
                                        borderRadius: "50%",
                                        padding: "2px 8px",
                                        fontSize: "14px",
                                    }}
                                >
                                    {quantidadeCarrinho}
                                </span>
                            )}
                        </div>

                        {/* Resumo do Carrinho */}
                        {carrinhoVisivel && (
                            <div
                                style={{
                                    position: "absolute",
                                    top: "70px",
                                    right: "10px",
                                    width: "300px",
                                    backgroundColor: "#fff",
                                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                                    padding: "10px",
                                    zIndex: 999,
                                    borderRadius: "8px",
                                    border: "1px solid black",
                                    display: "flex",
                                    flexDirection: "column",   // Flex column for items and button
                                    maxHeight: "400px",         // Limitar a altura máxima
                                }}
                            >
                                <h5>Itens no Carrinho</h5>
                                <hr style={{ border: "2px solid #ddd", marginBottom: "10px" }} />
                                <div
                                    style={{
                                        flex: 1,
                                        overflowY: "auto",        // Permitir scroll vertical nos itens
                                        maxHeight: "300px",        // Limitar altura dos itens
                                        marginBottom: "10px",
                                    }}
                                >
                                    {itensCarrinho.length === 0 ? (
                                        <p>Seu carrinho está vazio.</p>
                                    ) : (
                                        itensCarrinho.map((item) => (
                                            <div
                                                key={item.id}
                                                style={{
                                                    marginBottom: "10px",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    borderBottom: "1px solid #ddd",
                                                    paddingBottom: "10px",
                                                    paddingTop: "10px",
                                                }}
                                            >
                                                <img
                                                    src={item.imagem}
                                                    alt={item.nome}
                                                    style={{
                                                        width: "50px",
                                                        height: "50px",
                                                        marginRight: "10px",
                                                    }}
                                                />
                                                <div style={{ flex: 1 }}>
                                                    <div style={{ fontWeight: "bold", marginBottom: "5px" }}>
                                                        {item.nome}
                                                    </div>
                                                    <div style={{ fontSize: "12px", color: "gray" }}>
                                                        Quantidade: {item.quantidade}
                                                    </div>
                                                </div>
                                                <div style={{ fontWeight: "bold", marginLeft: "20px" }}>
                                                    R$ {item.preco.toFixed(2)}
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                                <div style={{ marginTop: "5px", fontWeight: "bold" }}>
                                    <p>Total: R$ {calcularTotal()}</p>
                                </div>
                                <Link href="/paginas/carrinho">
                                    <Button style={{
                                        backgroundColor: 'black',
                                        color: 'white',
                                        border: 'none',
                                        width: '100%',
                                    }}>
                                        Ver Carrinho
                                    </Button>
                                </Link>
                            </div>
                        )}


                        {/* Menu do usuário */}
                        <Nav className="ms-auto">
                            <Dropdown>
                                <Dropdown.Toggle
                                    as={Nav.Link}
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        width: "40px",
                                        height: "40px",
                                        borderRadius: "50%",
                                        backgroundColor: "white",
                                        marginLeft: "10px",
                                        marginTop: "05px",
                                        position: "relative",
                                    }}
                                >
                                    <IoPerson
                                        style={{
                                            color: "black",
                                            position: "absolute",
                                            top: "50%",
                                            left: "50%",
                                            transform: "translate(-50%, -50%)",
                                        }}
                                    />
                                </Dropdown.Toggle>

                                <Dropdown.Menu align="end">
                                    {clienteLogado ? (
                                        // Exibe apenas a opção "Sair" se o cliente estiver logado
                                        <Dropdown.Item
                                            onClick={logout}
                                            style={{ color: "black", fontWeight: "bold" }}
                                        >
                                            <b>Sair</b>
                                        </Dropdown.Item>
                                    ) : (
                                        <>
                                            {/* Exibe as opções de Login e Cadastro se o cliente não estiver logado */}
                                            <Dropdown.Item href="/paginas/login" style={{ color: "black" }}>
                                                <b>Login</b>
                                            </Dropdown.Item>
                                            <Dropdown.Item href="/paginas/cadastros" style={{ color: "black" }}>
                                                <b>Cadastre-se</b>
                                            </Dropdown.Item>
                                        </>
                                    )}
                                </Dropdown.Menu>
                            </Dropdown>
                        </Nav>
                    </Navbar.Collapse>

                </Container>
            </Navbar>

            {/* Criando Modal */}
            <Modal
                show={abrirModal}
                onHide={fecharModal}
                style={{
                    position: "fixed",
                    top: "50%",
                    left: "0",
                    transform: "translateY(-50%)",
                    width: "350px",
                }}
                className="custom-modal"
            >
                {/* Definindo que ao clicar na Modal e abri-la (puxando a função abrirModal irá exibir:*/}

                <Modal.Header style={{ backgroundColor: "black", color: "white" }}>
                    <Modal.Title style={{ width: '100%' }}>
                        <div style={{ display: 'flex' }}>
                            <IoPersonCircleOutline
                                style={{ marginBottom: "5px", marginRight: "10px", fontSize: "35px" }}
                            />
                            <span>
                                {clienteLogado && clienteLogado.nome ?
                                    `Olá, ${clienteLogado.nome}` :
                                    "Olá"}
                            </span>
                        </div>
                        <div style={{ marginTop: '5px', fontSize: '18px' }}>
                            Seja bem-vindo!
                        </div>
                    </Modal.Title>
                </Modal.Header>

                {/* Mensagem de olá */}
                <Modal.Body style={{ backgroundColor: "black", color: "white", fontSize: "20px" }}>
                    <ul style={{ padding: 0, listStyleType: "none" }}>
                        {/* Renderiza a opção "Minha Conta" apenas se o cliente estiver logado */}
                        {clienteLogado && clienteLogado.nome && (
                            <li>
                                <Link href={`/paginas/clientes/Account`} style={{ textDecoration: 'none', color: 'white' }}>
                                    <AiFillHome style={{ marginBottom: "06px" }} /> Minha Conta
                                </Link>
                            </li>
                        )}
                        <li>
                            <Link href={`/paginas/produtos`} style={{ textDecoration: 'none', color: 'white' }}>
                                <FaBoxOpen style={{ marginBottom: "03px" }} /> Produtos
                            </Link>
                        </li>
                        <li>
                            <Link href={`/paginas/carrinho`} style={{ textDecoration: 'none', color: 'white' }}>
                                <MdLocalGroceryStore style={{ marginBottom: "03px" }} /> Meu Carrinho
                            </Link>
                        </li>
                        <li>
                            <Link href={`/paginas/clientes/Compras`} style={{ textDecoration: 'none', color: 'white' }}>
                                <BiListCheck style={{ marginBottom: "03px", fontSize:'28px' }} /> Meus pedidos
                            </Link>
                        </li>
                    </ul>
                </Modal.Body>

                {/* Criando Footer da Modal*/}
                <Modal.Footer style={{ backgroundColor: "black", display: "flex", flexDirection: "column", alignItems: "center" }}>
                    {/* Exibir botões de login e cadastro apenas se o cliente não estiver logado */}
                    {!clienteLogado ? (
                        <>
                            <Button
                                variant="light"
                                style={{
                                    width: "100%",
                                    margin: "10px 0",
                                    fontWeight: "bold",
                                    color: "black",
                                    backgroundColor: "white",
                                }}
                                href="/login"
                            >
                                LOGIN
                            </Button>

                            <Button
                                variant="light"
                                style={{
                                    width: "100%",
                                    margin: "10px 0",
                                    fontWeight: "bold",
                                    color: "white",
                                    backgroundColor: "black",
                                    border: "none",
                                }}
                                href="/cadastro"
                            >
                                CADASTRE-SE
                            </Button>
                        </>
                    ) : null} {/* Não renderiza os botões se o cliente estiver logado */}
                </Modal.Footer>
            </Modal>


            <Container fluid className="my-2">
                {props.children}
            </Container>
            <Footer />
        </>
    );
}
