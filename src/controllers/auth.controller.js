import bcrypt from "bcryptjs";
import pool from "../config/database.js";

export const registrarUsuario = async (req, res) => {
  try {
    const { nombre, correo, contrasena, id_institucion, rol } = req.body;

    // Validar campos obligatorios
    if (!nombre || !correo || !contrasena || !id_institucion) {
      return res.status(400).json({
        mensaje: "Todos los campos obligatorios deben ser enviados.",
      });
    }

    // Comprobar si el correo ya existe
    const usuarioExistente = await pool.query(
      `SELECT id_usuario
             FROM public.usuarios
             WHERE correo = $1`,
      [correo],
    );

    if (usuarioExistente.rows.length > 0) {
      return res.status(409).json({
        mensaje: "El correo ya está registrado.",
      });
    }

    // Generar hash de contraseña
    const contrasenaHash = await bcrypt.hash(contrasena, 12);

    // Rol predeterminado
    const rolUsuario = rol || "docente";

    // Insertar usuario
    const resultado = await pool.query(
      `INSERT INTO public.usuarios
            (
                id_institucion,
                nombre,
                correo,
                contrasena,
                rol
            )
            VALUES ($1, $2, $3, $4, $5)
            RETURNING
                id_usuario,
                id_institucion,
                nombre,
                correo,
                telefono,
                rol,
                creado`,
      [id_institucion, nombre, correo, contrasenaHash, rolUsuario],
    );

    res.status(201).json({
      mensaje: "Usuario registrado correctamente.",
      usuario: resultado.rows[0],
    });
  } catch (error) {
    console.error("Error al registrar usuario:", error);

    res.status(500).json({
      mensaje: "Error interno del servidor.",
    });
  }
};
