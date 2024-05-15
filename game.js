// game.js
let gold = 0;
let tapDamage = 1;
let monsterHealth = 100;
let monsterMaxHealth = 100;
const monsterHealthIncreaseFactor = 1.2; // Increase monster health by 20% after each defeat
const warriors = [
    { cost: 0, baseDamage: 5, damage: 5, count: 0 },
    { cost: 50, baseDamage: 10, damage: 10, count: 0 },
    { cost: 100, baseDamage: 20, damage: 20, count: 0 },
    { cost: 200, baseDamage: 40, damage: 40, count: 0 },
    { cost: 400, baseDamage: 80, damage: 80, count: 0 },
    { cost: 800, baseDamage: 160, damage: 160, count: 0 },
    { cost: 1600, baseDamage: 320, damage: 320, count: 0 },
    { cost: 3200, baseDamage: 640, damage: 640, count: 0 },
    { cost: 6400, baseDamage: 1280, damage: 1280, count: 0 },
];

document.getElementById('monster').addEventListener('click', () => {
    monsterHealth -= tapDamage;
    showTapDamage(tapDamage);

    if (monsterHealth <= 0) {
        gold += 10;
        monsterMaxHealth = Math.floor(monsterMaxHealth * monsterHealthIncreaseFactor);
        monsterHealth = monsterMaxHealth;
    }

    saveGame();
    updateUI();
});

function showTapDamage(damage) {
    const tapDamageText = document.getElementById('tap-damage-text');
    tapDamageText.textContent = `-${damage}`;
    tapDamageText.style.display = 'block';
    setTimeout(() => tapDamageText.style.display = 'none', 500);
}

function updateUI() {
    document.getElementById('gold').textContent = gold;
    document.getElementById('tap-damage').textContent = tapDamage;
    const healthBarInner = document.getElementById('health-bar-inner');
    healthBarInner.style.width = `${(monsterHealth / monsterMaxHealth) * 100}%`;

    document.getElementById('monster-health').textContent = `${monsterHealth} / ${monsterMaxHealth}`;

    for (let i = 0; i < warriors.length; i++) {
        const warriorButton = document.getElementById(`hire-warrior-${i + 1}`);
        warriorButton.textContent = `Hire Warrior ${i + 1} (${warriors[i].cost} Gold) - ${warriors[i].count} Hired`;
        warriorButton.disabled = gold < warriors[i].cost;
    }
}

for (let i = 0; i < warriors.length; i++) {
    document.getElementById(`hire-warrior-${i + 1}`).addEventListener('click', () => hireWarrior(i));
}

function hireWarrior(index) {
    const warrior = warriors[index];
    if (gold >= warrior.cost) {
        gold -= warrior.cost;
        warrior.count++;
        warrior.damage += warrior.baseDamage;
        tapDamage += warrior.baseDamage;
        warrior.cost = Math.floor(warrior.cost * 1.15); // Increase cost by 15% for next purchase
        saveGame();
        updateUI();
    }
}

// Function to simulate warriors automatically battling monsters
function autoBattle() {
    let totalDamage = warriors.reduce((sum, w) => sum + w.damage * w.count, 0);
    monsterHealth -= totalDamage;
    if (monsterHealth <= 0) {
        gold += 10;
        monsterMaxHealth = Math.floor(monsterMaxHealth * monsterHealthIncreaseFactor);
        monsterHealth = monsterMaxHealth;
    }
    saveGame();
    updateUI();
}

// Save game state to localStorage
function saveGame() {
    const gameState = {
        gold: gold,
        tapDamage: tapDamage,
        monsterHealth: monsterHealth,
        monsterMaxHealth: monsterMaxHealth,
        warriors: warriors,
    };
    localStorage.setItem('idleMonsterClickerGameState', JSON.stringify(gameState));
}

// Load game state from localStorage
function loadGame() {
    const savedGameState = localStorage.getItem('idleMonsterClickerGameState');
    if (savedGameState) {
        const gameState = JSON.parse(savedGameState);
        gold = gameState.gold;
        tapDamage = gameState.tapDamage;
        monsterHealth = gameState.monsterHealth;
        monsterMaxHealth = gameState.monsterMaxHealth;
        for (let i = 0; i < warriors.length; i++) {
            warriors[i].cost = gameState.warriors[i].cost;
            warriors[i].baseDamage = gameState.warriors[i].baseDamage;
            warriors[i].damage = gameState.warriors[i].damage;
            warriors[i].count = gameState.warriors[i].count;
        }
    }
}

// Call autoBattle every second
setInterval(autoBattle, 1000);

// Load the game state when the page loads
window.onload = function() {
    loadGame();
    updateUI();
};
