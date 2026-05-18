// Card Database
const cardDatabase = [
    {
        id: 1,
        name: "Pikachu",
        emoji: "⚡",
        type: "Electric",
        hp: 40,
        rarity: "common",
        price: 15,
        attack: "Thunderbolt",
        weakness: "Water",
        resistance: "Metal"
    },
    {
        id: 2,
        name: "Charizard",
        emoji: "🔥",
        type: "Fire",
        hp: 120,
        rarity: "holo",
        price: 150,
        attack: "Fire Spin",
        weakness: "Water",
        resistance: "Grass"
    },
    {
        id: 3,
        name: "Blastoise",
        emoji: "💧",
        type: "Water",
        hp: 100,
        rarity: "rare",
        price: 80,
        attack: "Hydro Cannon",
        weakness: "Grass",
        resistance: "Ice"
    },
    {
        id: 4,
        name: "Venusaur",
        emoji: "🌿",
        type: "Grass",
        hp: 100,
        rarity: "rare",
        price: 75,
        attack: "Solar Beam",
        weakness: "Fire",
        resistance: "Water"
    },
    {
        id: 5,
        name: "Dragonite",
        emoji: "🐉",
        type: "Dragon",
        hp: 130,
        rarity: "holo",
        price: 200,
        attack: "Dragon Rage",
        weakness: "Ice",
        resistance: "Fire"
    },
    {
        id: 6,
        name: "Mewtwo",
        emoji: "🧬",
        type: "Psychic",
        hp: 140,
        rarity: "secret",
        price: 500,
        attack: "Psychic Break",
        weakness: "Dark",
        resistance: "None"
    },
    {
        id: 7,
        name: "Gyarados",
        emoji: "🌊",
        type: "Water",
        hp: 110,
        rarity: "uncommon",
        price: 40,
        attack: "Hydro Pump",
        weakness: "Grass",
        resistance: "Ice"
    },
    {
        id: 8,
        name: "Alakazam",
        emoji: "🧠",
        type: "Psychic",
        hp: 90,
        rarity: "rare",
        price: 120,
        attack: "Psychic",
        weakness: "Dark",
        resistance: "Fighting"
    },
    {
        id: 9,
        name: "Arcanine",
        emoji: "🐕",
        type: "Fire",
        hp: 95,
        rarity: "uncommon",
        price: 35,
        attack: "Wild Charge",
        weakness: "Water",
        resistance: "Grass"
    },
    {
        id: 10,
        name: "Lapras",
        emoji: "🦕",
        type: "Water",
        hp: 120,
        rarity: "rare",
        price: 90,
        attack: "Hydro Dash",
        weakness: "Grass",
        resistance: "Ice"
    }
];

// Game State
let gameState = {
    wallet: 1000,
    collection: [],
    totalCardsOwned: 0,
    collectionValue: 0
};

// Initialize Game
document.addEventListener('DOMContentLoaded', function() {
    renderShop('all');
    updatePlayerStats();
});

// Render Shop
function renderShop(rarity = 'all') {
    const shopGrid = document.getElementById('shopGrid');
    shopGrid.innerHTML = '';

    let filteredCards = cardDatabase;
    if (rarity !== 'all') {
        filteredCards = cardDatabase.filter(card => card.rarity === rarity);
    }

    filteredCards.forEach(card => {
        const cardElement = createCardElement(card, 'shop');
        shopGrid.appendChild(cardElement);
    });
}

