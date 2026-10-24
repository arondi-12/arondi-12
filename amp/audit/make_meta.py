#!/usr/bin/env python3
"""Validate the replacement meta descriptions: 150-160 characters, no invented claims."""
import json
import os

HERE = os.path.dirname(os.path.abspath(__file__))

CANDIDATES = [
    ("/", "Zedu brings structured channels, cohort communication, live collaboration and AI agents into one shared workspace for bootcamps and learning communities.",
     "Home: 'Built for Bootcamps and Learning Communities'; 'From organized channels to AI-powered agents, Zedu brings communication, collaboration, and automation into one seamless workspace.'"),
    ("/pricing", "Compare Zedu Starter, Pro and Enterprise plans for educators, bootcamps and institutions, with flexible pricing for structured learning and AI support.",
     "Pricing: plan cards Starter / Pro / Enterprise; subtitle 'Flexible plans for educators, bootcamps, and institutions building structured learning environments with collaboration and AI support.'"),
    ("/about", "See how Zedu helps educators and learning teams run organized, distraction-free communication for modern cohorts, with AI that assists, not replaces, teachers.",
     "About: 'Zedu was created to help educators and learning teams run organized, distraction-free communication for modern cohorts.'; 'AI Should Assist, Not Replace'."),
    ("/products/channels", "Keep discussions organized by course, cohort or topic with Zedu Channels. Threaded replies and clear announcements help everyone follow the conversation.",
     "Channels: 'Channels keep discussions organized by course, cohort, or topic'; 'Threaded replies'; 'send announcements directly within the relevant channels'."),
    ("/products/buzz", "Start instant voice conversations inside any Zedu learning channel. Buzz adds AI-generated summaries after each session so students can review key ideas.",
     "Buzz: 'Buzz lets students, educators, and teams jump into quick voice conversations directly inside learning channels.'; 'automatically generates a summary of the conversation'."),
    ("/products/file-management", "Store, share and collaborate on course materials, assignments and resources in Zedu. File Management keeps every resource tied to its class and conversation.",
     "File Management: 'Store, share, and collaborate on course materials, assignments, and resources directly inside Zedu. Everything stays connected to the conversations and classes where it belongs.'"),
    ("/solutions/bootcamps", "Zedu gives bootcamps one platform to manage cohorts, run live classes, support students and build active learning communities with structured channels.",
     "Bootcamps: 'An all-in-one platform for bootcamps to manage cohorts, run live classes, support students, and build active learning communities.'; 'dedicated channels'."),
    ("/solutions/schools", "Connect teachers, students and school staff in one organized workspace. Zedu gives classrooms structured channels for lessons, homework and announcements.",
     "Schools: 'Connect teachers, students, and school staff in one organized workspace designed for modern classrooms.'; 'Teachers manage discussions, homework, and announcements in structured channels.'"),
    ("/solutions/universities", "Bring departments, courses and student communities into one structured learning workspace for higher education, with role-based permissions and secure spaces.",
     "Universities: 'Bring departments, courses, and student communities together in one structured learning workspace designed for higher education.'; 'Role-Based Permissions'; 'Secure Communication'."),
    ("/resources", "Explore Zedu guides, case studies, templates and webinars for universities, schools and bootcamps building modern, structured learning communities with Zedu.",
     "Resources: 'Explore guides, insights, and tools to help universities, schools, and bootcamps run better learning communities.'; tabs Guides, Case studies, Templates, Webinars, Help center."),
    ("/download", "Download Zedu on iOS, Android and desktop. Join classes, chat with peers, manage files and keep up with assignments in one connected learning workspace.",
     "Download: 'Download Zedu on iOS, Android, and desktop' equivalent (App Store / Google Play / Desktop); 'communication, file sharing, and scheduling'; 'Assignments & Updates'."),
]

rows = []
for path, text, source in CANDIDATES:
    rows.append({"path": path, "replacement": text, "chars": len(text), "words": len(text.split()),
                 "in_range_150_160": 150 <= len(text) <= 160, "source": source})

json.dump(rows, open(os.path.join(HERE, "meta_candidates.json"), "w"), indent=2)
for r in rows:
    flag = "OK " if r["in_range_150_160"] else "FIX"
    print(f"{flag} {r['chars']:>3} chars {r['words']:>2} words  {r['path']}")
    print(f"    {r['replacement']}")
