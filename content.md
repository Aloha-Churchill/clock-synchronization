# What time is it?

An interactive introduction into how computers keep time and synchronize events

## Learning Flow
In the flowchart below, you'll find the main ideas and questions that this blog will be focused on. 

::artifact[learning-flow.html]{height=700}

## <span class="zone-dot foundations"></span> History of Timekeeping

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

## <span class="zone-dot foundations"></span> Coordinated Universal Time (UTC)

As the world grew more connected due to innovations in transportation and communication,
there was building pressure to adopt a "universal time" that everybody agreed on. Ideally, this universal clock would be perfectly consistent (ticking at a steady rate) and align with the sun's position in the sky.

But satisfying both of these requirments posed an immediate problem because the sun's position in the sky is not a reliable clock. The "solar day", or the time between consecutive solar noons, is not constant throughout the year. There are two primary factors at play here:

1. Earth does not orbit around the sun in a perfect circle but rather follows an elliptical orbit.
2. Earth's axis is tilted relative to its orbit and the passage of the sun across the sky is tilted along with that axis.

Centuries ago, astronomers found a solution to this problem by inventing "mean solar time" which uses an imaginary "mean sun" that moves across the sky at a perfectly uniform rate. This rate is the average of the real sun's motion over an entire year. Mean solar time gave people a smoothly ticking clock that on average, still agreed with the sun's position in the sky. This was the origin of Greenwhich Mean Time. Check out the interactive below to better understand how this solar mean time works.

::artifact[solar-vs-mean-time.html]{height=900}

However, another pesky problem was discovered with using mean solar time. It still depended on Earth's rotation around the sun as being a consistent timekeeper. After the discovery of the atomic clock, scientists discovered this was not the case: Earth's rotation around the sun is slowing down. Forget about clocks, this sounds like a big problem for us Earthlings! Let me put your concerns at ease: a day today is roughly 1.7 to 2.3 millisecond longer than a day was 100 years ago. Even mean solar time was not perfectly consistent.

In 1967, following the invention of the atomic clock, the second was redefined. Instead of using the Earth's movement as the basis for a second, the resonant frequency of a Cesium-133 atom was used.

> 1 second = duration of 9,192,631,770 periods of radiation corresponding to the transition between two hyperfine levels of the ground state of the Cesium-133 atom

You might look at this definition and throw up your hands in anguish! Why choose such a difficult number of hyperfine level jump thingys? The inpronouncable number was chosen to be that which most closely matched the previous planetary defintion of the second. As for the deeper physics, there are resources at the end of this blog for more information on how this quanity is measured.

Time from an atomic clock looses less than 1 second every 30 billion years. International Atomic Time uses a weighted average of atomic clocks all over the world. It does not adjust for the slowing of the earth's orbit. Finally, we can get to understanding **Coordinated Universal Time**, or UTC. UTC uses the tick of atomic clocks as it's base so that it meets the requirement of being a perfectly consistent clocks. However, it also uses something called a "leap second" to account for the slowdown in our Earth's orbit. A leap second is announced months in advance by a consortium of time keeping scientists and a second is added or subtracted from a day in the year to re-align the atomic clock with very accuratly measured mean solar time, or UT1. 

However, this addition or subtraction of a second caused engineering headaches for synchronizing systems and was recently abolished in 2022. This decision will take effect by 2035.

## <span class="zone-dot foundations"></span> Clocks Inside Your Computer

Now that we've covered a bit about the history of time and seen how complex it can get, let's turn to something that is most likely more relevant to your personal coding journey: the sources of time in your own computer.

It's very likely the device you are reading this on has several clocks.

### Physical Timers
There are usually at least 2 physical quartz crystal oscillators in a modern PC.
1. The Real Time Clock (RTC): A battery powered quartz crystal that keeps time even when your PC is completely powered off and can last years on battery power alone. 
2. The CPU Clock: A crystal that can oscillate at higher frequencies than the RTC and provides the base frequency for the CPU, RAM, and Bus. The CPU takes the base frequency of this oscillator and uses a phase-locked loop to multiply it to the CPU speed and drive the computation. The Time Stamp Counter (TSC) is based on the ticks of this clock.

