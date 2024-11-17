'use client'

import Pagina from "@/app/components/Pagina";
import { Formik } from "formik";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { FaCheck } from "react-icons/fa";
import { IoMdArrowRoundBack } from "react-icons/io";
import { v4 } from "uuid";
import { LuClipboardType } from "react-icons/lu";
import CategoriaValidator from "@/services/Validators/CategoriaValidator";

export default function Page({ params }) {
    const route = useRouter();

    const categorias = JSON.parse(localStorage.getItem('categorias')) || [];
    const dados = categorias.find(item => item.id == params.id);
    const categoria = dados || { nome: '', descricao: '' };
    const [successMessage, setSuccessMessage] = useState('');

    function salvar(dados) {
        if (categoria.id) {
            Object.assign(categoria, dados);
        } else {
            dados.id = v4();
            categorias.push(dados);
        }
        localStorage.setItem('categorias', JSON.stringify(categorias));

        setSuccessMessage('Informações da Categoria salvas com sucesso!');
        setTimeout(() => {
            route.push('/categorias');
        }, 3000);
    }

    return (
        <Pagina titulo="Categorias">
            {successMessage && (
                <div className="alert alert-success text-center">
                    {successMessage}
                </div>
            )}

            <div className="form-container">
                <h2 className="text-center mb-3" style={{ textShadow: '2px 2px 0 black', color: 'white' }}>
                    Adicionar/Editar Categoria
                    <LuClipboardType className="ms-2" />
                </h2>

                <Formik
                    initialValues={categoria}
                    validationSchema={CategoriaValidator} // Adiciona o validador
                    onSubmit={(values) => salvar(values)}
                >
                    {({ values, handleChange, handleSubmit, errors }) => ( // Inclui 'errors'
                        <Form>
                            <Form.Group className="mb-3" controlId="nome">
                                <Form.Label>Nome</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="nome"
                                    value={values.nome}
                                    onChange={handleChange('nome')}
                                    style={{ backgroundColor: 'white', color: 'black' }}
                                />
                                {errors.nome && <div className="text-danger">{errors.nome}</div>}
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="descricao">
                                <Form.Label>Descrição</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    name="descricao"
                                    value={values.descricao}
                                    style={{ backgroundColor: 'white', color: 'black', height: '115px' }}
                                    onChange={handleChange('descricao')}
                                />
                                {errors.descricao && <div className="text-danger">{errors.descricao}</div>}
                            </Form.Group>

                            <div className="text-center">
                                <Button
                                    onClick={handleSubmit}
                                    variant="light"
                                    style={{ fontWeight: 'bold', backgroundColor: 'white', color: 'black' }}
                                >
                                    <FaCheck style={{ marginBottom: '2px' }} /> Salvar
                                </Button>

                                <Link
                                    href="/categorias"
                                    className="btn btn-light ms-3"
                                    style={{
                                        color: 'black',
                                        fontWeight: 'bold',
                                        border: '1px solid white',
                                    }}
                                >
                                    <IoMdArrowRoundBack style={{ marginBottom: '2px' }} /> Voltar
                                </Link>
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
            <style jsx>{`
                .form-container {
                    background-color: black; /* Fundo preto */
                    color: white; /* Texto branco */
                    padding: 20px;
                    border-radius: 10px;
                    max-width: 600px;
                    margin: 0 auto;
                    margin-top: 20px;
                }
                .alert-success {
                    background-color: white; /* Fundo branco */
                    color: black; /* Texto preto */
                    border: 1px solid black;
                }
                h2 svg {
                    color: white; /* Ícone branco */
                }
            `}</style>
        </Pagina>
    );
}
