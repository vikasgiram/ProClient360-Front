// utils.js
export function formatDate(dateString) {
    /**
     * Format a date string from ISO 8601 to DD MMMM YYYY
     */
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'long' });
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  }

  export function formatDateforupdate(dateString) {
    /**
     * Format a date string from ISO 8601 to MM/DD/YYYY
     */
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0'); // Ensure 2 digits for day
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Ensure 2 digits for month
    const year = date.getFullYear();

    // Format the date as MM/DD/YYYY
    return `${year}-${month}-${day}`;
}

// export function formatDateforupdateSubcription(dateString) {
//   /**
//    * Format a date string from ISO 8601 to MM/DD/YYYY
//    */
//   const date = new Date(dateString);
//   const day = String(date.getDate()).padStart(2, '0'); // Ensure 2 digits for day
//   const month = String(date.getMonth() + 1).padStart(2, '0'); // Ensure 2 digits for month
//   const year = date.getFullYear();

//   // Format the date as MM/DD/YYYY
//   return `${month}-${day}-${year}`;
// }

export function formatDateforupdateSubcription(dateString) {
  /**
   * Format a date string from ISO 8601 to MM/DD/YYYY
   */
  const date = new Date(dateString);
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
  const day = String(date.getDate()).padStart(2, '0');
  const year = date.getFullYear();
  // return `${month}-${day}-${year}`;
  return `${year}-${month}-${day}`;
}

export function formatDateforTaskUpdate(dateString) {
  /**
   * Format a date string from ISO 8601 to HH:MM:SS DD-MM-YY
   * Uses the exact time from the ISO string without timezone conversion
   */
  const date = new Date(dateString);
  
  // Get UTC components (these match the ISO string regardless of local timezone)
  const hours = String(date.getUTCHours()).padStart(2, '0');
  const minutes = String(date.getUTCMinutes()).padStart(2, '0');
  
  // Get local date components (or use UTC if you prefer)
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = String(date.getFullYear()).slice(-2);
  
  return `${hours}:${minutes} ${day}-${month}-${year}`;
}

export function formatDateforEditAction(dateString) {
  /**
   * Format a date string to the `datetime-local` input format: YYYY-MM-DDTHH:MM
   */
  const date = new Date(dateString);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Ensure 2 digits for month
  const day = String(date.getDate()).padStart(2, '0'); // Ensure 2 digits for day
  const hours = String(date.getHours()).padStart(2, '0'); // Ensure 2 digits for hours
  const minutes = String(date.getMinutes()).padStart(2, '0'); // Ensure 2 digits for minutes

  // Format the date as YYYY-MM-DDTHH:MM
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}