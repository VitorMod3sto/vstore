'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link'; // Importando o Link
import { BiLogoVuejs } from 'react-icons/bi';
import Pagina2 from '@/app/components/Pagina2';

export default function Page() {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [mensagem, setMensagem] = useState('');
    const [corMensagem, setCorMensagem] = useState(''); // Para controlar a cor da mensagem

    // Salva a página anterior quando o componente é montado
    useEffect(() => {
        // Verifica se já existe uma URL de origem no localStorage
        if (!localStorage.getItem('previousPage')) {
            // Se não houver, salva a página atual
            localStorage.setItem('previousPage', window.location.href);
        }
    }, []);

    // Função de login
const loginCliente = () => {
    const clientes = JSON.parse(localStorage.getItem('clientes')) || [];
    const cliente = clientes.find(cliente => cliente.email === email);

    // Verifica se o login é do administrador
    if (email === 'adm@gmail.com' && senha === 'flamengo') {
        setMensagem('Login de administrador bem-sucedido!');
        setCorMensagem('green'); // Cor verde para sucesso
        window.location.href = '/produtos'; // Redireciona para a página de produtos
        return;
    }

    if (!cliente) {
        setMensagem('E-mail não encontrado!');
        setCorMensagem('red'); // Cor vermelha para erro
        return;
    }

    if (cliente.senha !== senha) {
        setMensagem('Senha incorreta!');
        setCorMensagem('red'); // Cor vermelha para erro
        return;
    }

    // Salvando o cliente logado no localStorage
    localStorage.setItem('clienteLogado', JSON.stringify(cliente));
    setMensagem('Login bem-sucedido!');
    setCorMensagem('green'); // Cor verde para sucesso

    // Redirecionar para a página anterior ou para a página inicial
    const previousPage = localStorage.getItem('previousPage') || '/paginas/home'; // Padrão para /paginas/home
    window.location.href = previousPage;
};


    return (
        <Pagina2 titulo="Login">
            <div style={{
                padding: '40px',
                width: '400px',
                margin: '50px auto', // Margem superior e inferior
                backgroundColor: 'black',
                borderRadius: '8px',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                color: 'white', // Para garantir que o texto seja visível
                textAlign: 'center'
            }}>
                {/* Título */}
                <h2 style={{
                    fontFamily: 'Montserrat, sans-serif',
                    fontWeight: '700',
                    fontSize: '24px',
                    marginBottom: '30px',
                    color: 'white'
                }}>
                   BEM VINDO DE VOLTA <BiLogoVuejs style={{fontSize:'45px'}} />
                </h2>

                <div style={{ marginBottom: '20px' }}>
                    {/* Campo de Email */}
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="E-mail"
                        style={{
                            width: '100%',
                            padding: '12px',
                            marginBottom: '15px',
                            borderRadius: '5px',
                            border: '2px solid #333',
                            boxSizing: 'border-box', // Para garantir que a largura fique certa
                            fontSize: '16px'
                        }}
                    />
                    {/* Campo de Senha */}
                    <input
                        type="password"
                        value={senha}
                        onChange={(e) => setSenha(e.target.value)}
                        placeholder="Senha"
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

                {/* Mensagem de erro ou sucesso */}
                <div style={{ minHeight: '30px' }}>
                    {mensagem && (
                        <p style={{
                            textAlign: 'center',
                            color: corMensagem, // Usando a cor dinâmica
                            marginTop: '15px',
                            fontSize: '14px',
                            fontWeight: 'bold'
                        }}>
                            {mensagem}
                        </p>
                    )}
                </div>

                {/* Botão de Login */}
                <button
                    onClick={loginCliente}
                    style={{
                        width: '100%',
                        padding: '12px',
                        backgroundColor: '#007bff',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        fontSize: '16px',
                        fontWeight: 'bold',
                        transition: 'background-color 0.3s ease'
                    }}
                >
                    ENTRAR 
                </button>

                {/* Botão de Cadastro */}
                <div style={{ marginTop: '20px' }}>
                    <p style={{ fontSize: '14px', color: 'white' }}>
                        Não tem conta? 
                        <Link href="/paginas/cadastros" style={{
                            color: '#28a745',
                            textDecoration: 'none',
                            fontWeight: 'bold'
                        }}> Cadastre-se
                        </Link>
                    </p>
                </div>
            </div>
        </Pagina2>
    );
}
