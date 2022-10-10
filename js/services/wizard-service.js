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
    wizards[casterIdx].hp += spell.hpCost
    wizards[casterIdx].mp += spell.mpCost
    if (wizards[casterIdx].hp <= 0) wizards.splice(casterIdx, 1)
    if (targetId) {
        const targetIdx = wizards.findIndex(wizard => wizard._id === targetId)
        wizards[targetIdx].hp += spell.hpDiff
        wizards[targetIdx].mp += spell.mpDiff
        if (wizards[targetIdx].hp <= 0) wizards.splice(targetIdx, 1)
    }
}

function _makeWizard() {
    return {
        _id: utilService.makeId(),
        color: utilService.getRandomColor(),
        spells: spellService.getSpells(),
        hp: 100,
        mp: 100
    }
}