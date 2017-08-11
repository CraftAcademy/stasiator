## The Stasiator

So this guy came by the office and asked me if we could build a proof of concept for some sort of a incident/crime reporting app. The idea is that if you come across something that you would like to report to the authorities, you snap a picture with your smartphone and send it through the app. He also wanted users to get perks if they report many incidents. from an ethical perspective that is pretty tricky. I can't really see CA Labs being involved in building an application that rewards policing. I was however intrigued by some of the challenges the app brought forward so I decided to create a Proof of Concept app. 

I called it **The Stasiator**.

[Stasi](https://en.wikipedia.org/wiki/Stasi)


Note that this needs to be run with the IOS Simulator or on an IOS Device to work.
At this point i'm accessing the images [EXIF data](https://en.wikipedia.org/wiki/Exif) (a standard for storing interchange information in digital photography image files using JPEG) and will implement image recognition api to get information about content. 

### Issues
For now, I can't get the Leaflet map to show on the IOS page (that part can be tried in with `ionic serve`)


### Emulator with live reload and console output

```
$ ionic emulate ios -l -c
```
