import Scene from "@/components/scene/Scene";
import Journey from "@/components/scene/Journey";
import Nav from "@/components/shell/Nav";
import Hero from "@/components/hero/Hero";
import About from "@/components/sections/About";
import Experience from "@/components/sections/Experience";
import Projects from "@/components/sections/Projects";
import TestRunner from "@/components/sections/TestRunner";
import Research from "@/components/sections/Research";
import Skills from "@/components/sections/Skills";
import Contact from "@/components/sections/Contact";

export default function Home() {
  return (
    <>
      <Scene />
      <Nav />
      <main>
        <Journey />
        <Hero />
        <About />
        <Experience />
        <Projects />
        <TestRunner />
        <Research />
        <Skills />
        <Contact />
      </main>
    </>
  );
}
