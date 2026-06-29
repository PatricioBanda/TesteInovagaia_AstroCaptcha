import { PrivateChallenge, PublicChallenge, Star } from './types';

type Difficulty = 'easy' | 'medium' | 'hard';

type ChallengeInput = {
  id: string;
  name: string;
  difficulty: Difficulty;
  stars: Star[];
  solutionEdges: [string, string][];
  hintPt: string;
  hintEn: string;
  successFeedbackPt: string;
  successFeedbackEn: string;
};

const blue = '#adc6ff';
const white = '#ffffff';
const warm = '#ffcc99';
const red = '#ff8a65';
const gold = '#eec200';

function challenge(input: ChallengeInput): PrivateChallenge {
  return input;
}

export const PRIVATE_CHALLENGES: PrivateChallenge[] = [
  challenge({
    id: 'orion',
    name: 'Orion',
    difficulty: 'medium',
    stars: [
      { id: 'betelgeuse', name: 'Betelgeuse', x: 35, y: 25, magnitude: 1.5, color: red },
      { id: 'bellatrix', name: 'Bellatrix', x: 68, y: 28, magnitude: 1.2, color: blue },
      { id: 'alnitak', name: 'Alnitak', x: 42, y: 52, magnitude: 1.1, color: blue },
      { id: 'alnilam', name: 'Alnilam', x: 50, y: 50, magnitude: 1.1, color: blue },
      { id: 'mintaka', name: 'Mintaka', x: 58, y: 48, magnitude: 1.1, color: blue },
      { id: 'saiph', name: 'Saiph', x: 32, y: 78, magnitude: 1.3, color: blue },
      { id: 'rigel', name: 'Rigel', x: 68, y: 75, magnitude: 1.6, color: white }
    ],
    solutionEdges: [['alnitak', 'alnilam'], ['alnilam', 'mintaka'], ['betelgeuse', 'alnitak'], ['bellatrix', 'mintaka'], ['saiph', 'alnitak'], ['rigel', 'mintaka']],
    hintPt: 'Procura as tres estrelas alinhadas do cinturao central.',
    hintEn: 'Look for the three aligned stars of the central belt.',
    successFeedbackPt: 'Orion e uma das constelacoes mais reconheciveis do ceu noturno.',
    successFeedbackEn: 'Orion is one of the most recognizable constellations in the night sky.'
  }),
  challenge({
    id: 'cassiopeia',
    name: 'Cassiopeia',
    difficulty: 'easy',
    stars: [
      { id: 'caph', name: 'Caph', x: 18, y: 35, magnitude: 1.4, color: white },
      { id: 'schedar', name: 'Schedar', x: 34, y: 58, magnitude: 1.5, color: warm },
      { id: 'tsih', name: 'Tsih', x: 50, y: 40, magnitude: 1.6, color: blue },
      { id: 'ruchbah', name: 'Ruchbah', x: 66, y: 55, magnitude: 1.3, color: white },
      { id: 'segin', name: 'Segin', x: 82, y: 32, magnitude: 1.2, color: blue }
    ],
    solutionEdges: [['caph', 'schedar'], ['schedar', 'tsih'], ['tsih', 'ruchbah'], ['ruchbah', 'segin']],
    hintPt: 'Liga os cinco pontos brilhantes num ziguezague em W.',
    hintEn: 'Connect the five bright points in a W-shaped zigzag.',
    successFeedbackPt: 'Cassiopeia destaca-se pelo seu formato em W.',
    successFeedbackEn: 'Cassiopeia stands out because of its W-shaped pattern.'
  }),
  challenge({
    id: 'ursa_major',
    name: 'Ursa Major',
    difficulty: 'medium',
    stars: [
      { id: 'alkaid', name: 'Alkaid', x: 15, y: 28, magnitude: 1.2, color: blue },
      { id: 'mizar', name: 'Mizar', x: 26, y: 32, magnitude: 1.3, color: white },
      { id: 'alioth', name: 'Alioth', x: 38, y: 36, magnitude: 1.4, color: white },
      { id: 'megrez', name: 'Megrez', x: 50, y: 40, magnitude: 1.1, color: blue },
      { id: 'phecda', name: 'Phecda', x: 48, y: 62, magnitude: 1.2, color: white },
      { id: 'merak', name: 'Merak', x: 72, y: 64, magnitude: 1.3, color: white },
      { id: 'dubhe', name: 'Dubhe', x: 75, y: 43, magnitude: 1.5, color: warm }
    ],
    solutionEdges: [['alkaid', 'mizar'], ['mizar', 'alioth'], ['alioth', 'megrez'], ['megrez', 'phecda'], ['phecda', 'merak'], ['merak', 'dubhe'], ['dubhe', 'megrez']],
    hintPt: 'Desenha a colher: cabo, curva e copo.',
    hintEn: 'Draw the spoon: handle, curve, and cup.',
    successFeedbackPt: 'Ursa Major contem o famoso asterismo da Grande Carroca.',
    successFeedbackEn: 'Ursa Major contains the famous Big Dipper asterism.'
  }),
  challenge({
    id: 'scorpius',
    name: 'Scorpius',
    difficulty: 'hard',
    stars: [
      { id: 'graffias', name: 'Graffias', x: 30, y: 18, magnitude: 1.2, color: blue },
      { id: 'dschubba', name: 'Dschubba', x: 42, y: 25, magnitude: 1.2, color: white },
      { id: 'antares', name: 'Antares', x: 52, y: 42, magnitude: 1.8, color: red },
      { id: 'shaula', name: 'Shaula', x: 68, y: 66, magnitude: 1.3, color: blue },
      { id: 'lesath', name: 'Lesath', x: 78, y: 78, magnitude: 1.1, color: white },
      { id: 'sargas', name: 'Sargas', x: 57, y: 80, magnitude: 1.2, color: white }
    ],
    solutionEdges: [['graffias', 'dschubba'], ['dschubba', 'antares'], ['antares', 'shaula'], ['shaula', 'lesath'], ['shaula', 'sargas']],
    hintPt: 'Usa Antares como centro e segue a cauda curva.',
    hintEn: 'Use Antares as the center and follow the curved tail.',
    successFeedbackPt: 'Scorpius e marcado por Antares, o coracao do escorpiao.',
    successFeedbackEn: 'Scorpius is marked by Antares, the scorpion heart.'
  }),
  challenge({
    id: 'crux',
    name: 'Crux',
    difficulty: 'easy',
    stars: [
      { id: 'acrux', name: 'Acrux', x: 50, y: 78, magnitude: 1.7, color: white },
      { id: 'gacrux', name: 'Gacrux', x: 48, y: 22, magnitude: 1.4, color: warm },
      { id: 'mimosa', name: 'Mimosa', x: 72, y: 48, magnitude: 1.4, color: blue },
      { id: 'delta', name: 'Delta Crucis', x: 28, y: 52, magnitude: 1.1, color: blue }
    ],
    solutionEdges: [['acrux', 'gacrux'], ['delta', 'mimosa']],
    hintPt: 'Liga o eixo vertical e depois o horizontal.',
    hintEn: 'Connect the vertical axis, then the horizontal axis.',
    successFeedbackPt: 'Crux, o Cruzeiro do Sul, e referencia de navegacao austral.',
    successFeedbackEn: 'Crux, the Southern Cross, is a southern navigation reference.'
  }),
  challenge({
    id: 'lyra',
    name: 'Lyra',
    difficulty: 'easy',
    stars: [
      { id: 'vega', name: 'Vega', x: 28, y: 22, magnitude: 1.8, color: white },
      { id: 'epsilon', name: 'Epsilon Lyrae', x: 45, y: 40, magnitude: 1.1, color: blue },
      { id: 'zeta', name: 'Zeta Lyrae', x: 58, y: 38, magnitude: 1.1, color: white },
      { id: 'sheliak', name: 'Sheliak', x: 70, y: 58, magnitude: 1.2, color: blue },
      { id: 'sulafat', name: 'Sulafat', x: 50, y: 72, magnitude: 1.2, color: warm }
    ],
    solutionEdges: [['vega', 'epsilon'], ['epsilon', 'zeta'], ['zeta', 'sheliak'], ['sheliak', 'sulafat'], ['sulafat', 'epsilon']],
    hintPt: 'Comeca em Vega e fecha o pequeno paralelogramo.',
    hintEn: 'Start at Vega and close the small parallelogram.',
    successFeedbackPt: 'Lyra inclui Vega, uma das estrelas mais brilhantes do ceu.',
    successFeedbackEn: 'Lyra includes Vega, one of the brightest stars in the sky.'
  }),
  challenge({
    id: 'cygnus',
    name: 'Cygnus',
    difficulty: 'medium',
    stars: [
      { id: 'deneb', name: 'Deneb', x: 50, y: 16, magnitude: 1.7, color: white },
      { id: 'sadr', name: 'Sadr', x: 50, y: 42, magnitude: 1.4, color: warm },
      { id: 'gienah', name: 'Gienah', x: 76, y: 42, magnitude: 1.2, color: blue },
      { id: 'delta', name: 'Delta Cygni', x: 24, y: 42, magnitude: 1.1, color: blue },
      { id: 'albireo', name: 'Albireo', x: 50, y: 78, magnitude: 1.3, color: gold }
    ],
    solutionEdges: [['deneb', 'sadr'], ['sadr', 'albireo'], ['delta', 'sadr'], ['sadr', 'gienah']],
    hintPt: 'Pensa numa cruz: Deneb no topo, Albireo em baixo.',
    hintEn: 'Think of a cross: Deneb on top, Albireo below.',
    successFeedbackPt: 'Cygnus e conhecido como o Cisne e tambem como a Cruz do Norte.',
    successFeedbackEn: 'Cygnus is known as the Swan and also the Northern Cross.'
  }),
  challenge({
    id: 'leo',
    name: 'Leo',
    difficulty: 'medium',
    stars: [
      { id: 'regulus', name: 'Regulus', x: 24, y: 70, magnitude: 1.6, color: blue },
      { id: 'eta', name: 'Eta Leonis', x: 28, y: 48, magnitude: 1.1, color: white },
      { id: 'algieba', name: 'Algieba', x: 40, y: 32, magnitude: 1.4, color: warm },
      { id: 'rasalas', name: 'Rasalas', x: 52, y: 22, magnitude: 1.1, color: white },
      { id: 'zosma', name: 'Zosma', x: 66, y: 52, magnitude: 1.2, color: blue },
      { id: 'denebola', name: 'Denebola', x: 82, y: 68, magnitude: 1.5, color: white }
    ],
    solutionEdges: [['regulus', 'eta'], ['eta', 'algieba'], ['algieba', 'rasalas'], ['algieba', 'zosma'], ['zosma', 'denebola'], ['regulus', 'denebola']],
    hintPt: 'Segue a foice da cabeca e fecha o corpo ate Denebola.',
    hintEn: 'Follow the sickle head and close the body toward Denebola.',
    successFeedbackPt: 'Leo representa o leao e tem Regulus como estrela principal.',
    successFeedbackEn: 'Leo represents the lion and has Regulus as its main star.'
  }),
  challenge({
    id: 'taurus',
    name: 'Taurus',
    difficulty: 'medium',
    stars: [
      { id: 'aldebaran', name: 'Aldebaran', x: 48, y: 52, magnitude: 1.7, color: red },
      { id: 'ain', name: 'Ain', x: 38, y: 40, magnitude: 1.1, color: white },
      { id: 'theta', name: 'Theta Tauri', x: 60, y: 40, magnitude: 1.1, color: blue },
      { id: 'elnath', name: 'Elnath', x: 78, y: 16, magnitude: 1.3, color: blue },
      { id: 'zeta', name: 'Zeta Tauri', x: 20, y: 18, magnitude: 1.2, color: white },
      { id: 'lambda', name: 'Lambda Tauri', x: 58, y: 72, magnitude: 1.0, color: warm }
    ],
    solutionEdges: [['aldebaran', 'ain'], ['aldebaran', 'theta'], ['theta', 'elnath'], ['ain', 'zeta'], ['aldebaran', 'lambda']],
    hintPt: 'Aldebaran e o olho: desenha os dois chifres a partir dele.',
    hintEn: 'Aldebaran is the eye: draw both horns from it.',
    successFeedbackPt: 'Taurus e associado ao touro e contem a estrela Aldebaran.',
    successFeedbackEn: 'Taurus is associated with the bull and contains Aldebaran.'
  }),
  challenge({
    id: 'gemini',
    name: 'Gemini',
    difficulty: 'medium',
    stars: [
      { id: 'castor', name: 'Castor', x: 34, y: 16, magnitude: 1.4, color: white },
      { id: 'pollux', name: 'Pollux', x: 60, y: 20, magnitude: 1.6, color: warm },
      { id: 'tejat', name: 'Tejat', x: 32, y: 42, magnitude: 1.0, color: blue },
      { id: 'mekbuda', name: 'Mekbuda', x: 58, y: 46, magnitude: 1.0, color: white },
      { id: 'alhena', name: 'Alhena', x: 36, y: 74, magnitude: 1.2, color: white },
      { id: 'wasat', name: 'Wasat', x: 62, y: 72, magnitude: 1.1, color: blue }
    ],
    solutionEdges: [['castor', 'tejat'], ['tejat', 'alhena'], ['pollux', 'mekbuda'], ['mekbuda', 'wasat'], ['castor', 'pollux'], ['tejat', 'mekbuda']],
    hintPt: 'Desenha duas figuras paralelas: os Gemeos Castor e Pollux.',
    hintEn: 'Draw two parallel figures: the twins Castor and Pollux.',
    successFeedbackPt: 'Gemini representa os gemeos Castor e Pollux.',
    successFeedbackEn: 'Gemini represents the twins Castor and Pollux.'
  }),
  challenge({
    id: 'pegasus',
    name: 'Pegasus',
    difficulty: 'easy',
    stars: [
      { id: 'markab', name: 'Markab', x: 24, y: 70, magnitude: 1.3, color: blue },
      { id: 'scheat', name: 'Scheat', x: 24, y: 26, magnitude: 1.4, color: red },
      { id: 'algenib', name: 'Algenib', x: 76, y: 70, magnitude: 1.3, color: white },
      { id: 'alpheratz', name: 'Alpheratz', x: 76, y: 26, magnitude: 1.5, color: blue }
    ],
    solutionEdges: [['markab', 'scheat'], ['scheat', 'alpheratz'], ['alpheratz', 'algenib'], ['algenib', 'markab']],
    hintPt: 'Forma o grande quadrado de Pegasus.',
    hintEn: 'Form the Great Square of Pegasus.',
    successFeedbackPt: 'Pegasus e famoso pelo seu grande quadrado no ceu de outono.',
    successFeedbackEn: 'Pegasus is famous for its great square in the autumn sky.'
  }),
  challenge({
    id: 'andromeda',
    name: 'Andromeda',
    difficulty: 'easy',
    stars: [
      { id: 'alpheratz', name: 'Alpheratz', x: 18, y: 54, magnitude: 1.4, color: blue },
      { id: 'mirach', name: 'Mirach', x: 38, y: 44, magnitude: 1.5, color: red },
      { id: 'almach', name: 'Almach', x: 62, y: 34, magnitude: 1.3, color: gold },
      { id: 'delta', name: 'Delta Andromedae', x: 78, y: 26, magnitude: 1.0, color: white },
      { id: 'mu', name: 'Mu Andromedae', x: 48, y: 68, magnitude: 0.9, color: blue }
    ],
    solutionEdges: [['alpheratz', 'mirach'], ['mirach', 'almach'], ['almach', 'delta'], ['mirach', 'mu']],
    hintPt: 'Segue a corrente principal e depois o pequeno ramo inferior.',
    hintEn: 'Follow the main chain, then the small lower branch.',
    successFeedbackPt: 'Andromeda e tambem conhecida pela galaxia proxima com o mesmo nome.',
    successFeedbackEn: 'Andromeda is also known for the nearby galaxy with the same name.'
  }),
  challenge({
    id: 'draco',
    name: 'Draco',
    difficulty: 'hard',
    stars: [
      { id: 'thuban', name: 'Thuban', x: 22, y: 74, magnitude: 1.1, color: white },
      { id: 'ed_asich', name: 'Ed Asich', x: 34, y: 56, magnitude: 1.0, color: blue },
      { id: 'eta', name: 'Eta Draconis', x: 48, y: 42, magnitude: 1.1, color: white },
      { id: 'rastaban', name: 'Rastaban', x: 68, y: 32, magnitude: 1.2, color: warm },
      { id: 'eltanin', name: 'Eltanin', x: 82, y: 44, magnitude: 1.5, color: red },
      { id: 'iota', name: 'Iota Draconis', x: 58, y: 66, magnitude: 1.0, color: gold }
    ],
    solutionEdges: [['thuban', 'ed_asich'], ['ed_asich', 'eta'], ['eta', 'rastaban'], ['rastaban', 'eltanin'], ['eltanin', 'iota'], ['iota', 'ed_asich']],
    hintPt: 'Faz uma serpente curva e fecha a dobra interna.',
    hintEn: 'Make a curved serpent and close the inner bend.',
    successFeedbackPt: 'Draco serpenteia em torno do polo norte celeste.',
    successFeedbackEn: 'Draco winds around the northern celestial pole.'
  }),
  challenge({
    id: 'aquila',
    name: 'Aquila',
    difficulty: 'easy',
    stars: [
      { id: 'altair', name: 'Altair', x: 50, y: 50, magnitude: 1.7, color: white },
      { id: 'tarazed', name: 'Tarazed', x: 38, y: 35, magnitude: 1.2, color: warm },
      { id: 'alshain', name: 'Alshain', x: 62, y: 64, magnitude: 1.1, color: blue },
      { id: 'theta', name: 'Theta Aquilae', x: 28, y: 68, magnitude: 0.9, color: white },
      { id: 'delta', name: 'Delta Aquilae', x: 72, y: 30, magnitude: 1.0, color: blue }
    ],
    solutionEdges: [['tarazed', 'altair'], ['altair', 'alshain'], ['altair', 'theta'], ['altair', 'delta']],
    hintPt: 'Altair esta no centro: liga as quatro asas ao redor.',
    hintEn: 'Altair is in the center: connect the four surrounding wings.',
    successFeedbackPt: 'Aquila contem Altair, parte do Triangulo de Verao.',
    successFeedbackEn: 'Aquila contains Altair, part of the Summer Triangle.'
  }),
  challenge({
    id: 'canis_major',
    name: 'Canis Major',
    difficulty: 'medium',
    stars: [
      { id: 'sirius', name: 'Sirius', x: 40, y: 32, magnitude: 1.9, color: white },
      { id: 'mirzam', name: 'Mirzam', x: 28, y: 48, magnitude: 1.1, color: blue },
      { id: 'wezen', name: 'Wezen', x: 54, y: 62, magnitude: 1.3, color: warm },
      { id: 'adha', name: 'Adhara', x: 68, y: 76, magnitude: 1.4, color: blue },
      { id: 'furud', name: 'Furud', x: 66, y: 42, magnitude: 1.0, color: white },
      { id: 'muliphein', name: 'Muliphein', x: 48, y: 82, magnitude: 0.9, color: white }
    ],
    solutionEdges: [['sirius', 'mirzam'], ['sirius', 'furud'], ['sirius', 'wezen'], ['wezen', 'adha'], ['wezen', 'muliphein']],
    hintPt: 'Comeca em Sirius, a estrela mais brilhante, e abre o corpo do cao.',
    hintEn: 'Start at Sirius, the brightest star, and open the dog shape.',
    successFeedbackPt: 'Canis Major contem Sirius, a estrela mais brilhante do ceu noturno.',
    successFeedbackEn: 'Canis Major contains Sirius, the brightest star in the night sky.'
  }),
  challenge({
    id: 'corona_borealis',
    name: 'Corona Borealis',
    difficulty: 'easy',
    stars: [
      { id: 'alphekka', name: 'Alphekka', x: 50, y: 22, magnitude: 1.5, color: white },
      { id: 'beta', name: 'Beta Coronae', x: 34, y: 32, magnitude: 1.0, color: blue },
      { id: 'gamma', name: 'Gamma Coronae', x: 24, y: 52, magnitude: 0.9, color: white },
      { id: 'delta', name: 'Delta Coronae', x: 36, y: 72, magnitude: 0.9, color: warm },
      { id: 'epsilon', name: 'Epsilon Coronae', x: 64, y: 72, magnitude: 0.9, color: blue },
      { id: 'theta', name: 'Theta Coronae', x: 76, y: 52, magnitude: 0.9, color: white },
      { id: 'iota', name: 'Iota Coronae', x: 66, y: 32, magnitude: 0.9, color: white }
    ],
    solutionEdges: [['gamma', 'beta'], ['beta', 'alphekka'], ['alphekka', 'iota'], ['iota', 'theta'], ['theta', 'epsilon'], ['epsilon', 'delta'], ['delta', 'gamma']],
    hintPt: 'Desenha uma coroa em arco quase circular.',
    hintEn: 'Draw a crown in a near-circular arc.',
    successFeedbackPt: 'Corona Borealis parece uma pequena coroa no ceu do norte.',
    successFeedbackEn: 'Corona Borealis looks like a small crown in the northern sky.'
  }),
  challenge({
    id: 'bootes',
    name: 'Bootes',
    difficulty: 'medium',
    stars: [
      { id: 'arcturus', name: 'Arcturus', x: 48, y: 76, magnitude: 1.8, color: red },
      { id: 'izhar', name: 'Izar', x: 44, y: 54, magnitude: 1.2, color: warm },
      { id: 'nekkar', name: 'Nekkar', x: 40, y: 26, magnitude: 1.0, color: blue },
      { id: 'seginus', name: 'Seginus', x: 60, y: 38, magnitude: 1.1, color: white },
      { id: 'muphrid', name: 'Muphrid', x: 30, y: 82, magnitude: 1.0, color: white },
      { id: 'rho', name: 'Rho Bootis', x: 70, y: 66, magnitude: 0.9, color: blue }
    ],
    solutionEdges: [['arcturus', 'izhar'], ['izhar', 'nekkar'], ['izhar', 'seginus'], ['arcturus', 'muphrid'], ['arcturus', 'rho'], ['rho', 'seginus']],
    hintPt: 'Usa Arcturus como base e abre o papagaio para cima.',
    hintEn: 'Use Arcturus as the base and open the kite upward.',
    successFeedbackPt: 'Bootes e frequentemente visto como uma forma de papagaio com Arcturus na base.',
    successFeedbackEn: 'Bootes is often seen as a kite shape with Arcturus at the base.'
  }),
  challenge({
    id: 'sagittarius',
    name: 'Sagittarius',
    difficulty: 'hard',
    stars: [
      { id: 'kaus_media', name: 'Kaus Media', x: 44, y: 42, magnitude: 1.2, color: blue },
      { id: 'kaus_australis', name: 'Kaus Australis', x: 50, y: 62, magnitude: 1.4, color: white },
      { id: 'kaus_borealis', name: 'Kaus Borealis', x: 38, y: 24, magnitude: 1.1, color: warm },
      { id: 'nunki', name: 'Nunki', x: 70, y: 32, magnitude: 1.3, color: blue },
      { id: 'ascella', name: 'Ascella', x: 72, y: 62, magnitude: 1.0, color: white },
      { id: 'albaldah', name: 'Albaldah', x: 30, y: 72, magnitude: 0.9, color: gold },
      { id: 'rukbat', name: 'Rukbat', x: 22, y: 50, magnitude: 0.9, color: white }
    ],
    solutionEdges: [['kaus_borealis', 'kaus_media'], ['kaus_media', 'kaus_australis'], ['kaus_australis', 'ascella'], ['ascella', 'nunki'], ['nunki', 'kaus_borealis'], ['kaus_australis', 'albaldah'], ['albaldah', 'rukbat'], ['rukbat', 'kaus_media']],
    hintPt: 'Procura a forma de bule: corpo central e bico lateral.',
    hintEn: 'Look for the teapot shape: central body and side spout.',
    successFeedbackPt: 'Sagittarius aponta para a regiao central da Via Lactea.',
    successFeedbackEn: 'Sagittarius points toward the central region of the Milky Way.'
  }),
  challenge({
    id: 'cepheus',
    name: 'Cepheus',
    difficulty: 'easy',
    stars: [
      { id: 'alderamin', name: 'Alderamin', x: 50, y: 18, magnitude: 1.4, color: white },
      { id: 'alfirk', name: 'Alfirk', x: 28, y: 40, magnitude: 1.0, color: blue },
      { id: 'delta', name: 'Delta Cephei', x: 36, y: 72, magnitude: 1.1, color: warm },
      { id: 'zeta', name: 'Zeta Cephei', x: 66, y: 72, magnitude: 1.0, color: red },
      { id: 'iota', name: 'Iota Cephei', x: 74, y: 40, magnitude: 0.9, color: white }
    ],
    solutionEdges: [['alderamin', 'alfirk'], ['alfirk', 'delta'], ['delta', 'zeta'], ['zeta', 'iota'], ['iota', 'alderamin']],
    hintPt: 'Forma uma pequena casa com telhado pontudo.',
    hintEn: 'Form a small house with a pointed roof.',
    successFeedbackPt: 'Cepheus e uma constelacao circumpolar do norte.',
    successFeedbackEn: 'Cepheus is a northern circumpolar constellation.'
  }),
  challenge({
    id: 'perseus',
    name: 'Perseus',
    difficulty: 'medium',
    stars: [
      { id: 'mirfak', name: 'Mirfak', x: 48, y: 32, magnitude: 1.6, color: white },
      { id: 'algol', name: 'Algol', x: 34, y: 58, magnitude: 1.4, color: blue },
      { id: 'gamma', name: 'Gamma Persei', x: 66, y: 46, magnitude: 1.1, color: warm },
      { id: 'epsilon', name: 'Epsilon Persei', x: 62, y: 22, magnitude: 1.0, color: blue },
      { id: 'zeta', name: 'Zeta Persei', x: 78, y: 62, magnitude: 1.0, color: white },
      { id: 'rho', name: 'Rho Persei', x: 24, y: 76, magnitude: 0.9, color: red }
    ],
    solutionEdges: [['epsilon', 'mirfak'], ['mirfak', 'gamma'], ['gamma', 'zeta'], ['mirfak', 'algol'], ['algol', 'rho']],
    hintPt: 'Mirfak fica no tronco: abre dois ramos para cima e para baixo.',
    hintEn: 'Mirfak is the trunk: open two branches upward and downward.',
    successFeedbackPt: 'Perseus e conhecido por Algol, uma estrela variavel famosa.',
    successFeedbackEn: 'Perseus is known for Algol, a famous variable star.'
  }),
  challenge({
    id: 'aries',
    name: 'Aries',
    difficulty: 'easy',
    stars: [
      { id: 'hamal', name: 'Hamal', x: 28, y: 40, magnitude: 1.5, color: warm },
      { id: 'sheratan', name: 'Sheratan', x: 50, y: 48, magnitude: 1.2, color: white },
      { id: 'mesarthim', name: 'Mesarthim', x: 70, y: 38, magnitude: 1.0, color: blue },
      { id: 'botein', name: 'Botein', x: 62, y: 68, magnitude: 0.9, color: white }
    ],
    solutionEdges: [['hamal', 'sheratan'], ['sheratan', 'mesarthim'], ['sheratan', 'botein']],
    hintPt: 'Uma linha curta com um pequeno ramo inferior.',
    hintEn: 'A short line with a small lower branch.',
    successFeedbackPt: 'Aries representa o carneiro e e uma constelacao zodiacal.',
    successFeedbackEn: 'Aries represents the ram and is a zodiac constellation.'
  }),
  challenge({
    id: 'pisces',
    name: 'Pisces',
    difficulty: 'hard',
    stars: [
      { id: 'alrescha', name: 'Alrescha', x: 50, y: 68, magnitude: 1.1, color: white },
      { id: 'fishes_w1', name: 'Western Fish 1', x: 28, y: 42, magnitude: 0.9, color: blue },
      { id: 'fishes_w2', name: 'Western Fish 2', x: 18, y: 28, magnitude: 0.9, color: white },
      { id: 'fishes_w3', name: 'Western Fish 3', x: 34, y: 20, magnitude: 0.9, color: warm },
      { id: 'fishes_e1', name: 'Eastern Fish 1', x: 68, y: 46, magnitude: 0.9, color: blue },
      { id: 'fishes_e2', name: 'Eastern Fish 2', x: 82, y: 30, magnitude: 0.9, color: white },
      { id: 'fishes_e3', name: 'Eastern Fish 3', x: 72, y: 18, magnitude: 0.9, color: warm }
    ],
    solutionEdges: [['alrescha', 'fishes_w1'], ['fishes_w1', 'fishes_w2'], ['fishes_w2', 'fishes_w3'], ['fishes_w3', 'fishes_w1'], ['alrescha', 'fishes_e1'], ['fishes_e1', 'fishes_e2'], ['fishes_e2', 'fishes_e3'], ['fishes_e3', 'fishes_e1']],
    hintPt: 'Dois pequenos peixes ligados por uma cauda comum.',
    hintEn: 'Two small fish connected by a shared tail.',
    successFeedbackPt: 'Pisces representa dois peixes ligados por uma faixa.',
    successFeedbackEn: 'Pisces represents two fish connected by a cord.'
  })
];

export function toPublicChallenge(challenge: PrivateChallenge): PublicChallenge {
  const { solutionEdges, successFeedbackPt, successFeedbackEn, ...publicChallenge } = challenge;
  return {
    ...publicChallenge,
    previewEdges: solutionEdges
  };
}
