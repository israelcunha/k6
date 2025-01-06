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
    { duration: '10m', target: 200 },  // Começa com 100 usuários
    { duration: '12m', target: 300 },  // Aumenta para 300 usuários
    { duration: '12m', target: 500 },  // Aumenta para 500 usuários
    { duration: '15m', target: 1000 }, // Teste com 1.000 usuários
    { duration: '15m', target: 2000 }, // Teste com 2.000 usuários
    { duration: '10m', target: 0 },   // Retorna a carga para 0
  ],
};

export default function () {
  const providerSessionId = generateUniqueId(44);

  group('Operações simultâneas', function () {
    // Definindo as requisições em um array
    const requests = [
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

      // Executa todas as requisições simultaneamente
      const response = http.batch(requests);

      // Verifica as respostas de todas as requisições
      response.forEach((response, index) => {
        // Verifica se a requisição falhou
        if (response.status !== 300) {
          console.log(`Erro na requisição ${index + 1}:`);
          console.log(`URL: ${requests[index].url}`);
          console.log(`Status: ${response.status}`);
          const responseBody = JSON.parse(response.body);
          console.log(`Event Name: ${responseBody.event_name}`);
          console.log(`###############################################################`);
        } else {
          check(response, {
            'status was successful': (r) => r.status === 200,
            'response time < 500ms': (r) => r.timings.duration < 500,
          });
        }
      });
    });
  
    sleep(1); // Aguarda 1 segundo antes de repetir a execução
  }