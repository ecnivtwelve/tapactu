import * as rssParser from 'react-native-rss-parser';

const GetNewsFromSource = async (source) => {
  return fetch(source)
    .then(response => response.text())
    .then((responseData) => rssParser.parse(responseData))
    .then(rss => {
      return rss;
    });
};

const JoinMultipleFeeds = async (feeds, length) => {
  return new Promise((resolve, reject) => {
    let items = [];
    let done = 0;

    for (let i = 0; i < feeds.length; i++) {
      GetNewsFromSource(feeds[i]).then((feed) => {
        // if length is set, only get the first n items
        if (length) {
          feed.items = feed.items.slice(0, length);
        }

        feed.items.forEach((item) => {
          // get feed without items
          let newFeed = {
            ...feed,
            items: [],
          };

          items.push({
            ...item,
            source: newFeed,
          });
        });

        // remove duplicates
        items = items.filter((item, index, self) =>
          index === self.findIndex((t) => (
            t.id === item.id
          ))
        );

        done++;

        if (done === feeds.length) {
          resolve(items);
        }
      });
    }

    if (feeds.length === 0) {
      resolve([]);
    }
  });
}

const GetMultipleFeeds = async (sources) => {
  let feed = [];
  
  for (let i = 0; i < sources.length; i++) {
    feed.push(GetNewsFromSource(sources[i].feeds[0]));
  }

  return Promise.all(feed);
}

const GetHeadlines = async (sources, max) => {
  return JoinMultipleFeeds(sources, max)
    .then((data) => {
      // sort by date
      data.sort((a, b) => {
        let aDate = new Date(a.published);
        let bDate = new Date(b.published);

        return bDate - aDate;
      });

      return data;
    });
};

export {
  GetHeadlines
};