import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import Link from "next/link";
import { Download, Mail } from "lucide-react";
import PageWrapper from "@/components/layout/page-wrapper";
import FadeInWhenVisible from "@/components/general/fadeIn-when-visible";
import { fadeInLeft, fadeInUp } from "@/utils/animations";
import ContactSection from "@/components/about/contact-me";

export const metadata = {
  title: "About | Micheal",
  description: "Learn more about Micheal and his skills",
};

export default function AboutPage() {
  const skills = [
    "JavaScript",
    "TypeScript",
    "React",
    "Next.js",
    "Node.js",
    "Express",
    "Supabase",
    "PostgreSQL",
    "Tailwind CSS",
    "HTML/CSS",
    "Git",
    "Docker",
    "AWS",
    "Firebase",
  ];

  return (
    <PageWrapper>
      <div className="container mx-auto px-4 py-24 md:py-32">
        <div className="max-w-4xl mx-auto">
          <FadeInWhenVisible variants={fadeInLeft}>
            <div className="flex flex-col md:flex-row gap-12 items-center md:items-start mb-16">
              <div className="w-48 h-48 relative rounded-full overflow-hidden border-4 border-primary/20">
                <Image
                  src="/placeholder.svg?height=200&width=200"
                  alt="Micheal"
                  fill
                  className="object-cover"
                />
              </div>

              <div className="flex-1 text-center md:text-left">
                <h1 className="text-4xl font-bold mb-4">About Me</h1>
                <p className="text-md text-muted-foreground mb-6">
                  I'm a web developer with a hacker's curiosity and an artist's
                  eye, turning ideas into sleek, functional code. Off-duty, I
                  dive into spy thrillers, military dramas, and chess strategy,
                  gaming with grandmaster focus. Music fuels my creativity,
                  whether debugging code or plotting my next move. A lifelong
                  learner, I thrive where logic meets imagination: in code,
                  cinema, and the perfect soundtrack.
                </p>

                <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                  <Button asChild>
                    <Link href="mailto:mickelodeon00@gmail.com">
                      <Mail className="mr-2 h-4 w-4" />
                      Contact Me
                    </Link>
                  </Button>
                  <Button asChild variant="outline">
                    <a href="/resume.pdf" download="Resume.pdf">
                      <Download className="mr-2 h-4 w-4" />
                      Download Résumé
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </FadeInWhenVisible>

          <FadeInWhenVisible variants={fadeInLeft}>
            <div className="grid gap-12">
              <section>
                <h2 className="text-2xl font-bold mb-6 border-b pb-2">
                  My Story
                </h2>
                <div className="prose prose-blue dark:prose-invert max-w-none">
                  <p>
                    I'm a passionate developer with a love for creating
                    beautiful, functional web applications. My journey in
                    programming began when I was in college, where I discovered
                    the joy of bringing ideas to life through code.
                  </p>
                  <p>
                    Over the years, I've worked on a variety of projects, from
                    small personal websites to large-scale enterprise
                    applications. I'm constantly learning and exploring new
                    technologies to improve my skills and stay up-to-date with
                    the latest trends in web development.
                  </p>
                  <p>
                    When I'm not coding, you can find me watching classic films,
                    playing chess, or exploring new music. I believe that these
                    diverse interests help fuel my creativity and
                    problem-solving abilities in my professional work.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-6 border-b pb-2">
                  Skills & Technologies
                </h2>
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill) => (
                    <Badge
                      key={skill}
                      variant="secondary"
                      className="text-sm py-1 px-3"
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-6 border-b pb-2">
                  Experience
                </h2>
                <div className="space-y-8">
                  <div>
                    <h3 className="text-xl font-semibold">
                      Senior Frontend Developer
                    </h3>
                    <p className="text-primary font-medium">
                      Example Tech Inc. | 2020 - Present
                    </p>
                    <p className="mt-2 text-muted-foreground">
                      Led the development of the company's flagship product,
                      improving performance by 40% and implementing new features
                      that increased user engagement by 25%.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold">Web Developer</h3>
                    <p className="text-primary font-medium">
                      Digital Solutions Ltd. | 2018 - 2020
                    </p>
                    <p className="mt-2 text-muted-foreground">
                      Developed and maintained client websites, collaborated
                      with designers to implement responsive designs, and
                      optimized existing codebases for better performance.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold">Junior Developer</h3>
                    <p className="text-primary font-medium">
                      StartUp Co. | 2016 - 2018
                    </p>
                    <p className="mt-2 text-muted-foreground">
                      Assisted in the development of web applications, fixed
                      bugs, and implemented new features based on user feedback.
                    </p>
                  </div>
                </div>
              </section>
            </div>
          </FadeInWhenVisible>

          <FadeInWhenVisible variants={fadeInUp}>
            <ContactSection />
          </FadeInWhenVisible>
        </div>
      </div>
    </PageWrapper>
  );
}
