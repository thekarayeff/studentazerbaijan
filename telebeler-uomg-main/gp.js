document.addEventListener("DOMContentLoaded", function () {
    let fennSaySelect = document.getElementById("fennSay");
    let fennlerDiv = document.getElementById("fennler");
    let netice = document.getElementById("netice");

    function fennleriYenile() {
        let fennSay = parseInt(fennSaySelect.value);
        fennlerDiv.innerHTML = "";

        for (let i = 0; i < fennSay; i++) {
            let row = document.createElement("div");
            row.classList.add("fenn_item");

            row.innerHTML = `
                <p class="fenn_label">Fənn ${i + 1}</p>
                <div class="fenn_inputs">
                    <input type="number" class="bal" placeholder="Ümumi bal" min="0" max="100" step="0.01">
                    <input type="number" class="kredit" placeholder="Kredit" min="0" step="0.5">
                </div>
            `;

            fennlerDiv.appendChild(row);
        }

        netice.innerText = "Ortalama: -";
    }

    fennSaySelect.addEventListener("change", fennleriYenile);
    fennleriYenile(); // İlk açılışda mövcud fənn sayına görə input-ları göstərmək üçün

    document.getElementById("hesabla").addEventListener("click", function () {
        let toplamBal = 0;
        let toplamKredit = 0;
        let rows = document.querySelectorAll(".fenn_item");
        let doldurulanSayi = 0;

        rows.forEach(row => {
            let bal = parseFloat(row.querySelector(".bal").value);
            let kredit = parseFloat(row.querySelector(".kredit").value);

            if (!isNaN(bal) && !isNaN(kredit) && bal >= 0 && kredit > 0) {
                toplamBal += bal * kredit;
                toplamKredit += kredit;
                doldurulanSayi++;
            }
        });

        if (toplamKredit > 0 && doldurulanSayi > 0) {
            let ortalama = toplamBal / toplamKredit;
            netice.innerText = "Ortalama: " + ortalama.toFixed(2);
        } else {
            netice.innerText = "Zəhmət olmasa bal və kreditləri düzgün daxil edin.";
        }
    });
});
