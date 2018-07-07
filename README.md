##### orkl
###### Super simple peer-to-peer blogging site based on [Beaker](https://beakerbrowser.com).

#### Why?
I wanted to build a peer-to-peer only blog; kind of like the p2p child of Svbtle and Telegra.ph. Fell in love with the idea of a site, which feels the same for the writer and the reader. The only difference is that the writer can change things and the reader can't. Thanks to [Dat](https://datproject.org/), we can easily decide if a computer is the owner or not of a site.

orkl is also 100% dynamic, so it's basically just a bunch of ```txt``` files (using [smarkt](https://github.com/jondashkyle/smarkt)) = no site generation or building.

#### Usage
The magic of Beaker Browser is the possibility to fork a site. To get started you can fork any orkl site, but for the sake of simplicity we will use an empty site I've made.

- Download [Beaker Browser](https://beakerbrowser.com)
- Navigate to [dat://orkl-kodedninja.hashbase.io](dat://orkl-kodedninja.hashbase.io)
- Find the "Fork this site" button, click it and fill out with your information
- Navigate to your site
- Edit the site's dat.json, adding `"fallback_page": "index.html"` (from Beaker 0.8 prerelease.1 this is not needed)
- Read the "How to use orkl?" entry

##### ```config.json```
```
{
  "directory": <directory of the content - required>,
  "title": <site title (overrides title in dat.json>
}
```

#### Development
Make a new site in Beaker then put the source code into it's directory. Run:
```
npm install
npm start
```
to start the bundler.


Thanks to [choo](https://choo.io), [Jon Kyle](https://jon-kyle.com) (for Enoki and Dropout), [Rasmus](https://rsms.me) (for [Inter UI](https://rsms.me/inter)) and the guys at Beaker.
