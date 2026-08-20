"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { Cita } from "@/types";

export default function Page() {
  const [ingresoDiario, setIngresoDiario] = useState(0);
  const [ingresoSemanal, setIngresoSemanal] = useState(0);
  const [ingresoMensual, setIngresoMensual] = useState(0);
  const [citas, setCitas] = useState<Cita[]>([]);

  async function cargarIngresos() {
    // Manejo más robusto de RPCs: comprobamos errores y extraemos un número cuando sea posible
    const { data: diario, error: errDiario } = await supabase.rpc("ingreso_diario");
    const { data: semanal, error: errSemanal } = await supabase.rpc("ingreso_semanal");
    const { data: mensual, error: errMensual } = await supabase.rpc("ingreso_mensual");

    if (errDiario) console.error("RPC ingreso_diario error:", errDiario);
    if (errSemanal) console.error("RPC ingreso_semanal error:", errSemanal);
    if (errMensual) console.error("RPC ingreso_mensual error:", errMensual);

    const extractNumber = (val: any) => {
      if (val == null) return 0;
      if (typeof val === "number") return val;
      if (Array.isArray(val)) {
        const first = val[0];
        if (typeof first === "number") return first;
        if (first && typeof first === "object") {
          return Number(first.ingreso ?? first.value ?? Object.values(first)[0]) || 0;
        }
      }
      if (typeof val === "string") return Number(val) || 0;
      if (typeof val === "object") return Number(val.ingreso ?? val.value) || 0;
      return 0;
    };

    setIngresoDiario(extractNumber(diario));
    setIngresoSemanal(extractNumber(semanal));
    setIngresoMensual(extractNumber(mensual));
  }

  async function cargarCitas() {
    const { data, error } = await supabase
      .from("citas")
      .select(
        `
        id,
        barberia_id,
        servicio_id,
        cliente_nombre,
        cliente_telefono,
        fecha_hora,
        metodo_pago,
        comprobante_url,
        estado,
        servicios (
          nombre,
          precio
        )
      `
      )
      .order("fecha_hora", { ascending: false });

    if (error) {
      console.error("Error cargando citas:", error);
      return;
    }

    if (data) {
      setCitas(data as Cita[]);
    }
  }

  async function cancelarCita(id: string, telefono: string) {
    const { error } = await supabase.from("citas").update({ estado: "CANCELADA" }).eq("id", id);
    if (error) {
      console.error("Error cancelando cita:", error);
      alert("No se pudo cancelar la cita.");
      return;
    }
    alert(`Cita cancelada. WhatsApp: ${telefono}`);
    await cargarCitas(); // esperar a recargar
  }

  useEffect(() => {
    cargarIngresos();
    cargarCitas();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white p-4 space-y-6">
      <h1 className="text-xl font-bold text-[#D4AF37] uppercase">
        Panel de Administración
      </h1>

      {/* Resumen de ingresos */}
      <div className="grid grid-cols-3 gap-3">
        <div className="p-3 bg-[#1e1e1e] border border-[#2a2a2a] rounded-lg text-center">
          <p className="text-[10px] text-gray-400 uppercase">Hoy</p>
          <p className="text-lg font-bold text-[#D4AF37]">${ingresoDiario}</p>
        </div>

        <div className="p-3 bg-[#1e1e1e] border border-[#2a2a2a] rounded-lg text-center">
          <p className="text-[10px] text-gray-400 uppercase">Esta Semana</p>
          <p className="text-lg font-bold text-[#D4AF37]">${ingresoSemanal}</p>
        </div>

        <div className="p-3 bg-[#1e1e1e] border border-[#2a2a2a] rounded-lg text-center">
          <p className="text-[10px] text-gray-400 uppercase">Este Mes</p>
          <p className="text-lg font-bold text-[#D4AF37]">${ingresoMensual}</p>
        </div>
      </div>

      {/* Lista de Citas */}
      <h2 className="text-sm font-semibold text-gray-300 uppercase mb-3">
        Gestión de Citas
      </h2>

      <div className="space-y-3">
        {citas.map((cita: any) => (
          <div
            key={cita.id}
            className={`p-4 rounded-lg border ${
              cita.estado === "CANCELADA"
                ? "border-red-900 bg-red-950/20 opacity-60"
                : "border-[#2a2a2a] bg-[#1e1e1e]"
            }`}
          >
            <div className="flex justify-between items-start mb-2">
              <div>
                <p className="font-bold text-[#D4AF37]">{cita.cliente_nombre}</p>
                <p className="text-xs text-gray-400">📱 {cita.cliente_telefono}</p>
              </div>

              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                  cita.estado === "CANCELADA"
                    ? "bg-red-900 text-red-200"
                    : "bg-green-900 text-green-200"
                }`}
              >
                {cita.estado}
              </span>
            </div>

            <div className="text-xs text-gray-300 space-y-1 mb-3">
              <p>
                ✂️ <strong>Servicio:</strong> {cita.servicios?.nombre} ($
                {cita.servicios?.precio})
              </p>
              <p>
                📅 <strong>Fecha:</strong>{" "}
                {new Date(cita.fecha_hora).toLocaleString()}
              </p>
              <p>
                💳 <strong>Pago:</strong> {cita.metodo_pago}
              </p>
            </div>

            {cita.estado !== "CANCELADA" && (
              <button
                onClick={() =>
                  cancelarCita(cita.id as string, cita.cliente_telefono as string)
                }
                className="w-full py-2 bg-red-900/50 border border-red-700 text-red-200 text-xs font-bold rounded hover:bg-red-900 transition-colors"
              >
                Cancelar Cita y Notificar por WhatsApp
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
