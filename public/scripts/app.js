// document.getElementById("ex").innerHTML = "Hello again"

// console.log("hello")

// const newDiv = document.createElement("div");
// const newContent = document.createTextNode("Hi there and greetings!");
// newDiv.appendChild(newContent);

// const newDiv2 = document.createElement("div");
// const newContent2 = document.createTextNode("Hi there!");
// newDiv2.appendChild(newContent2);

// const newDiv3 = newDiv2.cloneNode(true)



// const currentDiv = document.getElementById("ex");


// insertAfter = (el, referenceNode) => {
//     referenceNode.parentNode.insertBefore(el, referenceNode.nextSibling);
// }

// insertAfter(newDiv, currentDiv);

// insertAfter(newDiv2, newDiv);

// insertAfter(newDiv3, newDiv2);

getCORS = (url, success) => {
  const xhr = new XMLHttpRequest();
  if (!('withCredentials' in xhr)) xhr = new XDomainRequest(); // fix IE8/9
  xhr.open('GET', url);
  xhr.onload = success;
  xhr.send();
  return xhr;
}

const allNewsUrl = "https://hacker-news.firebaseio.com/v0/topstories.json?print=pretty"
let allNews;

getCORS(allNewsUrl, (request) => {
  const response = JSON.parse(request.currentTarget.response) || JSON.parse(request.target.responseText);
  console.log(response);
  allNews = response
  console.log("allNews", allNews)

  console.log("allNews[1]", allNews[1])

  const story = `https://hacker-news.firebaseio.com/v0/item/${allNews[1]}.json?print=pretty`
  console.log(story)

  getCORS(story, (request) => {
      const response = JSON.parse(request.currentTarget.response) || JSON.parse(request.target.responseText);
      console.log("story", response);
  });

});






