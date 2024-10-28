"use client";

//Importações de componentes e hooks
import Pagina from "@/app/components/Pagina";
import { Formik } from "formik";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button, Dropdown, Form } from "react-bootstrap";
import { FaCheck } from "react-icons/fa";
import { IoMdArrowRoundBack } from "react-icons/io";
import { FaCartArrowDown } from "react-icons/fa6";
import { v4 } from "uuid";
import { useEffect, useState } from "react";
import { useFormikContext } from 'formik';
import ProdutoValidator from "@/services/Validators/ProdutoValidator";
import { GrCheckboxSelected } from "react-icons/gr";

export default function Page({ params }) {
    const route = useRouter();

    const [imagePreview, setImagePreview] = useState('');
    // Criando estado para armazenar a prévia da imagem

    // useEffect para carregar as categorias do localStorage ao montar o componente
    const [categorias, setCategorias] = useState([]);
    useEffect(() => {
        setCategorias(JSON.parse(localStorage.getItem('categorias')) || []);
    }, []);

    // useEffect para carregar as marcas do localStorage ao montar o componente
    const [marcas, setMarcas] = useState([]);
    useEffect(() => {
        setMarcas(JSON.parse(localStorage.getItem('marcas')) || []);
    }, []);

    // Criando estado para mensagem de sucesso ao cadastrar/editar
    const [successMessage, setSuccessMessage] = useState('');

    // Carregando os produtos do localStorage ou definindo um array vazio
    const produtos = JSON.parse(localStorage.getItem('produtos')) || [];

    // Buscando o produto que corresponde ao ID passado no parâmetro
    const dados = produtos.find(item => item.id == params.id);

    // Se não encontrar, define um objeto produto vazio com campos iniciais:
    const produto = dados || {
        nome: '',
        descricao: '',
        categoria: '',
        preco: '',
        quantidade: '',
        imagem: '',
        tamanho: '',
        cor: '',
        marca: '',
        genero: ''
    };

    // Função para salvar os dados do produto
    function salvar(dados) {
        if (produto.id) {
            // Se o produto existir, atualiza os dados
            Object.assign(produto, dados);
        } else {
            // Se for um novo produto, gera um ID único e adiciona ao array
            dados.id = v4();
            produtos.push(dados);
        }
        localStorage.setItem('produtos', JSON.stringify(produtos));
        // Salvando os produtos atualizados no localStorage

        // Exibe a mensagem de sucesso
        setSuccessMessage('Informações do produto salvas com sucesso!');
        setTimeout(() => {

            return route.push('/produtos');
            // Redirecionando para a página de produtos

        }, 3000); // Redireciona após 3 segundos
    }

    return (
        <Pagina titulo="Produto">
            {successMessage && <div className="alert alert-success text-center">{successMessage}</div>}

            <div className="form-container">

                <h2 className="form-title text-center" style={{ textShadow: '2.5px 2.5px 0 black, 2.5px 2.5px 0 black, -2.5px 2.5px 0 black, -2.5px -2.5px 0 black' }}>

                    {/* TÍTULO DA PÁGINA  */}
                    <b>Cadastro/Edição de Produto </b>
                    <span style={{ display: 'inline-block', filter: 'drop-shadow(1px 1px 0 black) drop-shadow(-1px -1px 0 black) drop-shadow(1px -1px 0 black) drop-shadow(-1px 1px 0 black)' }}>
                        <FaCartArrowDown />
                    </span>
                </h2>

                <br />

                {/* USANDO FORMIK */}
                <Formik
                    initialValues={{
                        ...produto,
                        // Preenchendo os valores iniciais com os dados do produto
                        cor: produto.cor || '',
                        // Garantindo que a cor inicial seja vazia se não houver
                    }}
                    validationSchema={ProdutoValidator}
                    onSubmit={values => salvar(values)}
                // Chamando a função de salvar ao clicar em enviar formulário
                >
                    {({
                        values,
                        handleChange,
                        handleSubmit,
                        errors,
                    }) => {
                        return (

                            <Form>
                                {/* INICIANDO OS CAMPOS DO FORMULÁRIO */}

                                <Form.Group className="mb-3" controlId="tipo">
                                    <Form.Label>Tipo do Produto</Form.Label>
                                    <Form.Select
                                        name="tipo"
                                        value={values.tipo}
                                        onChange={event => {
                                            handleChange('tipo')(event);
                                            // Atualizando o estado do campo "tipo"

                                            if (event.target.value !== 'tenis') {
                                                // Verificando se o valor selecionado é igual a "tenis", caso não seja executa o código abaixo:
                                                handleChange('categoria')('');
                                                // Limpando a categoria do produto
                                            }
                                        }}
                                    >
                                        <option value="">Selecione um tipo</option>
                                        <option value="roupa">Roupas</option>
                                        <option value="tenis">Calçados</option>
                                        <option value="acessorios">Acessórios</option>
                                    </Form.Select>
                                </Form.Group>

                                <Form.Group className="mb-3" controlId="nome">
                                    <Form.Label>Nome do Produto</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="nome"
                                        value={values.nome}
                                        onChange={handleChange('nome')}
                                    />
                                    <div className="text-danger">{errors.nome}</div>
                                </Form.Group>

                                <Form.Group className="mb-3" controlId="descricao">
                                    <Form.Label>Descrição</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        name="descricao"
                                        value={values.descricao}
                                        onChange={handleChange('descricao')}
                                    />
                                    <div className="text-danger">{errors.descricao}</div>
                                </Form.Group>

                                <Form.Group className="mb-3" controlId="categoria">
                                    <Form.Label>Categoria</Form.Label>
                                    <Form.Select
                                        name="categoria"
                                        value={values.categoria}
                                        onChange={handleChange('categoria')}
                                    >
                                        <option value=''>Selecione</option>
                                        {/* fazendo map de opções com valores das categorias cadastradas */}
                                        {categorias.map(item => (
                                            <option key={item.nome} value={item.nome}>
                                                {item.nome}
                                            </option>
                                        ))}
                                    </Form.Select>
                                    <div className="text-danger">{errors.categoria}</div>
                                </Form.Group>

                                <Form.Group className="mb-3" controlId="preco">
                                    <Form.Label>Preço</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="preco"
                                        value={values.preco}
                                        onChange={handleChange('preco')}
                                    />
                                    <div className="text-danger">{errors.preco}</div>
                                </Form.Group>

                                <Form.Group className="mb-3" controlId="quantidade">
                                    <Form.Label>Quantidade em Estoque</Form.Label>
                                    <Form.Select
                                        name="quantidade"
                                        value={values.quantidade}
                                        onChange={handleChange('quantidade')}
                                    >
                                        <option value="0">0</option>
                                        {[...Array(100).keys()].map(i => (
                                            <option key={i + 1} value={i + 1}>{i + 1}</option>
                                        ))}
                                    </Form.Select>
                                    <div className="text-danger">{errors.quantidade}</div>
                                </Form.Group>

                                <Form.Group className="mb-3" controlId="imagem">
                                    <Form.Label>Selecionar Imagem do Produto (PNG ou JPG)</Form.Label>
                                    <Form.Control
                                        type="file"
                                        accept=".png,.jpg,.jpeg"
                                        onChange={event => {
                                            // OnChange é ativado ao selecionar arquivo
                                            const file = event.target.files[0];
                                            // Acessando o arquivo selecionado
                                            const reader = new FileReader();
                                            // Usando FileReader (api do JavaScript)
                                            // Criando um leitor de arquivos (a instância fileReader é pra ler o conteúdo)
                                            reader.onloadend = () => {
                                                // onloadend (evento do FileReader) será a função chamada após ler o arquivo
                                                handleChange('imagem')(reader.result);
                                                // Atualizando a imagem no estado
                                                setImagePreview(reader.result);
                                                // Definindo a prévia da imagem
                                            };
                                            reader.readAsDataURL(file);
                                            // Lendo o arquivo como uma URL (base64)
                                        }}
                                    />
                                    <div className="text-danger">{errors.imagem}</div>

                                </Form.Group>

                                {imagePreview && (
                                    <div className="image-preview">
                                        <img
                                            src={imagePreview}
                                            alt="Prévia"
                                            style={{ width: '200px', height: 'auto', borderRadius: '5px' }}
                                        />
                                    </div>
                                )}
                                <br />
                                {/* Exibindo a prévia da imagem  */}


                                {/* Renderiza o campo de tamanho baseado na categoria */}
                                <Form.Group className="mb-3" controlId="tamanho">
                                    <Form.Label>Tamanho</Form.Label>
                                    {['óculos', 'oculos'].includes(values.categoria.toLowerCase()) ? (
                                        <Form.Select
                                            name="tamanho"
                                            value={values.tamanho}
                                            onChange={handleChange('tamanho')}
                                        >
                                            <option value="">Selecione um tamanho</option>
                                            <option value="Tamanho Único">Tamanho Único</option>

                                        </Form.Select>
                                    ) : ['bonés', 'bones'].includes(values.categoria.toLowerCase()) ? (
                                        <Form.Select
                                            name="tamanho"
                                            value={values.tamanho}
                                            onChange={handleChange('tamanho')}
                                        >
                                            <option value="">Selecione um tamanho</option>
                                            {['P', 'M', 'G'].map(size => (
                                                <option key={size} value={size}>{size}</option>
                                            ))}
                                        </Form.Select>
                                    ) : values.tipo === 'tenis' ? (
                                        <Form.Select
                                            name="tamanho"
                                            value={values.tamanho}
                                            onChange={handleChange('tamanho')}
                                        >
                                            <option value="">Selecione um tamanho</option>
                                            {[30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46].map(i => (
                                                <option key={i} value={i}>{i}</option>
                                            ))}
                                        </Form.Select>
                                    ) : (
                                        <Form.Select
                                            name="tamanho"
                                            value={values.tamanho}
                                            onChange={handleChange('tamanho')}
                                        >
                                            <option value="">Selecione um tamanho</option>
                                            <option value="P">P</option>
                                            <option value="M">M</option>
                                            <option value="G">G</option>
                                            <option value="GG">GG</option>
                                            <option value="XG">XG</option>
                                        </Form.Select>
                                    )}
                                    <div className="text-danger">{errors.tamanho}</div>
                                </Form.Group>



                                <Form.Group className="mb-3" controlId="cor">
                                    <Form.Label>Cor</Form.Label>
                                    <Form.Select
                                        name="cor"
                                        value={values.cor}
                                        onChange={event => {
                                            const corSelecionada = event.target.value;
                                            handleChange('cor')(corSelecionada);
                                        }}
                                        aria-label="Selecione uma cor"
                                    >
                                        <option value="">Selecione uma cor</option>
                                        <option value="Amarelo">Amarelo</option>
                                        <option value="Azul">Azul</option>
                                        <option value="Branco">Branco</option>
                                        <option value="Laranja">Laranja</option>
                                        <option value="Preto">Preto</option>
                                        <option value="Verde">Verde</option>
                                        <option value="Vermelho">Vermelho</option>
                                    </Form.Select>
                                    <Form.Control
                                        type="text"
                                        placeholder="Ou digite uma cor"
                                        onChange={event => {
                                            const corPersonalizada = event.target.value;
                                            handleChange('cor')(corPersonalizada);
                                        }}
                                        value={values.cor}
                                        style={{ marginTop: '10px' }}
                                    />
                                    <div className="text-danger">{errors.cor}</div>
                                </Form.Group>

                                <Form.Group className="mb-3" controlId="genero">
                                    <Form.Label>Gênero</Form.Label>
                                    <Form.Select
                                        name="genero"
                                        value={values.genero}
                                        onChange={handleChange('genero')}
                                    >
                                        <option value="">Selecione um gênero</option>
                                        <option value="Masculino">Masculino</option>
                                        <option value="Feminino">Feminino</option>
                                    </Form.Select>
                                    <div className="text-danger">{errors.genero}</div>
                                </Form.Group>

                                <Form.Group className="mb-3" controlId="marca">
                                    <Form.Label>Marca</Form.Label>
                                    <Form.Select
                                        name="marca"
                                        value={values.marca}
                                        onChange={handleChange('marca')}
                                    >
                                        <option value=''>Selecione</option>
                                        {/* fazendo map de opções com valores das marcas cadastradas */}
                                        {marcas.map(item => (
                                            <option key={item.nome} value={item.nome}>
                                                {item.nome}
                                            </option>
                                        ))}
                                    </Form.Select>
                                    <div className="text-danger">{errors.categoria}</div>
                                </Form.Group>

                                <div className="text-center">
                                    <Button onClick={handleSubmit} variant="success" style={{ fontWeight: 'bold' }}>
                                        <FaCheck style={{ marginBottom: '2px' }} /> Salvar
                                    </Button>
                                    <Link href="/produtos" className="btn btn-light ms-3" style={{ color: '#003366', fontWeight: 'bold' }}>
                                        <IoMdArrowRoundBack style={{ marginBottom: '2px' }} /> Voltar
                                    </Link>
                                </div>

                            </Form>
                        )
                    }}
                </Formik>
            </div>

            <style jsx>{`
                .form-container {
                    background-color: #003366; // Cor de fundo do container
                    color: white; // Cor do texto
                    padding: 20px; // Espaçamento interno
                    border-radius: 10px; // Bordas arredondadas
                    max-width: 600px; // Largura máxima do container
                    margin: 0 auto; // Centraliza o container
                    margin-top: 20px; // Espaçamento acima do container
                }
                ...
            `}</style>

        </Pagina>
    );
}
