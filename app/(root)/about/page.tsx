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
    "AWS",
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
                    <h3 className="text-xl font-semibold">NYSC Developer Intern</h3>
                    <p className="text-primary font-medium">
                      Valdymas Intelligence | August 2024 - Present
                    </p>
                    <p className="mt-2 text-muted-foreground">
                      Built and maintained reusable components with Next.js and TypeScript across various internal tools. Improved performance via SSR and code-splitting. Integrated APIs and contributed to enhancing the company’s WordPress website with custom features and plugin management.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold">Frontend Developer</h3>
                    <p className="text-primary font-medium">
                      Eduvacity | October 2023 - November 2024
                    </p>
                    <p className="mt-2 text-muted-foreground">
                      Worked on eduvacity.com, a modern e-learning platform. Built responsive UI components with React and Tailwind CSS, and integrated Supabase for authentication, real-time data, and content management. Collaborated closely with design and product teams to improve learning experiences.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold">Fullstack Developer</h3>
                    <p className="text-primary font-medium">
                      Zsolutions | July 2022 - August 2023
                    </p>
                    <p className="mt-2 text-muted-foreground">
                      Contributed to the development of Advanced School Manager, a web and mobile platform for managing core school operations like enrollment, attendance, grading, and reporting. Built REST APIs, integrated Cloudinary for media handling, and designed responsive interfaces using React and Material UI.
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
