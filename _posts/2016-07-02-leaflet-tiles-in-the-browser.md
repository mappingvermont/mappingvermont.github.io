---
layout: post
category : web
tags : [leaflet, javascript, canvas]
title: Mapping One Pixel at a Time
description: "Rendering tiles dynamically using HTML5 canvas"
---
Big news! I just started a new job working for [Global Forest Watch](http://globalforestwatch.org/map). I'm thrilled to join the team here in DC, and excited to be part of their everything-but-the-kitchen-sink approach to mapping-- arcpy and GDAL for local data processing,  ArcGIS Server, TileMill and CartoDB for map services, and Leaflet and the ArcGIS JS API for web mapping.

\\
One of the things that got me interested in their work was how fast their raster data could be visualized and filtered by date. Here's [an example](http://www.globalforestwatch.org/map/9/-2.80/113.88/ALL/grayscale/umd_as_it_happens?tab=analysis-tab&begin=2015-01-01&end=2016-06-09) of GLAD alert data (30 x 30m pixels showing areas of likely deforestation). If I were building this site, I would use an esri image service to display this data. When a user hit the play button, the site would make an export map request to the service with start/end date parameters for the map of deforestation. This request would succeed, but it wouldn't be fast enough to keep up with the time slider presented in the website, which would need to make a new request multiple times per second.

\\
How does it work, then? Instead of making multiple calls to a service, the site loads map tiles for each area once. These tiles use specific RGB values as a way to encode date information. Each color is represented in RGB color space, with values of 1 - 255 for Red, Green, and Blue. The website reads these colors, then applies a function to translate the color to a date value they represent. 

\\
For this deforestation service, the date can be decoded by multiplying the the red band value by 255, then adding the green band value to it. This gives the total number of days after January 1, 2015. Deforestation that occurred on 1/10/2015, for example, would be Red: 0, Blue: 10, or (255 * 0) + (10). This date information is decoded client side, and the browser turns all the pixels that are within the date range selected pink. If a pixel doesn't match the date range shown, the browser will turn the pixel transparent.

\\
I think what I like most about this approach is how it comes down to basic computer science. All we're really doing here is manipulating an image. We don't need a fancy server to turn on/off different colors, we just need to read all the pixels of an image, apply a function to the values, then change their colors. Computers are really good at this, and web browsers in particular. All the work is pushed to the client side, the server just has to provide a static map tile.

\\
To better understand how to access the pixel values of map tiles in the browser, I found a [great example](https://johngravois.com/lerc-leaflet) from John Gravois. I repurposed it to read imagery tiles from an ArcGIS Image Server [here](http://rawgit.com/mappingvermont/32e9b947fc7bf60c91cecd460fc7b0bf/raw/0519e45e4783c1c50735452886013cb2ba695c77/leaflet_canvas.html). Now that we have a handle on each pixel being read to the map, we can alter the image data. Based on this [Mozilla image tutorial](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Pixel_manipulation_with_canvas), we can modify the RGB value displayed using the following code:

{% highlight javascript %}
  var invert = function() {
    for (var i = 0; i < data.length; i += 4) {
      data[i]     = 255 - data[i];     // red
      data[i + 1] = 255 - data[i + 1]; // green
      data[i + 2] = 255 - data[i + 2]; // blue
    }
    ctx.putImageData(imageData, 0, 0);
  };
{% endhighlight %}

I've used this function to [invert every pixel in that same ArcGIS Image Service and display it](http://rawgit.com/mappingvermont/c7056e7cd0f68af6f75c98d493ead337/raw/440f4d430fb0e5898f86736b2ad8d99ac8b2fcff/leaflet_canvas_invert.html). Pretty cool, huh? I like how surreal it looks-- the street trees of Toronto all turned white. It's amazing how fast it draws too. We're literally changing every pixel of a satellite image in the browser, and it performs just like a normal image service. More next time on using this approach to solve an actual mapping problem!
