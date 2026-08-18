
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
      <h2 className="text-sm font-semibold text-gray-300 uppercase mb-3">Gestión de Citas</h2>
      <div className="space-y-3">
        {citas.map((cita) => (
          <div
            key={cita.id}
            className={`p-4 rounded-lg border ${
              cita.estado === 'CANCELADA'
                ? 'border-red-900 bg-red-950/20 opacity-60'
                : 'border-[#2a2a2a] bg-[#1e1e1e]'
            }`}
          >
            <div className="flex justify-between items-start mb-2">
              <div>
                <p className="font-bold text-[#D4AF37]">{cita.cliente_nombre}</p>
                <p className="text-xs text-gray-400">📱 {cita.cliente_telefono}</p>
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                cita.estado === 'CANCELADA' ? 'bg-red-900 text-red-200' : 'bg-green-900 text-green-200'
              }`}>
                {cita.estado}
              </span>
            </div>

            <div className="text-xs text-gray-300 space-y-1 mb-3">
              <p>✂️ <strong>Servicio:</strong> {cita.servicios?.nombre} (${cita.servicios?.precio})</p>
              <p>📅 <strong>Fecha:</strong> {new Date(cita.fecha_hora).toLocaleString()}</p>
              <p>💳 <strong>Pago:</strong> {cita.metodo_pago}</p>
            </div>

            {cita.estado !== 'CANCELADA' && (
              <button
                onClick={() => cancelarCita(cita.id, cita.cliente_telefono)}
                className="w-full py-2 bg-red-900/50 border border-red-700 text-red-200 text-xs font-bold rounded hover:bg-red-900 transition-colors"
              >
                Cancelar Cita y Notificar por WhatsApp
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
