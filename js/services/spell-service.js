'use strict'

export const spellService = {
    getSpells,
    getSpellById,
}

const spells = [
    {
        _id: 's101',
        name: 'Fireball',
        hpDiff: -15,
        mpDiff: 0,
        hpCost: 0,
        mpCost: -10,
        description: 'Cast a fireball dealing -15 hp to an enemy, costs 10 mp'
    },
    {
        _id: 's102',
        name: 'Lightning bolt',
        hpDiff: -30,
        mpDiff: 0,
        hpCost: -5,
        mpCost: -20,
        description: 'Cast a lightning bolt dealing -30 hp to an enemy, costs 5 hp, 20 mp'
    },
    {
        _id: 's103',
        name: 'Freeze',
        hpDiff: -5,
        mpDiff: -15,
        hpCost: 0,
        mpCost: -20,
        description: 'Cast an ice breeze dealing -5 hp and -15 mp to an enemy, costs 20 mp'
    },
    {
        _id: 's104',
        name: 'Healing circle',
        hpDiff: 20,
        mpDiff: 0,
        hpCost: 0,
        mpCost: -30,
        description: 'Cast a healing circle healing the target 20 hp, costs 25 mp'
    },
    {
        _id: 's105',
        name: 'Magic drain',
        hpDiff: 0,
        mpDiff: -20,
        hpCost: -20,
        mpCost: 20,
        description: 'Drain an enemy mana by 20 mp, costs 10 hp'
    },
    {
        _id: 's106',
        name: 'Rest',
        hpDiff: 0,
        mpDiff: 0,
        hpCost: 15,
        mpCost: 15,
        description: 'Take a rest, restore 15 HP, 15 MP'
    },
]

function getSpells() {
    return spells
}

function getSpellById(spellId) {
    return spells.find(spell => spell._id === spellId)
}
