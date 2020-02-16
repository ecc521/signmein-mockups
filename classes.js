;(async function() {
  let request = await fetch("sampleData.json");
  let data = await request.json()

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
      addTh(classInfo.notes)
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

      var Name = GetInput ("name")
      button = document.createElement("button")
      button.innerHTML = "Sign In"
      div.appendChild(button)
      function SignIn() {
          var first = Name.value
          var time = Date.now()


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
          currentStudent.history.push({time, status:"present"})
          updateRow()
          row.replaceWith(createClassView(classInfo, updateRow))
      }
      button.addEventListener("click", SignIn)

      classInfo.students.forEach(function(student) {
        console.log(student)
	      
	      div.appendChild(createStudentSignInHistory(student))
	      if (student.history[0]) {
		       div.innerHTML += "<br>" + student.name  + " last signed in at " + student.history[0]
	      }
	      
      })

    function createStudentSignInHistory(student) {
	    let table = document.createElement("table")
	    table.className = "signInHistoryTable"

	student.history.forEach((signIn) => {
	      	let row = document.createElement("tr")

		let time = document.createElement("th")
		let date = new Date(signIn.dateTime)
		time.innerHTML = date
					row.appendChild(time)

		var status = document.createElement("th")
		status.innerHTML = signIn.status
		row.appendChild(status)

		row.className = "signInHistoryRow"

		table.appendChild(row)
	})

	    return table
      }


      return row

  }




}())
