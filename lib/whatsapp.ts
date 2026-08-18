// Genera el enlace que abre WhatsApp directamente con el mensaje listo para enviar
export function generarLinkWhatsApp(telefono: string, mensaje: string) {
  const numLimpio = telefono.replace(/[^0-9]/g, '');
  const textoCodificado = encodeURIComponent(mensaje);
  return `https://wa.me/${numLimpio}?text=${textoCodificado}`;
}
