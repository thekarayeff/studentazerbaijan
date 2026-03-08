document.addEventListener("DOMContentLoaded", () => {

  const calculate = () => {
    let total = 0;
    const rows = document.querySelectorAll("table tbody tr");
    const title = document.querySelector("#title")?.textContent.toLowerCase() || "";

    rows.forEach((row) => {
      const inputs = row.querySelectorAll("input[type='number']");
      const weight = parseFloat(row.children[1]?.textContent) || 1;
      const subject = row.children[0]?.textContent.toLowerCase() || "";
      let nb = 0;

      // === BURAXILIŞ (11-ci sinif) ===
      if (title.includes("buraxılış")) {
        if (
          subject.includes("tədris dili") ||
          subject.includes("azərbaycan dili") ||
          subject.includes("rus dili")
        ) {
          const qapali = +inputs[0]?.value || 0;
          const aciqYazili = +inputs[1]?.value || 0;
          nb = (5 / 2) * (2 * aciqYazili + qapali);
        } 
        else if (subject.includes("riyaziyyat")) {
          const qapali = +inputs[0]?.value || 0;
          const aciqYazili = +inputs[1]?.value || 0;
          const aciqEnenevi = +inputs[2]?.value || 0;
          nb = (25 / 8) * (2 * aciqYazili + aciqEnenevi + qapali);
        } 
        else if (
          subject.includes("xarici dil") ||
          subject.includes("ingilis") ||
          subject.includes("alman") ||
          subject.includes("fransız") ||
          subject.includes("fransiz") ||
          subject.includes("ərəb") ||
          subject.includes("arab") ||
          subject.includes("fars")
        ) {
          const qapali = +inputs[0]?.value || 0;
          const aciqYazili = +inputs[1]?.value || 0;
          nb = (100 / 37) * (2 * aciqYazili + qapali);
        } 
        else {
          const qapali = +inputs[0]?.value || 0;
          const aciqYazili = +inputs[1]?.value || 0;
          const aciqEnenevi = +inputs[2]?.value || 0;
          nb = qapali + aciqEnenevi + 2 * aciqYazili;
        }
      }

      // === I–IV QRUP (QƏBUL) ===
      else if (
        title.includes("i qrup") ||
        title.includes("ii qrup") ||
        title.includes("iii qrup") ||
        title.includes("iv qrup") ||
        title.includes("qəbul") ||
        title.includes("qebul")
      ) {
        const Dq = +inputs[0]?.value || 0;
        const Yq = +inputs[1]?.value || 0;
        const Dkod = +inputs[2]?.value || 0;
        const Dyazili = +inputs[3]?.value || 0;

        let NBq = (Dq - 0.25 * Yq) * 100 / 33;
        if (NBq < 0) NBq = 0;

        const NBa = (Dkod + 2 * Dyazili) * 100 / 33;

        nb = NBq + NBa;
      }

      const nbWeighted = nb * weight;
      row.querySelector(".nb").textContent = nbWeighted.toFixed(2);
      total += nbWeighted;
    });

    document.querySelector(".total").textContent = `ÜMUMİ BAL: ${total.toFixed(1)}`;
  };

  calculate();

  document.addEventListener("input", (e) => {
    if (e.target && e.target.matches("table input[type='number']")) {
      calculate();
    }
  });

  // === NAVBAR SPAN CLICK ===
  document.querySelectorAll(".navbar span").forEach(span => {
    span.addEventListener("click", () => {
      const title = document.querySelector("#title");
      const text = span.textContent.toLowerCase();

      if (text.includes("buraxılış")) {
        title.textContent = "Buraxılış imtahanı (11-ci sinif)";
      } 
      else if (text.includes("i qrup")) {
        title.textContent = "I ixtisas qrupu (qəbul imtahanı)";
      } 
      else if (text.includes("ii qrup")) {
        title.textContent = "II ixtisas qrupu (qəbul imtahanı)";
      } 
      else if (text.includes("iii qrup")) {
        title.textContent = "III ixtisas qrupu (qəbul imtahanı)";
      } 
      else if (text.includes("iv qrup")) {
        title.textContent = "IV ixtisas qrupu (qəbul imtahanı)";
      }

      // inputları sıfırla
      document.querySelectorAll("table input").forEach(i => i.value = 0);

      // yenidən hesabla
      calculate();
    });
  });

}); 