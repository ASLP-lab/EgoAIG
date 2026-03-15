const firebaseConfig = {
  apiKey: "AIzaSyDthzOThrMPvMd86_eoQOBz_UsyHROTYBE",
  authDomain: "coderush-22.firebaseapp.com",
  projectId: "coderush-22",
  storageBucket: "coderush-22.appspot.com",
  messagingSenderId: "115056576501",
  appId: "1:115056576501:web:45f9de0add582be7d902bc",
  measurementId: "G-11D3FC68Y5",
};

firebase.initializeApp(firebaseConfig);

const firestoreDB = firebase.firestore();
const storage = firebase.storage();
const storageRef = storage.ref();

const presentationRef = storageRef.child("presentation");

const getTeamNames = () => {
  var html = "";
  firestoreDB
    .collection("Teams")
    .get()
    .then((snap) => {
      snap.forEach((doc) => {
        html += '<option value="' + doc.data().name + '">' + doc.data().name + "</option>";
      });
      document.getElementById("teamName").innerHTML = html;
    })
    .catch((err) => {
      console.log(err);
    });
};

getTeamNames();

const uploadProposal = () => {
  const fileInput = document.getElementById("proposal");
  const file = fileInput.files[0];

  const proposalRef = storageRef.child("proposal/" + file.name);
  var uploadTask = proposalRef.put(file);

  uploadTask.on(
    "state_changed",
    (snapshot) => {
      var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      document.getElementById("propupload").innerHTML = "<p>Upload is " + Math.round(progress) + "% done</p>"
      switch (snapshot.state) {
        case firebase.storage.TaskState.PAUSED: // or 'paused'
          break;
        case firebase.storage.TaskState.RUNNING: // or 'running'
          break;
      }
    },
    (error) => {
      // Handle unsuccessful uploads
    },
    () => {
      uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
        localStorage.setItem("proposal", downloadURL);
      });
    }
  );
};

const uploadPresentation = () => {
  const fileInput_1 = document.getElementById("presentation");
  // function handleFiles() {
  const file = fileInput_1.files[0];

  const proposalRef = storageRef.child("presentation/" + file.name);
  var uploadTask = proposalRef.put(file);

  uploadTask.on(
    "state_changed",
    (snapshot) => {
      var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      document.getElementById("presupload").innerHTML = "<p>Upload is " + Math.round(progress) + "% done</p>"

      switch (snapshot.state) {
        case firebase.storage.TaskState.PAUSED: // or 'paused'
          // console.log("Upload is paused");
          break;
        case firebase.storage.TaskState.RUNNING: // or 'running'
          // console.log("Upload is running");
          break;
      }
    },
    (error) => {
      // Handle unsuccessful uploads
    },
    () => {
      uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
        localStorage.setItem("presentation", downloadURL);
      });
    }
  );
};

const upload = (e) => {
  e.preventDefault();

  var teamName = document.getElementById("teamName").value;
  var proposalLink = localStorage.getItem("proposal");
  var presentationLink = localStorage.getItem("presentation");
  // console.log(teamName);

  if(teamName == '' || proposalLink == null || presentationLink == null ){
    return alert("Input fields cannot be empty")
  }

  firestoreDB
    .collection("Teams")
    .where("name", "==", teamName)
    .get()
    .then((snaps) => {
      if (snaps.length == 0) {
        alert("Invalid Team Name");
      } else {
        snaps.forEach((doc) => {
          // console.log(doc.id)
          firestoreDB.collection("Teams").doc(doc.id).update({
              proposalLink: proposalLink,
              presentationLink: presentationLink,
            })
            .then(() => {
              alert("Submitted Successfully");
              window.location.href = "/coderush"
              localStorage.clear()
            })
            .catch((err) => {
              alert(err);
            });
        });
      }
    }).catch(err => {
      alert(err)
    });

};
