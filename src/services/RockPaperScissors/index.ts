export const choices: Choice[] = ['Kéo', 'Búa', 'Bao'];

export const getRandomChoice = (): Choice => choices[Math.floor(Math.random() * choices.length)];

export const determineWinner = (player: Choice, bot: Choice): Result => {
    if (player === bot) return 'Hòa';
    if (
        (player === 'Kéo' && bot === 'Bao') ||
        (player === 'Búa' && bot === 'Kéo') ||
        (player === 'Bao' && bot === 'Búa')
    ) {
        return 'Thắng';
    }
    return 'Thua';
};

console.log(getRandomChoice());