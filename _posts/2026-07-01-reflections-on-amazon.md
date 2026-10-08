---
layout: essay
title: "Reflections on Amazon"
date: 2026-07-01
category: "Career"
description: "Reflections on two years at Amazon Robotics and the lessons learned along the way."
notion_source: "https://app.notion.com/p/39f7e52c3cce8099a999ea8f6aafc299"
---

I recently left Amazon after two years working in Amazon Robotics.
Leaving a job is always bittersweet. You leave behind coworkers, relationships, projects, and things you spent a long time trying to build. Amazon is well known as a pressure cooker, and my experience reflected that. As an L6, or Senior System Development Engineer, it had some of the highest highs and lowest lows of any job I have ever had.
Amazon Robotics is a fascinating organization. It operates robotics systems at a scale that almost no other robotics company has approached. Maybe companies like Symbotic or Nimble will eventually get there, but Amazon is operating on a different level today.
Amazon Robotics is also, perhaps unsurprisingly, extremely software-heavy. A lot of industrial robotics comes down to taking hardware that already exists and building the software, infrastructure, and operational systems required to make it useful at enormous scale.
It is also a deeply results-driven organization. If a technology does not generate the expected value, Amazon is willing to change direction, remove it from sites, and try something else. It honestly felt like the startups I had worked at — try something, fail fast, move on.
On the development side, that means roadmaps are established months in advance and constantly recalibrated as blockers emerge.
On the operations side, however, things are much messier.
I worked in an arm of Amazon Robotics called Tech Transformation. Our group supported the reality-capture and planning work that happened before robotics systems were deployed in warehouses and fulfillment centers.
That meant understanding what the building actually looked like, what was being installed, how those systems fit into the existing site, and what information the teams doing the deployment needed.
Put simply, we were close to the front line of deploying robots at scale. That gave me a unique view into what makes robotics deployment work—and what causes it to fail.
Physical AI is a hot topic right now. Investors and companies are betting that robots will automate a large amount of physical work. After spending time inside warehouses and seeing how much variation exists from one fulfillment center to another, I am skeptical of how quickly that will happen.
Physical environments are chaotic. Software is not always ready. Integrations fail. Site conditions change. Contractors move equipment. Dependencies arrive late. Something that worked perfectly in one building behaves differently in another. People interact with systems in ways nobody anticipated.
The hard part is not proving that a robot can perform a task in a controlled environment. The hard part is making that robot useful and reliable across hundreds of uncontrolled environments.
How do you deal with that as a robotics engineer? You have to understand how the site actually works. You need strong procedures, recovery paths, clear ownership, tight specifications for vendors, and systems that fail safely when the process is not followed perfectly. It’s not just an engineering problem — it’s also an operations problem.
You should control as much as you reasonably can, but you also need to accept that unexpected things will happen. When they do, the blast radius should be small. The system should recover quickly, and the customer should barely notice.
That was probably the most important lesson I took away from Amazon Robotics: successful robotics deployment is as much an operational problem as it is a technical one.
Anyway, here are some other thoughts about Amazon.
### 1. Your manager and skip-level manager matter enormously
Your relationship with your manager shapes a huge portion of your experience at Amazon.
Doing good work is not enough by itself. You need to make your work visible. You need to explain what you are doing, why it matters, what is blocked, and what impact it is having. That does not mean constantly bragging. It means making your work legible to the organization.
Managers and senior leaders oversee a large number of projects and people. If they cannot clearly explain what you own and what impact you are having, that becomes a problem during performance discussions.
Your skip-level manager also matters because performance gets discussed and calibrated above your immediate team. You should make an effort to interact with them, understand what they care about, and make sure they know what problems you are solving.
At Amazon, visibility is part of the job.
### 2. Automation is fun—when you have the resources and the business need
Fundamentally, I worked on an operations-automation team.
The team had a mix of operational, hardware, and software experience, which meant I had the opportunity to build and shape a lot of the engineering approach.
That was fun. I got to think about architecture, infrastructure, developer workflows, automation, monitoring, and how to make systems easier to operate.
But you cannot introduce technology just because it is interesting.
I never seriously suggested Kubernetes, for example. Most people in the organization had little reason to interact with it, and it would have been far more complexity than the team needed.
The best technical solution is not always the most sophisticated one. It is the one that solves the problem, fits the skill set of the team, and can realistically be maintained. You have to understand people’s experience and explain technical topics in a way that makes sense to non-software audiences. You also need to tie engineering work back to a number whenever possible. How much time does this save? How many errors does it prevent? How many deployments does it unblock? What risk does it reduce?
If you can connect technical work to a measurable outcome, you will go far.
### 3. I got to travel a lot
Travel was one of the coolest parts of the job.
I took around 30 flights in 2025. By June 2026, I had already taken close to that number again.
I got to see different sites, work directly with deployment teams, and observe the systems we built operating in the real world. That is valuable experience for a robotics engineer. It is easy to make bad assumptions when you only see a system from behind a laptop.
But the travel got tiring.
Constant flights, hotels, rental cars, schedule changes, and eating on the road eventually take a toll. I gained weight even while trying to stay healthy, and it became harder to maintain a consistent routine.
There is a big difference between enjoying occasional work travel and having travel become a defining part of your job.
### 4. Senior individual-contributor roles involve much more than coding
As an L6, you are expected to be a technical leader even if you are still an individual contributor. That means setting direction, mentoring L4s and L5s, negotiating scope, dealing with stakeholders, and figuring out which problems are actually worth solving.
Half the time, I felt like an engineering manager. The other half, I felt like an IC. I had to think about team direction, resolve ambiguity, protect people from unnecessary work, and step in when something was stuck. I also still had to design systems and write code.
The experience helped me understand what I wanted from my career. I enjoy technical leadership. I like mentoring engineers, setting architectural direction, and helping a team make good decisions.
I do not think I want to be a people manager, especially in an environment as intense as Amazon.
I also realized that I wanted to work on deeper software and infrastructure problems. Over time, too much of my work became one-off scripts, last-minute requests, and problems that had never been properly scoped.
I think I eventually got tired of the chaos.
### 5. A good TPM is essential
Robotics deployments involve a huge amount of coordination. There are hardware teams, software teams, operations teams, vendors, construction schedules, site dependencies, launch dates, and customers who all want different things.
A strong TPM can absorb a tremendous amount of scope negotiation and organizational politics. They clarify ownership, track dependencies, force decisions, and give engineers space to focus on technical work.
A good TPM does not replace technical leadership. They make technical leadership possible.
### 6. Amazon’s writing culture is genuinely great
I was not much of a writer before joining Amazon.
I am a much better one now.
Amazon forces people at every level to put their ideas on paper before asking others to support them. That process exposes weak thinking very quickly.
What is the customer problem? Why does it matter? What are the alternatives? What are the risks? What evidence supports your proposal? What happens if you do nothing?
You also learn to anticipate criticism. What is the skeptical L7 going to ask? Which claim is unsupported? What assumption is hiding inside the proposal? How will the document get ripped apart? That process can be painful, but it improves your thinking.
AI may have helped with some wording, but the real value came from being forced to structure ideas clearly and defend them in writing.
It is one of the strongest parts of Amazon’s culture.
### 7. The highest highs came from solving hard problems together
My favorite moments were when the team accomplished something we did not think we could.
Fixing difficult bugs, responding to incidents, and getting a deployment over the line could be incredibly stressful. It could also be a lot of fun.
I developed a close rapport with my teammates. We trusted each other. We knew that when something went wrong, nobody was going to disappear and leave one person to deal with it alone. That kind of camaraderie is rare.
Some of the situations that created it were not situations I would voluntarily repeat, but the relationships that came out of them were real.
### 8. The lowest lows came from pressure without a clear path forward
The hardest moments were when there was enormous pressure on the team and no obvious way to make progress. As the senior engineer, it often fell to me to create a path.
Sometimes that meant simplifying the problem. Sometimes it meant changing the plan, cutting scope, escalating a decision, or personally stepping in to unblock something.
There were also periods where I worked extremely long hours to get a system stable or move a deployment forward. Those moments taught me a lot about leadership and about how I respond under pressure. They also taught me that repeatedly operating that way is not sustainable. Heroics can save a project. They are not a substitute for good planning, good systems, or reasonable staffing.
## Why’d I leave?
Ultimately, I left because the organization was moving in a more hardware-focused direction, while I wanted the next stage of my career to remain centered on software, infrastructure, and robotics systems.
I tried to transfer internally, but nothing worked out. I interviewed externally, received a few offers, and ultimately accepted an offer from Zoox. That is probably a blog post for another day.
Despite the difficult parts, I genuinely enjoyed my time at Amazon.
My manager was great, and I worked with people I respected and enjoyed spending time with. I hope I taught my teammates something, and I hope I left the team and its systems in a better state than when I arrived.
I also learned an enormous amount. I learned how to deal with ambiguity, communicate with senior leaders, navigate organizational politics, build support for technical ideas, and operate in environments where technical decisions had immediate consequences in the physical world.
That is probably why I still look back at Amazon fondly, even though it could sometimes feel like everything was always on fire.
Thank you to my former manager and coworkers. I genuinely appreciated working with all of you.
