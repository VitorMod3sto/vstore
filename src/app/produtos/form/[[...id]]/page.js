"use client";

//Importações de componentes e hooks
import Pagina from "@/app/components/Pagina";
import { Formik } from "formik";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button, Form } from "react-bootstrap";
import { FaCheck } from "react-icons/fa";
import { IoMdArrowRoundBack } from "react-icons/io";
import { FaCartArrowDown } from "react-icons/fa6";
import { v4 } from "uuid";
import { useState } from "react";

export default function Page({ params }) {
    const route = useRouter();
    const [imagePreview, setImagePreview] = useState('');
    // Criando estado para armazenar a prévia da imagem

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
        marca: ''
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
        return route.push('/produtos');
        // Redirecionando para a página de produtos
    }

    return (
        <Pagina titulo="Produto">

            <div className="form-container">

                <h2 className="form-title text-center" style={{ textShadow: '2.5px 2.5px 0 black, 2.5px 2.5px 0 black, -2.5px 2.5px 0 black, -2.5px -2.5px 0 black' }}>

                    {/* TÍTULO DA PÁGINA  */}
                    <b>Cadastro/Edição de Produto </b>
                    <span style={{ display: 'inline-block', filter: 'drop-shadow(1px 1px 0 black) drop-shadow(-1px -1px 0 black) drop-shadow(1px -1px 0 black) drop-shadow(-1px 1px 0 black)' }}>
                        <FaCartArrowDown /> {/* Ícone do carrinho */}
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
                    onSubmit={values => salvar(values)}
                // Chamando a função de salvar ao clicar em enviar formulário
                >
                    {({
                        values,
                        handleChange,
                        handleSubmit,
                    }) => (
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
                                    <option value="roupa">Roupa</option>
                                    <option value="tenis">Tênis</option>
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
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="descricao">
                                <Form.Label>Descrição</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    name="descricao"
                                    value={values.descricao}
                                    onChange={handleChange('descricao')}
                                />
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="categoria">
                                <Form.Label>Categoria</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="categoria"
                                    value={values.categoria}
                                    onChange={handleChange('categoria')}
                                    placeholder="Digite a categoria do produto"
                                />
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="preco">
                                <Form.Label>Preço</Form.Label>
                                <Form.Control
                                    type="number"
                                    name="preco"
                                    value={values.preco}
                                    onChange={handleChange('preco')}
                                />
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
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="imagem">
                                <Form.Label>Selecionar Imagem do Produto (PNG ou JPG)</Form.Label>
                                <Form.Control
                                    type="file"
                                    accept=".png,.jpg,.jpeg"
                                    onChange={event => {
                                        const file = event.target.files[0];
                                        // Pegando o arquivo selecionado
                                        const reader = new FileReader();
                                        // Criando um leitor de arquivos
                                        reader.onloadend = () => {
                                            handleChange('imagem')(reader.result);
                                            // Atualizando a imagem no estado
                                            setImagePreview(reader.result);
                                            // Definindo a prévia da imagem
                                        };
                                        reader.readAsDataURL(file);
                                        // Lendo o arquivo como uma URL
                                    }}
                                />
                            </Form.Group>

                            {imagePreview && (
                                <div className="image-preview">
                                    <img src={imagePreview} alt="Prévia" />
                                </div>
                            )}
                            {/* Exibindo a prévia da imagem  */}

                            {/* Renderiza o campo de tamanho baseado na categoria */}
                            <Form.Group className="mb-3" controlId="tamanho">
                                <Form.Label>Tamanho</Form.Label>
                                {values.tipo === 'tenis' ? (
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
                                    <option value="Vermelho">Vermelho</option>
                                    <option value="Laranja">Laranja</option>
                                    <option value="Amarelo">Amarelo</option>
                                    <option value="Verde">Verde</option>
                                    <option value="Azul">Azul</option>
                                    <option value="Anil">Anil</option>
                                    <option value="Violeta">Violeta</option>
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
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="marca">
                                <Form.Label>Marca</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="marca"
                                    value={values.marca}
                                    onChange={handleChange('marca')}
                                />
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
                    )}
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
