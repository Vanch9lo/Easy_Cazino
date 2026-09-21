class VirtualCasino {
    constructor() {
        this.balance = 1000;
        this.currentGame = 'slots';
        this.selectedBet = null;
        this.gameInProgress = false;
        
        this.init();
    }

    init() {
        this.updateBalance();
        this.setupNavigation();
        this.setupSlots();
        this.setupRoulette();
        this.setupBlackjack();
        this.setupDice();
    }

    updateBalance() {
        document.getElementById('balance').textContent = this.balance;
        
        // Проверка на банкротство
        if (this.balance <= 0) {
            setTimeout(() => {
                alert('Вы проиграли все деньги! Получите бонус 500 монет.');
                this.balance = 500;
                this.updateBalance();
            }, 1000);
        }
    }

    setupNavigation() {
        const navBtns = document.querySelectorAll('.nav-btn');
        const gameSections = document.querySelectorAll('.game-section');

        navBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                if (this.gameInProgress) return;
                
                const game = btn.dataset.game;
                
                // Обновляем активные кнопки
                navBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                // Показываем нужную секцию
                gameSections.forEach(section => {
                    section.classList.remove('active');
                });
                document.getElementById(game).classList.add('active');
                
                this.currentGame = game;
            });
        });
    }

    // СЛОТЫ
    setupSlots() {
        const spinBtn = document.getElementById('spin-btn');
        const betInput = document.getElementById('slot-bet');
        const resultDiv = document.getElementById('slot-result');
        
        const symbols = ['🍒', '🍋', '🍊', '🍇', '🔔', '💎', '7️⃣'];
        
        spinBtn.addEventListener('click', () => {
            const bet = parseInt(betInput.value);
            if (bet > this.balance) {
                resultDiv.textContent = 'Недостаточно средств!';
                resultDiv.style.color = '#ff6b6b';
                return;
            }
            
            this.balance -= bet;
            this.updateBalance();
            
            // Анимация вращения
            const reels = [
                document.getElementById('reel1'),
                document.getElementById('reel2'),
                document.getElementById('reel3')
            ];
            
            // Случайные символы
            const results = [];
            reels.forEach((reel, index) => {
                const symbol = symbols[Math.floor(Math.random() * symbols.length)];
                results.push(symbol);
                
                setTimeout(() => {
                    reel.textContent = symbol;
                    reel.style.animation = 'spin 0.5s ease-in-out';
                }, index * 200);
            });
            
            // Проверка выигрыша
            setTimeout(() => {
                this.checkSlotWin(results, bet, resultDiv);
                reels.forEach(reel => {
                    reel.style.animation = '';
                });
            }, 800);
        });
    }

    checkSlotWin(results, bet, resultDiv) {
        const [r1, r2, r3] = results;
        
        if (r1 === r2 && r2 === r3) {
            // Три одинаковых
            let multiplier = 5;
            if (r1 === '💎') multiplier = 20;
            else if (r1 === '7️⃣') multiplier = 15;
            else if (r1 === '🔔') multiplier = 10;
            
            const win = bet * multiplier;
            this.balance += win;
            this.updateBalance();
            
            resultDiv.textContent = `ДЖЕКПОТ! Выигрыш: ${win} монет!`;
            resultDiv.style.color = '#00ff88';
        } else if (r1 === r2 || r2 === r3 || r1 === r3) {
            // Два одинаковых
            const win = bet * 2;
            this.balance += win;
            this.updateBalance();
            
            resultDiv.textContent = `Выигрыш: ${win} монет!`;
            resultDiv.style.color = '#ffd700';
        } else {
            resultDiv.textContent = 'Попробуйте еще раз!';
            resultDiv.style.color = '#ff6b6b';
        }
    }

    // РУЛЕТКА
    setupRoulette() {
        const spinBtn = document.getElementById('roulette-spin');
        const betInput = document.getElementById('roulette-bet');
        const resultDiv = document.getElementById('roulette-result');
        const wheel = document.getElementById('wheel');
        const numberDisplay = document.getElementById('roulette-number');
        const betBtns = document.querySelectorAll('#roulette .bet-btn');
        
        let selectedBetType = null;
        
        // Выбор типа ставки
        betBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                betBtns.forEach(b => b.classList.remove('selected'));
                btn.classList.add('selected');
                selectedBetType = btn.dataset.bet;
            });
        });
        
        spinBtn.addEventListener('click', () => {
            if (!selectedBetType) {
                resultDiv.textContent = 'Выберите тип ставки!';
                resultDiv.style.color = '#ff6b6b';
                return;
            }
            
            const bet = parseInt(betInput.value);
            if (bet > this.balance) {
                resultDiv.textContent = 'Недостаточно средств!';
                resultDiv.style.color = '#ff6b6b';
                return;
            }
            
            this.balance -= bet;
            this.updateBalance();
            
            // Случайное число от 0 до 36
            const number = Math.floor(Math.random() * 37);
            const rotation = number * (360 / 37) + Math.random() * 360 + 720;
            
            wheel.style.transform = `rotate(${rotation}deg)`;
            numberDisplay.textContent = number;
            
            setTimeout(() => {
                this.checkRouletteWin(number, selectedBetType, bet, resultDiv);
            }, 2000);
        });
    }

    checkRouletteWin(number, betType, bet, resultDiv) {
        const redNumbers = [1,3,5,7,9,12,14,16,18,19,21,23,25,27,30,32,34,36];
        const isRed = redNumbers.includes(number);
        const isBlack = number !== 0 && !isRed;
        const isEven = number !== 0 && number % 2 === 0;
        const isOdd = number !== 0 && number % 2 === 1;
        
        let win = false;
        let multiplier = 2;
        
        switch(betType) {
            case 'red':
                win = isRed;
                break;
            case 'black':
                win = isBlack;
                break;
            case 'even':
                win = isEven;
                break;
            case 'odd':
                win = isOdd;
                break;
        }
        
        if (win) {
            const winAmount = bet * multiplier;
            this.balance += winAmount;
            this.updateBalance();
            
            resultDiv.textContent = `Выигрыш! Число ${number}. Получено: ${winAmount} монет`;
            resultDiv.style.color = '#00ff88';
        } else {
            resultDiv.textContent = `Проигрыш. Число ${number}. Попробуйте еще раз!`;
            resultDiv.style.color = '#ff6b6b';
        }
    }

    // БЛЭКДЖЕК
    setupBlackjack() {
        this.deck = [];
        this.playerCards = [];
        this.dealerCards = [];
        this.gameActive = false;
        
        const dealBtn = document.getElementById('deal-btn');
        const hitBtn = document.getElementById('hit-btn');
        const standBtn = document.getElementById('stand-btn');
        const betInput = document.getElementById('blackjack-bet');
        const resultDiv = document.getElementById('blackjack-result');
        
        dealBtn.addEventListener('click', () => {
            const bet = parseInt(betInput.value);
            if (bet > this.balance) {
                resultDiv.textContent = 'Недостаточно средств!';
                resultDiv.style.color = '#ff6b6b';
                return;
            }
            
            this.currentBet = bet;
            this.balance -= bet;
            this.updateBalance();
            this.startBlackjack();
        });
        
        hitBtn.addEventListener('click', () => {
            this.hitPlayer();
        });
        
        standBtn.addEventListener('click', () => {
            this.standPlayer();
        });
    }

    createDeck() {
        const suits = ['♠', '♥', '♦', '♣'];
        const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
        
        this.deck = [];
        for (let suit of suits) {
            for (let value of values) {
                this.deck.push({
                    suit: suit,
                    value: value,
                    numValue: this.getCardValue(value)
                });
            }
        }
        
        // Перемешиваем колоду
        for (let i = this.deck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.deck[i], this.deck[j]] = [this.deck[j], this.deck[i]];
        }
    }

    getCardValue(value) {
        if (value === 'A') return 11;
        if (['J', 'Q', 'K'].includes(value)) return 10;
        return parseInt(value);
    }

    startBlackjack() {
        this.createDeck();
        this.playerCards = [];
        this.dealerCards = [];
        this.gameActive = true;
        
        // Раздаем карты
        this.playerCards.push(this.deck.pop());
        this.dealerCards.push(this.deck.pop());
        this.playerCards.push(this.deck.pop());
        this.dealerCards.push(this.deck.pop());
        
        this.updateBlackjackDisplay();
        this.updateBlackjackButtons();
        
        // Проверяем на блэкджек
        if (this.calculateScore(this.playerCards) === 21) {
            this.endBlackjack('Блэкджек! Вы выиграли!');
        }
    }

    hitPlayer() {
        if (!this.gameActive) return;
        
        this.playerCards.push(this.deck.pop());
        this.updateBlackjackDisplay();
        
        const score = this.calculateScore(this.playerCards);
        if (score > 21) {
            this.endBlackjack('Перебор! Вы проиграли!');
        } else if (score === 21) {
            this.standPlayer();
        }
    }

    standPlayer() {
        if (!this.gameActive) return;
        
        // Дилер берет карты
        while (this.calculateScore(this.dealerCards) < 17) {
            this.dealerCards.push(this.deck.pop());
        }
        
        this.updateBlackjackDisplay(true);
        
        const playerScore = this.calculateScore(this.playerCards);
        const dealerScore = this.calculateScore(this.dealerCards);
        
        if (dealerScore > 21) {
            this.endBlackjack('Дилер перебрал! Вы выиграли!');
        } else if (playerScore > dealerScore) {
            this.endBlackjack('Вы выиграли!');
        } else if (playerScore < dealerScore) {
            this.endBlackjack('Дилер выиграл!');
        } else {
            this.endBlackjack('Ничья!');
        }
    }

    calculateScore(cards) {
        let score = 0;
        let aces = 0;
        
        for (let card of cards) {
            if (card.value === 'A') {
                aces++;
                score += 11;
            } else {
                score += card.numValue;
            }
        }
        
        // Обрабатываем тузы
        while (score > 21 && aces > 0) {
            score -= 10;
            aces--;
        }
        
        return score;
    }

    updateBlackjackDisplay(showDealerCards = false) {
        const playerCardsDiv = document.getElementById('player-cards');
        const dealerCardsDiv = document.getElementById('dealer-cards');
        const playerScoreDiv = document.getElementById('player-score');
        const dealerScoreDiv = document.getElementById('dealer-score');
        
        // Карты игрока
        playerCardsDiv.innerHTML = '';
        for (let card of this.playerCards) {
            const cardDiv = document.createElement('div');
            cardDiv.className = 'card';
            if (card.suit === '♥' || card.suit === '♦') {
                cardDiv.classList.add('red');
            }
            cardDiv.textContent = card.value + card.suit;
            playerCardsDiv.appendChild(cardDiv);
        }
        
        // Карты дилера
        dealerCardsDiv.innerHTML = '';
        for (let i = 0; i < this.dealerCards.length; i++) {
            const cardDiv = document.createElement('div');
            cardDiv.className = 'card';
            
            if (i === 0 || showDealerCards) {
                const card = this.dealerCards[i];
                if (card.suit === '♥' || card.suit === '♦') {
                    cardDiv.classList.add('red');
                }
                cardDiv.textContent = card.value + card.suit;
            } else {
                cardDiv.textContent = '?';
                cardDiv.style.background = '#333';
                cardDiv.style.color = '#fff';
            }
            
            dealerCardsDiv.appendChild(cardDiv);
        }
        
        // Счет
        playerScoreDiv.textContent = `Счет: ${this.calculateScore(this.playerCards)}`;
        
        if (showDealerCards) {
            dealerScoreDiv.textContent = `Счет: ${this.calculateScore(this.dealerCards)}`;
        } else {
            dealerScoreDiv.textContent = `Счет: ${this.dealerCards[0].numValue}`;
        }
    }

    updateBlackjackButtons() {
        const dealBtn = document.getElementById('deal-btn');
        const hitBtn = document.getElementById('hit-btn');
        const standBtn = document.getElementById('stand-btn');
        
        if (this.gameActive) {
            dealBtn.disabled = true;
            hitBtn.disabled = false;
            standBtn.disabled = false;
        } else {
            dealBtn.disabled = false;
            hitBtn.disabled = true;
            standBtn.disabled = true;
        }
    }

    endBlackjack(message) {
        this.gameActive = false;
        const resultDiv = document.getElementById('blackjack-result');
        
        if (message.includes('выиграли') || message.includes('Блэкджек')) {
            const winAmount = this.currentBet * 2;
            this.balance += winAmount;
            this.updateBalance();
            resultDiv.textContent = `${message} Выигрыш: ${winAmount} монет`;
            resultDiv.style.color = '#00ff88';
        } else if (message.includes('Ничья')) {
            this.balance += this.currentBet;
            this.updateBalance();
            resultDiv.textContent = `${message} Ставка возвращена`;
            resultDiv.style.color = '#ffd700';
        } else {
            resultDiv.textContent = message;
            resultDiv.style.color = '#ff6b6b';
        }
        
        this.updateBlackjackButtons();
    }

    // КОСТИ
    setupDice() {
        const rollBtn = document.getElementById('roll-btn');
        const betInput = document.getElementById('dice-bet');
        const resultDiv = document.getElementById('dice-result');
        const betBtns = document.querySelectorAll('#dice .bet-btn');
        
        let selectedBetType = null;
        
        // Выбор типа ставки
        betBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                betBtns.forEach(b => b.classList.remove('selected'));
                btn.classList.add('selected');
                selectedBetType = btn.dataset.bet;
            });
        });
        
        rollBtn.addEventListener('click', () => {
            if (!selectedBetType) {
                resultDiv.textContent = 'Выберите тип ставки!';
                resultDiv.style.color = '#ff6b6b';
                return;
            }
            
            const bet = parseInt(betInput.value);
            if (bet > this.balance) {
                resultDiv.textContent = 'Недостаточно средств!';
                resultDiv.style.color = '#ff6b6b';
                return;
            }
            
            this.balance -= bet;
            this.updateBalance();
            
            // Бросаем кости
            const die1 = Math.floor(Math.random() * 6) + 1;
            const die2 = Math.floor(Math.random() * 6) + 1;
            const total = die1 + die2;
            
            const diceSymbols = ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅'];
            
            // Анимация
            const die1Element = document.getElementById('die1');
            const die2Element = document.getElementById('die2');
            
            die1Element.style.animation = 'roll 0.5s ease-in-out';
            die2Element.style.animation = 'roll 0.5s ease-in-out';
            
            setTimeout(() => {
                die1Element.textContent = diceSymbols[die1 - 1];
                die2Element.textContent = diceSymbols[die2 - 1];
                
                die1Element.style.animation = '';
                die2Element.style.animation = '';
                
                this.checkDiceWin(total, selectedBetType, bet, resultDiv);
            }, 500);
        });
    }

    checkDiceWin(total, betType, bet, resultDiv) {
        let win = false;
        let multiplier = 2;
        
        switch(betType) {
            case 'low':
                win = total >= 2 && total <= 6;
                break;
            case 'high':
                win = total >= 8 && total <= 12;
                break;
            case 'seven':
                win = total === 7;
                multiplier = 5;
                break;
        }
        
        if (win) {
            const winAmount = bet * multiplier;
            this.balance += winAmount;
            this.updateBalance();
            
            resultDiv.textContent = `Выигрыш! Сумма: ${total}. Получено: ${winAmount} монет`;
            resultDiv.style.color = '#00ff88';
        } else {
            resultDiv.textContent = `Проигрыш. Сумма: ${total}. Попробуйте еще раз!`;
            resultDiv.style.color = '#ff6b6b';
        }
    }
}

// Запуск казино
document.addEventListener('DOMContentLoaded', () => {
    new VirtualCasino();
});