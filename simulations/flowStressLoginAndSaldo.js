import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '1m', target: 6 }, // Aumenta para 6 usuários em 1m
    { duration: '1m', target: 6 }, // Mantém os 6 usuários em 1m
    { duration: '1m', target: 10 }, // Aumenta para 10 usuários em 1m
    { duration: '1m', target: 10 }, // Mantém os 10 usuários em 1m
    { duration: '1m', target: 6 }, // Diminui para 6 usuários em 1m
    { duration: '1m', target: 6 }, // Mantém os 6 usuários em 1m
    { duration: '1m', target: 0 }, // Diminui para 0 usuários em 1m
  ],
};

export default function () {
  // Definir URLs
  const loginUrl = 'https://backdev.fds.bet/api/auth/login';
  const saldoUrl = 'https://backdev.fds.bet/api/casino/fds';

  // Definir payloads
  const loginPayload = JSON.stringify({
    email: 'testecasino@gmail.com',
    password: 'ab40028922',
  });

  const saldoPayload = JSON.stringify({
    user_id: 185268,
    event_name: 'balance',
  });

  // Definir cabeçalhos
  const params = {
    headers: {
      'Content-Type': 'application/json',
      'application-encrypt': 'fdstst',
    },
  };

  // Fazer as requisições em paralelo
  const responses = http.batch([
    ['POST', loginUrl, loginPayload, params],
    ['POST', saldoUrl, saldoPayload, params],
  ]);

  // Verificar as respostas
  check(responses[0], {
    'login successful': (r) => r.status === 200,
    'login response time < 500ms': (r) => r.timings.duration < 500,
  });

  check(responses[1], {
    'balance retrieved': (r) => r.status === 200,
    'balance response time < 500ms': (r) => r.timings.duration < 500,
  });

  sleep(1); // Espera 1 segundo antes de repetir
}
