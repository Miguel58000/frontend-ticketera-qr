"use client"

import { useEffect, useState } from "react"
import {
  Box,
  Button,
  Card,
  Grid,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  CircularProgress,
} from "@mui/material"
import DeleteIcon from "@mui/icons-material/Delete"
import EditIcon from "@mui/icons-material/Edit"
import PersonAddIcon from "@mui/icons-material/PersonAdd"
import GroupIcon from "@mui/icons-material/Group"
import { useRouter } from "next/router"

interface Cliente {
  idCliente: number
  nombre: string
  apellido: string
  tipoDoc: string
  nroDoc: string
  fechaNacimiento: string
  mail: string
  contraseña: string
}

type ClienteFormData = Omit<Cliente, "idCliente">

const tiposDocumento = ["DNI", "Pasaporte", "Cédula"] as const

const DEFAULT_FORM_DATA: ClienteFormData = {
  nombre: "",
  apellido: "",
  tipoDoc: "DNI",
  nroDoc: "",
  fechaNacimiento: "",
  mail: "",
  contraseña: "",
}

export default function Clientes(): JSX.Element {
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [clienteForm, setClienteForm] = useState<ClienteFormData>(DEFAULT_FORM_DATA)
  const [editId, setEditId] = useState<number | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const router = useRouter()

  useEffect(() => {
    fetchClientes()
  }, [])

  async function fetchClientes() {
    try {
      setLoading(true)
      const res = await fetch("/api/clientes")
      if (!res.ok) throw new Error("Error al cargar clientes")
      const data = await res.json()
      setClientes(data)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    try {
      setLoading(true)
      const method = editId ? "PUT" : "POST"
      const url = editId ? `/api/clientes/${editId}` : "/api/clientes"

      const body = editId ? clienteForm : { ...clienteForm }

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })

      if (!res.ok) throw new Error("Error al guardar cliente")
      resetForm()
      fetchClientes()
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(idCliente: number) {
    try {
      setLoading(true)
      const res = await fetch(`/api/clientes/${idCliente}`, {
        method: "DELETE",
      })
      if (!res.ok) throw new Error("Error al eliminar cliente")
      fetchClientes()
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  function handleInputChange(field: keyof ClienteFormData, value: string) {
    setClienteForm((prev) => ({ ...prev, [field]: value }))
  }

  function handleEdit(cliente: Cliente) {
    setEditId(cliente.idCliente)
    const { idCliente, ...formData } = cliente
    setClienteForm(formData)
  }

  function resetForm() {
    setClienteForm(DEFAULT_FORM_DATA)
    setEditId(null)
  }

  return (
    <Box p={4}>
      <Typography variant="h4" gutterBottom display="flex" alignItems="center" gap={1}>
        <GroupIcon /> Gestión de Clientes
      </Typography>

      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          <Card sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom display="flex" alignItems="center" gap={1}>
              <PersonAddIcon /> {editId ? "Editar Cliente" : "Nuevo Cliente"}
            </Typography>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField label="Nombre" fullWidth required value={clienteForm.nombre} onChange={(e) => handleInputChange("nombre", e.target.value)} />
                </Grid>
                <Grid item xs={6}>
                  <TextField label="Apellido" fullWidth required value={clienteForm.apellido} onChange={(e) => handleInputChange("apellido", e.target.value)} />
                </Grid>
                <Grid item xs={6}>
                  <Select fullWidth value={clienteForm.tipoDoc} onChange={(e) => handleInputChange("tipoDoc", e.target.value)}>
                    {tiposDocumento.map((tipo) => (
                      <MenuItem key={tipo} value={tipo}>
                        {tipo}
                      </MenuItem>
                    ))}
                  </Select>
                </Grid>
                <Grid item xs={6}>
                  <TextField label="Número de Documento" fullWidth required value={clienteForm.nroDoc} onChange={(e) => handleInputChange("nroDoc", e.target.value)} />
                </Grid>
                <Grid item xs={12}>
                  <TextField label="Correo Electrónico" type="email" fullWidth required value={clienteForm.mail} onChange={(e) => handleInputChange("mail", e.target.value)} />
                </Grid>
                <Grid item xs={12}>
                  <TextField label="Contraseña" type="password" fullWidth required={!editId} value={clienteForm.contraseña} onChange={(e) => handleInputChange("contraseña", e.target.value)} />
                </Grid>
              </Grid>
              <Box mt={2} display="flex" gap={1}>
                <Button type="submit" variant="contained" color="primary" fullWidth disabled={loading}>
                  {editId ? "Actualizar" : "Agregar"}
                </Button>
                {editId && (
                  <Button variant="outlined" onClick={resetForm} fullWidth>
                    Cancelar
                  </Button>
                )}
              </Box>
            </form>
          </Card>
        </Grid>
        <Grid item xs={12} md={8}>
          <TableContainer component={Card} sx={{ p: 2 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Nombre</TableCell>
                  <TableCell>Documento</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={4} align="center">
                      <CircularProgress />
                    </TableCell>
                  </TableRow>
                ) : (
                  clientes.map((cliente) => (
                    <TableRow key={cliente.idCliente}>
                      <TableCell>{cliente.nombre} {cliente.apellido}</TableCell>
                      <TableCell>{cliente.tipoDoc} {cliente.nroDoc}</TableCell>
                      <TableCell>{cliente.mail}</TableCell>
                      <TableCell>
                        <Button onClick={() => handleEdit(cliente)}><EditIcon /></Button>
                        <Button color="error" onClick={() => handleDelete(cliente.idCliente)}><DeleteIcon /></Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    </Box>
  )
}
