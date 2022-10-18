'use strict'

import { logService } from '../services/log-service.js'
import { spellService } from '../services/spell-service.js'
import { wizardService } from '../services/wizard-service.js'

window.onInit = onInit
window.onReset = onReset
window.onStart = onStart
window.onTarget = onTarget
window.onSetSpell = onSetSpell
window.onToggleLog = onToggleLog
window.onToggleShop = onToggleShop
window.onPurchaseSpell = onPurchaseSpell
window.onCloseSpellsModal = onCloseSpellsModal

const gElGame = document.querySelector('.game')
const gElShopBtn = document.querySelector('.shop-btn')
const gElSpellsModal = document.querySelector('.spell-modal')
const gElSettings = document.querySelector('.setting-container')
const gElBattleLogBtn = document.querySelector('.battle-log-btn')


const gGame = {
    isGameOn: false,
    currentTurn: null,
    numOfPlayers: null,
    selectedSpell: null
}

function onReset() {
    if (gGame.currentTurn === null) return
    gGame.isGameOn = false
    gGame.currentTurn = null
    gGame.numOfPlayers = null
    gGame.selectedSpell = null
    logService.clearLogs()
    _toggleHidden([gElSettings, gElGame, gElBattleLogBtn, gElShopBtn])
}

function onStart(ev) {
    ev.preventDefault()
    _setNumOfPlayers()
    wizardService.setWizards(gGame.numOfPlayers)
    _setCurrTurn()
    _setIsGameOn()
    _renderBatlleLog()
    _renderWizards()
    _renderSpells()
    _renderShop()
    _toggleHidden([gElSettings, gElGame, gElBattleLogBtn, gElShopBtn])
}

function onInit() {
    gGame.numOfPlayers = document.querySelector('select').value
}

function onToggleShop() {
    const elShop = document.querySelector('.shop')
    _toggleHidden([elShop])
}

function onToggleLog() {
    const elBattleLog = document.querySelector('.batlle-log')
    _toggleHidden([elBattleLog])
}

function onCloseSpellsModal() {
    gElSpellsModal.classList.add('hidden')
}

function onSetSpell(ev, spellId) {
    ev.stopPropagation()
    if (!gGame.isGameOn) return
    const spell = spellService.getSpellById(spellId)
    const currWizard = wizardService.getWizards()[gGame.currentTurn]
    if (spell.mpCost < 0 && currWizard.mp < -spell.mpCost) return _renderMessageModal('Not enough mana')
    _setSelectedSpell(spell)
    _toggleHidden([gElSpellsModal])
    if (spell.name === 'Rest' || spell.name === 'Star Gazing') {
        _handleSpell(currWizard._id)
        _toggleHidden([gElSpellsModal])
        _setCurrTurn()
        _renderWizards()
        _renderBatlleLog()
        _renderSpells()
        _renderShop()
        _setSelectedSpell(null)
    }
}

function onTarget(ev, targetId) {
    const currWizard = wizardService.getWizards()[gGame.currentTurn]
    if (targetId === currWizard._id && !gGame.selectedSpell) {
        return _toggleHidden([gElSpellsModal])
    } else if (!gGame.selectedSpell) return
    switch (gGame.selectedSpell.name) {
        case 'Rest':
            console.log(gGame.selectedSpell.name)
    }
    const elBody = document.querySelector('body')
    const elSpellAnimation = document.querySelector('.spell-animation')
    elBody.classList.add('shakey')
    _toggleHidden([elSpellAnimation])
    elSpellAnimation.style.top = '' + ev.clientY + 'px'
    elSpellAnimation.style.left = '' + ev.clientX + 'px'
    setTimeout(() => _toggleHidden([elSpellAnimation]), 350)
    setTimeout(() => elBody.classList.remove('shakey'), 500)
    _handleSpell(targetId)
    _toggleHidden([gElSpellsModal])
    _setCurrTurn()
    _renderWizards()
    _renderBatlleLog()
    _checkWin()
    if (!gGame.isGameOn) return
    _renderSpells()
    _renderShop()
    _setSelectedSpell(null)
}

function onPurchaseSpell(spellId) {
    const spell = spellService.getSpellById(spellId)
    const wizard = wizardService.getWizards()[gGame.currentTurn]
    if (wizard.spells.includes(spell)) {
        return _renderMessageModal('Already purchsed')
        
    } else if (spell.goldCost > wizard.gold) {
        return _renderMessageModal('Not enough gold')
    }
    wizardService.addSpell(spell, gGame.currentTurn)
    _renderShop()
    _renderWizards()
    _renderSpells()
    onToggleShop()
}

