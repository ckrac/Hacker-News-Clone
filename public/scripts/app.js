const storyContainer = document.querySelector('#story-container');
const allNewsUrl = "https://hacker-news.firebaseio.com/v0/topstories.json?print=pretty"

getNews = () => {
  return fetch(allNewsUrl)
    .then((resp) => {
      return resp.json()
    })
    .then((json) => {
      return json
    })
}

getStory = (story) => {
  const storyUrl = `https://hacker-news.firebaseio.com/v0/item/${story}.json?print=pretty`
  return fetch(storyUrl)
    .then((resp) => {
      return resp.json()
    })
    .then((json) => {
      return json
    })
}

createNode = (element) => {
  return document.createElement(element)
}

append = (parent, el) => {
  return parent.appendChild(el);
}

timeDiff = (time) => {
  const unix = Math.round(+new Date()/1000);
  const diffMins = Math.floor((unix - time) / 60)
  const diffHoursString = minsToHours(diffMins)
  let stringDiff;
  (diffMins > 60) ? stringDiff = diffHoursString : stringDiff = `${diffMins} minutes ago`;
  return stringDiff
}

minsToHours = (mins) => {
  let stringDiff;
  (Math.floor(mins / 60) > 1) ? stringDiff = `${Math.floor(mins / 60)} hours ago` : stringDiff = `${Math.floor(mins / 60)} hour ago`;
  return stringDiff
}

storiesArr = (count, result) => {
  let stories = result.filter((i, index) => (index >= count && index < count + 30))
  // why is this not affecting global var?
  count += 30;
  // console.log('from func', count)
  return stories
}


domain_from_url = (url) => {
    let result;
    let match;
    if (match = url.match(/^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n\?\=]+)/im)) {
        result = match[1]
        if (match = result.match(/^[^\.]+\.(.+\..+)$/)) {
            result = match[1]
        }
    }
    return result
}

renderStory = (storyObj, i) => {
  getStory(storyObj).then((result) => {
    postedElapsed = timeDiff(result.time)
    // don't know why i get an error here (Paused on promise rejection: Cannot read property 'match' of undefined)
    const domainUrl = domain_from_url(result.url)
    const storyUrl = `${result.url}`
    const fromDomainUrl = `https://news.ycombinator.com/from?site=${domainUrl}`

    const byUrl = `https://news.ycombinator.com/user?id=${result.by}`
    const timeUrl = `https://news.ycombinator.com/item?id=${result.id}`
    const logInUrl = `https://news.ycombinator.com/hide?id=${result.id}&goto=news`
    const commentsUrl = `https://news.ycombinator.com/item?id=${result.id}`
    let p = createNode("p")
    let div = createNode("div")
    p.className += "top-story"
    div.className += "bottom-story"
    p.innerHTML = `<span class="top-story-index">${i + 1}.</span>
      <a href="#"><img src="https://news.ycombinator.com/grayarrow2x.gif" class="votearrow"></a>
      <span class="top-story-title"><a href=${storyUrl}>${result.title}</a>
      <span class="top-story-domain" id="top-story-domain">(<a href=${fromDomainUrl}>${domainUrl}</a>)</span>`
    div.innerHTML = `${result.score} points by
      <span class="bottom-story-a">
        <a href=${byUrl}>${result.by}</a>
        <a href=${timeUrl}>${postedElapsed}</a>
        | <a href=${logInUrl}>hide</a> |
        <a href=${commentsUrl}>${result.descendants} comments</a>
      </span>`
    append(p, div)
    append(storyContainer, p)
  })
}

getNews().then((result) => {
  let count = 0;
  // const firstSet = result.filter((i, index) => (index < 30))
  const firstSet = storiesArr(count, result)
  count += 30;

  for (let i = 0; i < firstSet.length; i++){
    renderStory(firstSet[i], i)
  }

  window.onscroll = function(ev) {
    if ((window.innerHeight + window.scrollY) >= document.body.scrollHeight) {
      // you're at the bottom of the page
      const newSet = storiesArr(count, result)
      for (let i = 0; i < newSet.length; i++) {
        renderStory(newSet[i], count + i)
      }
      count += 30;
    }
  };
})
















