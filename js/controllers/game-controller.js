'use strict'

import { spellService } from '../services/spell-service.js'
import { wizardService } from '../services/wizard-service.js'
import { logService } from '../services/log-service.js'

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
    if (spell.name === 'Rest' || spell.name === 'Star Gazing' ) {
        onTarget(null)
    }
}

function onTarget(targetId) {
    const currWizard = wizardService.getWizards()[gGame.currentTurn]
    if (targetId === currWizard._id && !gGame.selectedSpell) {
        return _toggleHidden([gElSpellsModal])
    }
    if (!gGame.selectedSpell) return
    _toggleHidden([gElSpellsModal])
    _handleSpell(targetId)
    _renderBatlleLog()
    _setCurrTurn()
    _renderWizards()
    _renderSpells()
    _renderShop()
    _setSelectedSpell(null)
    _checkWin()
}

function onPurchaseSpell(spellId) {
    const spell = spellService.getSpellById(spellId)
    const wizard = wizardService.getWizards()[gGame.currentTurn]
    if (wizard.spells.includes(spell)) {
        _renderMessageModal('Already purchsed')
        return
    } else if (spell.goldCost > wizard.gold) {
        _renderMessageModal('Not enough gold')
        return
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
        onclick="onTarget('${wizard._id}')"
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
    const elShopContainer = document.querySelector('.shop-container')
    const currWizard = wizardService.getWizards()[gGame.currentTurn]
    const spells = spellService.getSpells().slice()
    spells.splice(0, 2)
    let strHTMLs = spells.map(spell => {
        return `<div class="flex spell-item-container ${(currWizard.spells.includes(spell)) ? 'purchsed' : ''}"
        onclick="onPurchaseSpell('${spell._id}')">
        <div class="flex spell-cost-container">${spell.goldCost}&nbsp<i class="fa-solid fa-hand-holding-dollar"></i></div>
        <div class="flex spell-name-container">${spell.name}</div>
        <div class="flex spell-desc-container">${spell.description}</div>
        </div>`
    })
    elShopContainer.innerHTML = strHTMLs.join('')
}

function _renderBatlleLog() {
    const elBattleLogContainer = document.querySelector('.battle-log-container')
    const logs = logService.getLogs()
    let strHTMLs = logs.map(log => {
        return `<p class="log-text">
        ${log.caster._id} used ${log.spell.name} ${(!log.caster._id) ? 'he killed himself' : ''} ${(log.target) ? `on ${log.target._id}` : ''}
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
    }
}

function _toggleHidden(elements) {
    elements.forEach(element => element.classList.toggle('hidden'))
}