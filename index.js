const express = require('express');
const client = require('./db'); 
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.post('/api/guardarPersona', async (req, res) => {
    const { nombre, apellido1, apellido2, dni } = req.body;
    const query = 'INSERT INTO persona (nombre, apellido1, apellido2, dni) VALUES ($1, $2, $3, $4)';

    try {
        await client.query(query, [nombre, apellido1, apellido2, dni]);
        res.status(201).json({ 
            message: "Usuario creado exitosamente", 
            nombre, apellido1, apellido2, dni 
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error creando el usuario',
            error: error.message
        });
    }
});

app.post('/api/guardarCoche', async (req, res) => {
    const { matricula, marca, modelo, caballos, persona_id } = req.body;
    const query = 'INSERT INTO coche (matricula, marca, modelo, caballos, persona_id) VALUES ($1, $2, $3, $4, $5)';

    try {
        await client.query(query, [matricula, marca, modelo, caballos, persona_id]);
        res.status(201).json({ 
            message: "Coche creado exitosamente", 
            matricula, marca, modelo, caballos, persona_id 
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error creando el coche',
            error: error.message
        });
    }
});

app.get('/api/obtenerPersona', async (req, res) => {
    const query = 'SELECT * FROM persona';

    try {
        const result = await client.query(query);
        res.status(200).json({
            success: true,
            message: "Datos de la tabla persona",
            data: result.rows
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error al recuperar datos de persona",
            details: error.message
        });
    }
});


app.get('/api/obtenerCoche', async (req, res) => {
    const query = 'SELECT * FROM coche';

    try {
        const result = await client.query(query);
        res.status(200).json({
            success: true,
            message: "Datos de la tabla coche",
            data: result.rows
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error al recuperar datos de coche",
            details: error.message
        });
    }
});


app.get('/api/personaCoches', async (req, res) => {
    const query = `
        SELECT 
            persona.id,
            persona.Nombre,
            persona.Apellido1,
            persona.Apellido2,
            persona.DNI,
            coche.Matricula,
            coche.Marca,
            coche.Modelo,
            coche.Caballos
        FROM persona
        LEFT JOIN coche ON persona.id = coche.Persona_id
        ORDER BY persona.id;
    `;

    try {
        const result = await client.query(query);
        res.status(200).json({
            success: true,
            message: "Lista de personas con sus coches",
            data: result.rows
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error al recuperar la relación persona-coche",
            details: error.message
        });
    }
});




app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
