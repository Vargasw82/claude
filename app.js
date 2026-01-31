// Estado de la aplicación
const state = {
    dailyHours: 8,
    weeklyDays: 5,
    positions: [], // [{id, name, monthlyCost, hourlyRate}]
    tasks: [], // [{id, name, positionHours: {positionId: hours}}]
    tools: []
};

// Elementos del DOM
const elements = {
    positionName: document.getElementById('positionName'),
    positionMonthlyCost: document.getElementById('positionMonthlyCost'),
    addPosition: document.getElementById('addPosition'),
    positionsList: document.getElementById('positionsList'),
    taskName: document.getElementById('taskName'),
    addTask: document.getElementById('addTask'),
    tasksList: document.getElementById('tasksList'),
    totalHours: document.getElementById('totalHours'),
    laborCost: document.getElementById('laborCost'),
    toolName: document.getElementById('toolName'),
    toolMonthlyCost: document.getElementById('toolMonthlyCost'),
    addTool: document.getElementById('addTool'),
    toolsList: document.getElementById('toolsList'),
    toolsCost: document.getElementById('toolsCost'),
    finalLaborCost: document.getElementById('finalLaborCost'),
    finalToolsCost: document.getElementById('finalToolsCost'),
    finalTotal: document.getElementById('finalTotal'),
    exportBtn: document.getElementById('exportBtn'),
    clearBtn: document.getElementById('clearBtn')
};

// Funciones de cálculo
function calculateHourlyRate(monthlyCost) {
    // 5 días × 8 horas × 4 semanas = 160 horas/mes
    const monthlyHours = state.dailyHours * state.weeklyDays * 4;
    return monthlyCost / monthlyHours;
}

function calculateMonthlyHours() {
    return state.dailyHours * state.weeklyDays * 4;
}

function calculateTotalHours() {
    return state.tasks.reduce((total, task) => {
        const taskHours = Object.values(task.positionHours).reduce((sum, hours) => sum + hours, 0);
        return total + taskHours;
    }, 0);
}

function calculateLaborCost() {
    return state.tasks.reduce((total, task) => {
        const taskCost = Object.entries(task.positionHours).reduce((sum, [positionId, hours]) => {
            const position = state.positions.find(p => p.id === parseInt(positionId));
            if (position) {
                return sum + (hours * position.hourlyRate);
            }
            return sum;
        }, 0);
        return total + taskCost;
    }, 0);
}

function calculateToolsCost() {
    const totalProjectHours = calculateTotalHours();
    const monthlyHours = calculateMonthlyHours();

    return state.tools.reduce((total, tool) => {
        // Costo prorrateado = (costo mensual / horas mensuales) × horas del proyecto
        const proratedCost = (tool.monthlyCost / monthlyHours) * totalProjectHours;
        return total + proratedCost;
    }, 0);
}

function calculateTotalCost() {
    return calculateLaborCost() + calculateToolsCost();
}

// Funciones de formato
function formatCurrency(amount) {
    return new Intl.NumberFormat('es-MX', {
        style: 'currency',
        currency: 'MXN',
        minimumFractionDigits: 2
    }).format(amount);
}

