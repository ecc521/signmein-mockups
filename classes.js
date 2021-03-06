;(async function() {
		// Your web app's Firebase configuration
		var firebaseConfig = {
			apiKey: "AIzaSyDWxpurKLW0wtGLZnrl0JgwIjxYlxOllBA",
			authDomain: "signmein-b6efa.firebaseapp.com",
			databaseURL: "https://signmein-b6efa.firebaseio.com",
			projectId: "signmein-b6efa",
			storageBucket: "signmein-b6efa.appspot.com",
			messagingSenderId: "329477146944",
			appId: "1:329477146944:web:8c63522ab3bc6d9b5dd2a5",
			measurementId: "G-GYHSX42BKL"
		};
		// Initialize Firebase
		var app = firebase.initializeApp(firebaseConfig);
		var db = firebase.firestore(app);
		firebase.analytics();

  //let request = await fetch("sampleData.json");
  //let data = await request.json()
  var idTeacher;
  var idClass;
  var idStudent;
  let data = {}

  let teachersCollection = await db.collection("Teachers").get()
  let teacherDocs = teachersCollection.docs
  for (let i=0;i<teacherDocs.length;i++) {
      let teacherDoc = teacherDocs[i]
      data.name = teacherDoc.id
      let idTeacher = teacherDoc.id
      console.log(idTeacher)

      let classesCollection = await db.collection("Teachers").doc(idTeacher).collection("Classes").get()
      let classesDocs = classesCollection.docs
      data.classes = []
      for (let i=0;i<classesDocs.length;i++) {
          let classDoc = classesDocs[i]
          idClass = classDoc.id
          //console.log(idClass)

          let classObj = {}
          data.classes.push(classObj)
          classObj.name = classDoc.id

          let studentsArr = []
          classObj.students = studentsArr

          let studentsCollection = await db.collection("Teachers").doc(idTeacher).collection("Classes").doc(idClass).collection("Students").get()
          let studentsDocs = studentsCollection.docs
          for (let i=0;i<studentsDocs.length;i++) {
              let studentDoc = studentsDocs[i]
              let idStudent = studentDoc.id
              //console.log(idStudent)

              let student = {}
              studentsArr.push(student)
              student.name = studentDoc.id
			  
			  let historyArr = []
			  student.history = historyArr
			  
			  let studentDocument = await db.collection("Teachers").doc(idTeacher).collection("Classes").doc(idClass).collection("Students").doc(idStudent).get()
			  let studentData = studentDocument.data()
			  let dateList = Object.keys(studentData)
			  for (let i = 0;i<dateList.length;i++) {
				  let dateTime = dateList[i]
				  let status = studentData[dateTime]
				  
				  let historyObj = {}
				  historyArr.push(historyObj)
				  historyObj.dateTime = Number(dateTime)
				  historyObj.status = status 
			  }
          }
      }
  }

  console.log(data)
  let header = document.querySelector("h1")
  header.innerText = data.name + "'s Classes"

  let table = document.getElementById("classes")


  function createClassRow(classInfo) {
      //Creates a row for the table.
      let tableRow = document.createElement("tr")
      tableRow.className = "classRow"

      function addTh(text) {
          let th = document.createElement("th")
          th.innerText = text
          tableRow.appendChild(th)
      }

      addTh(classInfo.name)
      addTh(classInfo.notes || "")
      if (typeof classInfo.students === "string") {
          //For creating the header
          addTh(classInfo.students)
      }
      else {
          addTh(classInfo.students.length)
      }
      return tableRow
  }


  table.appendChild(createClassRow({
      name: "Class Name",
      notes: "Notes",
      students: "Number of Students"
  }))

  let classes = data.classes
  classes.forEach((classInfo) => {
      //Add a row for the class.
      let row = createClassRow(classInfo)

      table.appendChild(row)

      let expanded = false

      function updateRow() {
          //For when the row needs to be updated
          let newRow = createClassRow(classInfo)
          newRow.addEventListener("click", clickListener)
          row.replaceWith(newRow)
          row = newRow
      }

      row.addEventListener("click", clickListener)


      function clickListener() {
          if (expanded) {
              row.nextElementSibling.remove()
          }
          else {
              let classView = createClassView(classInfo, updateRow)
              row.parentNode.insertBefore(classView, row.nextElementSibling)
          }
          expanded = !expanded
      }
  })

  function createClassView(classInfo, updateRow) {

      let row = document.createElement("tr")
      let cell = document.createElement("th")
      row.appendChild(cell)
      cell.colSpan = 3

      let div = document.createElement("div")

      div.className = "classInfo"

      let name = document.createElement("h2")
      name.innerHTML = classInfo.name
      div.appendChild(name)
      cell.appendChild(div)


      function GetInput (type){
          var input = document.createElement("input")
          input.placeholder = type
          input.style.width = "75%"
          div.appendChild(input)
          return input
      }

      var Name = GetInput ("Student Name")
      button = document.createElement("button")
      button.innerHTML = "Sign In"
      div.appendChild(button)
      function SignIn() {
          var first = Name.value

          let currentStudent;
          classInfo.students.forEach((student) => {
              if (student.name.toLowerCase() === first.toLowerCase()) {
                  currentStudent = student
              }
          })

          if (!currentStudent && confirm(first + " is not in the class. Would you like to add them?")) {
              currentStudent = {}
              classInfo.students.push(currentStudent)
              currentStudent.name = first
          }

          currentStudent.history = currentStudent.history || []
          currentStudent.history.push({dateTime: Date.now(), status:"present"})
          updateRow()
          row.replaceWith(createClassView(classInfo, updateRow))
      }
      button.addEventListener("click", SignIn)

      classInfo.students.forEach(function(student) {
		  let studentElem = document.createElement("div")
		  studentElem.className = "studentCard"
		  studentElem.innerHTML = student.name
	      if (student.history[0]) {
		       studentElem.innerHTML += " last signed in at " + new Date(student.history[0].dateTime).toLocaleString()
	      }
		  else {
		  	   studentElem.innerHTML += " has never signed in"
		  }
		  let expanded = false
		  studentElem.addEventListener("click", function() {
			  if (expanded) {
			  	studentElem.nextElementSibling.remove()
			  }
			  else {
			  	let studentHistory = createStudentSignInHistory(student)
				studentElem.parentNode.insertBefore(studentHistory, studentElem.nextElementSibling)
			  }
			  expanded = !expanded
		  })
		  div.appendChild(studentElem)

      })

    function createStudentSignInHistory(student) {
	    let table = document.createElement("table")
	    table.className = "signInHistoryTable"

	student.history.forEach((signIn) => {
	      	let row = document.createElement("tr")

		let time = document.createElement("th")
		let date = new Date(signIn.dateTime).toLocaleString()
		time.innerHTML = date
					row.appendChild(time)

		var status = document.createElement("th")
		status.innerHTML = signIn.status
		row.appendChild(status)

		if (signIn.status === "present") {
			row.style.backgroundColor = "lightgreen"
		}
		else if (signIn.status === "suspicious") {
			row.style.backgroundColor = "#FFAAFF"
		}

		row.className = "signInHistoryRow"

		table.appendChild(row)
	})

	    return table
      }


      return row

  }




}())
