// Estado de la aplicación
const state = {
    monthlyCost: 100000,
    dailyHours: 8,
    weeklyDays: 5,
    hourlyRate: 0,
    tasks: [],
    tools: []
};

// Elementos del DOM
const elements = {
    monthlyCost: document.getElementById('monthlyCost'),
    dailyHours: document.getElementById('dailyHours'),
    weeklyDays: document.getElementById('weeklyDays'),
    hourlyRate: document.getElementById('hourlyRate'),
    taskName: document.getElementById('taskName'),
    taskHours: document.getElementById('taskHours'),
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
function calculateHourlyRate() {
    // Horas mensuales = horas diarias × días semanales × 4.33 (semanas promedio por mes)
    const monthlyHours = state.dailyHours * state.weeklyDays * 4.33;
    state.hourlyRate = state.monthlyCost / monthlyHours;
    return state.hourlyRate;
}

function calculateTotalHours() {
    return state.tasks.reduce((total, task) => total + task.hours, 0);
}

function calculateLaborCost() {
    const totalHours = calculateTotalHours();
    return totalHours * state.hourlyRate;
}

function calculateToolsCost() {
    const totalProjectHours = calculateTotalHours();
    const monthlyHours = state.dailyHours * state.weeklyDays * 4.33;

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
function updateHourlyRate() {
    const rate = calculateHourlyRate();
    elements.hourlyRate.textContent = formatCurrency(rate).replace('MXN', '').trim();
}

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
    updateHourlyRate();
    updateTasksSummary();
    updateToolsSummary();
    updateFinalSummary();
}

// Gestión de tareas
function addTask() {
    const name = elements.taskName.value.trim();
    const hours = parseFloat(elements.taskHours.value);

    if (!name || !hours || hours <= 0) {
        alert('Por favor, ingresa un nombre de tarea válido y horas mayores a 0');
        return;
    }

    const task = {
        id: Date.now(),
        name,
        hours
    };

    state.tasks.push(task);
    renderTask(task);
    updateAllSummaries();

    // Limpiar inputs
    elements.taskName.value = '';
    elements.taskHours.value = '';
    elements.taskName.focus();
}

function removeTask(taskId) {
    state.tasks = state.tasks.filter(task => task.id !== taskId);
    renderTasks();
    updateAllSummaries();
}

function renderTask(task) {
    const taskCost = task.hours * state.hourlyRate;

    const taskDiv = document.createElement('div');
    taskDiv.className = 'task-item';
    taskDiv.dataset.taskId = task.id;

    taskDiv.innerHTML = `
        <div class="task-info">
            <div class="task-name">${task.name}</div>
            <div class="task-details">${formatNumber(task.hours)} horas</div>
        </div>
        <div class="task-cost">${formatCurrency(taskCost)}</div>
        <button class="btn-delete" onclick="removeTask(${task.id})">Eliminar</button>
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
    const monthlyHours = state.dailyHours * state.weeklyDays * 4.33;
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

    exportText += 'CONFIGURACIÓN:\n';
    exportText += `- Costo mensual: ${formatCurrency(state.monthlyCost)}\n`;
    exportText += `- Horas diarias: ${state.dailyHours}\n`;
    exportText += `- Días semanales: ${state.weeklyDays}\n`;
    exportText += `- Tarifa por hora: ${formatCurrency(state.hourlyRate)}\n\n`;

    exportText += '─────────────────────────────────────────────\n';
    exportText += 'SCOPE OF WORK (SOW):\n';
    exportText += '─────────────────────────────────────────────\n';

    if (state.tasks.length === 0) {
        exportText += 'No hay tareas agregadas\n\n';
    } else {
        state.tasks.forEach((task, index) => {
            const taskCost = task.hours * state.hourlyRate;
            exportText += `${index + 1}. ${task.name}\n`;
            exportText += `   Horas: ${formatNumber(task.hours)} | Costo: ${formatCurrency(taskCost)}\n\n`;
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
        const monthlyHours = state.dailyHours * state.weeklyDays * 4.33;
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

    state.tasks = [];
    state.tools = [];

    renderTasks();
    renderTools();
    updateAllSummaries();

    alert('Se ha limpiado toda la información del cotizador.');
}

// Event Listeners
elements.monthlyCost.addEventListener('input', (e) => {
    state.monthlyCost = parseFloat(e.target.value) || 0;
    updateAllSummaries();
});

elements.dailyHours.addEventListener('input', (e) => {
    state.dailyHours = parseFloat(e.target.value) || 0;
    updateAllSummaries();
});

elements.weeklyDays.addEventListener('input', (e) => {
    state.weeklyDays = parseFloat(e.target.value) || 0;
    updateAllSummaries();
});

elements.addTask.addEventListener('click', addTask);

elements.taskName.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        elements.taskHours.focus();
    }
});

elements.taskHours.addEventListener('keypress', (e) => {
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
