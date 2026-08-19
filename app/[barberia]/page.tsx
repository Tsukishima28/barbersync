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
              onClick={() => setMetodoPago('PRESENCIAL')}
              className={`p-3 text-xs font-bold rounded-lg border ${
                metodoPago === 'PRESENCIAL'
                  ? 'border-[#D4AF37] bg-[#2a2421] text-[#D4AF37]'
                  : 'border-[#2a2a2a] bg-[#1e1e1e] text-gray-400'
              }`}
            >
              Pagar en Local
            </button>
            <button
              type="button"
              onClick={() => setMetodoPago('TRANSFERENCIA')}
              className={`p-3 text-xs font-bold rounded-lg border ${
                metodoPago === 'TRANSFERENCIA'
                  ? 'border-[#D4AF37] bg-[#2a2421] text-[#D4AF37]'
                  : 'border-[#2a2a2a] bg-[#1e1e1e] text-gray-400'
              }`}
            >
              Transferencia
            </button>
          </div>
        </div>

        {/* Subir comprobante si eligió transferencia */}
        {metodoPago === 'TRANSFERENCIA' && (
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

        {/* Botón de Confirmar */}
        <button
          type="submit"
          disabled={cargando}
          className="w-full py-4 bg-[#D4AF37] text-black font-bold uppercase rounded-lg shadow-lg hover:bg-[#b5932a] transition-all">
          {cargando ? 'Procesando...' : 'Confirmar Cita por WhatsApp'}
        </button>
      </form>
    </div>
  );
}
