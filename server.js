const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();

// Setters
app.set('PORT', process.env.PORT || 3000); // Si no existe la variable de entorno PORT, toma el valor por defecto 3000

// Usar la carpeta public
app.use(express.static(path.join(__dirname, 'public')));

// Para enviar datos
app.use(express.json()); // Usar datos como JSON

// Cargar datos de departamentos y municipios
const departments = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'departments.json')));
const towns = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'towns.json')));

// Rutas de la API
app.get('/api/departments', (req, res) => {
    res.json(departments);
});

app.get('/api/towns/:departmentCode', (req, res) => {
    const { departmentCode } = req.params;
    const filteredTowns = towns.filter(t => t.department === departmentCode);
    res.json(filteredTowns);
});

// Iniciar el servidor
app.listen(app.get('PORT'), () => {
    console.log(`Server listo en el puerto ${app.get('PORT')}`);
});