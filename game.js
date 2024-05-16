// game.js

// Helper function to format numbers into short versions
function formatNumber(num) {
    if (num >= 1e15) {
        return (num / 1e15).toFixed(1) + 'Qa'; // Quadrillion
    }
    if (num >= 1e12) {
        return (num / 1e12).toFixed(1) + 'T'; // Trillion
    }
    if (num >= 1e9) {
        return (num / 1e9).toFixed(1) + 'B'; // Billion
    }
    if (num >= 1e6) {
        return (num / 1e6).toFixed(1) + 'M'; // Million
    }
    if (num >= 1e3) {
        return (num / 1e3).toFixed(1) + 'K'; // Thousand
    }
    return num;
}

let gold = 0;
let tapDamage = 1;
let warriorDamage = 0;
let monsterHealth = 100;
let monsterMaxHealth = 100;
const monsterHealthIncreaseFactor = 1.2; // Increase monster health by 20% after each defeat
const warriors = [
    { cost: 0, baseDamage: 500, damage: 500, count: 0 },  // Buffed
    { cost: 50, baseDamage: 1000, damage: 1000, count: 0 },  // Buffed
    { cost: 100, baseDamage: 2000, damage: 2000, count: 0 },  // Buffed
    { cost: 200, baseDamage: 4000, damage: 4000, count: 0 },  // Buffed
    { cost: 400, baseDamage: 8000, damage: 8000, count: 0 },  // Buffed
    { cost: 800, baseDamage: 16000, damage: 16000, count: 0 },  // Buffed
    { cost: 1600, baseDamage: 32000, damage: 32000, count: 0 },  // Buffed
    { cost: 3200, baseDamage: 64000, damage: 64000, count: 0 },  // Buffed
    { cost: 6400, baseDamage: 128000, damage: 128000, count: 0 },  // Buffed
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
    tapDamageText.textContent = `-${formatNumber(damage)}`;
    tapDamageText.style.display = 'block';
    setTimeout(() => tapDamageText.style.display = 'none', 500);
}

function showWarriorDamage(damage) {
    const warriorDamageText = document.getElementById('warrior-damage-text');
    warriorDamageText.textContent = `-${formatNumber(damage)}`;
    warriorDamageText.style.display = 'block';
    setTimeout(() => warriorDamageText.style.display = 'none', 500);
}

function updateUI() {
    document.getElementById('gold').textContent = formatNumber(gold);
    document.getElementById('tap-damage').textContent = formatNumber(tapDamage);
    document.getElementById('warrior-damage').textContent = formatNumber(warriorDamage);
    const healthBarInner = document.getElementById('health-bar-inner');
    healthBarInner.style.width = `${(monsterHealth / monsterMaxHealth) * 100}%`;

    document.getElementById('monster-health').textContent = `${formatNumber(monsterHealth)} / ${formatNumber(monsterMaxHealth)}`;

    for (let i = 0; i < warriors.length; i++) {
        const warriorButton = document.getElementById(`hire-warrior-${i + 1}`);
        warriorButton.textContent = `Hire Warrior ${i + 1} (${formatNumber(warriors[i].cost)} Gold) - ${warriors[i].count} Hired`;
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
        warriorDamage += warrior.baseDamage;
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
    if (totalDamage > 0) {
        showWarriorDamage(totalDamage);
    }
    saveGame();
    updateUI();
}

// Save game state to localStorage
function saveGame() {
    const gameState = {
        gold: gold,
        tapDamage: tapDamage,
        warriorDamage: warriorDamage,
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
        warriorDamage = gameState.warriorDamage;
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

// Function to disable pinch-to-zoom but enable scrolling
function disablePinchToZoom() {
    document.addEventListener('wheel', function(event) {
        if (event.ctrlKey) {
            event.preventDefault();
        }
    }, { passive: false });

    document.addEventListener('touchmove', function(event) {
        if (event.scale !== 1) {
            event.preventDefault();
        }
    }, { passive: false });
}

// Function to enable scrolling
function enableScrolling() {
    document.addEventListener('touchmove', function(event) {
        if (event.scale === 1) {
            event.stopPropagation();
        }
    }, { passive: false });
}

// Call autoBattle every second
setInterval(autoBattle, 1000);

// Load the game state and disable pinch-to-zoom when the page loads
window.onload = function() {
    loadGame();
    updateUI();
    disablePinchToZoom();
    enableScrolling();
};