// Create Card Element
function createCardElement(card, context = 'shop') {
    const cardDiv = document.createElement('div');
    cardDiv.className = 'card';

    let ownedCount = gameState.collection.filter(c => c.id === card.id).length;
    let buttonText = context === 'shop' ? `Buy ($${card.price})` : `Sell ($${card.price})`;
    let buttonAction = context === 'shop' ? `buyCard(${card.id})` : `sellCard(${card.id})`;

    cardDiv.innerHTML = `
        <div class="card-image">
            <div>${card.emoji}</div>
            <div class="card-rarity rarity-${card.rarity}">${card.rarity}</div>
        </div>
        <div class="card-info">
            <div class="card-name">${card.name}</div>
            <div class="card-type">${card.type}</div>
            <div class="card-stats">
                <div>❤️ HP: ${card.hp}</div>
                <div>⚔️ ${card.attack}</div>
            </div>
            <div class="card-price">$${card.price}</div>
            ${context === 'shop' ? 
                `<button class="card-action" onclick="${buttonAction}" ${gameState.wallet < card.price ? 'disabled' : ''}>${buttonText}</button>` :
                `<div><strong>Owned: ${ownedCount}</strong></div><button class="card-action" onclick="${buttonAction}">${buttonText}</button>`
            }
        </div>
    `;

    cardDiv.addEventListener('click', () => showCardDetails(card));
    return cardDiv;
}

// Buy Card
function buyCard(cardId) {
    const card = cardDatabase.find(c => c.id === cardId);
    
    if (gameState.wallet >= card.price) {
        gameState.wallet -= card.price;
        gameState.collection.push({...card, ownedId: Date.now()});
        gameState.totalCardsOwned++;
        gameState.collectionValue += card.price;
        
        updatePlayerStats();
        showNotification(`✅ Bought ${card.name}!`, 'success');
        renderShop('all');
    } else {
        showNotification('❌ Insufficient funds!', 'error');
    }
}

// Sell Card
function sellCard(cardId) {
    const cardIndex = gameState.collection.findIndex(c => c.id === cardId);
    
    if (cardIndex !== -1) {
        const card = gameState.collection[cardIndex];
        const sellPrice = Math.floor(card.price * 0.7);
        
        gameState.collection.splice(cardIndex, 1);
        gameState.wallet += sellPrice;
        gameState.totalCardsOwned--;
        gameState.collectionValue -= card.price;
        
        updatePlayerStats();
        showNotification(`✅ Sold ${card.name} for $${sellPrice}!`, 'success');
        renderCollection();
    }
}

// Filter Rarity
function filterRarity(rarity) {
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    renderShop(rarity === 'all' ? 'all' : rarity);
}

// Render Collection
function renderCollection() {
    const collectionGrid = document.getElementById('collectionGrid');
    collectionGrid.innerHTML = '';

    if (gameState.collection.length === 0) {
        collectionGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: #999; padding: 40px;">Your collection is empty. Start buying cards!</p>';
        return;
    }

    gameState.collection.forEach(card => {
        const cardElement = createCardElement(card, 'collection');
        collectionGrid.appendChild(cardElement);
    });

    const uniqueCards = new Set(gameState.collection.map(c => c.id)).size;
    document.getElementById('totalCollectionCards').textContent = gameState.collection.length;
    document.getElementById('uniqueCards').textContent = uniqueCards;
}

// Buy Booster Pack
function buyBoosterPack(price, isPremium = false, isEliteBox = false) {
    if (gameState.wallet < price) {
        showNotification('❌ Insufficient funds!', 'error');
        return;
    }

    gameState.wallet -= price;
    updatePlayerStats();

    let packSize = 5;
    let guaranteedRares = 0;

    if (isPremium && isEliteBox) {
        packSize = 20;
        guaranteedRares = 5;
    } else if (isPremium) {
        packSize = 10;
        guaranteedRares = 1;
    }

    const pulledCards = [];
    let raresAdded = 0;

    for (let i = 0; i < packSize; i++) {
        let randomCard;

        if (raresAdded < guaranteedRares) {
            const rareCards = cardDatabase.filter(c => ['rare', 'holo', 'secret'].includes(c.rarity));
            randomCard = rareCards[Math.floor(Math.random() * rareCards.length)];
            raresAdded++;
        } else {
            randomCard = cardDatabase[Math.floor(Math.random() * cardDatabase.length)];
        }

        gameState.collection.push({...randomCard, ownedId: Date.now()});
        gameState.totalCardsOwned++;
        gameState.collectionValue += randomCard.price;
        pulledCards.push(randomCard);
    }

    updatePlayerStats();
    displayBoosterResult(pulledCards, price);
}

