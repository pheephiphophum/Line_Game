const log = document.getElementById('log')
const attackBtn = document.getElementById('attackBtn')
const moveBtn = document.getElementById('moveBtn')
const healBtn = document.getElementById('healBtn')
const runBtn = document.getElementById('runBtn')
const statsDiv = document.getElementById('stats')
const introForm = document.introForm

introForm.addEventListener('submit', function(event){
    event.preventDefault() // this overrides page refresh on submit
    player.name = introForm.username.value
    player.attackPwr = +introForm.attackPwr.value
    introForm.reset()
    updatePlayerStats()

    //conditional rendering. hidden reserves the space, display: none does not reserve space 
    introForm.style.display = 'none'
})

function createMessage(text){
    const message = document.createElement('p')
    message.textContent = text
    log.prepend(message)
}

function updatePlayerStats(){
    const playerName= document.getElementById('playerName')
    const playerHealth = document.getElementById('playerHealth')
    const playerAtkPower = document.getElementById('playerAtkPower')
    const playerSpeed = document.getElementById('playerSpeed')
    const playerPotion = document.getElementById('playerPotion')

    playerName.textContent = player.name
    playerHealth.textContent = `HP: ${player.hp}`
    playerAtkPower.textContent = `Atk: ${player.attackPwr}`
    playerSpeed.textContent =   `Speed: ${player.speed}`
    playerPotion.textContent =  `Potions: ${player.potionCount}`
}

class Character{
    constructor(name, hp, attackPwr, speed, potionCount = 0){
        this.name = name,
        this.hp = hp, 
        this.attackPwr = attackPwr
        this.speed = speed
        this.potionCount = potionCount
    }
    
    attack(combatant){
        const critHit = Math.random()
        let damage = this.attackPwr
        if(critHit > .94){
            damage = Math.round(this.attackPwr * 1.5)
            createMessage(`Critical! ${this.name} attacks ${combatant.name} for ${damage}!`)
            updatePlayerStats()
            return
        }
        combatant.hp = combatant.hp - this.attackPwr
        createMessage(`${this.name} attacks ${combatant.name} for ${damage}!`)
    }
}

const player = new Character('Fidan', 100, 15, 5, 2)

const stickman = new Character('Mr. Stickman', 60, 20, 20)
const yonder = new Character('Wonder over Yonder', 30, 10, 15)
const beast = new Character('The Beast', 35, 5, 5)

const enemies = [beast, yonder, stickman]
let enemy = null
let inEncounter = false


function handleMove(){
    const randomChance = Math.random()
     
    if (randomChance > .5){
        const randomIndex = Math.floor(Math.random() * enemies.length)
        enemy = enemies[randomIndex]
        encounterTime(enemy)
    } else{
        createMessage(`'"Theyre getting closer.."'`)
    }
}

function encounterTime(enemy){
    createMessage(`${enemy.name}.. It's found me!`)
    inEncounter = true
}

function handleAttack(enemy){
    if(inEncounter === false){
        createMessage(`"They could find me at any moment.. I must be ready."`)
        return
    }
    
    let attacksFirst = null

    if(enemy.speed > player.speed){
        attacksFirst = enemy.name
    } else if(player.speed > enemy.speed){
        attacksFirst = player.name
    } else{
        const randomChance = Math.random()
        if(randomChance < .5){
            attacksFirst = enemy.name
        } else{
            attacksFirst = player.name
        }
    }

    if(attacksFirst === player.name){
        player.attack(enemy)
        if(enemy.hp <= 0){
            inEncounter = false
            createMessage(`I killed ${enemy.name}.`)
            return
        }
    
        enemy.attack(player)
        if(player.hp <= 0){
            inEncounter = false
            createMessage(`${enemy.name} has defeated me..`)
            return
        }
        updatePlayerStats()
    } else{
        enemy.attack(player)
        updatePlayerStats()
        if(player.hp <= 0){
            inEncounter = false
            createMessage(`${enemy.name} has defeated me..`)
            return
        }
        player.attack(enemy)
        if(enemy.hp <= 0){
            inEncounter = false
            createMessage(`I killed ${enemy.name}.`)
            return
        }
    } 
}

function healSelf(){
    const message = document.createElement('p')
    if(player.hp === 100){
        createMessage(`I don't need to heal.`)
        return
    }

    if(player.potionCount > 0){
        player.hp = player.hp + 15
        player.potionCount -= 1
            if (player.hp > 100){
                player.hp = 100
            }
        createMessage(`Not enough but.. It'll do.`)
        updatePlayerStats()
    } else{
        createMessage(`Damn, can't heal right now!`)
    }
}

function startGame(){
    createMessage('I have been chosen as the weapon.')
    updatePlayerStats()
    // updateEnemyStats()
}

startGame()

attackBtn.addEventListener('click', () => handleAttack(enemy))
moveBtn.addEventListener('click', handleMove)
healBtn.addEventListener('click', healSelf)

// health hitting zero
// crit chance per character
// inventory
// win condition
// start game and pick name