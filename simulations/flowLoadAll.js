import http from 'k6/http';
import { check, sleep, group } from 'k6';

// Função para gerar strings aleatórias de 44 caracteres
function generateUniqueId(length) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// Cabeçalhos para todas as requisições
const headers = {
  'Content-Type': 'application/json',
  'application-encrypt': 'fdstst',
};

export const options = {
  stages: [
    { duration: '1m', target: 100 },  // Começa com 50 usuários em 1 minuto
    { duration: '2m', target: 200 },  // Começa com 50 usuários em 1 minuto
    { duration: '3m', target: 300 }, // Aumenta para 100 usuários em 2 minutos
    { duration: '4m', target: 400 }, // Chega a 200 usuários em 3 minutos
    { duration: '3m', target: 300 }, // Mantém 200 usuários por 3 minutos
    { duration: '2m', target: 200 }, // Diminui a carga para 0 usuários
    { duration: '1m', target: 100 }, // Diminui a carga para 0 usuários
  ],
};

export default function () {
  const providerSessionId = generateUniqueId(44);

  // Payloads de login e saldo
  const loginPayload = JSON.stringify({
    email: 'testecasino@gmail.com',
    password: 'ab40028922',
  });

  const saldoPayload = JSON.stringify({
    user_id: 185268,
    event_name: 'balance',
  });

  group('Operações simultâneas', function () {
    // Criando os dados das requisições
    let requests = [
      {
        method: 'POST',
        url: 'https://backdev.fds.bet/api/auth/login',
        body: loginPayload,
        params: { headers },
      },
      {
        method: 'POST',
        url: 'https://backdev.fds.bet/api/casino/fds',
        body: saldoPayload,
        params: { headers },
      },
      {
        method: 'POST',
        url: 'https://backdev.fds.bet/api/casino/fds',
        body: JSON.stringify({
          token: 'backdev-6617a60b61e594.039013',
          event_name: 'bet',
          amount: 0.1,
          user_id: 185268,
          game_id: 3,
          game_provider_id: 5,
          provider_session_id: providerSessionId,
          provider_round_id: '37203563241',
          provider_transaction_id: '372035641',
        }),
        params: { headers },
      },
      {
        method: 'POST',
        url: 'https://backdev.fds.bet/api/casino/fds',
        body: JSON.stringify({
          token: 'backdev-6617a60b61e594.039013',
          event_name: 'win',
          amount: 0.1,
          user_id: 185268,
          game_id: 3,
          game_provider_id: 5,
          provider_session_id: providerSessionId,
          provider_round_id: '37203563241',
          provider_transaction_id: '372035641',
        }),
        params: { headers },
      },
    ];

    // Executa as requisições paralelamente
    let responses = http.batch(requests);

    // Verifica as respostas de todas as requisições
    responses.forEach((response, index) => {
      // Verifica se o status da resposta não foi 200 (sucesso)
      if (response.status !== 200) {
        console.log(`Erro na requisição ${index + 1}:`);
        console.log(`URL: ${requests[index].url}`);
        console.log(`Status: ${response.status}`);
        console.log(`Resposta: ${response.body}`);
      } else {
        // Verificação adicional de sucesso e tempo de resposta
        check(response, {
          'status foi bem sucedido': (r) => r.status === 200,
          'tempo de resposta < 900ms': (r) => r.timings.duration < 500,
        });
      }
    });
  });

  sleep(1); // Aguarda 1 segundo antes de repetir a execução
}
