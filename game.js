let varidians = [];

const gameMap = document.getElementById('game-map');
const dialogueBox = document.getElementById('dialogue-box');
const dialogueText = document.getElementById('dialogue-text');
const battleBox = document.getElementById('battle-box');
const battleDialogue = document.getElementById('battle-dialogue');

const player = {
    x: 380,
    y: 200,
    width: 28,
    height: 40,
    element: null,
    speed: 4,
    direction: 'down',
    frame: 0,
    varidian: null,
};

let interactingCharacter = null;

function loadVaridianData() {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = './varidians.js';
        script.onload = () => {
            varidians = varidiansData;
            resolve();
        };
        script.onerror = () => reject(new Error('Failed to load varidians.js'));
        document.head.appendChild(script);
    });
}

function getRandomVaridian() {
    const randomIndex = Math.floor(Math.random() * varidians.length);
    return varidians[randomIndex];
}

function createPlayer() {
    player.element = document.createElement('div');
    player.element.style.width = player.width + 'px';
    player.element.style.height = player.height + 'px';
    player.element.style.backgroundSize = 'cover';
    player.element.style.position = 'absolute';
    player.element.style.left = player.x + 'px';
    player.element.style.top = player.y + 'px';
    gameMap.appendChild(player.element);
    updatePlayerSprite();
}

function updatePlayerSprite() {
    const spriteMap = {
        'down': 'data/player/playerDown.png',
        'up': 'data/player/playerUp.png',
        'left': 'data/player/playerLeft.png',
        'right': 'data/player/playerRight.png',
    };
    player.element.style.backgroundImage = `url("${spriteMap[player.direction]}")`;
    player.element.style.backgroundPosition = `-${player.frame * player.width}px 0`;
}

function movePlayer(dx, dy, direction) {
    player.x += dx;
    player.y += dy;
    player.direction = direction;
    player.frame = (player.frame + 1) % 4;
    player.element.style.left = player.x + 'px';
    player.element.style.top = player.y + 'px';
    updatePlayerSprite();
    checkInteraction();
}

document.addEventListener('keydown', (event) => {
    switch (event.key) {
        case 'w':
            movePlayer(0, -player.speed, 'up');
            break;
        case 'a':
            movePlayer(-player.speed, 0, 'left');
            break;
        case 's':
            movePlayer(0, player.speed, 'down');
            break;
        case 'd':
            movePlayer(player.speed, 0, 'right');
            break;
        case ' ':
            if (interactingCharacter) {
                if (interactingCharacter.isEnemy) {
                    startBattle(interactingCharacter);
                } else {
                    showDialogue(interactingCharacter.dialogue);
                }
            }
            break;
    }
});

const characters = [
    {
        name: 'Professor',
        x: 600,
        y: 200,
        width: 30,
        height: 50,
        dialogue: 'Welcome to the world of Varidian Adventures!',
        element: null,
        isEnemy: true,
    },
    {
        name: 'Enemy Trainer',
        x: 600,
        y: 600,
        width: 20,
        height: 50,
        dialogue: 'I challenge you to a battle!',
        element: null,
        isEnemy: true,
    }
];

function createCharacters() {
    characters.forEach(character => {
        character.element = document.createElement('div');
        character.element.style.width = character.width + 'px';
        character.element.style.height = character.height + 'px';
        character.element.style.backgroundImage = 'url("data/testnpc.png")';
        character.element.style.backgroundSize = 'cover';
        character.element.style.position = 'absolute';
        character.element.style.left = character.x + 'px';
        character.element.style.top = character.y + 'px';

        gameMap.appendChild(character.element);
    });
}

function checkInteraction() {
    interactingCharacter = characters.find(character => {
        const dx = player.x - character.x;
        const dy = player.y - character.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const maxDistance = 50;
        return distance <= maxDistance;
    });
}

function showDialogue(text) {
    dialogueText.textContent = text;
    dialogueBox.style.display = 'block';
    setTimeout(() => {
        dialogueBox.style.display = 'none';
    }, 3000);
}

function startBattle(enemy) {
    dialogueBox.style.display = 'none';
    battleBox.style.display = 'block';
    battleDialogue.textContent = 'A wild ' + enemy.name + ' appears!';

    const playerVaridian = getRandomVaridian();
    const enemyVaridian = getRandomVaridian();

    console.log('Player Varidian:', playerVaridian.name);
    console.log('Enemy Varidian:', enemyVaridian.name);

    setTimeout(() => {
        battleDialogue.textContent = 'Battle starts!';
    }, 3000);

    setTimeout(() => {
        endBattle();
    }, 6000);
}

function endBattle() {
    battleBox.style.display = 'none';
}

loadVaridianData().then(() => {
    createPlayer();
    createCharacters();
}).catch(error => {
    console.error(error);
});