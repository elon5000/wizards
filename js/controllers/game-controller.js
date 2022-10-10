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

const gElGame = document.querySelector('.game')
const gElSettings = document.querySelector('.setting-container')
const gElBattleLogBtn = document.querySelector('.battle-log-btn')
const gElSpellModal = document.querySelector('.spell-modal')


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
    _toggleHidden([gElSettings, gElGame, gElBattleLogBtn])
}

function onStart(ev) {
    ev.preventDefault()
    _setNumOfPlayers()
    wizardService.setWizards(gGame.numOfPlayers)
    _setCurrTurn(0)
    _setIsGameOn()
    _renderBatlleLog()
    _renderWizards()
    _renderSpells()
    _toggleHidden([gElSettings, gElGame, gElBattleLogBtn])
}

function onInit() {
    gGame.numOfPlayers = document.querySelector('select').value
}

function onToggleLog() {
    const elBattleLog = document.querySelector('.batlle-log')
    _toggleHidden([elBattleLog])
}

function onSetSpell(ev, spellId) {
    ev.stopPropagation()
    if (!gGame.isGameOn) return
    const spell = spellService.getSpellById(spellId)
    _setSelectedSpell(spell)
    _toggleHidden([gElSpellModal])
    if (spell.name === 'Rest') {
        onTarget(null)
    }
    const currWizard = wizardService.getWizards()[gGame.currentTurn]
    if (spell.mpCost < 0 && currWizard.mp < -spell.mpCost) return alert('Not enoght mana')
}

function onTarget(targetId) {
    const currWizard = wizardService.getWizards()[gGame.currentTurn]
    if (targetId === currWizard._id && !gGame.selectedSpell) {
        return _toggleHidden([gElSpellModal])
    }
    if (!gGame.selectedSpell) return
    _toggleHidden([gElSpellModal])
    _handleSpell(targetId)
    _renderBatlleLog()
    _setCurrTurn()
    _renderWizards()
    _renderSpells()
    _setSelectedSpell(null)
    _checkWin()
}

function _renderWizards() {
    const wizards = wizardService.getWizards()
    const elBoard = document.querySelector('.game-board')
    let strHTMLs = wizards.map((wizard, idx) => {
        return `
        <div class="${(gGame.currentTurn === idx) ? 'player' : 'target'} flex wizard wizard-${wizard._id}"
        title="wizard-${wizard._id}"
        onclick="onTarget('${wizard._id}')"
        style="background: ${wizard.color}">
        <i class="fa-solid fa-hat-wizard wizard-hat"></i>
        <div class="flex stats-contianer">
        <h4 class="wizard-hp" title="health points: ${wizard.hp}"> <i class="fa-solid fa-heart"></i>&nbsp: ${wizard.hp} </h4>
        <h4 class="wizard-mp" title="mana points: ${wizard.mp}"> <i class="fa-solid fa-wand-magic"></i>&nbsp: ${wizard.mp} </h4>
        </div>
        </div>
        `
    })
    elBoard.innerHTML = strHTMLs.join('')
}

function _renderSpells() {
    if (!gGame.isGameOn) return
    const elSpellModal = document.querySelector('.spell-modal')
    const wizard = wizardService.getWizards()[gGame.currentTurn]
    const strHTMLs = wizard.spells.map((spell => {
        return `<div class="flex listed-spell spell-${spell._id}"
        onclick="onSetSpell(event ,'${spell._id}')" 
        title="${spell.description}">
        ${spell.name}
        </div>
        `
    }))
    elSpellModal.innerHTML = strHTMLs.join('')
}

function _renderMessageModal(message) {
    const elMessageModal = document.querySelector('.message-modal')
    elMessageModal.innerText = message
    _toggleHidden([elMessageModal])
    setTimeout(() => _toggleHidden([elMessageModal]), 2500)
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
    if (turn) gGame.currentTurn = turn
    else if (gGame.currentTurn < wizardService.getWizards().length - 1) {
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
    }
}

function _toggleHidden(elements) {
    elements.forEach(element => element.classList.toggle('hidden'))
}