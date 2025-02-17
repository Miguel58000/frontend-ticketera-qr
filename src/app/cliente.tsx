import prisma from "@/prisma/prismaClient";
import { NextResponse } from "next/server";
import "../estilosCrudClientes.css";


interface Cliente {
  idCliente: number;
  nombre: string;
  apellido: string;
  nroDoc: string;
  fechaNacimiento: Date;
  mail: string;
  contrasena: string;
}

export async function GET(): Promise<NextResponse> {
  try {
    const clientes: Cliente[] = await prisma.cliente.findMany();
    return NextResponse.json(clientes);
  } catch (error: unknown) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Error al obtener clientes" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request): Promise<NextResponse> {
  try {
    const body: Omit<Cliente, "idCliente"> = await req.json();
    const nuevoCliente: Cliente = await prisma.cliente.create({ data: body });
    return NextResponse.json(nuevoCliente, { status: 201 });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Error al crear cliente" },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request): Promise<NextResponse> {
  try {
    const body: Partial<Cliente> = await req.json();
    const { idCliente, ...data } = body;
    if (!idCliente) {
      return NextResponse.json({ error: "ID es requerido" }, { status: 400 });
    }
    const clienteActualizado: Cliente = await prisma.cliente.update({
      where: { idCliente },
      data,
    });
    return NextResponse.json(clienteActualizado);
  } catch (error: unknown) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Error al actualizar cliente" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request): Promise<NextResponse> {
  try {
    const { idCliente }: { idCliente: number } = await req.json();
    if (!idCliente) {
      return NextResponse.json({ error: "ID es requerido" }, { status: 400 });
    }
    await prisma.cliente.delete({ where: { idCliente } });
    return NextResponse.json({ message: "Cliente eliminado correctamente" });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Error al eliminar cliente" },
      { status: 500 }
    );
  }
}
