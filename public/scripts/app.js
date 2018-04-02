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
  return stories
}

generateUrls = (storiesArr) => {
  const storyUrls = storiesArr.map(story => `https://hacker-news.firebaseio.com/v0/item/${story}.json?print=pretty`)
  return storyUrls
}

getStory = (url) => {
  return fetch(url)
    .then((resp) => {
      return resp.json()
    })
    .then((json) => {
      return json
    })
}

getStories = (urls) => {
  const multipleFetch = urls.map((url,index) => getStory(url))
  return multipleFetch
}

extractHostname = (url) => {
  let hostname;
  //find & remove protocol (http, ftp, etc.) and get hostname

  if (url.indexOf("://") > -1) {
      hostname = url.split('/')[2];
  }
  else {
      hostname = url.split('/')[0];
  }

  //find & remove port number
  hostname = hostname.split(':')[0];
  //find & remove "?"
  hostname = hostname.split('?')[0];

  return hostname;
}

extractRootDomain = (url) => {
  let domain = extractHostname(url),
      splitArr = domain.split('.'),
      arrLen = splitArr.length;
  //extracting the root domain here
  //if there is a subdomain
  if (arrLen > 2) {
      domain = splitArr[arrLen - 2] + '.' + splitArr[arrLen - 1];
      //check to see if it's using a Country Code Top Level Domain (ccTLD) (i.e. ".me.uk")
      if (splitArr[arrLen - 2].length == 2 && splitArr[arrLen - 1].length == 2) {
          //this is using a ccTLD
          domain = splitArr[arrLen - 3] + '.' + domain;
      }
  }
  return domain;
}

renderStory = (result, i) => {
    postedElapsed = timeDiff(result.time)
    let domainUrl;
    // check if their is an attached url from respons
    if (result.url) {
      domainUrl = extractRootDomain(result.url)
    }
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

    if (domainUrl) {
      p.innerHTML = `<span class="top-story-index">${i + 1}.</span>
        <a href="#"><img src="https://news.ycombinator.com/grayarrow2x.gif" class="votearrow"></a>
        <span class="top-story-title"><a href=${storyUrl}>${result.title}</a>
        <span class="top-story-domain" id="top-story-domain">(<a href=${fromDomainUrl}>${domainUrl}</a>)</span>`
    } else {
      p.innerHTML = `<span class="top-story-index">${i + 1}.</span>
        <a href="#"><img src="https://news.ycombinator.com/grayarrow2x.gif" class="votearrow"></a>
        <span class="top-story-title"><a href=${storyUrl}>${result.title}</a>`
    }

    div.innerHTML = `${result.score} points by
      <span class="bottom-story-a">
        <a href=${byUrl}>${result.by}</a>
        <a href=${timeUrl}>${postedElapsed}</a>
        | <a href=${logInUrl}>hide</a> |
        <a href=${commentsUrl}>${result.descendants} comments</a>
      </span>`
    append(p, div)
    append(storyContainer, p)
}

getNews().then((result) => {
  let count = 0;
  // const firstSet = result.filter((i, index) => (index < 30))
  const storiesToAppend =[]
  const firstSet = storiesArr(count, result)
  const urlsFirstSet = generateUrls(firstSet)
  console.log(urlsFirstSet)
  const apiRequests = getStories(urlsFirstSet)
  count += 30;

  Promise.all(apiRequests).then((result) => {
    console.log("from promise",result)
    for (let i = 0; i < apiRequests.length; i++){
      renderStory(result[i], i)
    }
  })

  window.onscroll = function(ev) {
    if ((window.innerHeight + window.scrollY) >= document.body.scrollHeight) {
      // you're at the bottom of the page
      const newSet = storiesArr(count, result)
      const urlsNewSet = generateUrls(newSet)
      const newApiRequests = getStories(urlsNewSet)
      Promise.all(newApiRequests).then((result) => {
        for (let i = 0; i < apiRequests.length; i++){
          renderStory(result[i], i + count)
        }
        count += 30;
      })
    }
  };
})
















