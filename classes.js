;(async function() {
  let request = await fetch("sampleData.json");
  let data = await request.json()

  console.log(data)
  let header = document.querySelector("h1")
  header.innerText = data.name + "'s Classes"
  
}())
