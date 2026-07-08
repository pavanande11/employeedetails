export function calculateExperience(dateValue) {
  if (!dateValue) {
    return "";
  }

  const joiningDate = new Date(`${dateValue}T00:00:00`);
  const today = new Date();

  if (Number.isNaN(joiningDate.getTime()) || joiningDate > today) {
    return "";
  }

  let years = today.getFullYear() - joiningDate.getFullYear();
  let months = today.getMonth() - joiningDate.getMonth();

  if (today.getDate() < joiningDate.getDate()) {
    months -= 1;
  }

  if (months < 0) {
    years -= 1;
    months += 12;
  }

  const yearText = years === 1 ? "1 year" : `${years} years`;
  const monthText = months === 1 ? "1 month" : `${months} months`;

  return `${years}.${months} - ${yearText} ${monthText}`;
}