function _renderWizards() {
    const wizards = wizardService.getWizards()
    const elBoard = document.querySelector('.game-board')
    let strHTMLs = wizards.map((wizard, idx) => {
        return `
        <div class="${(gGame.currentTurn === idx) ? 'player' : 'target'} flex wizard wizard-${wizard._id}"
        title="Wizard-${wizard._id}"
        onclick="onTarget(event, '${wizard._id}')"
        style="background: ${wizard.color}">
        <i class="fa-solid fa-hat-wizard wizard-hat"></i>
        <div class="grid stats-contianer">
        <h4 class="wizard-hp" title="Health points: ${wizard.hp}"> <i class="fa-solid fa-heart"></i>&nbsp: ${wizard.hp} </h4>
        <h4 class="wizard-mp" title="Mana points: ${wizard.mp}"> <i class="fa-solid fa-wand-magic"></i>&nbsp: ${wizard.mp} </h4>
        <h4 class="wizard-gold" title="Gold: ${wizard.gold}"> <i class="fa-solid fa-hand-holding-dollar"></i>&nbsp: ${wizard.gold} </h4>
        <h4 class="wizard-level" title="Level: ${wizard.level}"> Level: ${wizard.level} </h4>
        </div>
        </div>
        `
    })
    elBoard.innerHTML = strHTMLs.join('')
}

function _renderSpells() {
    if (!gGame.isGameOn) return
    const elSpellsContainer = document.querySelector('.spell-list')
    const wizard = wizardService.getWizards()[gGame.currentTurn]
    const strHTMLs = wizard.spells.map((spell => {
        return `<div class="flex listed-spell spell-${spell._id}"
        onclick="onSetSpell(event ,'${spell._id}')" 
        title="${spell.description}">
        <h3> ${spell.name} </h3>
        <h4> ${spell.description} </h4>
        </div>
        `
    }))
    elSpellsContainer.innerHTML = strHTMLs.join('')
}

function _renderMessageModal(message) {
    const elMessageModal = document.querySelector('.message-modal')
    elMessageModal.innerText = message
    _toggleHidden([elMessageModal])
    setTimeout(() => _toggleHidden([elMessageModal]), 2500)
}

function _renderShop() {
    const elShopList = document.querySelector('.shop-list')
    const currWizard = wizardService.getWizards()[gGame.currentTurn]
    const spells = spellService.getSpells().slice()
    spells.splice(0, 2)
    let strHTMLs = spells.map(spell => {
        return `<div class="flex spell-item-container ${(currWizard.spells.includes(spell)) ? 'purchsed' : ''}"
        onclick="onPurchaseSpell('${spell._id}')">
        <div class="flex spell-cost-container" title="Costs ${spell.goldCost} gold">${spell.goldCost}&nbsp<i class="fa-solid fa-hand-holding-dollar"></i></div>
        <div class="flex spell-name-container" title="${spell.name}">${spell.name}</div>
        <div class="flex spell-desc-container" title="${spell.description}">${spell.description}</div>
        </div>`
    })
    elShopList.innerHTML = strHTMLs.join('')
}

function _renderBatlleLog() {
    const elBattleLogContainer = document.querySelector('.battle-log-container')
    const logs = logService.getLogs()
    let strHTMLs = logs.map(log => {
        return `<p class="log-text">
        ${log.caster._id} used ${log.spell.name} ${(log.target) ? `on ${log.target._id} for ${log.spell.hpDiff} HP` : ''}
        </p>`
    })
    elBattleLogContainer.innerHTML = strHTMLs.join('')
}

function _handleSpell(targetId) {
    logService.makeLog(gGame.currentTurn, targetId, gGame.selectedSpell)
    wizardService.updateWizards(gGame.currentTurn, targetId, gGame.selectedSpell)
}

function _setIsGameOn() {
    gGame.isGameOn = !gGame.isGameOn
}

function _setSelectedSpell(spell) {
    gGame.selectedSpell = spell
}

function _setCurrTurn(turn) {
    if (turn) {
        gGame.currentTurn = turn
    } else if (gGame.currentTurn === 0 || gGame.currentTurn && gGame.currentTurn < wizardService.getWizards().length - 1) {
        gGame.currentTurn += 1
    } else {
        gGame.currentTurn = 0
    }
}

function _setNumOfPlayers() {
    gGame.numOfPlayers = +document.querySelector('.num-of-players').value
}

function _checkWin() {
    const wizards = wizardService.getWizards()
    if (wizards.length === 1) {
        _setIsGameOn()
        _renderMessageModal('The winner is ' + wizards[0]._id)
        setTimeout(onReset, 3000)
        return
    }
}

function _toggleHidden(elements) {
    elements.forEach(element => element.classList.toggle('hidden'))
}