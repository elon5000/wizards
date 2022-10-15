'use strict'

import { utilService } from './util-service.js'
import { spellService } from './spell-service.js'

export const wizardService = {
    getWizards,
    getWizardById,
    setWizards,
    updateWizards,
    addSpell
}

const WIZARDS = []

function getWizards() {
    return WIZARDS
}

function getWizardById(wizardId) {
    return WIZARDS.find(wizard => wizard._id === wizardId)
}

function setWizards(length = 2) {
    const colors = utilService.getColors()
    if (WIZARDS.length) WIZARDS.splice(0, WIZARDS.length)
    for (let i = 0; i < length; i++) {
        const wizard = _makeWizard()
        const colorIdx = utilService.getRandomInt(0 , colors.length)
        const wizardColor = colors[colorIdx]
        colors.splice(colorIdx, 1)
        wizard.color = wizardColor
        WIZARDS.push(wizard)
    }
}

function updateWizards(casterIdx, targetId, selectedSpell) {
    const spell = {...selectedSpell}
    spell.hpDiff = (spell.hpDiff * WIZARDS[casterIdx].level)
    spell.mpDiff = (spell.mpDiff * WIZARDS[casterIdx].level)
    WIZARDS[casterIdx].hp += spell.hpCost
    WIZARDS[casterIdx].mp += spell.mpCost
    WIZARDS[casterIdx].gold += 1
    if (WIZARDS[casterIdx].hp <= 0) WIZARDS.splice(casterIdx, 1)
    else if (WIZARDS[casterIdx].mp < 0) WIZARDS[casterIdx].mp = 0
    if (targetId) {
        const targetIdx = WIZARDS.findIndex(wizard => wizard._id === targetId)
        WIZARDS[targetIdx].hp += spell.hpDiff
        if (WIZARDS[targetIdx].hp <= 0) {
            WIZARDS[casterIdx].gold += 5
            WIZARDS[casterIdx].level += 1
            WIZARDS.splice(targetIdx, 1)
            return
        }
        WIZARDS[targetIdx].mp += spell.mpDiff
        if (WIZARDS[targetIdx].mp < 0) WIZARDS[targetIdx].mp = 0
    }
}

function _makeWizard() {
    const spells = spellService.getSpells().slice()
    const spellIdx = utilService.getRandomInt(2, spells.length)
    const wizard = {
        _id: utilService.makeId(),
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

function addSpell(spell, wizardIdx) {
    WIZARDS[wizardIdx].gold -= spell.goldCost
    WIZARDS[wizardIdx].spells.push(spell)
}