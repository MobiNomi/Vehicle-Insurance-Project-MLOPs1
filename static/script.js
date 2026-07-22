// This script does one job: translate the friendly dropdowns
// (Male/Female, Yes/No, vehicle age brackets) into the exact
// hidden field names/values that FastAPI's DataForm.get_vehicle_data()
// reads with form.get("Gender"), form.get("Driving_License"), etc.

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("assessmentForm");

  // 1) Generic mapped fields: any element with data-target + data-map
  //    e.g. data-target="Gender" data-map="Male:1,Female:0"
  const mappedFields = form.querySelectorAll("[data-target]");

  mappedFields.forEach((el) => {
    const targetName = el.getAttribute("data-target");
    const mapAttr = el.getAttribute("data-map");

    // create a hidden input that will actually be submitted
    const hidden = document.createElement("input");
    hidden.type = "hidden";
    hidden.name = targetName;
    form.appendChild(hidden);

    const syncValue = () => {
      if (mapAttr) {
        const pairs = Object.fromEntries(
          mapAttr.split(",").map((pair) => pair.split(":"))
        );
        hidden.value = pairs[el.value] ?? "";
      } else {
        hidden.value = el.value;
      }
    };

    el.addEventListener("change", syncValue);
    syncValue();

    // the visible control itself should not be submitted directly
    el.removeAttribute("name");
  });

  // 2) Vehicle age: one friendly select drives TWO hidden booleans
  const vehicleAgeSelect = document.getElementById("ui_vehicle_age");
  const hiddenLt1 = document.getElementById("hidden_vehicle_lt1");
  const hiddenGt2 = document.getElementById("hidden_vehicle_gt2");

  const syncVehicleAge = () => {
    hiddenLt1.value = vehicleAgeSelect.value === "lt1" ? "1" : "0";
    hiddenGt2.value = vehicleAgeSelect.value === "gt2" ? "1" : "0";
  };

  vehicleAgeSelect.addEventListener("change", syncVehicleAge);
  syncVehicleAge();

  // 3) Result panel: reflect prediction status already rendered
  //    server-side via data-status on .result-panel. If a real
  //    result is present, update the readout text.
  const resultPanel = document.querySelector(".result-panel");
  const status = resultPanel?.getAttribute("data-status");
  const statusEl = document.getElementById("resultStatus");
  const noteEl = document.getElementById("resultNote");

  if (status === "Response-Yes") {
    statusEl.textContent = "Likely to respond \u2014 Yes";
    noteEl.textContent = "The model predicts this applicant is likely to respond positively to the offer.";
  } else if (status === "Response-No") {
    statusEl.textContent = "Unlikely to respond \u2014 No";
    noteEl.textContent = "The model predicts this applicant is unlikely to respond to the offer.";
  }
});