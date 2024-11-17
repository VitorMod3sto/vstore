'use client'

import Pagina from "@/app/components/Pagina";
import { Formik } from "formik";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { TbBrandPushbullet } from "react-icons/tb";
import { FaCheck } from "react-icons/fa";
import { IoMdArrowRoundBack } from "react-icons/io";
import { v4 } from "uuid";
import MarcaValidator from "@/services/Validators/MarcaVallidator";

export default function Page({ params }) {
    const route = useRouter();

    const marcas = JSON.parse(localStorage.getItem('marcas')) || [];
    const dados = marcas.find(item => item.id == params.id);
    const marca = dados || { nome: '', descricao: '' };
    const [successMessage, setSuccessMessage] = useState('');

    function salvar(dados) {
        if (marca.id) {
            Object.assign(marca, dados);
        } else {
            dados.id = v4();
            marcas.push(dados);
        }
        localStorage.setItem('marcas', JSON.stringify(marcas));

        setSuccessMessage('Informações da Marca salvas com sucesso!');
        setTimeout(() => {
            route.push('/marcas');
        }, 3000);
    }

    return (
        <Pagina titulo="Marcas">
            {successMessage && (
                <div className="alert alert-success text-center">
                    {successMessage}
                </div>
            )}

            <div className="form-container">
                <h2 className="text-center mb-3" style={{ color: 'white' }}>
                    Adicionar/Editar Marca
                    <TbBrandPushbullet className="ms-2" />
                </h2>

                <Formik
                    initialValues={marca}
                    validationSchema={MarcaValidator} // Adiciona o schema de validação
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
                                {/* Exibe o erro do campo nome */}
                                {errors.nome && <div className="text-danger">{errors.nome}</div>}
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="descricao">
                                <Form.Label>Descrição</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    name="descricao"
                                    value={values.descricao}
                                    style={{
                                        backgroundColor: 'white',
                                        color: 'black',
                                        height: '115px',
                                    }}
                                    onChange={handleChange('descricao')}
                                />
                                {/* Exibe o erro do campo descricao */}
                                {errors.descricao && (
                                    <div className="text-danger">{errors.descricao}</div>
                                )}
                            </Form.Group>

                            <div className="text-center">
                                <Button
                                    onClick={handleSubmit}
                                    variant="light"
                                    style={{
                                        fontWeight: 'bold',
                                        backgroundColor: 'white',
                                        color: 'black',
                                    }}
                                >
                                    <FaCheck style={{ marginBottom: '2px' }} /> Salvar
                                </Button>
                                <Link
                                    href="/marcas"
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
