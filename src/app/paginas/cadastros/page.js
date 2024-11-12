'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Pagina2 from "@/app/components/Pagina2";
import { BiLogoVuejs } from 'react-icons/bi';
import apiLocalidade from "@/services/apiLocalidade";
import { buscarEnderecoPorCep } from "@/services/apiViaCep";
import { FaArrowRight } from 'react-icons/fa';
import emailjs from 'emailjs-com';
import { GiPartyHat, GiPartyPopper } from "react-icons/gi";


export default function Cadastro() {
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [mensagem, setMensagem] = useState('');
    const [mostrarEndereco, setMostrarEndereco] = useState(false);
    const [ufs, setUfs] = useState([]);
    const [cidades, setCidades] = useState([]);
    const [cep, setCep] = useState('');
    const [endereco, setEndereco] = useState('');
    const [bairro, setBairro] = useState('');
    const [numero, setNumero] = useState('');
    const [uf, setUf] = useState('');
    const [cidade, setCidade] = useState('');

    // Defina a cor da mensagem aqui
    const [corMensagem, setCorMensagem] = useState('red'); // Inicialmente vermelha (erro)

    // Estado para controlar a exibição do modal de boas-vindas
    const [mostrarModal, setMostrarModal] = useState(false);

    useEffect(() => {
        apiLocalidade.get('estados?orderBy=nome').then(resultado => {
            setUfs(resultado.data);
        });
    }, []);

    const avancarParaEndereco = () => {
        if (!nome || !email || !senha) {
            setMensagem('Todos os campos são obrigatórios!');
            setCorMensagem('red'); // Cor vermelha para erro
            return;
        }

        const clientes = JSON.parse(localStorage.getItem('clientes')) || [];
        const clienteExistente = clientes.find(cliente => cliente.email === email);

        if (clienteExistente) {
            setMensagem('E-mail já cadastrado!');
            setCorMensagem('red'); // Cor vermelha para erro
            return;
        }

        setMostrarEndereco(true);
        setMensagem('');
    };

    useEffect(() => {
        if (cep.length === 8) {
            buscarEnderecoPorCep(cep).then(endereco => {
                if (endereco && !endereco.erro) {
                    setEndereco(endereco.logradouro);
                    setBairro(endereco.bairro);
                    setCidade(endereco.localidade);
                    setUf(endereco.uf);
                } else {
                    console.warn("CEP não encontrado.");
                }
            });
        }
    }, [cep]);

    useEffect(() => {
        if (uf) {
            apiLocalidade.get(`estados/${uf}/municipios`).then(resultado => {
                setCidades(resultado.data);
                setCidade('');
            });
        }
    }, [uf]);

    const cadastrarCliente = () => {
        if (!nome || !email || !senha || !endereco || !numero || !cidade || !uf) {
            setMensagem('Todos os campos são obrigatórios!');
            setCorMensagem('red'); // Cor vermelha para erro
            return;
        }

        const clientes = JSON.parse(localStorage.getItem('clientes')) || [];
        const clienteExistente = clientes.find(cliente => cliente.email === email);

        if (clienteExistente) {
            setMensagem('E-mail já cadastrado!');
            setCorMensagem('red'); // Cor vermelha para erro
            return;
        }

        // Adiciona o novo cliente
        const novoCliente = { nome, email, senha, endereco, numero, bairro, cep, cidade, uf };
        clientes.push(novoCliente);
        localStorage.setItem('clientes', JSON.stringify(clientes));
        localStorage.setItem('clienteLogado', JSON.stringify(novoCliente));

        // Chama o envio do e-mail imediatamente após o cadastro
        enviarEmailBoasVindas(nome, email);

        // Define a cor da mensagem para verde e a mensagem de sucesso
        setCorMensagem('green'); // Cor verde para sucesso
        setMensagem('Cadastro realizado com sucesso!');

        // Exibe o modal de boas-vindas
        setMostrarModal(true);
        // Espera 4 segundos antes de redirecionar
        setTimeout(() => {
            window.location.href = '/paginas/home';  // Redireciona para a página home
        }, 6000);  // Atraso de 4 segundos

    };

    // Função para enviar o e-mail de boas-vindas
    const enviarEmailBoasVindas = (nome, email) => {
        const templateParams = {
            to_email: email,
            to_name: nome,
            email: email
        };

        emailjs.send(
            process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID,  // Usando variáveis de ambiente
            process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID,  // Usando variáveis de ambiente
            templateParams,
            process.env.NEXT_PUBLIC_EMAILJS_USER_ID // Usando variáveis de ambiente
        )
            .then((response) => {
                console.log('E-mail enviado com sucesso:', response);
            })
            .catch((error) => {
                console.error('Erro ao enviar o e-mail:', error);
            });
    };

    return (
        <Pagina2 titulo="Cadastro">
            <div style={{
                padding: '40px',
                width: '400px',
                margin: '50px auto',
                backgroundColor: 'black',
                borderRadius: '8px',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                color: 'white',
                textAlign: 'center',
                height: '650px',
            }}>

                <h2 style={{
                    fontFamily: 'Montserrat, sans-serif',
                    fontWeight: '700',
                    fontSize: '24px',
                    marginBottom: '30px',
                    color: 'white'
                }}>
                    CADASTRE-SE AGORA <BiLogoVuejs style={{ fontSize: '45px' }} />
                </h2>

                {!mostrarEndereco ? (
                    <div style={{ marginBottom: '20px' }}>
                        <input
                            type="text"
                            value={nome}
                            onChange={(e) => setNome(e.target.value)}
                            placeholder="Nome"
                            required
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
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="E-mail"
                            required
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
                            required
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
                ) : (
                    <div style={{ marginTop: '30px' }}>
                        <input
                            type="text"
                            value={cep}
                            onChange={(e) => setCep(e.target.value)}
                            placeholder="CEP"
                            style={{
                                width: '48%',
                                padding: '12px',
                                marginRight: '4%',
                                borderRadius: '5px',
                                border: '2px solid #333',
                                boxSizing: 'border-box',
                                fontSize: '16px'
                            }}
                        />
                        <select
                            value={uf}
                            onChange={(e) => setUf(e.target.value)}
                            style={{
                                width: '48%',
                                padding: '12px',
                                borderRadius: '5px',
                                border: '2px solid #333',
                                boxSizing: 'border-box',
                                fontSize: '16px'
                            }}
                        >
                            <option value=''>Selecione a UF</option>
                            {ufs.map(uf => (
                                <option key={uf.sigla} value={uf.sigla}>
                                    {uf.sigla}
                                </option>
                            ))}
                        </select>
                        <select
                            value={cidade}
                            onChange={(e) => setCidade(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '12px',
                                marginTop: '15px',
                                marginBottom: '15px',
                                borderRadius: '5px',
                                border: '2px solid #333',
                                boxSizing: 'border-box',
                                fontSize: '16px'
                            }}
                        >
                            <option value=''>Selecione a cidade</option>
                            {cidades.map(cidade => (
                                <option key={cidade.nome} value={cidade.nome}>
                                    {cidade.nome}
                                </option>
                            ))}
                        </select>

                        <input
                            type="text"
                            value={endereco}
                            onChange={(e) => setEndereco(e.target.value)}
                            placeholder="Endereço"
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
                            type="text"
                            value={bairro}
                            onChange={(e) => setBairro(e.target.value)}
                            placeholder="Bairro"
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
                            type="number"
                            value={numero}
                            onChange={(e) => setNumero(e.target.value)}
                            placeholder="Número"
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
                    </div>
                )}

                <div style={{ minHeight: '30px' }}>
                    {mensagem && (
                        <p style={{
                            textAlign: 'center',
                            color: corMensagem,  // Usando a cor dinâmica
                            marginTop: '15px',
                            fontSize: '14px',
                            fontWeight: 'bold'
                        }}>
                            {mensagem}
                        </p>
                    )}
                </div>

                {!mostrarEndereco ? (
                    <button
                        onClick={avancarParaEndereco}
                        style={{
                            width: '100%',
                            padding: '12px',
                            backgroundColor: 'white',
                            color: 'black',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: 'pointer',
                            fontSize: '16px',
                            fontWeight: 'bold',
                        }}
                    >
                        AVANÇAR <FaArrowRight />
                    </button>
                ) : (
                    <button
                        onClick={cadastrarCliente}
                        style={{
                            width: '100%',
                            padding: '12px',
                            backgroundColor: '#28a745',
                            color: 'white',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: 'pointer',
                            fontSize: '16px',
                            fontWeight: 'bold',
                            marginTop: '15px',
                        }}
                    >
                        CONCLUIR CADASTRO
                    </button>
                )}

                <div style={{ marginTop: '20px' }}>
                    <p style={{ fontSize: '14px', color: 'white' }}>
                        Já tem conta?
                        <Link href="/paginas/login" style={{
                            color: '#007bff',
                            textDecoration: 'none',
                            fontWeight: 'bold'
                        }}> Faça login
                        </Link>
                    </p>
                </div>
            </div>

            {mostrarModal && (
    <div style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)', // Garantir que o modal fique centralizado
        backgroundColor: 'black',  // Fundo preto
        padding: '30px 40px',
        borderRadius: '12px',
        border: '2px solid #f0a500',  // Borda laranja
        textAlign: 'center',
        zIndex: '1000',
        boxShadow: '0 8px 16px rgba(0, 0, 0, 0.3)',
        opacity: 1,
        transition: 'opacity 1s ease-out',  // Fade-in suave
        animation: 'fadeIn 1s ease-out',  // Animação de fade-in
    }}>
        <h1 style={{color: '#f0a500'}}>
             <BiLogoVuejs style={{fontSize:'40px'}}/><GiPartyPopper style={{marginBottom:'10px', fontSize:'45px'}}/>
        </h1>
        <h2 style={{
            color: '#f0a500',  // Texto laranja
            fontSize: '24px',
            fontWeight: '700',
            marginBottom: '20px',
            fontFamily: 'Montserrat, sans-serif',
            textTransform: 'uppercase',
        }}>
           Bem-vindo à Vstore, {nome}! 
        </h2>
        <p style={{
            color: 'white',  // Texto branco para contraste no fundo preto
            fontSize: '18px',
            fontWeight: '500',
            lineHeight: '1.6',
            marginBottom: '20px',
        }}>
            Você acaba de se juntar à nossa família ! <br />
            Um e-mail de boas-vindas foi enviado para o seu endereço de e-mail e nele você encontrará uma surpresa especial! 🎁
        </p>
        <button
            onClick={() => setMostrarModal(false)}
            style={{
                padding: '12px 20px',
                backgroundColor: '#f0a500',  // Botão laranja
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: 'pointer',
                marginTop: '20px',
                transition: 'background-color 0.3s',
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#f58d42'} // Hover color
            onMouseLeave={(e) => e.target.style.backgroundColor = '#f0a500'} // Hover color
        >
            Fechar
        </button>
    </div>
)}

<style jsx>{`
    @keyframes fadeIn {
        0% {
            opacity: 0;
        }
        100% {
            opacity: 1;
        }
    }
`}</style>


        </Pagina2>
    );
}
