document.addEventListener('DOMContentLoaded', () => {
    const departamentoSelect = document.getElementById('departamento');
    const municipioSelect = document.getElementById('municipio');
    const registroForm = document.getElementById('registroForm');
    const registrosTableBody = document.getElementById('registrosTableBody');

    let empleados = []; // Array para almacenar los empleados
    let idCounter = 1; // Contador para el ID del empleado

    // Cargar departamentos al iniciar
    fetch('http://localhost:3000/api/departments')
        .then(response => {
            if (!response.ok) {
                throw new Error('Error en la red');
            }
            return response.json();
        })
        .then(data => {
            data.forEach(departamento => {
                const option = document.createElement('option');
                option.value = departamento.code;
                option.textContent = departamento.name;
                departamentoSelect.appendChild(option);
            });
        })
        .catch(error => {
            console.error('Hubo un problema con la solicitud Fetch:', error);
        });

    // Cargar municipios cuando se selecciona un departamento
    departamentoSelect.addEventListener('change', (e) => {
        const departmentCode = e.target.value;
        municipioSelect.innerHTML = '<option value="">Seleccione un municipio</option>'; // Resetear municipios

        if (departmentCode) {
            fetch(`http://localhost:3000/api/towns/${departmentCode}`)
                .then(response => response.json())
                .then(data => {
                    data.forEach(municipio => {
                        const option = document.createElement('option');
                        option.value = municipio.code;
                        option.textContent = municipio.name;
                        municipioSelect.appendChild(option);
                    });
                });
        }
    });

    // Manejar el envío del formulario
    registroForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const nombre = document.getElementById('nombre').value;
        const puesto = document.getElementById('puesto').value;
        const departamentoNombre = departamentoSelect.options[departamentoSelect.selectedIndex].text;
        const municipioNombre = municipioSelect.options[municipioSelect.selectedIndex].text;

        // Crear un objeto empleado
        const empleado = {
            id: idCounter++,
            nombre,
            puesto,
            municipio: municipioNombre,
            departamento: departamentoNombre
        };

        // Agregar el empleado al array
        empleados.push(empleado);

        // Agregar el empleado a la tabla
        const row = document.createElement('tr');
        row.innerHTML = `<td>${empleado.id}</td>
                         <td>${empleado.nombre}</td>
                         <td>${empleado.puesto}</td>
                         <td>${empleado.municipio}</td>
                         <td>${empleado.departamento}</td>`;
        registrosTableBody.appendChild(row);

        // Limpiar el formulario
        registroForm.reset();
        municipioSelect.innerHTML = '<option value="">Seleccione un municipio</option>'; // Resetear municipios
    });
});