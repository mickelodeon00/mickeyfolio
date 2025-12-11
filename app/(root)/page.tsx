import { Button } from "@/components/ui/button";
import { ArrowRight, Github, Linkedin, Twitter } from "lucide-react";
import Link from "next/link";
import PageWrapper from "@/components/layout/page-wrapper";
import { fadeInLeft } from "@/utils/animations";
import FadeInWhenVisible from "@/components/general/fadeIn-when-visible";

export default function Home() {
  // const structuredData = {
  //   '@context': 'https://schema.org',
  //   '@graph': [
  //     {
  //       '@type': 'Person',
  //       '@id': 'https://mickeyfolio.vercel.app/#person',
  //       name: 'Mickey',
  //       jobTitle: 'Full Stack Developer',
  //       url: 'https://mickeyfolio.vercel.app',
  //       image: 'https://mickeyfolio.vercel.app/profile.jpg',
  //       sameAs: [
  //         'https://github.com/yourusername',
  //         'https://linkedin.com/in/yourprofile'
  //       ],
  //       worksFor: {
  //         '@type': 'Organization',
  //         name: 'Freelance'
  //       }
  //     },
  //     {
  //       '@type': 'WebSite',
  //       '@id': 'https://mickeyfolio.vercel.app/#website',
  //       url: 'https://mickeyfolio.vercel.app',
  //       name: 'Mickey Portfolio',
  //       description: 'Full Stack Developer Portfolio',
  //       publisher: {
  //         '@id': 'https://mickeyfolio.vercel.app/#person'
  //       },
  //       inLanguage: 'en-US'
  //     }
  //   ]
  // }
  return (
    <PageWrapper>
      <div className="relative h-screen flex items-center justify-center overflow-hidden">
        <FadeInWhenVisible variants={fadeInLeft}>
          <div className="container mx-auto px-4 z-10 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Hi, I&apos;m Micheal
            </h1>
            <h1 className="text-5xl md:text-7xl font-bold mb-4">
              <span className="text-primary">Software Developer</span>{" "}
            </h1>

            <p className="text-base md:text-lg max-w-2xl mx-auto mb-8 text-muted-foreground">
              Crafting elegant digital solutions where logic meets creativity. Specializing in web applications, cloud infrastructure, and scalable systems.
            </p>

            <div className="flex flex-wrap justify-center gap-4 mb-12">
              <Button asChild size="lg">
                <Link href="/projects">
                  View Projects <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/blog">
                  Read My Blog <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>

            <div className="flex justify-center space-x-6">
              <Link
                href="https://github.com/mickelodeon00"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full h-12 w-12"
                >
                  <Github className="h-6 w-6" />
                </Button>
              </Link>
              <Link
                href="https://x.com/Mickelodeon00"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full h-12 w-12"
                >
                  <Twitter className="h-6 w-6" />
                </Button>
              </Link>
              <Link
                href="https://www.linkedin.com/in/micheal-akingbade-90038225a/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full h-12 w-12"
                >
                  <Linkedin className="h-6 w-6" />
                </Button>
              </Link>
            </div>
          </div>
        </FadeInWhenVisible>
      </div>
    </PageWrapper>
  );
}
