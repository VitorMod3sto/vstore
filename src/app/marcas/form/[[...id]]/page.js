'use client'

import Pagina from "@/app/components/Pagina";
import { Formik } from "formik";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { TbBrandCpp, TbBrandPushbullet } from "react-icons/tb";

import { FaCheck } from "react-icons/fa";
import { IoMdArrowRoundBack } from "react-icons/io";
import { v4 } from "uuid";

export default function Page({ params }) {

    const route = useRouter()

    // Carregando as marcas do localStorage ou definindo um array vazio
    const marcas = JSON.parse(localStorage.getItem('marcas')) || []
    
    // Buscando a marca que corresponde ao ID passado no parâmetro
    const dados = marcas.find(item => item.id == params.id)

    // Se não encontrar, define um objeto marca vazio com campos iniciais:
    const marca = dados || { nome: '', descricao: '' }

     // Criando estado para mensagem de sucesso ao cadastrar/editar
    const [successMessage, setSuccessMessage] = useState('');

    // Função para salvar os dados da marca
    function salvar(dados) {
        if (marca.id) {
            // Se a marca existir, atualiza os dados
            Object.assign(marca, dados)
        } else {
            // Se for uma nova categoria, gera um ID único e adiciona ao array
            dados.id = v4()
            marcas.push(dados)
        }
        localStorage.setItem('marcas', JSON.stringify(marcas))
        // Salvando as marcas atualizadas no localStorage

        // Exibe a mensagem de sucesso
        setSuccessMessage('Informações da Marca salvas com sucesso!');
        setTimeout(() => {

            return route.push('/marcas');
            // Redirecionando para a página de produtos

        }, 3000); // Redireciona após 3 segundos
    }

    return (
        <Pagina titulo="Marcas">
            {successMessage && <div className="alert alert-success text-center">{successMessage}</div>}

            <div className="form-container">

                {/* TÍTULO DA PÁGINA  */}
                <h2 className="text-center mb-3" style={{ textShadow: '2.5px 2.5px 0 black, 2.5px -2.5px 0 black, -2.5px 2.5px 0 black, -2.5px -2.5px 0 black', color: 'white' }}>
                    Adicionar/Editar Marca
                    <TbBrandPushbullet  
                    className="ms-2" style={{ display: 'inline-block', filter: 'drop-shadow(1.5px 2px 0 black) drop-shadow(-2px -2px 0 black) drop-shadow(2px -2px 0 black) drop-shadow(-1.5px 2px 0 black)' }} />
                </h2>

                {/* USANDO FORMIK */}
                <Formik
                    initialValues={marca}
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
                                    <Link href="/marcas" className="btn btn-light ms-3" style={{ color: '#003366', fontWeight: 'bold' }}>
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