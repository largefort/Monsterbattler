// game.js
let gold = 0;
let tapDamage = 1;
let monsterHealth = 100;
const monsterMaxHealth = 100;
const warriors = [
    { cost: 0, damage: 5, hired: false },
    { cost: 50, damage: 10, hired: false },
    { cost: 100, damage: 20, hired: false },
    { cost: 200, damage: 40, hired: false },
    { cost: 400, damage: 80, hired: false },
    { cost: 800, damage: 160, hired: false },
    { cost: 1600, damage: 320, hired: false },
    { cost: 3200, damage: 640, hired: false },
    { cost: 6400, damage: 1280, hired: false },
];

document.getElementById('monster').addEventListener('click', () => {
    monsterHealth -= tapDamage;
    showTapDamage(tapDamage);

    if (monsterHealth <= 0) {
        gold += 10;
        monsterHealth = monsterMaxHealth;
    }

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
}

for (let i = 0; i < warriors.length; i++) {
    document.getElementById(`hire-warrior-${i + 1}`).addEventListener('click', () => hireWarrior(i));
}

function hireWarrior(index) {
    const warrior = warriors[index];
    if (gold >= warrior.cost && !warrior.hired) {
        gold -= warrior.cost;
        warrior.hired = true;
        tapDamage += warrior.damage;
        document.getElementById(`hire-warrior-${index + 1}`).disabled = true;
        updateUI();
    }
}

// Function to simulate warriors automatically battling monsters
function autoBattle() {
    let totalDamage = warriors.filter(w => w.hired).reduce((sum, w) => sum + w.damage, 0);
    monsterHealth -= totalDamage;
    if (monsterHealth <= 0) {
        gold += 10;
        monsterHealth = monsterMaxHealth;
    }
    updateUI();
}

// Call autoBattle every second
setInterval(autoBattle, 1000);

updateUI();
