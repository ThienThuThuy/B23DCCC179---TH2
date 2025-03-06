import { useState } from 'react';
import { choices, getRandomChoice, determineWinner } from '@/services/RockPaperScissors';

export default function useGameModel() {
    const [history, setHistory] = useState<GameHistory[]>([]);
    const [modalVisible, setModalVisible] = useState<boolean>(false);

    const playGame = (playerChoice: Choice) => {
        const botChoice = getRandomChoice();
        const result = determineWinner(playerChoice, botChoice);
        const newResult: GameHistory = { player: playerChoice, bot: botChoice, result };

        setHistory((prev) => [newResult, ...prev]);
        setModalVisible(true);
    };

    return { history, playGame, modalVisible, setModalVisible, choices };
}
