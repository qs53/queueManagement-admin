const firebaseRef = firebase.database();
let counter = 0;

document.querySelector("button.submitButton").addEventListener("click", function () {
    let counterName = document.getElementById("counter-name").value;
    let counterNumber = document.getElementById("counter-number").value;
    let prefix = document.getElementById("prefix").value;

    if (counterName === "" || counterNumber === "" || prefix === "") {
        document.querySelector("h3.fail-message").style.display = "block";
    } else {
        firebaseRef.ref().once("value", function (snapshot) {
            if (snapshot.toJSON() !== null) {
                counters = snapshot.toJSON().counters;
                counterDetails = Object.keys(counters);
                for (var j = 0; j < counterDetails.length; j++) {
                    let existingCounter = Number(counterDetails[j].slice(7, counterDetails[j].length));
                    if (existingCounter > counter) {
                        counter = existingCounter;
                    }
                }
            }

            counter++;

            firebaseRef.ref("counters/counter" + counter).set({
                name: counterName,
                number: counterNumber,
                prefix: prefix,
            });
        });

        counter = 0;
        document.querySelector("h3.success-message").style.display = "block";
        setTimeout(() => document.querySelector("h3.success-message").style.display = "none", 4000);
    }
});
