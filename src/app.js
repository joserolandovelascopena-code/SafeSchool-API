import express from "express";
import cors from "cors";
import pool from "./config/database.js";
import authRoutes from "./routes/auth.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    mensaje: "SafeSchool API funcionando",
  });
});

app.get("/api/test-db", async (req, res) => {
  try {
    const resultado = await pool.query(`
            SELECT 
                current_database() AS base_datos,
                current_user AS usuario,
                version() AS version;
        `);

    res.json({
      conexion: true,
      baseDatos: resultado.rows[0],
    });
  } catch (error) {
    console.error("Error de conexión:", error);

    res.status(500).json({
      conexion: false,
      mensaje: "No se pudo conectar con PostgreSQL",
    });
  }
});

app.use("/api/auth", authRoutes);

export default app;
