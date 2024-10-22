'use client';

import Pagina from "@/app/components/Pagina";
import apiLocalidade from "@/services/apiLocalidade";
import { Formik } from "formik";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { FaCheck } from "react-icons/fa";
import { IoMdArrowRoundBack } from "react-icons/io";
import { v4 } from "uuid";
import { BsPersonAdd } from "react-icons/bs";

import { buscarEnderecoPorCep } from "@/services/apiViaCep"; // Importação
import { MdOutlinePersonPin } from "react-icons/md";

export default function Page({ params }) {
  const route = useRouter();
  const funcionarios = JSON.parse(localStorage.getItem('funcionarios')) || [];
  const [ufs, setUfs] = useState([]);
  const [cidades, setCidades] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    apiLocalidade.get(`estados?orderBy=nome`).then(resultado => {
      setUfs(resultado.data);
    });
  }, []);

  const dados = funcionarios.find(item => item.id == params.id);
  const funcionario = dados || { nome: '', cargo: '', cpf: '', dataNascimento: '', cidade: '', email: '', telefone: '', cep: '', uf: '', bairro: '', endereco: '', numero: '' };

  function salvar(dados) {
    if (funcionario.id) {
      Object.assign(funcionario, dados);
    } else {
      dados.id = v4();
      funcionarios.push(dados);
    }
    localStorage.setItem('funcionarios', JSON.stringify(funcionarios));
    setSuccessMessage('Informações do Funcionário salvas com sucesso!');
    setTimeout(() => {
      route.push('/funcionarios');
    }, 3000);
  }

  return (
    <Pagina titulo="Funcionários">
      {successMessage && <div className="alert alert-success text-center">{successMessage}</div>}

      <div className="form-container">
        <h2 className="text-center mb-3" style={{ textShadow: '2.5px 2.5px 0 black, 2.5px -2.5px 0 black, -2.5px 2.5px 0 black, -2.5px -2.5px 0 black', color: 'white' }}>
          Adicionar/Editar Funcionário <MdOutlinePersonPin style={{ display: 'inline-block', filter: 'drop-shadow(1.5px 2px 0 black) drop-shadow(-2px -2px 0 black) drop-shadow(2px -2px 0 black) drop-shadow(-1.5px 2px 0 black)' }} />
        </h2>

        <Formik
          initialValues={funcionario}
          onSubmit={values => salvar(values)}
        >
          {({
            values,
            handleChange,
            handleSubmit,
          }) => {
            useEffect(() => {
              if (values.uf) {
                apiLocalidade.get(`estados/${values.uf}/municipios`).then(resultado => {
                  setCidades(resultado.data);
                });
              }
            }, [values.uf]);

            useEffect(() => {
              if (values.cep.length === 8) {
                buscarEnderecoPorCep(values.cep).then(endereco => {
                  if (endereco && !endereco.erro) {
                    handleChange({ target: { name: 'endereco', value: endereco.logradouro } });
                    handleChange({ target: { name: 'bairro', value: endereco.bairro } });
                    handleChange({ target: { name: 'cidade', value: endereco.localidade } });
                    handleChange({ target: { name: 'uf', value: endereco.uf } });
                  } else {
                    console.warn("CEP não encontrado.");
                  }
                });
              }
            }, [values.cep]);

            return (
              <Form onSubmit={handleSubmit}>
                <div className="row mb-3">
                  <div className="col">
                    <Form.Group controlId="nome">
                      <Form.Label>Nome</Form.Label>
                      <Form.Control
                        type="text"
                        name="nome"
                        value={values.nome}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </div>
                  <div className="col">
                    <Form.Group controlId="cargo">
                      <Form.Label>Cargo</Form.Label>
                      <Form.Select
                        name="cargo"
                        value={values.cargo}
                        onChange={handleChange}
                      >
                        <option value=''>Selecione</option>
                        <option value='Gerente'>Gerente</option>
                        <option value='Coordenador'>Coordenador</option>
                        <option value='TI'>TI</option>
                      </Form.Select>
                    </Form.Group>
                  </div>
                </div>

                <div className="row mb-3">
                  <div className="col">
                    <Form.Group controlId="dataNascimento">
                      <Form.Label>Data de Nascimento</Form.Label>
                      <Form.Control
                        type="number"
                        name="dataNascimento"
                        value={values.dataNascimento}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </div>
                  <div className="col">
                    <Form.Group controlId="cpf">
                      <Form.Label>CPF</Form.Label>
                      <Form.Control
                        type="number"
                        name="cpf"
                        value={values.cpf}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </div>
                </div>

                <div className="row mb-3">
                  <div className="col">
                    <Form.Group controlId="email">
                      <Form.Label>Email</Form.Label>
                      <Form.Control
                        type="email"
                        name="email"
                        value={values.email}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </div>
                  <div className="col">
                    <Form.Group controlId="telefone">
                      <Form.Label>Telefone</Form.Label>
                      <Form.Control
                        type="text"
                        name="telefone"
                        value={values.telefone}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </div>
                </div>

                <div className="row mb-3">
                  <div className="col">
                    <Form.Group controlId="cep">
                      <Form.Label>CEP</Form.Label>
                      <Form.Control
                        type="text"
                        name="cep"
                        value={values.cep}
                        onChange={handleChange('cep')}
                      />
                    </Form.Group>
                  </div>
                  <div className="col">
                    <Form.Group controlId="uf">
                      <Form.Label>UF</Form.Label>
                      <Form.Select
                        name="uf"
                        value={values.uf}
                        onChange={handleChange('uf')}
                      >
                        <option value=''>Selecione</option>
                        {ufs.map(item => (
                          <option key={item.sigla} value={item.sigla}>
                            {item.sigla} - {item.nome}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </div>
                </div>

                <div className="row mb-3">
                  <div className="col">
                    <Form.Group controlId="cidade">
                      <Form.Label>Cidade</Form.Label>
                      <Form.Select
                        name="cidade"
                        value={values.cidade}
                        onChange={handleChange('cidade')}
                      >
                        <option value=''>Selecione</option>
                        {cidades.map(item => (
                          <option key={item.nome} value={item.nome}>
                            {item.nome}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </div>
                  <div className="col">
                    <Form.Group controlId="bairro">
                      <Form.Label>Bairro:</Form.Label>
                      <Form.Control
                        type="text"
                        name="bairro"
                        value={values.bairro}
                        onChange={handleChange('bairro')}
                      />
                    </Form.Group>
                  </div>
                </div>

                <div className="row mb-3">
                  <div className="col">
                    <Form.Group controlId="endereco">
                      <Form.Label>Endereço:</Form.Label>
                      <Form.Control
                        type="text"
                        name="endereco"
                        value={values.endereco}
                        onChange={handleChange('endereco')}
                      />
                    </Form.Group>
                  </div>
                  <div className="col">
                    <Form.Group controlId="numero">
                      <Form.Label>Número</Form.Label>
                      <Form.Control
                        type="number"
                        name="numero"
                        value={values.numero}
                        onChange={handleChange}
                        placeholder="Digite um número"
                      />
                    </Form.Group>
                  </div>
                </div>

                <div className="text-center">
                  <Button type="submit" variant="success" style={{ fontWeight: 'bold' }}>
                    <FaCheck style={{ marginBottom: '2px' }} /> Salvar
                  </Button>
                  <Link href="/funcionarios" className="btn btn-light ms-3" style={{ color: '#003366', fontWeight: 'bold' }}>
                    <IoMdArrowRoundBack style={{ marginBottom: '2px' }} /> Voltar
                  </Link>
                </div>
              </Form>
            );
          }}
        </Formik>
      </div>
      <style jsx>{`
        .form-container {
          background-color: #003366;
          color: white;
          padding: 20px;
          border-radius: 10px;
          max-width: 600px;
          margin: 0 auto;
          margin-top: 20px;
        }
      `}</style>
    </Pagina>
  );
}
