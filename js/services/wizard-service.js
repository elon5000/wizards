'use strict'

import { utilService } from './util-service.js'
import { spellService } from './spell-service.js'

export const wizardService = {
    getWizards,
    getWizardById,
    setWizards,
    updateWizards,
}

const wizards = []

function getWizards() {
    return wizards
}

function getWizardById(wizardId) {
    return wizards.find(wizard => wizard._id === wizardId)
}

function setWizards(length = 2) {
    if (wizards.length) wizards.splice(0, wizards.length)
    for (let i = 0; i < length; i++) {
        const wizard = _makeWizard()
        wizards.push(wizard)
    }
}

function updateWizards(casterIdx, targetId, spell) {
    spell.hpDiff = (spell.hpDiff * wizards[casterIdx].level)
    spell.mpDiff = (spell.mpDiff * wizards[casterIdx].level)
    wizards[casterIdx].hp += spell.hpCost
    wizards[casterIdx].mp += spell.mpCost
    wizards[casterIdx].gold += 1
    if (wizards[casterIdx].hp <= 0) wizards.splice(casterIdx, 1)
    else if (wizards[casterIdx].mp < 0) wizards[casterIdx].mp = 0
    if (targetId) {
        const targetIdx = wizards.findIndex(wizard => wizard._id === targetId)
        wizards[targetIdx].hp += spell.hpDiff
        if (wizards[targetIdx].hp <= 0) {
            wizards[casterIdx].level += 1
            wizards.splice(targetIdx, 1)
            return
        }
        wizards[targetIdx].mp += spell.mpDiff
        if (wizards[targetIdx].mp < 0) wizards[targetIdx].mp = 0
    }
}

function _makeWizard() {
    const spells = spellService.getSpells().slice()
    const spellIdx = utilService.getRandomInt(2, spells.length)
    const wizard = {
        _id: utilService.makeId(),
        color: utilService.getRandomColor(),
        spells: [],
        hp: 100,
        mp: 100,
        level: 1,
        gold: 0
    }
    wizard.spells.push(spellService.getSpellById('s101'))
    wizard.spells.push(spellService.getSpellById('s102'))
    wizard.spells.push(spells[spellIdx])
    return wizard
}