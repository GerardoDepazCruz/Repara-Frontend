import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// 🔥 Agregamos "nombreTecnicoReal" como parámetro
export const generarCertificadoPdf = (solicitud, certificado, usuarioLogueado, nombreTecnicoReal) => {
  const doc = new jsPDF();
  const fechaActual = new Date().toLocaleDateString('es-PE');

  // 1. Cabecera Azul
  doc.setFillColor(37, 99, 235);
  doc.rect(0, 0, 210, 40, 'F');

  // 2. Título y Logo
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('RePara', 14, 25);
  
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text('Servicios Técnicos a Domicilio', 14, 32);

  // 3. Título del Documento
  doc.setTextColor(50, 50, 50);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('CERTIFICADO DE GARANTÍA', 105, 55, { align: 'center' });

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Código de Certificado: ${certificado.codigoCertificado}`, 105, 63, { align: 'center' });
  doc.text(`Fecha de Emisión: ${fechaActual}`, 105, 68, { align: 'center' });
  doc.text(`Válido hasta: ${certificado.fechaExpiracion}`, 105, 73, { align: 'center' });

  const nombreCliente = usuarioLogueado?.nombres 
      ? `${usuarioLogueado.nombres} ${usuarioLogueado.apellidos}`
      : 'Cliente RePara';

  // 🔥 Usamos el nombre real que nos pasen, si no viene, usamos el genérico
  const nombreTecnico = nombreTecnicoReal || 'Técnico RePara';

  // 4. Tabla de Datos del Servicio
  autoTable(doc, {
    startY: 85,
    head: [['Detalle del Servicio', 'Información']],
    body: [
      ['Cliente', nombreCliente],
      ['Técnico Asignado', nombreTecnico],
      ['Electrodoméstico', solicitud.categoria?.nombre || 'Reparación General'],
      ['Descripción del Problema', solicitud.descripcionProblema],
      ['Dirección del Servicio', solicitud.direccionServicio],
      ['Monto Total Pagado', `S/ ${solicitud.costoFinal || solicitud.montoFinal || '0.00'}`],
    ],
    theme: 'grid',
    headStyles: { fillColor: [37, 99, 235], halign: 'center' },
    styles: { fontSize: 10, cellPadding: 5 },
    columnStyles: { 0: { fontStyle: 'bold', cellWidth: 50 } }
  });

  // 5. Pie de Página (Términos)
  const finalY = doc.lastAutoTable.finalY || 150;
  doc.setFontSize(9);
  doc.setTextColor(100, 100, 100);
  doc.text('Términos y Condiciones de la Garantía:', 14, finalY + 15);
  doc.text('1. Esta garantía cubre exclusivamente la mano de obra y los repuestos detallados en el informe.', 14, finalY + 20);
  doc.text('2. No cubre daños por mal uso, sobrecargas eléctricas o intervención de terceros.', 14, finalY + 25);
  doc.text('3. Presente este certificado digital para hacer efectiva la garantía dentro del plazo establecido.', 14, finalY + 30);

  // 6. Firma
  doc.setTextColor(50, 50, 50);
  doc.text('_____________________________', 105, finalY + 55, { align: 'center' });
  doc.text('RePara S.A.C.', 105, finalY + 62, { align: 'center' });
  doc.text('Departamento Técnico', 105, finalY + 67, { align: 'center' });

  // Guardar el archivo
  doc.save(`Garantia_RePara_${certificado.codigoCertificado}.pdf`);
};