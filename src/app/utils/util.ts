function formatDate(_date: Date | undefined) {
    const date = (_date === undefined) ? new Date() : _date;
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const year = date.getFullYear();
    
    return `${day}-${month}-${year}`;
}

function formatDateToDDMMYYYY(_dateString: string | undefined | Date) {
  const dateString = _dateString ?? '';
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  
  return `${day}-${month}-${year}`;
}

function formatAmPm(_time: string | undefined) {
  const time = _time ?? "05:00:00";
  const [hours, minutes] = time.split(':');
  const h = parseInt(hours);
  const period = h >= 12 ? 'PM' : 'AM';
  const hours12 = h % 12 || 12;
  return `${hours12}:${minutes} ${period}`;
}

function removeZeros(chunk: string | undefined): string {
  if (chunk === undefined)
    return '';
  return chunk.replace(/^0+/, '');
}

function capitalize(word: string | undefined) {
  if (word === undefined)
    return '';
  return (word.charAt(0).toUpperCase() + word.slice(1));
}

export { formatDate, formatDateToDDMMYYYY, formatAmPm, removeZeros, capitalize };