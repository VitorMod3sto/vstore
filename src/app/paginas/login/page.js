'use client';

import { useState } from 'react';
import Pagina2 from "@/app/components/Pagina2";

export default function Login() {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [mensagem, setMensagem] = useState('');

    // Função de login
    const loginCliente = () => {
        const clientes = JSON.parse(localStorage.getItem('clientes')) || [];
        const cliente = clientes.find(cliente => cliente.email === email && cliente.senha === senha);

        if (!cliente) {
            setMensagem('E-mail ou senha inválidos!');
            return;
        }

        // Salvando o cliente logado no localStorage
        localStorage.setItem('clienteLogado', JSON.stringify(cliente));
        setMensagem('Login bem-sucedido!');
        // Redirecionando para a página inicial ou carrinho (opcional)
        window.location.href = '/paginas/home'; // Pode alterar para a página que desejar
    };

    return (
        <Pagina2 titulo="Login">
            <div style={{ padding: '20px', maxWidth: '400px', margin: 'auto' }}>
                <h2>Login</h2>
                <div style={{ marginBottom: '10px' }}>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="E-mail"
                        style={{ width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '5px' }}
                    />
                    <input
                        type="password"
                        value={senha}
                        onChange={(e) => setSenha(e.target.value)}
                        placeholder="Senha"
                        style={{ width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '5px' }}
                    />
                </div>

                <button
                    onClick={loginCliente}
                    style={{
                        width: '100%',
                        padding: '10px',
                        backgroundColor: '#007bff',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer'
                    }}
                >
                    Entrar
                </button>

                {mensagem && <p style={{ textAlign: 'center', color: 'red', marginTop: '10px' }}>{mensagem}</p>}
            </div>
        </Pagina2>
    );
}
