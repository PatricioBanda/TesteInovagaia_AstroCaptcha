import { Constellation } from './types';

export const CONSTELLATIONS: Constellation[] = [
  {
    id: 'orion',
    name: 'Orion',
    stars: [
      { id: 'betelgeuse', name: 'Betelgeuse', x: 35, y: 25, magnitude: 1.5, color: '#ffb399' }, // Orange Supergiant
      { id: 'bellatrix', name: 'Bellatrix', x: 68, y: 28, magnitude: 1.2, color: '#adc6ff' }, // Blue Giant
      { id: 'alnitak', name: 'Alnitak', x: 42, y: 52, magnitude: 1.1, color: '#adc6ff' },
      { id: 'alnilam', name: 'Alnilam', x: 50, y: 50, magnitude: 1.1, color: '#adc6ff' },
      { id: 'mintaka', name: 'Mintaka', x: 58, y: 48, magnitude: 1.1, color: '#adc6ff' },
      { id: 'saiph', name: 'Saiph', x: 32, y: 78, magnitude: 1.3, color: '#adc6ff' },
      { id: 'rigel', name: 'Rigel', x: 68, y: 75, magnitude: 1.6, color: '#ffffff' } // Bright Blue-white Supergiant
    ],
    connections: [
      ['alnitak', 'alnilam'],
      ['alnilam', 'mintaka'],
      ['betelgeuse', 'alnitak'],
      ['bellatrix', 'mintaka'],
      ['saiph', 'alnitak'],
      ['rigel', 'mintaka']
    ],
    hintPt: 'Procura as três estrelas alinhadas do cinto central. Elas são o ponto de partida para a constelação de Orion.',
    hintEn: 'Look for the three aligned stars of the central belt. They are the starting point for connecting Orion.',
    insightStatic: "Orion is one of the most recognizable constellations, featuring the famous 'Orion's Belt'. It is visible throughout the world and represents the mythological Greek hunter."
  },
  {
    id: 'cassiopeia',
    name: 'Cassiopeia',
    stars: [
      { id: 'caph', name: 'Caph', x: 18, y: 35, magnitude: 1.4, color: '#ffffff' },
      { id: 'schedar', name: 'Schedar', x: 34, y: 58, magnitude: 1.5, color: '#ffcc99' },
      { id: 'tsih', name: 'Tsih', x: 50, y: 40, magnitude: 1.6, color: '#adc6ff' },
      { id: 'ruchbah', name: 'Ruchbah', x: 66, y: 55, magnitude: 1.3, color: '#ffffff' },
      { id: 'segin', name: 'Segin', x: 82, y: 32, magnitude: 1.2, color: '#adc6ff' }
    ],
    connections: [
      ['caph', 'schedar'],
      ['schedar', 'tsih'],
      ['tsih', 'ruchbah'],
      ['ruchbah', 'segin']
    ],
    hintPt: 'Conecta os 5 pontos brilhantes num formato de ziguezague formando um "W" característico.',
    hintEn: 'Connect the 5 bright star points in a jagged zigzag pattern forming a distinctive "W" shape.',
    insightStatic: "Cassiopeia is a prominent northern constellation easily recognized by its bright 'W' shape. In Greek lore, she was a boastful queen placed in the heavens as punishment."
  },
  {
    id: 'ursa_major',
    name: 'Ursa Major',
    stars: [
      { id: 'alkaid', name: 'Alkaid', x: 15, y: 28, magnitude: 1.2, color: '#adc6ff' },
      { id: 'mizar', name: 'Mizar', x: 26, y: 32, magnitude: 1.3, color: '#ffffff' },
      { id: 'alioth', name: 'Alioth', x: 38, y: 36, magnitude: 1.4, color: '#ffffff' },
      { id: 'megrez', name: 'Megrez', x: 50, y: 40, magnitude: 1.1, color: '#adc6ff' },
      { id: 'phecda', name: 'Phecda', x: 48, y: 62, magnitude: 1.2, color: '#ffffff' },
      { id: 'merak', name: 'Merak', x: 72, y: 64, magnitude: 1.3, color: '#ffffff' },
      { id: 'dubhe', name: 'Dubhe', x: 75, y: 43, magnitude: 1.5, color: '#ffcc99' }
    ],
    connections: [
      ['alkaid', 'mizar'],
      ['mizar', 'alioth'],
      ['alioth', 'megrez'],
      ['megrez', 'phecda'],
      ['phecda', 'merak'],
      ['merak', 'dubhe'],
      ['dubhe', 'megrez']
    ],
    hintPt: 'Desenha a colher: começa na ponta do cabo à esquerda, segue a curva e fecha o quadrado do copo.',
    hintEn: 'Draw the celestial spoon: start from the left handle tip, follow the curve, and complete the rectangular cup.',
    insightStatic: "Ursa Major represents the Great Bear, which contains the world-renowned 'Big Dipper' asterism. Sailors have used its outer pointer stars to find Polaris (the North Star) for centuries."
  }
];
