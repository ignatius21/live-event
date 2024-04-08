import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import  moment from "moment"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


// crear funcion para obtener la hora exsacta de la reunion, formateada para horas y minutos
export function getMeetingTime() {
  const date = new Date()
  const hours = date.getHours()
  const minutes = date.getMinutes().toString().padStart(2, '0')
  const period = hours >= 12 ? 'PM' : 'AM'
  const formattedHours = (hours % 12 || 12).toString().padStart(2, '0')
  return `${formattedHours}:${minutes} ${period}`
}

// crear funcion para obtener la fecha de la reunion, formateando el dia, mes y año
export function getMeetingDate() {
  const date = new Date()
  const day = date.toLocaleString('default', { weekday: 'long' })
  const month = date.toLocaleString('default', { month: 'long' })
  const year = date.getFullYear()
  const dayNumber = date.getDate()
  return `${day}, ${dayNumber} ${month}, ${year}`
}

export function obtenerHora() {
  return moment().subtract(3, 'hours').format('hh:mm A');
}