const firebaseRef = firebase.database();
let counter = 0;

document.querySelector("button.submitButton").addEventListener("click", function () {
    let counterName = document.getElementById("counter-name").value;
    let counterNumber = document.getElementById("counter-number").value;
    let prefix = document.getElementById("prefix").value;
    let key = document.getElementById("secret-key").value;
    let form = document.querySelector("form");

    document.querySelector("h3.fail-message").style.display = "none";
    document.querySelector("h3.secret-key-invalid").style.display = "none";

    if (counterName === "" || counterNumber === "" || prefix === "" || key === "") {
        document.querySelector("h3.fail-message").style.display = "block";
    } else {
        firebaseRef.ref().once("value", async function (snapshot) {
            if (snapshot.toJSON() !== null && snapshot.toJSON().counters) {
                let counters = await snapshot.toJSON().counters;
                let counterDetails = Object.keys(counters);
                let secretKey = await snapshot.toJSON().secretKey;
                if (!(key === secretKey)) {
                    document.querySelector("h3.secret-key-invalid").style.display = "block";
                    document.querySelector("h3.fail-message").style.display = "none";
                    return;
                }

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

            counter = 0;

            document.querySelector("h3.success-message").style.display = "block";
            form.reset();
            setTimeout(() => {
                document.querySelector("h3.success-message").style.display = "none";
            }, 3000);
        });
    }
});