function formatNumber(number) {
    return new Intl.NumberFormat('es-MX', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(number);
}

// Funciones de actualización de UI
function updateTasksSummary() {
    const totalHours = calculateTotalHours();
    const laborCost = calculateLaborCost();

    elements.totalHours.textContent = formatNumber(totalHours);
    elements.laborCost.textContent = formatCurrency(laborCost).replace('MXN', '').trim();
}

function updateToolsSummary() {
    const toolsCost = calculateToolsCost();
    elements.toolsCost.textContent = formatCurrency(toolsCost).replace('MXN', '').trim();
}

function updateFinalSummary() {
    const laborCost = calculateLaborCost();
    const toolsCost = calculateToolsCost();
    const totalCost = calculateTotalCost();

    elements.finalLaborCost.textContent = formatCurrency(laborCost);
    elements.finalToolsCost.textContent = formatCurrency(toolsCost);
    elements.finalTotal.textContent = formatCurrency(totalCost);
}

function updateAllSummaries() {
    updateTasksSummary();
    updateToolsSummary();
    updateFinalSummary();
}

// Gestión de puestos
function addPosition() {
    const name = elements.positionName.value.trim();
    const monthlyCost = parseFloat(elements.positionMonthlyCost.value);

    if (!name || !monthlyCost || monthlyCost <= 0) {
        alert('Por favor, ingresa un nombre de puesto válido y un costo mayor a 0');
        return;
    }

    const position = {
        id: Date.now(),
        name,
        monthlyCost,
        hourlyRate: calculateHourlyRate(monthlyCost)
    };

    state.positions.push(position);
    renderPosition(position);
    updateAllSummaries();

    // Limpiar inputs
    elements.positionName.value = '';
    elements.positionMonthlyCost.value = '';
    elements.positionName.focus();
}

function removePosition(positionId) {
    if (!confirm('¿Estás seguro? Se eliminarán las horas asociadas a este puesto en todas las tareas.')) {
        return;
    }

    state.positions = state.positions.filter(position => position.id !== positionId);

    // Eliminar horas de este puesto en todas las tareas
    state.tasks.forEach(task => {
        delete task.positionHours[positionId];
    });

    renderPositions();
    renderTasks();
    updateAllSummaries();
}

function renderPosition(position) {
    const positionDiv = document.createElement('div');
    positionDiv.className = 'position-item';
    positionDiv.dataset.positionId = position.id;

    positionDiv.innerHTML = `
        <div class="position-info">
            <div class="position-name">${position.name}</div>
            <div class="position-details">
                Costo mensual: ${formatCurrency(position.monthlyCost)} |
                Tarifa por hora: ${formatCurrency(position.hourlyRate)}
            </div>
        </div>
        <button class="btn-delete" onclick="removePosition(${position.id})">Eliminar</button>
    `;

    elements.positionsList.appendChild(positionDiv);
}

function renderPositions() {
    elements.positionsList.innerHTML = '';
    state.positions.forEach(position => renderPosition(position));
}

// Gestión de tareas
function addTask() {
    const name = elements.taskName.value.trim();

    if (!name) {
        alert('Por favor, ingresa un nombre de tarea válido');
        return;
    }

    if (state.positions.length === 0) {
        alert('Por favor, agrega al menos un puesto antes de crear tareas');
        return;
    }

    const task = {
        id: Date.now(),
        name,
        positionHours: {} // {positionId: hours}
    };

    // Inicializar horas en 0 para todos los puestos
    state.positions.forEach(position => {
        task.positionHours[position.id] = 0;
    });

    state.tasks.push(task);
    renderTask(task);
    updateAllSummaries();

    // Limpiar input
    elements.taskName.value = '';
    elements.taskName.focus();
}

function removeTask(taskId) {
    state.tasks = state.tasks.filter(task => task.id !== taskId);
    renderTasks();
    updateAllSummaries();
}

function updateTaskHours(taskId, positionId, hours) {
    const task = state.tasks.find(t => t.id === taskId);
    if (task) {
        task.positionHours[positionId] = parseFloat(hours) || 0;
        updateTaskDisplay(taskId);
        updateAllSummaries();
    }
}

function updateTaskDisplay(taskId) {
    const task = state.tasks.find(t => t.id === taskId);
    if (!task) return;

    const taskDiv = document.querySelector(`[data-task-id="${taskId}"]`);
    if (!taskDiv) return;

    const totalTaskHours = Object.values(task.positionHours).reduce((sum, hours) => sum + hours, 0);
    const taskCost = Object.entries(task.positionHours).reduce((sum, [positionId, hours]) => {
        const position = state.positions.find(p => p.id === parseInt(positionId));
        if (position) {
            return sum + (hours * position.hourlyRate);
        }
        return sum;
    }, 0);

    const totalHoursSpan = taskDiv.querySelector('.task-total-hours');
    const taskCostSpan = taskDiv.querySelector('.task-total-cost');

    if (totalHoursSpan) {
        totalHoursSpan.textContent = formatNumber(totalTaskHours);
    }
    if (taskCostSpan) {
        taskCostSpan.textContent = formatCurrency(taskCost);
    }
}

function renderTask(task) {
    const taskDiv = document.createElement('div');
    taskDiv.className = 'task-item';
    taskDiv.dataset.taskId = task.id;

    const totalTaskHours = Object.values(task.positionHours).reduce((sum, hours) => sum + hours, 0);
    const taskCost = Object.entries(task.positionHours).reduce((sum, [positionId, hours]) => {
        const position = state.positions.find(p => p.id === parseInt(positionId));
        if (position) {
            return sum + (hours * position.hourlyRate);
        }
        return sum;
    }, 0);

    let positionInputsHTML = '';
    state.positions.forEach(position => {
        const hours = task.positionHours[position.id] || 0;
        positionInputsHTML += `
            <div class="position-hours-input">
                <label>${position.name}:</label>
                <input type="number"
                       value="${hours}"
                       min="0"
                       step="0.5"
                       onchange="updateTaskHours(${task.id}, ${position.id}, this.value)"
                       placeholder="Horas">
                <span class="unit">hrs</span>
            </div>
        `;
    });

    taskDiv.innerHTML = `
        <div class="task-header">
            <div class="task-name">${task.name}</div>
            <button class="btn-delete" onclick="removeTask(${task.id})">Eliminar</button>
        </div>
        <div class="task-positions">
            ${positionInputsHTML}
        </div>
        <div class="task-summary">
            <div class="task-summary-item">
                <span>Total horas:</span>
                <strong class="task-total-hours">${formatNumber(totalTaskHours)}</strong>
            </div>
            <div class="task-summary-item">
                <span>Costo:</span>
                <strong class="task-total-cost highlight">${formatCurrency(taskCost)}</strong>
            </div>
        </div>
    `;

    elements.tasksList.appendChild(taskDiv);
}

function renderTasks() {
    elements.tasksList.innerHTML = '';
    state.tasks.forEach(task => renderTask(task));
}

// Gestión de herramientas
function addTool() {
    const name = elements.toolName.value.trim();
    const monthlyCost = parseFloat(elements.toolMonthlyCost.value);

    if (!name || !monthlyCost || monthlyCost <= 0) {
        alert('Por favor, ingresa un nombre de herramienta válido y un costo mayor a 0');
        return;
    }

    const tool = {
        id: Date.now(),
        name,
        monthlyCost
    };

    state.tools.push(tool);
    renderTool(tool);
    updateAllSummaries();

    // Limpiar inputs
    elements.toolName.value = '';
    elements.toolMonthlyCost.value = '';
    elements.toolName.focus();
}

function removeTool(toolId) {
    state.tools = state.tools.filter(tool => tool.id !== toolId);
    renderTools();
    updateAllSummaries();
}

function renderTool(tool) {
    const totalProjectHours = calculateTotalHours();
    const monthlyHours = calculateMonthlyHours();
    const proratedCost = totalProjectHours > 0
        ? (tool.monthlyCost / monthlyHours) * totalProjectHours
        : 0;

    const toolDiv = document.createElement('div');
    toolDiv.className = 'tool-item';
    toolDiv.dataset.toolId = tool.id;

    toolDiv.innerHTML = `
        <div class="tool-info">
            <div class="tool-name">${tool.name}</div>
            <div class="tool-details">
                Costo mensual: ${formatCurrency(tool.monthlyCost)}
                ${totalProjectHours > 0 ? `| Prorrateado: ${formatCurrency(proratedCost)}` : ''}
            </div>
        </div>
        <div class="tool-cost">${formatCurrency(proratedCost)}</div>
        <button class="btn-delete" onclick="removeTool(${tool.id})">Eliminar</button>
    `;

    elements.toolsList.appendChild(toolDiv);
}

function renderTools() {
    elements.toolsList.innerHTML = '';
    state.tools.forEach(tool => renderTool(tool));
}

// Funciones de exportación y limpieza
function exportQuote() {
    const totalHours = calculateTotalHours();
    const laborCost = calculateLaborCost();
    const toolsCost = calculateToolsCost();
    const totalCost = calculateTotalCost();

    let exportText = '═══════════════════════════════════════════\n';
    exportText += '         COTIZACIÓN DE PROYECTO\n';
    exportText += '═══════════════════════════════════════════\n\n';

    exportText += 'CONFIGURACIÓN DE TARIFA:\n';
    exportText += `Base de cálculo: ${state.weeklyDays} días × ${state.dailyHours} horas × 4 semanas = ${calculateMonthlyHours()} horas/mes\n\n`;

    if (state.positions.length === 0) {
        exportText += 'No hay puestos configurados\n\n';
    } else {
        exportText += 'Puestos:\n';
        state.positions.forEach((position, index) => {
            exportText += `${index + 1}. ${position.name}\n`;
            exportText += `   Costo mensual: ${formatCurrency(position.monthlyCost)} | `;
            exportText += `Tarifa por hora: ${formatCurrency(position.hourlyRate)}\n\n`;
        });
    }

    exportText += '─────────────────────────────────────────────\n';
    exportText += 'SCOPE OF WORK (SOW):\n';
    exportText += '─────────────────────────────────────────────\n';

    if (state.tasks.length === 0) {
        exportText += 'No hay tareas agregadas\n\n';
    } else {
        state.tasks.forEach((task, index) => {
            const totalTaskHours = Object.values(task.positionHours).reduce((sum, hours) => sum + hours, 0);
            const taskCost = Object.entries(task.positionHours).reduce((sum, [positionId, hours]) => {
                const position = state.positions.find(p => p.id === parseInt(positionId));
                if (position) {
                    return sum + (hours * position.hourlyRate);
                }
                return sum;
            }, 0);

            exportText += `${index + 1}. ${task.name}\n`;
            Object.entries(task.positionHours).forEach(([positionId, hours]) => {
                const position = state.positions.find(p => p.id === parseInt(positionId));
                if (position && hours > 0) {
                    const positionCost = hours * position.hourlyRate;
                    exportText += `   - ${position.name}: ${formatNumber(hours)} hrs × ${formatCurrency(position.hourlyRate)}/hr = ${formatCurrency(positionCost)}\n`;
                }
            });
            exportText += `   Total: ${formatNumber(totalTaskHours)} horas | Costo: ${formatCurrency(taskCost)}\n\n`;
        });
    }

    exportText += `Total de horas: ${formatNumber(totalHours)}\n`;
    exportText += `Costo de trabajo: ${formatCurrency(laborCost)}\n\n`;

    exportText += '─────────────────────────────────────────────\n';
    exportText += 'HERRAMIENTAS Y RECURSOS:\n';
    exportText += '─────────────────────────────────────────────\n';

    if (state.tools.length === 0) {
        exportText += 'No hay herramientas agregadas\n\n';
    } else {
        const monthlyHours = calculateMonthlyHours();
        state.tools.forEach((tool, index) => {
            const proratedCost = (tool.monthlyCost / monthlyHours) * totalHours;
            exportText += `${index + 1}. ${tool.name}\n`;
            exportText += `   Costo mensual: ${formatCurrency(tool.monthlyCost)} | `;
            exportText += `Prorrateado: ${formatCurrency(proratedCost)}\n\n`;
        });
    }

    exportText += `Costo de herramientas: ${formatCurrency(toolsCost)}\n\n`;

    exportText += '═══════════════════════════════════════════\n';
    exportText += 'RESUMEN FINAL:\n';
    exportText += '═══════════════════════════════════════════\n';
    exportText += `Costo de trabajo:      ${formatCurrency(laborCost)}\n`;
    exportText += `Costo de herramientas: ${formatCurrency(toolsCost)}\n`;
    exportText += `───────────────────────────────────────────\n`;
    exportText += `TOTAL DEL PROYECTO:    ${formatCurrency(totalCost)}\n`;
    exportText += '═══════════════════════════════════════════\n\n';
    exportText += `Generado el: ${new Date().toLocaleString('es-MX')}\n`;

    // Crear blob y descargar
    const blob = new Blob([exportText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cotizacion_${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function clearAll() {
    if (!confirm('¿Estás seguro de que quieres limpiar todo? Esta acción no se puede deshacer.')) {
        return;
    }

    state.positions = [];
    state.tasks = [];
    state.tools = [];

    renderPositions();
    renderTasks();
    renderTools();
    updateAllSummaries();

    alert('Se ha limpiado toda la información del cotizador.');
}

// Event Listeners
elements.addPosition.addEventListener('click', addPosition);

elements.positionName.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        elements.positionMonthlyCost.focus();
    }
});

elements.positionMonthlyCost.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addPosition();
    }
});

elements.addTask.addEventListener('click', addTask);

elements.taskName.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addTask();
    }
});

elements.addTool.addEventListener('click', addTool);

elements.toolName.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        elements.toolMonthlyCost.focus();
    }
});

elements.toolMonthlyCost.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addTool();
    }
});

elements.exportBtn.addEventListener('click', exportQuote);
elements.clearBtn.addEventListener('click', clearAll);

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    updateAllSummaries();
    console.log('Cotizador de Proyectos inicializado correctamente');
});
