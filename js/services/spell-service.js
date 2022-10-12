'use strict'

export const spellService = {
    getSpells,
    getSpellById,
}

const spells = [
    {
        _id: 's101',
        name: 'Rest',
        hpDiff: 0,
        mpDiff: 0,
        hpCost: 15,
        mpCost: 15,
        description: 'Take a rest, restore 15 HP, 15 MP'
    },
    {
        _id: 's102',
        name: 'Fireball',
        hpDiff: -15,
        mpDiff: 0,
        hpCost: 0,
        mpCost: -10,
        description: 'Cast a fireball dealing -15 hp to an enemy, costs 10 mp'
    },
    {
        _id: 's103',
        name: 'Freeze',
        hpDiff: -5,
        mpDiff: -15,
        hpCost: 0,
        mpCost: -20,
        goldCost: 5,
        description: 'Cast an ice breeze dealing -5 hp and -15 mp to an enemy, costs 20 mp'
    },
    {
        _id: 's104',
        name: 'Healing circle',
        hpDiff: 20,
        mpDiff: 0,
        hpCost: 0,
        mpCost: -30,
        goldCost: 5,
        description: 'Cast a healing circle healing the target 20 hp, costs 25 mp'
    },
    {
        _id: 's105',
        name: 'Magic drain',
        hpDiff: 0,
        mpDiff: -20,
        hpCost: -20,
        mpCost: 20,
        goldCost: 5,
        description: 'Drain an enemy mana by 20 mp, costs 10 hp'
    },
    {
        _id: 's106',
        name: 'Lightning bolt',
        hpDiff: -30,
        mpDiff: 0,
        hpCost: -5,
        mpCost: -20,
        goldCost: 5,
        description: 'Cast a lightning bolt dealing -30 hp to an enemy, costs 5 hp, 20 mp'
    },
    {
        _id: 's107',
        name: 'Self combustion',
        hpDiff: -40,
        mpDiff: 0,
        hpCost: -30,
        mpCost: 0,
        goldCost: 5,
        description: 'Deal 40 HP damage to the enemy and 30 HP damage to yourself'
    },
    {
        _id: 's108',
        name: 'Star Gazing',
        hpDiff: 0,
        mpDiff: 0,
        hpCost: -40,
        mpCost: 70,
        goldCost: 5,
        description: 'Gaze to the sky, restore 70 MP, for 40 HP'
    },
    {
        _id: 's108',
        name: 'Magic arrow',
        hpDiff: -15,
        mpDiff: -15,
        hpCost: 0,
        mpCost: -25,
        goldCost: 5,
        description: 'Shot a magic arrow, deal 15 HP and 15 MP to the enemy for 25 MP'
    },
]

function getSpells() {
    return spells
}

function getSpellById(spellId) {
    return spells.find(spell => spell._id === spellId)
}