### Logical Abstractions
The operating system typically provides logical abstractions for you to interface with time.
1. The "System Clock/ Wall Clock" (CLOCK_REALTIME): This is a calculated value, not a raw counter. At boot, the Kernel reads from the RTC and then starts the counter in memory, every time the TSC ticks a certain number of time, the Kernel increments this "Wall Clock" variable. This clock allows the "Wall Clock" time to change with NTP (which we will investigate in the near future). Because of this, the Wall Clock does not monotonoically increase. This computes the UTC.
2. The "Steady" Clock (CLOCK_MONOTONIC): This clock starts at 0 when the Kernel initializes. It ignores the RTC and NTP entirely. It only looks at the high-speed system oscillator and increases monotonoically.

::artifact[clock-quiz.html]{height=600}


## <span class="zone-dot sync"></span> Synchronization
Before we start to learn how to synchronize, we need to understand what synchronization is and why it is important. 

> Synchronization is the coordination of multiple processes, threads, or hardware devices to ensure orderly execution, data consistency, and prevent conflicts like race conditions.

Synchronization is vital to anything that is trying to communicate. In your everyday life, understanding what happened first or at what time a 
friend is expecting you to meet them is important for how you understand the world and operate in it, so too is synchronization in computer science.


In this blog post, we will be focused on synchronization across **hardware devices**. Within this topic, we can further divide synchronization across computers into two primary problems: 
1. How do we synchronize computer's **local clocks**?
2. How do we synchronize **events** between computers?

Let's start with problem 1: synchronizing local clocks.

## <span class="zone-dot sync"></span> Network Time Protocol (NTP)
The Network Time Protocol (NTP) helps solve the problem of synchronizing server's local clocks across the Internet. 
Its goal is to update each client (computer) to have their clock match as close as possible with UTC. 

