'use strict'

import { wizardService } from '../services/wizard-service.js'

export const logService = {
    makeLog,
    getLogs,
    clearLogs,
}

const logs = []

function makeLog(casterIdx, targetId, spell) {
    const log = {
        caster: wizardService.getWizards()[casterIdx],
        target: (targetId) ? wizardService.getWizardById(targetId) : null,
        spell
    }
    logs.push(log)
}

function getLogs() {
    return logs
}

function clearLogs() {
    logs.splice(0, logs.length)
}