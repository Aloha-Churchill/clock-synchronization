# What time is it?

### An interactive introduction into how computers keep time and synchronize events

## Learning Flow
In the flowchart below, you'll find the main ideas and questions that this blog will be focused on. 

::artifact[learning-flow.html]{height=700}

## History of Timekeeping - Foundations I

### Introduction

For the most part, knowing what time it is for us in our daily lives is a simple matter
of glancing down at a watch or checking a phone. You probably have a little clock widget on whichever
screen you are reading this on. Take a little break to check it. Unless your clock is not synchronized or you prefer to print out the contents of the blog on paper for reading later for some mysterious reason, it should be pretty simple to tell the time.

For me, at the moment of writing this, it's March 22 12:58 pm 2026. I have implicit trust in this time. If
I ask somebody in my same time zone, what time is it? they will have the same answer. So what is this time that most of us in the
world agree on?

### A Brief History of Timers

Humans have found ingenious methods to track time since antiquity. You can click on the icons below to discover various timekeeping methods throughout history.

::artifact[timekeeping-history.html]{height=550}

## UTC: Coordinated Universal Time

::artifact[solar-vs-mean-time.html]{height=900}

As the world grew more connected due to innovations in transportation and communication,
there was building pressure to adopt a "universal time" that everybody agreed on. Ideally, this universal clock would be perfectly consistent (ticking at a steady rate) and align with the sun's position in the sky.

But satisfying both of these requirments posed an immediate problem because the sun's position in the sky is not a reliable clock. The "solar day", or the time between consecutive solar noons, is not constant throughout the year. There are two primary factors at play here:

1. Earth does not orbit around the sun in a perfect circle but rather follows an elliptical orbit.
2. Earth's axis is tilted relative to its orbit and the passage of the sun across the sky is tilted along with that axis.

Centuries ago, astronomers found a solution to this problem by inventing "mean solar time" which uses an imaginary "mean sun" that moves across the sky at a perfectly uniform rate. This rate is the average of the real sun's motion over an entire year. Mean solar time gave people a smoothly ticking clock that on average, still agreed with the sun's position in the sky. This was the origin of Greenwhich Mean Time.

However, another pesky problem was discovered with using mean solar time. It still depended on Earth's rotation around the sun as being a consistent timekeeper. After the discovery of the atomic clock, scientists discovered this was not the case: Earth's rotation around the sun is slowing down. Forget about clocks, this sounds like a big problem for us Earthlings! Let me put your concerns at ease: a day today is roughly 1.7 to 2.3 millisecond longer than a day was 100 years ago. Even mean solar time was not perfectly consistent.

In 1967, the second was redefined based on the atomic clock because this is the most consistent clock we have. It only looses less than 1 second every 30 billion years. International Atomic Time uses a weighted average of atomic clocks all over the world. It does not adjust for the slowing of the earth's orbit. Finally, we can get to understanding **Coordinated Universal Time**, or UTC. UTC uses the tick of atomic clocks as it's base so that it meets the requirement of being a perfectly consistent clocks. However, it also uses something called a "leap second" to account for the slowdown in our Earth's orbit. A leap second is announced months in advance by a consortium of time keeping scientists and a second is added or subtracted from a day in the year to re-align the atomic clock with very accuratly measured mean solar time, or UT1. However, this addition or subtraction of a second caused engineering headaches for synchronizing systems and were abolished in 2022. This decision will take effect by 2035, where it seems atomic time will fully be embraced (at least for a time).

## The clocks in your computer

Now that we've covered a bit about the history of time and seen how complex it can get, let's turn to something that is most likely more relevant to your personal coding journey: the sources of time in your own computer.

It's very likely the device you are reading this on has several sources of time.

1. Real-Time Clock (RTC): Most modern computers have a quartz crystal oscillator that can maintain time even when the laptop is powered down. This is powered by a small battery that allows this clock to run for years.
2. System time/CPU counter: When your computer is powered on, it reads the time from the RTC and then uses the CPU's internal clock cycles to track the passage of time. It is updated by NTP to correct for the drift

## NTP

::artifact[ntp-exchange.html]{height=500}

## Sources

https://en.wikipedia.org/wiki/History_of_timekeeping_devices
https://en.wikipedia.org/wiki/Universal_Time#History

::artifact[example-widget.html]{height=380}
