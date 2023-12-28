---
layout: post
category : web
tags : [dumbphone, AWS, javascript]
title: Teaching a Dumbphone New Tricks
description: "Building an SMS-based google maps client"
---

I have a dumbphone. And it's great, except when I'm lost. Most people open Google Maps on their phone, check out their location on the map, and course correct. I usually drive/hike/bike for another 15 minutes, then call one of my other dumbphone friends and ask them to look things up for me.
\\
\\
I'd been meaning to try [AWS Lambda](https://aws.amazon.com/lambda/) for some time, and this seemed like a good application. AWS Lambda provides serverless computing infrastructure-- you upload your code to the AWS servers, it waits for you to trigger it, and you only pay for it when it's in use. Plus it's totally scalable, so when this "app" takes over the dumbphone world, it should remain responsive.
\\
\\
In theory it's pretty simple. The app needs to:

- Get a text message with structured to/from/mode of transportation information
- Pass this to the Google Directions API
- Parse the response
- Return turn-by-turn directions by SMS to the phone

As part of my year-long effort to improve my JavaScript skills, I wrote this in Node JS instead of my usual python. It took a little longer, but soon enough I could communicate with the Google API and return directions in a formatted text string:

{% highlight javascript %}
stepArr = []

var steps = response.json.routes[0].legs[0].steps
for (i = 0; i < steps.length; i++) {
    var step = steps[i]
    var instruction = step.html_instructions
    var distance = step.distance.text

    var msg = instruction + ' (' + distance + ')';
    stepArr.push(msg)
}

return stepArr.join(', ')
{% endhighlight %}

Now the hard part-- hooking this process up to SMS and AWS. The [few things I'd read](http://www.perrygeo.com/running-python-with-compiled-code-on-aws-lambda.html) about deployment suggested it was possible, but involved lots of bundling virtualenvs, handlers, workers in very specific ways so they could be invoked by AWS. \\
\\
Luckily I found [this awesome tutorial](https://www.twilio.com/blog/2016/12/create-an-sms-bot-on-aws-lambda-with-claudia-js.html) from the SMS service Twilio, which made the process relatively painless. Per their recommendation I wrapped my code using the [Claudia Bot Builder](https://github.com/claudiajs/claudia-bot-builder) package, and it took care of the rest, providing an easy CLI interface to package my code and upload it to Lambda.\\
\\
The only hard part, per always, my poor understanding of the async nature of JavaScript. I ultimately included calls to OSM's nominatim geocoder as well, and waiting for responses to come back from that and Google Maps was tough. Once that process was sorted out, and all returned the Promise objects required by claudia.js, deploying was easy.\\
\\
I now have an SMS service that can text me directions when I'm lost, am a little bit better at writing JavaScript, and am excited to build more AWS Lambda functions. For those of you with dumbphones, get in touch and I'd be happy to share the phone number and input parameters for the service. For everyone else, check out the code on github to see how easy it is to write a Lambda function: [http://github.com/mappingvermont/navigator/](http://github.com/mappingvermont/navigator).

