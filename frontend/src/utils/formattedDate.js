// FormattedDate.js
import React from 'react';

// Componente para formatear solo la fecha
export const FormattedDate = ({ dateString }) => {
  const date = new Date(dateString);

  const dateOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'America/Bogota'
  };

  const formattedDate = new Intl.DateTimeFormat('es-CO', dateOptions).format(date);

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
