const firebaseRef = firebase.database();

document.querySelector("button.submitButton").addEventListener("click", function () {
    let counterName = document.getElementById("counter-name").value;
    let counterNumber = document.getElementById("counter-number").value;
    let key = document.getElementById("secret-key").value;
    let form = document.querySelector("form");
    let counterExists = false;
    let counterToDelete = "";

    document.querySelector("h3.fail-message").style.display = "none";
    document.querySelector("h3.secret-key-invalid").style.display = "none";
    document.querySelector("h3.counter-not-exist").style.display = "none";

    if (counterName === "" || counterNumber === "" || key === "") {
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
                    if (counters[counterDetails[j]].name === counterName && counters[counterDetails[j]].number === counterNumber) {
                        counterToDelete = counterDetails[j];
                        counterExists = true;
                    }
                }
            }

            if (counterExists) {
                firebaseRef.ref("counters/" + counterToDelete).remove();
                document.querySelector("h3.success-message").style.display = "block";
                form.reset();
                setTimeout(() => {
                    document.querySelector("h3.success-message").style.display = "none";
                }, 3000);
                firebaseRef.ref().once("value", async function (snapshot) {
                    let countersNotInOrder = snapshot.toJSON().counters;
                    let counterDetailsNotInOrder = Object.keys(countersNotInOrder);
                    firebaseRef.ref("counters").remove();
                    let counterIds = [];
                    counterDetailsNotInOrder.forEach((counter) => {
                        counterIds.push(Number(counter.slice(7, 9)));
                    });
                    counterIds = counterIds.sort(sortNumber);

                    counterDetailsNotInOrder = [];
                    counterIds.forEach((counterId) => {
                        counterDetailsNotInOrder.push("counter" + counterId);
                    });

                    let id = 1;

                    counterDetailsNotInOrder.forEach((counter) => {
                        firebaseRef.ref("counters/counter" + id).set({
                            name: countersNotInOrder[counter].name,
                            number: countersNotInOrder[counter].number,
                            prefix: countersNotInOrder[counter].prefix,
                        });
                        id++;
                    });
                });
            } else {
                document.querySelector("h3.counter-not-exist").style.display = "block";
            }
        });
    }
});

function sortNumber(a, b) {
    return a - b;
}
