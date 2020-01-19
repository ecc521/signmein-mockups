;(async function() {
  let request = await fetch("sampleData.json");
  let classes = await request.json()
  
  console.log(classes)
}())
