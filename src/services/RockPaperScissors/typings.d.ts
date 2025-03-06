type Choice = 'Kéo' | 'Búa' | 'Bao';
type Result = 'Hòa' | 'Thắng' | 'Thua';

interface GameHistory {
    player: Choice;
    bot: Choice;
    result: Result;
}
