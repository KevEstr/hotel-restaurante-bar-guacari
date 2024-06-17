// FormattedDate.js
import React from 'react';

// Componente para formatear solo la fecha
export const FormattedDate = ({ dateString }) => {
  const date = new Date(dateString);

  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Los meses empiezan en 0
  const year = date.getFullYear();

  const formattedDate = `${day}/${month}/${year}`;

  return <span>{formattedDate}</span>;
};

// Componente para formatear solo la hora
export const FormattedTime = ({ dateString }) => {
  const date = new Date(dateString);

  const timeOptions = {
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    timeZone: 'America/Bogota'
  };

  const formattedTime = new Intl.DateTimeFormat('es-CO', timeOptions).format(date);

  return <span>{formattedTime}</span>;
};
