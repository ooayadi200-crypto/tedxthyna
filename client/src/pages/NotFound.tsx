import { ArrowUpRight } from "lucide-react";
import { Link } from "wouter";
import { Chars, Magnetic } from "@/components/site/motion";
import { Page } from "@/components/site/Page";

export default function NotFound() {
  return (
    <Page title="File not found — TEDx Thyna Youth" footer={false}>
      <main className="notfound">
        <img src="/media/mark.webp" alt="" className="notfound-mark" aria-hidden />
        <span className="mono red">Error / File missing</span>
        <h1 className="notfound-code">
          <Chars text="404" delay={0.5} stagger={0.12} />
        </h1>
        <p>This file was never filed — or someone made it disappear.</p>
        <Magnetic>
          <Link href="/" className="btn btn-red" data-cursor="Home">
            <span className="btn-fill" />
            <span className="btn-label">Back to the case</span>
            <ArrowUpRight size={16} />
          </Link>
        </Magnetic>
      </main>
    </Page>
  );
}
