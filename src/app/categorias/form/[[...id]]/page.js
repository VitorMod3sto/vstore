'use client'

import Pagina from "@/app/components/Pagina";
import { Formik } from "formik";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { BiLogoCreativeCommons } from "react-icons/bi";
import { FaCheck } from "react-icons/fa";
import { MdOutlineWysiwyg } from "react-icons/md";

import { IoMdArrowRoundBack } from "react-icons/io";
import { v4 } from "uuid";
import { LuClipboardType } from "react-icons/lu";

export default function Page({ params }) {

    const route = useRouter()

    // Carregando as categorias do localStorage ou definindo um array vazio
    const categorias = JSON.parse(localStorage.getItem('categorias')) || []

    // Buscando a categoria que corresponde ao ID passado no parâmetro
    const dados = categorias.find(item => item.id == params.id)

    // Se não encontrar, define um objeto categoria vazio com campos iniciais:
    const categoria = dados || { nome: '', descricao: '' }

    // Criando estado para mensagem de sucesso ao cadastrar/editar
    const [successMessage, setSuccessMessage] = useState('');


    // Função para salvar os dados da categoria
    function salvar(dados) {
        if (categoria.id) {
            // Se a categoria existir, atualiza os dados
            Object.assign(categoria, dados)
        } else {
            // Se for uma nova categoria, gera um ID único e adiciona ao array
            dados.id = v4()
            categorias.push(dados)
        }
        localStorage.setItem('categorias', JSON.stringify(categorias))
        // Salvando as categorias atualizadas no localStorage

        // Exibe a mensagem de sucesso
        setSuccessMessage('Informações da Categoria salvas com sucesso!');
        setTimeout(() => {

            return route.push('/categorias')
            // Redirecionando para a página de categorias

        }, 3000); // Redireciona após 3 segundos

    }

    return (
        <Pagina titulo="Categorias">
            {successMessage && <div className="alert alert-success text-center">{successMessage}</div>}

            <div className="form-container">

                {/* TÍTULO DA PÁGINA  */}
                <h2 className="text-center mb-3" style={{ textShadow: '2.5px 2.5px 0 black, 2.5px -2.5px 0 black, -2.5px 2.5px 0 black, -2.5px -2.5px 0 black', color: 'white' }}>
                    Adicionar/Editar Categoria
                    <LuClipboardType className="ms-2" style={{ display: 'inline-block', filter: 'drop-shadow(1.5px 2px 0 black) drop-shadow(-2px -2px 0 black) drop-shadow(2px -2px 0 black) drop-shadow(-1.5px 2px 0 black)' }} />
                </h2>

                {/* USANDO FORMIK */}
                <Formik
                    initialValues={categoria}
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
                                <Form.Group className="mb-3" controlId="nome">
                                    <Form.Label>Nome</Form.Label>
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
                                        style={{ height: '115px' }}
                                        onChange={handleChange('descricao')}
                                    />
                                </Form.Group>


                                <div className="text-center">
                                    <Button onClick={handleSubmit} variant="success" style={{ fontWeight: 'bold' }}>
                                        <FaCheck style={{ marginBottom: '2px' }} /> Salvar
                                    </Button>

                                    <Link href="/categorias" className="btn btn-light ms-3" style={{ color: '#003366', fontWeight: 'bold' }}>
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
    )
}