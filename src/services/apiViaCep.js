export async function buscarEnderecoPorCep(cep) {
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      if (!response.ok) throw new Error("Erro ao buscar endereço");
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Erro ao buscar endereço:", error);
      return null;
    }
  }