/**
 * Utility functions for the Digital OMR app.
 */

const BENGALI_DIGITS = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];

/**
 * Converts standard English numerals to Bengali numerals.
 */
export function convertToBengali(text: string | number): string {
  if (text === undefined || text === null) return '';
  return text.toString().replace(/\d/g, (d) => BENGALI_DIGITS[parseInt(d)]);
}