// Display Booster Result
function displayBoosterResult(cards, price) {
    const resultDiv = document.getElementById('boosterResult');
    let cardsHTML = '';

    cards.forEach(card => {
        cardsHTML += `
            <div class="booster-card">
                <div class="booster-card-icon">${card.emoji}</div>
                <div class="booster-card-name">${card.name}</div>
                <div class="booster-card-rarity rarity-${card.rarity}">${card.rarity}</div>
            </div>
        `;
    });

    resultDiv.innerHTML = `
        <h3>🎉 Booster Pack Opened!</h3>
        <p>You pulled ${cards.length} cards worth $${cards.reduce((sum, c) => sum + c.price, 0)} (Total spent: $${price})</p>
        <div class="booster-cards">
            ${cardsHTML}
        </div>
    `;

    resultDiv.classList.add('show');
    showNotification(`🎉 Opened booster pack! Got ${cards.length} cards!`, 'success');
}

// Switch Tab
function switchTab(tabName) {
    document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
    document.getElementById(tabName + '-tab').classList.add('active');

    document.querySelectorAll('.action-buttons .btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');

    if (tabName === 'collection') {
        renderCollection();
    } else if (tabName === 'booster') {
        document.getElementById('boosterResult').classList.remove('show');
    }
}

// Show Card Details
function showCardDetails(card) {
    const modal = document.getElementById('cardModal');
    const modalBody = document.getElementById('modalBody');
    const ownedCount = gameState.collection.filter(c => c.id === card.id).length;

    modalBody.innerHTML = `
        <div style="text-align: center;">
            <div style="font-size: 5em; margin-bottom: 20px;">${card.emoji}</div>
            <h2>${card.name}</h2>
            <p style="font-size: 1.1em; color: #667eea; margin-bottom: 15px;">${card.type} Type</p>
            
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <p><strong>HP:</strong> ${card.hp}</p>
                <p><strong>Attack:</strong> ${card.attack}</p>
                <p><strong>Weakness:</strong> ${card.weakness}</p>
                <p><strong>Resistance:</strong> ${card.resistance}</p>
                <p><strong>Rarity:</strong> <span class="rarity-${card.rarity}">${card.rarity}</span></p>
                <p style="font-size: 1.3em; color: #27ae60; margin-top: 15px;"><strong>Price: $${card.price}</strong></p>
                <p><strong>You own:</strong> ${ownedCount} copies</p>
            </div>
        </div>
    `;

    modal.classList.add('show');
}

// Close Modal
function closeModal() {
    document.getElementById('cardModal').classList.remove('show');
}

// Update Player Stats
function updatePlayerStats() {
    document.getElementById('walletBalance').textContent = `$${gameState.wallet}`;
    document.getElementById('cardsOwned').textContent = gameState.totalCardsOwned;
    document.getElementById('collectionValue').textContent = `$${gameState.collectionValue}`;
}

// Show Notification
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#27ae60' : type === 'error' ? '#e74c3c' : '#3498db'};
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        z-index: 2000;
        animation: slideIn 0.3s ease;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => notification.remove(), 3000);
}

// Reset Game
function resetGame() {
    if (confirm('Are you sure? This will reset your entire game.')) {
        gameState = {
            wallet: 1000,
            collection: [],
            totalCardsOwned: 0,
            collectionValue: 0
        };
        updatePlayerStats();
        renderShop('all');
        document.getElementById('boosterResult').classList.remove('show');
        showNotification('🔄 Game reset!', 'info');
    }
}

// Close modal when clicking outside
window.addEventListener('click', function(event) {
    const modal = document.getElementById('cardModal');
    if (event.target === modal) {
        closeModal();
    }
});