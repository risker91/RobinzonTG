// Параметры персонажа
const character = {
    energy: 0,
    food: 0,
    security: 0
};

// Базовый URL API
const apiUrl = 'http://84.21.172.178:8080/api/game';

// Идентификатор пользователя (например, из Telegram WebApp API)
const userId = 'guest'; // Замените на ID пользователя из Telegram

// Функция загрузки начального состояния
async function loadGameState() {
    try {
        const response = await fetch(`${apiUrl}/${userId}/play`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ actionNumber: null }) // Для начальной загрузки
        });

        const data = await response.json();
        updateGameState(data);
    } catch (error) {
        console.error('Ошибка загрузки состояния игры:', error);
        document.getElementById('description').innerText = 'Ошибка загрузки данных. Попробуйте обновить страницу.';
    }
}

// Функция выбора действия
async function chooseAction(actionNumber) {
    try {
        const response = await fetch(`${apiUrl}/${userId}/play`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ actionNumber })
        });

        const data = await response.json();
        updateGameState(data);
    } catch (error) {
        console.error('Ошибка выполнения действия:', error);
        document.getElementById('description').innerText = 'Ошибка выполнения действия. Попробуйте снова.';
    }
}

// Обновление состояния игры
function updateGameState(data) {
    // Обновляем текст описания
    document.getElementById('description').innerText = data.text;

    // Обновляем параметры персонажа
    if (data.userState) {
        data.userState.forEach(state => {
            switch (state.resource) {
                case 'Энергия':
                    character.energy = state.value;
                    break;
                case 'Еда':
                    character.food = state.value;
                    break;
                case 'Безопасность':
                    character.security = state.value;
                    break;
            }
        });
    }
    updateStats();

    // Обновляем список действий
    const actionsContainer = document.getElementById('actions');
    actionsContainer.innerHTML = '';
    data.actions.forEach(action => {
        // Создаем кнопку действия
        const button = document.createElement('button');
        button.innerText = `Действие #${action.number}: ${action.text}`;
        button.onclick = () => chooseAction(action.number);

        // Создаем описание стоимости действия
        const costDescription = document.createElement('div');
        costDescription.className = 'action-cost';

        if (action.cost && action.cost.length > 0) {
            const costs = action.cost.map(cost => {
                switch (cost.resource) {
                    case 'Энергия': return `Энергия: ${cost.value}`;
                    case 'Еда': return `Еда: ${cost.value}`;
                    case 'Безопасность': return `Безопасность: ${cost.value}`;
                    default: return `${cost.resource}: ${cost.value}`;
                }
            });
            costDescription.innerText = costs.join(', ');
        } else {
            costDescription.innerText = 'Без затрат.';
        }

        // Добавляем кнопку и описание в контейнер
        const actionContainer = document.createElement('div');
        actionContainer.appendChild(button);
        actionContainer.appendChild(costDescription);
        actionsContainer.appendChild(actionContainer);
    });
}

// Функция обновления параметров
function updateStats() {
    document.getElementById('energy').innerText = character.energy;
    document.getElementById('food').innerText = character.food;
    document.getElementById('security').innerText = character.security;
}

// Загружаем начальные данные при загрузке страницы
loadGameState();