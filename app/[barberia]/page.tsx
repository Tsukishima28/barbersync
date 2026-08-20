"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { generarLinkWhatsApp } from "@/lib/whatsapp";
import type { Servicio } from "@/types";

interface PageProps {
  params: {
    barberia: string;
  };
}

export default function Page({ params }: PageProps) {
  const barberiaId = params.barberia;

  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [servicioSeleccionado, setServicioSeleccionado] = useState<string>("");
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [fechaHora, setFechaHora] = useState("");
  const [metodoPago, setMetodoPago] = useState<"PRESENCIAL" | "TRANSFERENCIA">(
    "PRESENCIAL"
  );
  const [comprobante, setComprobante] = useState<File | null>(null);
  const [cargando, setCargando] = useState(false);

  // Cargar servicios al montar
  async function cargarServicios() {
    const { data, error } = await supabase
      .from("servicios")
      .select("*")
      .eq("barberia_id", barberiaId);

    if (error) {
      console.error("Error cargando servicios:", error);
      return;
    }

    if (data) {
      setServicios(data as Servicio[]);
    }
  }

  useEffect(() => {
    cargarServicios();
  }, [barberiaId]);

  async function manejarSubmit(e: React.FormEvent) {
    e.preventDefault();
    setCargando(true);

    let comprobanteUrl: string | undefined = undefined;

    if (metodoPago === "TRANSFERENCIA" && comprobante) {
      const nombreArchivo = `${barberiaId}-${Date.now()}-${comprobante.name}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("comprobantes")
        .upload(nombreArchivo, comprobante);

      if (uploadError) {
        console.error("Error subiendo comprobante:", uploadError);
        alert("No se pudo subir el comprobante. Intenta nuevamente.");
        setCargando(false);
        return;
      }

      if (uploadData?.path) {
        const { data: urlData } = supabase.storage
          .from("comprobantes")
          .getPublicUrl(uploadData.path);
        comprobanteUrl = urlData.publicUrl;
      }
    }

    const { data, error } = await supabase
      .from("citas")
      .insert({
        barberia_id: barberiaId,
        servicio_id: servicioSeleccionado,
        cliente_nombre: nombre,
        cliente_telefono: telefono,
        fecha_hora: fechaHora,
        metodo_pago: metodoPago,
        comprobante_url: comprobanteUrl,
        estado: "PENDIENTE",
      })
      .select()
      .single();

    if (!error && data) {
      const mensaje = `Hola, soy ${nombre}. Quiero confirmar mi cita para el servicio ${
        servicios.find((s) => s.id === servicioSeleccionado)?.nombre || ""
      } el día ${new Date(fechaHora).toLocaleString()}.

Método de pago: ${metodoPago}.`;

      const link = generarLinkWhatsApp(telefono, mensaje);
      window.open(link, "_blank");
    } else {
      console.error("Error al crear cita:", error);
      alert("Hubo un error al crear la cita.");
    }

    setCargando(false);
  }

  return (
    <div className="min-h-screen bg-black text-white p-4">
      <h1 className="text-xl font-bold text-[#D4AF37] uppercase mb-4">
        Reserva tu cita
      </h1>

      <form className="space-y-4" onSubmit={manejarSubmit}>
        {/* Datos del Cliente */}
        <div>
          <label className="block text-xs font-semibold text-[#D4AF37] uppercase mb-1">
            2. Tus Datos
          </label>
          <input
            type="text"
            placeholder="Nombre completo"
            required
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="w-full p-3 bg-[#1e1e1e] border border-[#2a2a2a] rounded-lg text-white mb-2 focus:outline-none focus:border-[#D4AF37]"
          />
          <input
            type="tel"
            placeholder="Número de WhatsApp"
            required
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
            className="w-full p-3 bg-[#1e1e1e] border border-[#2a2a2a] rounded-lg text-white focus:outline-none focus:border-[#D4AF37]"
          />
        </div>

        {/* Fecha y Hora */}
        <div>
          <label className="block text-xs font-semibold text-[#D4AF37] uppercase mb-1">
            3. Fecha y Hora
          </label>
          <input
            type="datetime-local"
            required
            value={fechaHora}
            onChange={(e) => setFechaHora(e.target.value)}
            className="w-full p-3 bg-[#1e1e1e] border border-[#2a2a2a] rounded-lg text-white focus:outline-none focus:border-[#D4AF37]"
          />
        </div>

        {/* Método de Pago */}
        <div>
          <label className="block text-xs font-semibold text-[#D4AF37] uppercase mb-2">
            4. Método de Pago
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setMetodoPago("PRESENCIAL")}
              className={`p-3 text-xs font-bold rounded-lg border ${
                metodoPago === "PRESENCIAL"
                  ? "border-[#D4AF37] bg-[#2a2421] text-[#D4AF37]"
                  : "border-[#2a2a2a] bg-[#1e1e1e] text-gray-400"
              }`}
            >
              Pagar en Local
            </button>
            <button
              type="button"
              onClick={() => setMetodoPago("TRANSFERENCIA")}
              className={`p-3 text-xs font-bold rounded-lg border ${
                metodoPago === "TRANSFERENCIA"
                  ? "border-[#D4AF37] bg-[#2a2421] text-[#D4AF37]"
                  : "border-[#2a2a2a] bg-[#1e1e1e] text-gray-400"
              }`}
            >
              Transferencia
            </button>
          </div>
        </div>

        {/* Subir comprobante si eligió transferencia */}
        {metodoPago === "TRANSFERENCIA" && (
          <div className="p-3 bg-[#1e1e1e] border border-[#2a2a2a] rounded-lg">
            <label className="block text-xs text-gray-300 mb-1">
              Adjuntar comprobante de transferencia:
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setComprobante(e.target.files?.[0] || null)}
              className="text-xs text-gray-400 w-full"
            />
          </div>
        )}

        <button
          type="submit"
          disabled={cargando}
          className="w-full py-4 bg-[#D4AF37] text-black font-bold uppercase rounded-lg shadow-lg hover:bg-[#b5932a] transition-all"
        >
          {cargando ? "Procesando..." : "Confirmar Cita por WhatsApp"}
        </button>
      </form>
    </div>
  );
}
