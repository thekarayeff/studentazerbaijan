document.addEventListener("DOMContentLoaded", () => {
  const totalInput = document.getElementById("totalAmount");
  const failedCreditsInput = document.getElementById("failedCredits");
  const calcBtn = document.getElementById("kesrCalcBtn");
  const resultBox = document.getElementById("kesrResult");
  const formulaText = document.getElementById("formulaText");

  if (!totalInput || !failedCreditsInput || !calcBtn || !resultBox) return;

  const TOTAL_CREDITS = 60;
  const SERVICE_FEE = 1;

  const formatAzn = (value) =>
    new Intl.NumberFormat("az-AZ", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);

  const calculate = () => {
    const total = parseFloat(totalInput.value);
    const failedCredits = parseFloat(failedCreditsInput.value);

    if (
      Number.isNaN(total) ||
      Number.isNaN(failedCredits) ||
      total < 0 ||
      failedCredits < 0
    ) {
      resultBox.innerHTML = "<p>Zəhmət olmasa düzgün rəqəmlər daxil edin.</p>";
      return;
    }

    const paid = ((total / TOTAL_CREDITS) * failedCredits) / 4 + SERVICE_FEE;
    resultBox.innerHTML = `
      <p>Ödəniləcək məbləğ: <strong>${formatAzn(paid)} ₼</strong></p>
    `;
    if (formulaText) {
      formulaText.innerHTML = `Düstur: ((${formatAzn(total)} / ${TOTAL_CREDITS}) × ${failedCredits}) / 4 + ${formatAzn(SERVICE_FEE)} = <strong>${formatAzn(paid)} AZN</strong>`;
    }
  };

  calcBtn.addEventListener("click", calculate);
  totalInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") calculate();
  });
  failedCreditsInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") calculate();
  });
});
