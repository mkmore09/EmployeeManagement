const formatDate = (date) => {
  if (!date || typeof date === "object") return "-";
  return new Date(date).toLocaleDateString();
};

export default formatDate;