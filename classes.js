;(async function() {
  let request = await fetch("testData.json");
  let classes = await request.json()
  
  console.log(classes)
}())
