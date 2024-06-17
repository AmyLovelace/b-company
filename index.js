let emailsRegistrados = [];

document.addEventListener('DOMContentLoaded', function () {
    const form = document.querySelector('form');
    form.addEventListener('submit', function (event) {
        event.preventDefault();
        validarYEnviarFormulario(form);
    });
});

function mostrarAlerta(tipo, mensaje) {
    const contenedorAlertas = document.getElementById('alertas');
    contenedorAlertas.innerHTML = `<div class="alert alert-${tipo} alert-dismissible fade show" role="alert">
                                    ${mensaje}
                                    <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                                        <span aria-hidden="true">&times;</span>
                                    </button>
                                  </div>`;
    contenedorAlertas.style.display = 'block';
}

function limpiarAlertas() {
    const contenedorAlertas = document.getElementById('alertas');
    contenedorAlertas.innerHTML = '';  
    contenedorAlertas.style.display = 'none'; 
}

function validarYEnviarFormulario(form) {
    limpiarAlertas();

    const nombre = document.getElementById('nombre').value;
    const apellido = document.getElementById('apellido').value;
    const email = document.getElementById('email').value;
    const cargo = document.getElementById('cargo').value;
    const fechaIngreso = new Date(document.getElementById('fecha-ingreso').value);
    const fechaNacimiento = new Date(document.getElementById('fecha-nacimiento').value);
    let valid = true;
    let mensajeError = '';

    document.querySelectorAll('input').forEach(function (element) {
        if (!element.value.trim()) {
            valid = false;
            mensajeError += 'Por favor completa el campo ' + element.name + '.<br>';
            element.classList.add('is-invalid');
        } else {
            element.classList.remove('is-invalid');
        }
    });

    if (emailsRegistrados.includes(email)) {
        valid = false;
        mensajeError += 'El email ya está registrado.<br>';
        document.getElementById('email').classList.add('is-invalid');
    }

    const edadMinimaIngreso = new Date(fechaNacimiento.setFullYear(fechaNacimiento.getFullYear() + 18));
    if (fechaIngreso < edadMinimaIngreso) {
        valid = false;
        mensajeError += 'La fecha de ingreso no puede ser menor a 18 años después de la fecha de nacimiento.<br>';
        document.getElementById('fecha-ingreso').classList.add('is-invalid');
    }

    if (!valid) {
        mostrarAlerta('danger', 'Error: ' + mensajeError);
    } else {
        document.getElementById('userDataConfirmation').innerHTML = `
            <li>Nombre y Apellido: ${nombre} ${apellido}</li>
            <li>Email: ${email}</li>
            <li>Cargo: ${cargo}</li>
            <li>Fecha de Ingreso: ${fechaIngreso.toISOString().slice(0, 10)}</li>
        `;
        $('#confirmModal').modal('show');
    }
}


document.getElementById('confirmAddUser').addEventListener('click', function() {
    agregarUsuario();
});

function agregarUsuario() {
    const nombre = document.getElementById('nombre').value;
    const apellido = document.getElementById('apellido').value;
    const email = document.getElementById('email').value;
    const cargo = document.getElementById('cargo').value;
    const fechaIngreso = document.getElementById('fecha-ingreso').value;

    const userCard = `
        <div class="col-md-4 col-lg-3 col-xl-3 mb-4">
            <div class="card">
                <div class="card-body">
                    <p><strong>Nombre:</strong></p>
                    <h5 class="card-title">${nombre} ${apellido}</h5>
                    <p><strong>Email:</strong></p>
                    <p class="card-text email">${email}</p>
                    <p><strong>Cargo:</strong></p>
                    <p class="card-text">${cargo}</p>
                    <p><strong>Fecha de Ingreso:</strong></p>
                    <p class="card-text">${fechaIngreso}</p>
                </div>
                <div class="card-footer">
                    <button type="button" class="btn btn-danger btn-block" onclick="eliminarUsuario(this)">Eliminar</button>
                </div>
            </div>
        </div>
    `;

    const grid = document.getElementById('user-grid');
    grid.innerHTML += userCard;
    emailsRegistrados.push(email);
    $('#confirmModal').modal('hide');
    document.querySelector('form').reset();
}

function eliminarUsuario(button) {
    const card = button.closest('.col-md-4');
    const email = card.querySelector('.card-text').textContent; 
    const emailIndex = emailsRegistrados.indexOf(email);
    if (emailIndex !== -1) {
        emailsRegistrados.splice(emailIndex, 1);
    }
    card.remove();
}

