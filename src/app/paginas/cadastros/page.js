'use client';

import { useState } from 'react';
import Pagina2 from "@/app/components/Pagina2";

export default function Cadastro() {
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [mensagem, setMensagem] = useState('');

    // Função de cadastro
    const cadastrarCliente = () => {
        // Recuperando os clientes já cadastrados
        const clientes = JSON.parse(localStorage.getItem('clientes')) || [];

        // Verificando se já existe um cliente com o mesmo e-mail
        const clienteExistente = clientes.find(cliente => cliente.email === email);

        if (clienteExistente) {
            setMensagem('E-mail já cadastrado!');
            return;
        }

        // Criando o novo cliente
        const novoCliente = { nome, email, senha };

        // Adicionando ao localStorage
        clientes.push(novoCliente);
        localStorage.setItem('clientes', JSON.stringify(clientes));

        // Logando o usuário automaticamente após o cadastro
        localStorage.setItem('clienteLogado', JSON.stringify(novoCliente));

        setMensagem('Cadastro realizado com sucesso!');
    };

    return (
        <Pagina2 titulo="Cadastro">
            <div style={{ padding: '20px', maxWidth: '400px', margin: 'auto' }}>
                <h2>Cadastro de Cliente</h2>
                <div style={{ marginBottom: '10px' }}>
                    <input
                        type="text"
                        value={nome}
                        onChange={(e) => setNome(e.target.value)}
                        placeholder="Nome"
                        style={{ width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '5px' }}
                    />
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
                    onClick={cadastrarCliente}
                    style={{
                        width: '100%',
                        padding: '10px',
                        backgroundColor: '#28a745',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer'
                    }}
                >
                    Cadastrar
                </button>

                {mensagem && <p style={{ textAlign: 'center', color: 'red', marginTop: '10px' }}>{mensagem}</p>}
            </div>
        </Pagina2>
    );
}