#### Why might we need this?
Synchronizing our local clock is helpful for processes like certificate validation. For example, [SSL certificates](https://www.cloudflare.com/learning/ssl/what-is-an-ssl-certificate/) use the system time to check if they are still valid.
But perhaps most importantly, it's nice for us to see the correct time and be able to add timestamps when logging and look back on them later with and understanding that those timestamps mean something to us.


Ok, let's look at how NTP helps synchronize our local clocks.
NTP is built on the idea that there are some servers that have a more accurate time than others. 
Explore the below interactable to understand the "stratum system".

::artifact[ntp-stratum.html]{height=750}

Let's call a system with a more accurate clock the **server** and a system with a less accurate clock the **client**.
How do you update a client to have a more accurate time? This might seem like an easy problem, but take a minute to think about it...maybe not so easy after all.
For example, if the server sends a message to the client with the server's local time, there is a delay in the network from the sending and recieving of this packet, so 
we can't just blindly update the client time to the time in that packet. We somehow need to deduce the time of flight of the packet between the client and server.

NTP proposes a simple, but clever mechanism for doing just that.

1. The client sends a message at its local time $t0$ to the server that it wants an update. It records $t0$.
2. The server records the time the message was received from the client in its local time, $t1$.
3. The server prepares the updated message and records the time it sends the message out, $t2$.
4. The client receives the message from the server and records its local time $t3$

We now have the times: $t0$, $t1$, $t2$, and $t3$. 
At the end of this process, the client knows all of these timestamps because as part of the message the server sends the client to update its time, it also sends $t1$ and $t2$.

To synchronize a client clock with a server, NTP calculates two primary values: the **Round-Trip Delay ($\delta$)** and the **Clock Offset ($\theta$)**.

### Round-Trip Delay
The delay represents the total time the request and response packets spent traveling across the network. It excludes the time the server spent processing the request.

$$\delta = (t_3 - t_0) - (t_2 - t_1)$$

### Clock Offset
The offset is the difference between the client’s clock and the server’s clock. To derive the formula for $\theta$, we assume that the network delay is **symmetric**, meaning the time to send the request is equal to the time to receive the response ($\delta/2$ each way).

We can set up two equations based on the packet travel:

1.  **For the Request Packet:** The server's time ($t_1$) is equal to the client's start time ($t_0$) plus the clock offset ($\theta$) and the one-way travel time ($\delta/2$).
    $$t_0 + \theta + \frac{\delta}{2} = t_1$$

2.  **For the Response Packet:** From the client's perspective, the arrival time ($t_3$) is the server's departure time ($t_2$) minus the offset ($\theta$) plus the one-way travel time ($\delta/2$).
    $$t_3 + \theta - \frac{\delta}{2} = t_2$$

By solving this system of equations (subtracting the equations to isolate $\theta$), we arrive at the standard NTP Offset formula:

$$\theta = \frac{(t_1 - t_0) + (t_2 - t_3)}{2}$$

* **Logic:** This formula averages the time difference measured during the request phase and the response phase to find the most accurate shift for the client clock.

::artifact[ntp-exchange.html]{height=800}

### Updating the Client's Clock
The clock offset $\theta$ tells the client how far off from the correct time it is.

Here's a little understanding check.

::artifact[theta-quiz.html]{height=140}

A client rarely "snaps" its clock to the new time because most software assumes time is monotonic (always increasing). If a fast clock suddenly jumps backward to stay in sync, it can cause violations where a later event appears to happen before an earlier one which can break database logs, security certificates, and system timers.

Instead, something called the "phase locked loop" is run. Explore the below interactable to understand how the clock is gradually 
shifted to the correct time.

::artifact[ntp-slew-pll.html]{height=600}

## <span class="zone-dot distributed"></span> Event Ordering

### Local time isn't reliable...
Like we saw, NTP is useful, but not sufficient for synchronization. 
It keeps clocks close enough for logging and certificates, but never exact. Remember: NTP's offset formula assumes symmetric network delay, and in real networks that's never guaranteed. 
There's always residual error. And even a few milliseconds of disagreement between two machines is enough to reverse the apparent order of events. 
Imagine a server A sending a question to server B and C. Server B has the answer and sends this to server A and C. How might server C observe 
B's answer before A's question?

::artifact[causal-violation.html]{height=600}


Oh despair! Oh trechary! It seems we cannot rely on physical time alone to solve the problem of synchronization. 

But fear not. There are some clever people who came up with clever solutions to even be able to syncrhonize when the time is off.

## <span class="zone-dot distributed"></span> Lamport Clocks

Fundamentally, distributed systems have no shared clock. Each server ticks independently, and as we just saw, messages can arrive out of order. So how do we reason about what happened before what?

In 1978, Leslie Lamport had a wonderful insight: we don't actually need to know what time something happened, we just need to know whether one event could have caused another. He formalized this as the **happens-before** relation, written as $a \to b$:

* If $a$ and $b$ occur on the same server, and $a$ comes first, then $a \to b$.
* If $a$ is the sending of a message and $b$ is its receipt, then $a \to b$.
* If $a \to b$ and $b \to c$, then $a \to c$ (transitivity).

Any two events that aren't linked by this chain are **concurrent** which means neither caused the other, and no clock trick can (or should) force an ordering between them.

A **Lamport clock** turns this relation into a number. Each server maintains a counter $L$, and follows three rules: increment before any local event, attach the counter when sending a message, and on receipt set $L = \max(L_{local}, L_{received}) + 1$. The result is a guarantee: if $a \to b$, then $L(a) < L(b)$. Causality always flows uphill.

::artifact[lamport-clock.html]{height=600}

Notice what Lamport clocks can't tell you: if $L(a) < L(b)$, that doesn't necessarily mean $a \to b$. The events might be concurrent. Lamport clocks capture causality in one direction only.

There's an extension called a [vector clock](https://en.wikipedia.org/wiki/Vector_clock) that solves exactly this. Instead of a single counter, each server maintains a vector of counters: one per server in the system. This lets you distinguish "definitely caused" from "merely concurrent." If you need to detect conflicts (say, two users editing the same document simultaneously), vector clocks give you the information Lamport clocks leave out.

## Conclusions

We perceive the world through time. What’s the time? Well *now* of course! But like many things that feel intuitive, when you try to explain it precisely to a computer, the edge cases multiply and what seemed simple becomes deeply complicated. This blog has really only touched the surface of how complicated time and synchronization is.

If you're curious to learn more about time and synchronization, I've attached some resources that I found especially excellent on the topic and which helped me write this blog.

And now, when somebody asks you what time it is, that question alone just might be able to carry the conversation for an entire dinner.

Thank you for reading, and I hope you enjoyed! 🌸




## Sources

- MIT CSAIL. *Clock Synchronization Lecture Notes*.  
  https://courses.csail.mit.edu/6.885/spring06/notes/lect6.pdf

- Cambridge University. *Distributed Systems Notes*.  
  https://www.cl.cam.ac.uk/teaching/2122/ConcDisSys/dist-sys-notes.pdf

- Bhayani, A. *The Clock Synchronization Nightmare*.  
  https://arpitbhayani.me/blogs/clock-sync-nightmare/

- Sookocheff, K. *Lamport Clocks*.  
  https://sookocheff.com/post/time/lamport-clock/

- Sookocheff, K. *How Does NTP Work?*  
  https://sookocheff.com/post/time/how-does-ntp-work/

- *History of Timekeeping Devices*. Wikipedia.  
  https://en.wikipedia.org/wiki/History_of_timekeeping_devices

- *Universal Time – History*. Wikipedia.  
  https://en.wikipedia.org/wiki/Universal_Time#History

- YouTube. *The Rest is Science: What Day Is It, Really?*.  
  https://www.youtube.com/watch?v=RrGHtl5qJfk

- YouTube. *Video*.  
  https://www.youtube.com/watch?v=p2BxAu6WZI8

- YouTube. *Distributed Systems Playlist*.  
  https://www.youtube.com/playlist?list=PLeKd45zvjcDFUEv_ohr_HdUFe97RItdiB

- Anthropic. *Claude Code*.  
  https://claude.ai/

- Google. *Gemini (AI Assistant)*.  
  https://gemini.google.com/

### A note on sources
A few of the sources that I especially recommend are...
1. The distributed systems playlist linked above. [Martin Kleppmann](https://martin.kleppmann.com/) released this lecture series. It is an incredibly well explained introduction to distributed systems. It's amazing to me that world-class lectures like this are released for public consumption on YouTube!
2. Kevin Sookocheff's "How does NTP Work" blog. My NTP explanation is based off of this blog. It goes into the nuances of NTP that most sources do not.
3. The podcast/YouTube video "What Day Is It, Really?". I love this podcast in general, but if you're curious this episode gets into the question of how we actually determined the days and months and years...like why do a bunch of months have odd days, and who determined what year it is?

In addition, I used Gemini for building better intuition about the types of clocks in your computer. This varies by the system, which is part of the reason finding a 
single source of information for this was difficult and thus was an easier task on Gemini. I've attached the sources that Gemini said it used below as additional references. 


Core Sources & References
+ Leslie Lamport (1978): "Time, Clocks, and the Ordering of Events in a Distributed System" – The foundational paper for the "Happened-Before" relationship and Logical Clocks.
+ RFC 5905 (Network Time Protocol Version 4): The official IETF specification detailing NTP architecture, stratum levels, and algorithms for clock offset and round-trip delay.
+ BIPM (Bureau International des Poids et Mesures): Standards for UTC (Coordinated Universal Time) and the integration of TAI (International Atomic Time) with UT1 (Earth's rotation).
+ Fidge (1988) & Mattern (1989): Independent papers that established the theory for Vector Clocks to track partial ordering and concurrency in distributed systems.
+ Intel 64 and IA-32 Architectures Software Developer’s Manuals: Technical documentation regarding hardware timers, including the TSC (Time Stamp Counter) and HPET (High Precision Event Timer).
+ POSIX / Linux Kernel Documentation: Specifications for clock types, specifically the difference between CLOCK_REALTIME (wall-clock) and CLOCK_MONOTONIC (incremental system time).
+ IEEE 1588-2008: The standard for PTP (Precision Time Protocol), often compared to NTP for high-precision local network synchronization.